export interface Battery {
  academyId: number
  batteryLevel: number
  employeeId: string
  serialNumber: string
  timestamp: string
}

export type GroupedBatteries = Record<string, Battery[]>

export type BatteryPerAcademy = Record<string, { academyId: number; serialNumber: string }[]>
