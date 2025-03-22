import type { Faction } from './faction'
import type { Unit } from './unit'

export interface Army {
  id: string
  name: string
  faction: Faction
  currentPoints: number
  targetPoints: number
  currency: number // for Trench Crusade, this is Glory Points
  units: Unit[]
}
