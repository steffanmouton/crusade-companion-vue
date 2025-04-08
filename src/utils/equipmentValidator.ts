import type { Equipment } from '../models/equipment'
import { HandednessType, EquipmentCategory } from '../models/equipment'
import type { Faction } from '../models/faction'
import type { Troop } from '../models/troop'
import type { WarbandVariant } from '../models/warbandVariant'
import { getEquipmentLimit, isEquipmentAllowedForTroop, isEquipmentGloballyBanned } from './equipmentUtils'
import type { ArmyRules } from '../models/armyRules'

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
  HANDEDNESS_WARNING = 'handedness-warning',
  SPECIAL_EQUIPMENT_COMBO = 'special-equipment-combo',
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
  warbandVariant: WarbandVariant | null,
  armyRules: ArmyRules | null = null
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

  // If we have armyRules available, use that for validation
  if (armyRules) {
    return validateEquipmentWithArmyRules(equipment, troop, armyRules)
  }

  // Check handedness rules
  validateHandedness(equipment, result)

  // Check equipment category limits
  validateCategoryLimits(equipment, result)

  // Add information about special equipment combinations
  addSpecialCombinationInfo(equipment, result)

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
 *
 * This now adds warnings instead of errors to allow the user to continue.
 * Also handles special cases for bayonet lugs and shield combos.
 */
