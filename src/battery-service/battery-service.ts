import { getItemTime } from '@/helpers/get-item-time'
import type { Battery, BatteryPerAcademy, GroupedBatteries } from '@/types/types'
import { getBatteryData } from './battery-api'
import { groupDataByParam } from '@/helpers/group-data'
import { BAD_BATTERY_LEVEL_THRESHOLD, ONE_DAY } from './const-vars'

export const sortGroppedBatteryData = (baterryData: GroupedBatteries): GroupedBatteries => {
  const result = {} as GroupedBatteries
  for (const serialNum in baterryData) {
    result[serialNum] = baterryData[serialNum].sort((a, b) => timeDifference(a, b))
  }
  return result
}

export const findBadBattery = (oneDayBatteries: Battery[]): boolean => {
  if (oneDayBatteries.length < 2) {
    return false
  }

  const fistMeasure = oneDayBatteries[0]
  const lastMeasure = oneDayBatteries[oneDayBatteries.length - 1]
  const dayMultiplier = ONE_DAY / (getItemTime(lastMeasure) - getItemTime(fistMeasure))
  const batteryDifference =
    Math.round((fistMeasure.batteryLevel - lastMeasure.batteryLevel) * 100) / 100
  return batteryDifference > BAD_BATTERY_LEVEL_THRESHOLD / dayMultiplier
}

export const timeDifference = (measure1: Battery, measure2: Battery): number =>
  getItemTime(measure1) - getItemTime(measure2)

export const getBatteryMoreThanDayMeasures = (measures: Battery[]): Battery[][] => {
  let firstIndex = 0
  let lastIndex = 1
  const batteryDays: Battery[][] = []

  while (lastIndex < measures.length) {
    const day = [measures[firstIndex]]

    while (
      lastIndex < measures.length &&
      timeDifference(measures[lastIndex], measures[firstIndex]) <= ONE_DAY
    ) {
      day.push(measures[lastIndex])
      lastIndex++
    }

    if (lastIndex === measures.length) {
      return batteryDays
    }

    let more24HLastIndex = lastIndex
    let moreThanDay = [...day]
    while (more24HLastIndex < measures.length) {
      moreThanDay.push(measures[more24HLastIndex])
      batteryDays.push(moreThanDay)
      moreThanDay = [...moreThanDay]
      more24HLastIndex++
    }
    firstIndex++
  }
  return batteryDays
}

export const getBatteryOneDayMeasures = (measures: Battery[]): Battery[][] => {
  let firstIndex = 0
  let lastIndex = 1
  const batteryDays: Battery[][] = []

  while (lastIndex < measures.length) {
    const day = [measures[firstIndex]]

    while (
      lastIndex < measures.length &&
      timeDifference(measures[lastIndex], measures[firstIndex]) <= ONE_DAY
    ) {
      day.push(measures[lastIndex])
      lastIndex++
    }

    batteryDays.push(day)
    if (lastIndex === measures.length) {
      return batteryDays
    }

    while (timeDifference(measures[lastIndex], measures[firstIndex]) > ONE_DAY) {
      firstIndex++
    }
  }
  return batteryDays
}

export const sortAcademiesByBadBatteriesCount = (
  acadimies: string[],
  badBatteries: Record<
    string,
    {
      academyId: number
      serialNumber: string
    }[]
  >
): string[] => {
  return acadimies.sort((a, b) => {
    return badBatteries[b].length - badBatteries[a].length
  })
}

export const getAcademyWithBatteriesToReplace = async (): Promise<{
  grouppedBadBatteries: BatteryPerAcademy
  sortedAcademies: string[]
}> => {
  const allBatteries = await getBatteryData()
  const grouppedByBatteriesySerialNum = groupDataByParam(allBatteries, 'serialNumber')
  const sortedBatteriesByDate = sortGroppedBatteryData(grouppedByBatteriesySerialNum)
  const badBatteries = []

  for (const batteryMeasures of Object.values(sortedBatteriesByDate)) {
    if (batteryMeasures.length < 2) {
      continue
    }

    const batteryOneDayMeasures = [
      ...getBatteryOneDayMeasures(batteryMeasures),
      ...getBatteryMoreThanDayMeasures(batteryMeasures)
    ]
    const hasBadBatteryMeasures = batteryOneDayMeasures.find(findBadBattery) !== undefined

    if (hasBadBatteryMeasures) {
      badBatteries.push({
        academyId: batteryMeasures[0].academyId,
        serialNumber: batteryMeasures[0].serialNumber
      })
    }
  }
  const grouppedBadBatteries: BatteryPerAcademy = groupDataByParam(badBatteries, 'academyId')

  return {
    grouppedBadBatteries,
    sortedAcademies: sortAcademiesByBadBatteriesCount(
      Object.keys(grouppedBadBatteries),
      grouppedBadBatteries
    )
  }
}
