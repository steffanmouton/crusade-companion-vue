import type { Equipment } from './equipment'
import type { Faction } from './faction'

export interface Troop {
  id: string
  name: string
  faction: Faction
  type: string
  costPoints: number
  costCurrency: number
  stats: TroopStats
  allowedEquipment: Equipment[]
}

export interface TroopStats {
  movement: number
  movementType: string
  ranged: number
  melee: number
  armor: number
  baseSize: number
  abilities: string[]
  keywords: string[]
}
