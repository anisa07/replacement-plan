import type { Battery } from '@/types/types'

const BATTERY_API = 'http://localhost:8085/battery-data'

export const getBatteryData = (): Promise<Battery[]> => {
  try {
    return fetch(BATTERY_API)
      .then((response) => response.json())
      .then((data) => data)
  } catch (error) {
    throw new Error('Failed to fetch battery data')
  }
}
