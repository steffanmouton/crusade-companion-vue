import type { Faction } from './faction'
import type { Unit } from './unit'

export interface Army {
  id: string
  name: string
  faction: Faction
  points: number
  currency: number
  units: Unit[]
}