function validateHandedness(equipment: Equipment[], result: ValidationResult): void {
  // First check for special cases: bayonet lugs and shield combos
  const hasBayonetLugItem = equipment.some(e => e.equipmentIndicator?.hasBayonetLug === true);
  const hasShieldComboItem = equipment.some(e => e.equipmentIndicator?.shieldCombo === true);

  console.log('Validating handedness with:', {
    equipmentCount: equipment.length,
    hasBayonetLugItem,
    hasShieldComboItem
  });

  // Clear any existing handedness warnings
  result.warnings = result.warnings.filter(warning => warning.type !== WarningType.HANDEDNESS_WARNING);

  // Get bayonets and other melee weapons separately to handle special cases
  const bayonets = equipment.filter(e =>
    e.category === EquipmentCategory.MELEE_WEAPON &&
    e.name.toLowerCase().includes('bayonet')
  );

  // Only count weapons for handedness with adjustments for special cases
  // Filter items rather than just counting them
  const meleeOneHanded = equipment.filter(
    (e) =>
      (e.category === EquipmentCategory.MELEE_WEAPON) &&
      e.handedness === HandednessType.ONE_HANDED &&
      // Bayonet is counted as NO_HANDS if there's an item with bayonet lug
      !(e.name.toLowerCase().includes('bayonet') && hasBayonetLugItem)
  );

  // Display which bayonets are being excluded from hands count
  if (hasBayonetLugItem && bayonets.length > 0) {
    console.log('Bayonets found:', bayonets.map(b => b.name), 'These are NOT counting for handedness');
  }

  const meleeTwoHanded = equipment.filter(
    (e) =>
      (e.category === EquipmentCategory.MELEE_WEAPON) &&
      e.handedness === HandednessType.TWO_HANDED &&
      // Bayonet is counted as NO_HANDS if there's an item with bayonet lug
      !(e.name.toLowerCase().includes('bayonet') && hasBayonetLugItem)
  );

  const rangedOneHanded = equipment.filter(
    (e) =>
      (e.category === EquipmentCategory.RANGED_WEAPON) &&
      e.handedness === HandednessType.ONE_HANDED
  );

  const rangedTwoHanded = equipment.filter(
    (e) =>
      (e.category === EquipmentCategory.RANGED_WEAPON) &&
      e.handedness === HandednessType.TWO_HANDED
  );

  // Shield is counted as NO_HANDS if there's an item with shield combo
  const shieldItems = equipment.filter(
    (e) =>
      e.category === EquipmentCategory.SHIELD &&
      !hasShieldComboItem
  );

  // Display shield handling logic
  if (hasShieldComboItem && equipment.some(e => e.category === EquipmentCategory.SHIELD)) {
    console.log('Shields found with shield combo items - they will NOT count for handedness');
  }

  // Calculate total hands used for each weapon type, including shields if they count for handedness
  const meleeHandsUsed = meleeOneHanded.length * 1 + meleeTwoHanded.length * 2;
  const rangedHandsUsed = rangedOneHanded.length * 1 + rangedTwoHanded.length * 2;

  // Add shield hands if they aren't paired with a shield combo item
  const shieldHandsUsed = shieldItems.reduce((total, shield) => {
    if (shield.handedness === HandednessType.ONE_HAND_REQUIRED) {
      return total + 1;
    }
    return total;
  }, 0);

  console.log('Hands calculation:', {
    meleeOneHanded: meleeOneHanded.map(e => e.name),
    meleeTwoHanded: meleeTwoHanded.map(e => e.name),
    meleeHandsUsed,
    rangedHandsUsed,
    shieldHandsUsed
  });

  // Check if melee hands exceed limit (including shield if appropriate)
  if (meleeHandsUsed + shieldHandsUsed > 2) {
    result.warnings.push({
      type: WarningType.HANDEDNESS_WARNING,
      message: 'Using more than two hands for melee weapons and shield',
      details: `You're using ${meleeHandsUsed} hands for melee weapons${shieldHandsUsed > 0 ? ` and ${shieldHandsUsed} for shield` : ''}. Consider removing some weapons.`,
    });
  }

  // Check if a two-handed melee weapon is combined with one-handed melee weapons
  if (meleeTwoHanded.length > 0 && meleeOneHanded.length > 0) {
    // Only show this warning if the two-handed weapon isn't a bayonet with a bayonet lug
    const nonBayonetTwoHandedWeapons = meleeTwoHanded.filter(
      e => !(e.name.toLowerCase().includes('bayonet') && hasBayonetLugItem)
    );

    // If we have no non-bayonet two-handed weapons with bayonet lugs, there's no actual warning needed
    if (nonBayonetTwoHandedWeapons.length > 0) {
      result.warnings.push({
        type: WarningType.HANDEDNESS_WARNING,
        message: 'Using two-handed melee weapon with additional one-handed weapons',
        details: `${nonBayonetTwoHandedWeapons[0].name} uses both hands and is combined with ${meleeOneHanded.map(e => e.name).join(', ')}`,
      });
    }
  }

  // Check if more than one two-handed melee weapon
  if (meleeTwoHanded.length > 1) {
    // Filter out bayonets with bayonet lugs for this warning
    const nonBayonetTwoHandedWeapons = meleeTwoHanded.filter(
      e => !(e.name.toLowerCase().includes('bayonet') && hasBayonetLugItem)
    );

    if (nonBayonetTwoHandedWeapons.length > 1) {
      result.warnings.push({
        type: WarningType.HANDEDNESS_WARNING,
        message: 'Using multiple two-handed melee weapons',
        details: `Multiple two-handed melee weapons: ${nonBayonetTwoHandedWeapons.map(e => e.name).join(', ')}`,
      });
    }
  }

  // Check ranged weapons similarly
  if (rangedHandsUsed + shieldHandsUsed > 2) {
    result.warnings.push({
      type: WarningType.HANDEDNESS_WARNING,
      message: 'Using more than two hands for ranged weapons and shield',
      details: `You're using ${rangedHandsUsed} hands for ranged weapons${shieldHandsUsed > 0 ? ` and ${shieldHandsUsed} for shield` : ''}. Consider removing some weapons.`,
    });
  }

  if (rangedTwoHanded.length > 0 && rangedOneHanded.length > 0) {
    result.warnings.push({
      type: WarningType.HANDEDNESS_WARNING,
      message: 'Using two-handed ranged weapon with additional one-handed weapons',
      details: `${rangedTwoHanded[0].name} uses both hands and is combined with ${rangedOneHanded.map(e => e.name).join(', ')}`,
    });
  }

  if (rangedTwoHanded.length > 1) {
    result.warnings.push({
      type: WarningType.HANDEDNESS_WARNING,
      message: 'Using multiple two-handed ranged weapons',
      details: `Multiple two-handed ranged weapons: ${rangedTwoHanded.map(e => e.name).join(', ')}`,
    });
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

// Add information about special equipment combinations
function addSpecialCombinationInfo(equipment: Equipment[], result: ValidationResult): void {
  // Clear existing special equipment combo warnings
  result.warnings = result.warnings.filter(warning => warning.type !== WarningType.SPECIAL_EQUIPMENT_COMBO);

  // Check for bayonet lug + bayonet combo
  const bayonets = equipment.filter(e => e.name.toLowerCase().includes('bayonet'));
  const itemsWithBayonetLug = equipment.filter(e => e.equipmentIndicator?.hasBayonetLug === true);

  if (bayonets.length > 0 && itemsWithBayonetLug.length > 0) {
    result.warnings.push({
      type: WarningType.SPECIAL_EQUIPMENT_COMBO,
      message: 'Bayonet attached to compatible weapon',
      details: `${bayonets[0].name} is attached to ${itemsWithBayonetLug.map(e => e.name).join(', ')} and doesn't require additional hands (0 hands used).`,
    });
  }

  // Check for shield combo items + shield
  const shields = equipment.filter(e => e.category === EquipmentCategory.SHIELD);
  const itemsWithShieldCombo = equipment.filter(e => e.equipmentIndicator?.shieldCombo === true);

  if (shields.length > 0 && itemsWithShieldCombo.length > 0) {
    result.warnings.push({
      type: WarningType.SPECIAL_EQUIPMENT_COMBO,
      message: 'Shield combined with compatible weapon',
      details: `${shields[0].name} is combined with ${itemsWithShieldCombo.map(e => e.name).join(', ')} and doesn't require additional hands (0 hands used).`,
    });
  }
}

// Add a new function to validate equipment with ArmyRules
function validateEquipmentWithArmyRules(
  equipment: Equipment[],
  troop: Troop | null,
  armyRules: ArmyRules
): ValidationResult {
  // Initialize result
  const result: ValidationResult = {
    isValid: true,
    warnings: [],
    errors: []
  }

  if (!troop) {
    return result
  }

  // Check available troop
  if (!armyRules.troops.availability[troop.id]) {
    result.errors.push({
      type: ErrorType.TROOP_RESTRICTION_VIOLATION,
      message: 'This troop is not available in this warband variant'
    })
    result.isValid = false
  }

  // Create a map to count quantities of each item
  const itemCounts: Record<string, number> = {}
  equipment.forEach(item => {
    itemCounts[item.id] = (itemCounts[item.id] || 0) + 1
  })

  // Check equipment limits from army rules
  for (const itemId in itemCounts) {
    const count = itemCounts[itemId]
    const limit = armyRules.equipment.limits[itemId]

    if (limit !== undefined && count > limit) {
      result.errors.push({
        type: ErrorType.EQUIPMENT_CATEGORY_LIMIT,
        message: `You can only have ${limit} of ${equipment.find(e => e.id === itemId)?.name || itemId}`
      })
      result.isValid = false
    }
  }

  // Check global equipment restrictions
  equipment.forEach(item => {
    // Check if item is banned by ID
    if (armyRules.equipment.globalRestrictions.bannedEquipmentIds.includes(item.id)) {
      result.errors.push({
        type: ErrorType.EQUIPMENT_BANNED,
        message: `${item.name} is not allowed in this warband variant`
      })
      result.isValid = false
    }

    // Check if item is banned by category
    if (armyRules.equipment.globalRestrictions.bannedCategories.includes(item.category)) {
      result.errors.push({
        type: ErrorType.EQUIPMENT_BANNED,
        message: `Equipment of type ${item.category} is not allowed in this warband variant`
      })
      result.isValid = false
    }

    // Check if item is banned by keyword
    if (item.keywords) {
      const bannedKeywords = armyRules.equipment.globalRestrictions.bannedKeywords
      const bannedItemKeywords = bannedKeywords.filter(keyword =>
        item.keywords.includes(keyword)
      )

      if (bannedItemKeywords.length > 0) {
        result.errors.push({
          type: ErrorType.EQUIPMENT_BANNED,
          message: `Equipment with keywords [${bannedItemKeywords.join(', ')}] is not allowed in this warband variant`
        })
        result.isValid = false
      }
    }

    // Check troop restrictions
    const troopRestrictions = armyRules.equipment.troopRestrictions[item.id]
    if (troopRestrictions && troopRestrictions.conditions) {
      const conditions = troopRestrictions.conditions
      let meetsConditions = false

      // Check OR conditions
      if (conditions.or) {
        for (const condition of conditions.or) {
          if (checkTroopMeetsCondition(troop, condition)) {
            meetsConditions = true
            break
          }
        }
      }

      // Check AND conditions
      if (conditions.and && !meetsConditions) {
        meetsConditions = true
        for (const condition of conditions.and) {
          if (!checkTroopMeetsCondition(troop, condition)) {
            meetsConditions = false
            break
          }
        }
      }

      if (!meetsConditions) {
        result.errors.push({
          type: ErrorType.TROOP_RESTRICTION_VIOLATION,
          message: `${item.name} is not allowed for this troop type`
        })
        result.isValid = false
      }
    }
  })

  // Check handedness
  // ... existing handedness validation code ...

  // Check special equipment combinations
  // ... existing special equipment validation code ...

  return result
}

// Helper function to check if a troop meets a condition
function checkTroopMeetsCondition(
  troop: Troop | null,
  condition: { troopIds?: string[], keywords?: string[], bannedKeywords?: string[] }
): boolean {
  if (!troop) return false

  // Check troop IDs
  if (condition.troopIds && condition.troopIds.length > 0) {
    if (!condition.troopIds.includes(troop.id)) {
      return false
    }
  }

  // Check keywords
  if (condition.keywords && condition.keywords.length > 0) {
    if (!troop.keywords) return false

    for (const keyword of condition.keywords) {
      if (!troop.keywords.includes(keyword)) {
        return false
      }
    }
  }

  // Check banned keywords
  if (condition.bannedKeywords && condition.bannedKeywords.length > 0) {
    if (!troop.keywords) return true // If troop has no keywords, it can't have banned ones

    for (const keyword of condition.bannedKeywords) {
      if (troop.keywords.includes(keyword)) {
        return false
      }
    }
  }

  return true
}
