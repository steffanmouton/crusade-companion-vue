import type { Cost } from './cost'

export interface Equipment {
  id: string
  originalId?: string
  name: string
  description: string
  type: string
  range?: string
  modifiers?: string[]
  keywords?: string[]
  equipmentIndicator?: EquipmentIndicator
  rules?: string[]
  handedness?: HandednessType
  isSpecial?: boolean
  explorationOnly?: boolean  // Flag for items that can only be gained during Exploration
  category?: EquipmentCategory
}

export interface EquipmentIndicator {
  hasBayonetLug?: boolean
  shieldCombo?: boolean
}

export enum HandednessType {
  ONE_HANDED = 'one-handed',
  TWO_HANDED = 'two-handed',
  NO_HANDS = 'no-hands',
  ONE_HAND_REQUIRED = 'one-hand-required' // For items like shields, standards, musical instruments
}

export enum EquipmentCategory {
  MELEE_WEAPON = 'Melee Weapon',
  RANGED_WEAPON = 'Ranged Weapon',
  ARMOUR = 'Armour',
  HEADGEAR = 'Headgear',
  GRENADE = 'Grenade',
  SHIELD = 'Shield',
  MUSICAL_INSTRUMENT = 'Musical Instrument',
  STANDARD = 'Standard',
  EQUIPMENT = 'Equipment'
}
