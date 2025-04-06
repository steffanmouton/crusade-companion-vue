import type { Equipment } from '../models/equipment'
import { HandednessType, EquipmentCategory } from '../models/equipment'
import type { Faction } from '../models/faction'
import type { Troop } from '../models/troop'
import type { WarbandVariant } from '../models/warbandVariant'
import { getEquipmentLimit, isEquipmentAllowedForTroop, isEquipmentGloballyBanned } from './equipmentUtils'

export interface ValidationResult {
  isValid: boolean
  warnings: ValidationWarning[]
  errors: ValidationError[]
}

export interface ValidationWarning {
  type: WarningType
  message: string
  details?: string
}

export interface ValidationError {
  type: ErrorType
  message: string
  details?: string
}

export enum WarningType {
  FACTION_LIMIT_EXCEEDED = 'faction-limit-exceeded',
  VARIANT_LIMIT_EXCEEDED = 'variant-limit-exceeded',
}

export enum ErrorType {
  HANDEDNESS_VIOLATION = 'handedness-violation',
  EQUIPMENT_CATEGORY_LIMIT = 'equipment-category-limit',
  EQUIPMENT_NOT_AVAILABLE = 'equipment-not-available',
  EQUIPMENT_BANNED = 'equipment-banned',
  TROOP_RESTRICTION_VIOLATION = 'troop-restriction-violation',
}

/**
 * Validates if the equipment selection is valid according to the game rules
 */
export function validateEquipment(
  equipment: Equipment[],
  faction: Faction | null,
  troop: Troop | null,
  warbandVariant?: WarbandVariant | null
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    warnings: [],
    errors: [],
  }

  // If no faction or troop, we can't do much validation
  if (!faction || !troop) {
    return result
  }

  // Check handedness rules
  validateHandedness(equipment, result)

  // Check equipment category limits
  validateCategoryLimits(equipment, result)

  // Check faction equipment availability and limits
  if (faction) {
    validateFactionEquipment(equipment, faction, troop, warbandVariant, result)
  }

  // Set overall validity - valid if no errors (warnings are still valid)
  result.isValid = result.errors.length === 0

  return result
}

/**
 * Validates handedness rules - a model can have either:
 * - One two-handed melee weapon OR up to two one-handed melee weapons
 * - One two-handed ranged weapon OR up to two one-handed ranged weapons
 */
function validateHandedness(equipment: Equipment[], result: ValidationResult): void {
  // Count one-handed and two-handed weapons by type
  const meleeOneHanded = equipment.filter(
    (e) =>
      (e.type === EquipmentCategory.MELEE_WEAPON || e.category === EquipmentCategory.MELEE_WEAPON) &&
      e.handedness === HandednessType.ONE_HANDED
  )
  const meleeTwoHanded = equipment.filter(
    (e) =>
      (e.type === EquipmentCategory.MELEE_WEAPON || e.category === EquipmentCategory.MELEE_WEAPON) &&
      e.handedness === HandednessType.TWO_HANDED
  )
  const rangedOneHanded = equipment.filter(
    (e) =>
      (e.type === EquipmentCategory.RANGED_WEAPON ||
        e.category === EquipmentCategory.RANGED_WEAPON) &&
      e.handedness === HandednessType.ONE_HANDED
  )
  const rangedTwoHanded = equipment.filter(
    (e) =>
      (e.type === EquipmentCategory.RANGED_WEAPON ||
        e.category === EquipmentCategory.RANGED_WEAPON) &&
      e.handedness === HandednessType.TWO_HANDED
  )

  // Check items that require one hand
  const oneHandRequired = equipment.filter((e) => e.handedness === HandednessType.ONE_HAND_REQUIRED)

  // Calculate total hands used
  const handsTaken = 
    oneHandRequired.length + 
    meleeOneHanded.length + 
    meleeTwoHanded.length * 2 + 
    rangedOneHanded.length + 
    rangedTwoHanded.length * 2

  // Check if a two-handed melee weapon is combined with one-handed melee weapons
  if (meleeTwoHanded.length > 0 && meleeOneHanded.length > 0) {
    result.errors.push({
      type: ErrorType.HANDEDNESS_VIOLATION,
      message: 'Cannot use two-handed melee weapon with one-handed melee weapons',
      details: `${meleeTwoHanded[0].name} cannot be combined with ${meleeOneHanded.map(e => e.name).join(', ')}`,
    })
  }

  // Check if more than one two-handed melee weapon
  if (meleeTwoHanded.length > 1) {
    result.errors.push({
      type: ErrorType.HANDEDNESS_VIOLATION,
      message: 'Cannot use more than one two-handed melee weapon',
      details: `Multiple two-handed melee weapons: ${meleeTwoHanded.map(e => e.name).join(', ')}`,
    })
  }

  // Check if more than two one-handed melee weapons
  if (meleeOneHanded.length > 2) {
    result.errors.push({
      type: ErrorType.HANDEDNESS_VIOLATION,
      message: 'Cannot use more than two one-handed melee weapons',
      details: `Too many one-handed melee weapons: ${meleeOneHanded.map(e => e.name).join(', ')}`,
    })
  }

  // Check ranged weapons similarly
  if (rangedTwoHanded.length > 0 && rangedOneHanded.length > 0) {
    result.errors.push({
      type: ErrorType.HANDEDNESS_VIOLATION,
      message: 'Cannot use two-handed ranged weapon with one-handed ranged weapons',
      details: `${rangedTwoHanded[0].name} cannot be combined with ${rangedOneHanded.map(e => e.name).join(', ')}`,
    })
  }

  if (rangedTwoHanded.length > 1) {
    result.errors.push({
      type: ErrorType.HANDEDNESS_VIOLATION,
      message: 'Cannot use more than one two-handed ranged weapon',
      details: `Multiple two-handed ranged weapons: ${rangedTwoHanded.map(e => e.name).join(', ')}`,
    })
  }

  if (rangedOneHanded.length > 2) {
    result.errors.push({
      type: ErrorType.HANDEDNESS_VIOLATION,
      message: 'Cannot use more than two one-handed ranged weapons',
      details: `Too many one-handed ranged weapons: ${rangedOneHanded.map(e => e.name).join(', ')}`,
    })
  }
}

