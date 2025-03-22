import type { Equipment } from './equipment'
import type { Cost } from './cost'

export interface Troop {
  id: string
  name: string
  factionId: number
  factionName: string
  description: string
  type: string
  cost: Cost
  armyBuildingRules?: string[]
  stats: TroopStats
  equipmentDescription: string
  defaultEquipment?: Equipment[]
  specialEquipment?: Equipment[]
  abilities: string[]
  keywords: string[]
  countAllowed: number[]
  cardHeaderImageURI?: string
  cardHeroSideImageURI?: string
}

export interface TroopStats {
  movement: number
  movementType: string
  ranged: number
  melee: number
  armor: number
  baseSize: number
}
