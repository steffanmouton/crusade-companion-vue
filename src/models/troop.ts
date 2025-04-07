import type { Equipment } from './equipment'

export interface TroopStats {
  movement: number
  movementType: string
  ranged: number
  melee: number
  armor: number
  baseSize: number
}

export interface Troop {
  id: string
  name: string
  factionId: string
  factionName: string
  description: string
  type: string
  armyBuildingRules?: string[]
  stats: TroopStats
  equipmentDescription: string
  defaultEquipment?: string[]
  isDefaultEquipmentRemovable?: boolean
  isEquipmentLocked?: boolean
  abilities: string[]
  keywords: string[]
  mercenaryFactions?: string[]
  cardHeaderImageURI?: string
  cardHeroSideImageURI?: string
  warbandVariant?: string
  specialRules?: string[]
}
