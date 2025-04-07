export interface Equipment {
  id: string
  name: string
  type: string
  description: string
  range?: string
  modifiers: string[]
  keywords: string[]
  equipmentIndicator: {
    hasBayonetLug: boolean
    shieldCombo: boolean
  }
  rules: string[]
  handedness: HandednessType
  category: EquipmentCategory
  onlyFor?: {
    warbandVariant?: string
  }
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