/**
 * Validates equipment category limits
 * - One suit of armor
 * - One headgear
 * - One grenade type
 * - One of each equipment type per model
 */
function validateCategoryLimits(equipment: Equipment[], result: ValidationResult): void {
  // Check armor limit (max 1)
  const armors = equipment.filter(
    (e) => e.type === EquipmentCategory.ARMOUR || e.category === EquipmentCategory.ARMOUR
  )
  if (armors.length > 1) {
    result.errors.push({
      type: ErrorType.EQUIPMENT_CATEGORY_LIMIT,
      message: 'Cannot wear more than one suit of armor',
      details: `Multiple armors selected: ${armors.map(e => e.name).join(', ')}`,
    })
  }

  // Check headgear limit (max 1)
  const headgear = equipment.filter(
    (e) => e.type === EquipmentCategory.HEADGEAR || e.category === EquipmentCategory.HEADGEAR
  )
  if (headgear.length > 1) {
    result.errors.push({
      type: ErrorType.EQUIPMENT_CATEGORY_LIMIT,
      message: 'Cannot wear more than one headgear',
      details: `Multiple headgears selected: ${headgear.map(e => e.name).join(', ')}`,
    })
  }

  // Check grenade limit (max 1 type)
  const grenades = equipment.filter(
    (e) => e.type === EquipmentCategory.GRENADE || e.category === EquipmentCategory.GRENADE
  )
  if (grenades.length > 1) {
    result.errors.push({
      type: ErrorType.EQUIPMENT_CATEGORY_LIMIT,
      message: 'Cannot carry more than one type of grenade',
      details: `Multiple grenade types selected: ${grenades.map(e => e.name).join(', ')}`,
    })
  }

  // Check for duplicates of the same equipment (by ID)
  const equipmentCounts = equipment.reduce((counts, item) => {
    counts[item.id] = (counts[item.id] || 0) + 1
    return counts
  }, {} as Record<string, number>)

  for (const [id, count] of Object.entries(equipmentCounts)) {
    if (count > 1) {
      const duplicateItem = equipment.find(e => e.id === id)
      result.errors.push({
        type: ErrorType.EQUIPMENT_CATEGORY_LIMIT,
        message: 'Cannot carry duplicates of the same equipment',
        details: `Multiple copies of ${duplicateItem?.name} selected`,
      })
    }
  }
}

/**
 * Validates if equipment is available in the faction's armoury and checks limits
 */
function validateFactionEquipment(
  equipment: Equipment[],
  faction: Faction,
  troop: Troop,
  warbandVariant: WarbandVariant | null | undefined,
  result: ValidationResult
): void {
  // Track equipment counts by ID
  const equipmentCounts: Record<string, number> = {};
  equipment.forEach(item => {
    equipmentCounts[item.id] = (equipmentCounts[item.id] || 0) + 1;
  });
  
  // Check each piece of equipment
  for (const item of equipment) {
    // Check if equipment is globally banned for this faction/variant
    if (isEquipmentGloballyBanned(item, faction, warbandVariant)) {
      result.errors.push({
        type: ErrorType.EQUIPMENT_BANNED,
        message: `${item.name} is banned for this warband`,
        details: `This item cannot be used by this faction or warband variant`
      });
      continue;
    }
    
    // Check if equipment is allowed for this troop
    if (!isEquipmentAllowedForTroop(item, troop, faction, warbandVariant)) {
      result.errors.push({
        type: ErrorType.TROOP_RESTRICTION_VIOLATION,
        message: `${item.name} cannot be used by this troop type`,
        details: `This troop does not meet the requirements to use this equipment`
      });
      continue;
    }
    
    // Check against equipment limits
    const limit = getEquipmentLimit(item, faction, warbandVariant);
    if (limit > 0) {
      const count = equipmentCounts[item.id];
      if (count > limit) {
        result.warnings.push({
          type: WarningType.FACTION_LIMIT_EXCEEDED,
          message: `Limit exceeded for ${item.name}`,
          details: `Maximum of ${limit} allowed, found ${count}`,
        });
      }
    }
  }
} 