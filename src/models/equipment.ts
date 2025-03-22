import type { Cost } from './cost'

export interface Equipment {
  id: string
  name: string
  description: string
  type: string
  range?: string
  cost?: Cost
  modifiers?: string[]
  keywords?: string[]
  equipmentIndicator?: EquipmentIndicator
  rules?: string[]
  limit?: number
  onlyFor?: EquipmentOnlyFor
}

export interface EquipmentIndicator {
  hasBayonetLug?: boolean
  shieldCombo?: boolean
}

export interface EquipmentOnlyFor {
  faction?: string
  troopIds?: string[]
  keywords?: string[]
}
