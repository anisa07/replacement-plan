import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  sortGroppedBatteryData,
  findBadBattery,
  timeDifference,
  getBatteryOneDayMeasures,
  getBatteryMoreThanDayMeasures,
  sortAcademiesByBadBatteriesCount,
  getAcademyWithBatteriesToReplace
} from '@/battery-service/battery-service'
import type { Battery, GroupedBatteries } from '@/types/types'
import { BAD_BATTERY_LEVEL_THRESHOLD } from '@/battery-service/const-vars'

const mocks = vi.hoisted(() => {
  return {
    getBatteryData: vi.fn()
  }
})

vi.mock('@/battery-service/battery-api', () => {
  return {
    getBatteryData: mocks.getBatteryData
  }
})

describe('battery-service', () => {
  const battery1: Battery = {
    academyId: 1,
    batteryLevel: 0.6,
    employeeId: 'emp1',
    serialNumber: 'SN1',
    timestamp: '2023-01-01T00:00:00Z'
  }

  const battery2: Battery = {
    academyId: 1,
    batteryLevel: 0.2,
    employeeId: 'emp1',
    serialNumber: 'SN1',
    timestamp: '2023-01-02T00:00:00Z'
  }

  const battery3: Battery = {
    academyId: 1,
    batteryLevel: 0.4,
    employeeId: 'emp1',
    serialNumber: 'SN1',
    timestamp: '2023-01-03T00:00:00Z'
  }

  const battery4: Battery = {
    academyId: 1,
    batteryLevel: 0.2,
    employeeId: 'emp1',
    serialNumber: 'SN1',
    timestamp: '2023-01-04T00:00:00Z'
  }

  describe('sortGroppedBatteryData', () => {
    it('should sort grouped battery data by timestamp', () => {
      const groupedBatteries: GroupedBatteries = {
        SN1: [battery3, battery1, battery2]
      }
      const sortedBatteries = sortGroppedBatteryData(groupedBatteries)
      expect(sortedBatteries.SN1).toEqual([battery1, battery2, battery3])
    })
  })

  describe('findBadBattery', () => {
    it(`should return true if battery level difference exceeds threshold ${BAD_BATTERY_LEVEL_THRESHOLD}`, () => {
      const oneDayBatteries: Battery[] = [battery1, battery2]
      expect(findBadBattery(oneDayBatteries)).toBe(true)
    })

    it(`should return false if battery level difference does not exceed threshold ${BAD_BATTERY_LEVEL_THRESHOLD}`, () => {
      const oneDayBatteries: Battery[] = [battery1, battery3]
      expect(findBadBattery(oneDayBatteries)).toBe(false)
    })
  })

  describe('timeDifference', () => {
    it('should return the time difference between two battery measures', () => {
      expect(timeDifference(battery1, battery2)).toBeLessThan(0)
      expect(timeDifference(battery2, battery1)).toBeGreaterThan(0)
    })
  })

  describe('getBatteryOneDayMeasures', () => {
    it('should group battery measures into one-day intervals', () => {
      const measures: Battery[] = [battery1, battery2, battery3]
      const oneDayMeasures = getBatteryOneDayMeasures(measures)
      expect(oneDayMeasures.length).toBe(2)
      expect(oneDayMeasures[0]).toEqual([battery1, battery2])
      expect(oneDayMeasures[1]).toEqual([battery2, battery3])
    })
  })

  describe('getBatteryMoreThanDayMeasures', () => {
    it('should group battery measures into more-than-one-day intervals', () => {
      const measures: Battery[] = [battery1, battery2, battery3, battery4]
      const moreThanDayMeasures = getBatteryMoreThanDayMeasures(measures)
      expect(moreThanDayMeasures.length).toBe(3)
    })
    it('should handle empty measures array', () => {
      const measures: Battery[] = []
      const moreThanDayMeasures = getBatteryMoreThanDayMeasures(measures)
      expect(moreThanDayMeasures.length).toBe(0)
    })
  })

  describe('sortAcademiesByBadBatteriesCount', () => {
    it('should sort academies by the number of bad batteries', () => {
      const academies = ['A', 'B', 'C']
      const badBatteries = {
        A: [{ academyId: 1, serialNumber: 'SN1' }],
        B: [
          { academyId: 2, serialNumber: 'SN2' },
          { academyId: 2, serialNumber: 'SN4' }
        ],
        C: [
          { academyId: 3, serialNumber: 'SN3' },
          { academyId: 5, serialNumber: 'SN6' },
          { academyId: 6, serialNumber: 'SN5' }
        ]
      }
      const sortedAcademies = sortAcademiesByBadBatteriesCount(academies, badBatteries)
      expect(sortedAcademies).toEqual(['C', 'B', 'A'])
    })
  })

  describe('getAcademyWithBatteriesToReplace', () => {
    const mockBatteryData: Battery[] = [
      {
        academyId: 1,
        batteryLevel: 0.5,
        employeeId: 'emp1',
        serialNumber: 'SN1',
        timestamp: '2023-01-01T00:00:00Z'
      },
      {
        academyId: 1,
        batteryLevel: 0.1,
        employeeId: 'emp1',
        serialNumber: 'SN1',
        timestamp: '2023-01-02T00:00:00Z'
      },
      {
        academyId: 1,
        batteryLevel: 0.9,
        employeeId: 'emp1',
        serialNumber: 'SN2',
        timestamp: '2023-01-01T05:12:00Z'
      },
      {
        academyId: 1,
        batteryLevel: 0.5,
        employeeId: 'emp1',
        serialNumber: 'SN2',
        timestamp: '2023-01-02T00:01:00Z'
      },
      {
        academyId: 1,
        batteryLevel: 0.9,
        employeeId: 'emp1',
        serialNumber: 'SN3',
        timestamp: '2023-01-01T00:00:00Z'
      },
      {
        academyId: 1,
        batteryLevel: 0.7,
        employeeId: 'emp1',
        serialNumber: 'SN3',
        timestamp: '2023-01-02T00:00:00Z'
      },
      {
        academyId: 2,
        batteryLevel: 0.9,
        employeeId: 'emp1',
        serialNumber: 'SN4',
        timestamp: '2023-01-01T09:00:00Z'
      },
      {
        academyId: 2,
        batteryLevel: 0.8,
        employeeId: 'emp1',
        serialNumber: 'SN4',
        timestamp: '2023-01-01T21:00:00Z'
      },
      {
        academyId: 2,
        batteryLevel: 0.5,
        employeeId: 'emp1',
        serialNumber: 'SN4',
        timestamp: '2023-01-02T21:00:00Z'
      }
    ]
    beforeEach(() => {
      vi.resetAllMocks()
    })
    it('should return the academies with the batteries to replace', async () => {
      mocks.getBatteryData.mockResolvedValue(mockBatteryData)
      const result = await getAcademyWithBatteriesToReplace()
      expect(result.grouppedBadBatteries).toEqual({
        1: [
          { academyId: 1, serialNumber: 'SN1' },
          { academyId: 1, serialNumber: 'SN2' }
        ]
      })
      expect(result.sortedAcademies).toEqual(['1'])
    })
  })
})
