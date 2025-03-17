import type { Equipment } from './equipment'

export interface Troop {
  id: string
  name: string
  factionId: number
  factionName: string
  description: string
  type: string
  costPoints: number
  costCurrency: number
  armyBuildingRules?: string[]
  stats: TroopStats
  equipmentDescription: string
  allowedEquipment: Equipment[]
  specialEquipment?: string[]
  abilities: string[]
  keywords: string[]
  countAllowed: number[]
}

export interface TroopStats {
  movement: number
  movementType: string
  ranged: number
  melee: number
  armor: number
  baseSize: number
}
