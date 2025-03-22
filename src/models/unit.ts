import type { Equipment } from './equipment'

export interface Unit {
  id: string
  name: string
  troopId: string
  costPoints: number
  costCurrency: number
  currentEquipment: Equipment[]
  purchasedAbilities: string[]
}
