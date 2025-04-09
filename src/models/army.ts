import type { Faction } from './faction'
import type { Unit } from './unit'
import type { ArmyRules } from './armyRules'
import type { WarbandVariant } from './warbandVariant'
import { CURRENT_RULEBOOK_VERSION } from '../config/appConstants'

export interface Army {
  id: string
  name: string
  faction: Faction
  currentPoints: number
  targetPoints: number
  currency: number // for Trench Crusade, this is Glory Points
  units: Unit[]
  warbandVariantId?: string // Reference to warband variant instead of embedding
  rulebookVersion?: string // Version of the rulebook these rules are based on

  // Cached compiled rules for this army
  compiledRules?: ArmyRules
}

/**
 * Creates ArmyRules for an existing Army, based on its faction and optional warband variant
 * @param army The army to create rules for
 * @param variants All available warband variants
 * @returns Compiled ArmyRules object
 */
export function getArmyRules(army: Army, variants: WarbandVariant[]): ArmyRules {
  // If we already have compiled rules, return them
  if (army.compiledRules) {
    return army.compiledRules
  }

  // Find the variant if specified
  let variant: WarbandVariant | undefined
  if (army.warbandVariantId) {
    variant = variants.find(
      (v) => v.id === army.warbandVariantId && v.factionId === army.faction.id,
    )
  }

  // Compile the rules using the armyRulesService function
  // Import dynamically to avoid circular dependencies
  // This needs to be handled by the caller
  return {
    factionId: army.faction.id,
    factionName: army.faction.name,
    specialRules: army.faction.specialRules,
    warbandVariantId: variant?.id,
    warbandVariantName: variant?.name,
    warbandVariantRules: variant?.specialRules,
    rulebookVersion: army.rulebookVersion || CURRENT_RULEBOOK_VERSION,

    // These need to be filled in by the armyRulesService
    equipment: {
      costs: {},
      limits: {},
      troopRestrictions: {},
      globalRestrictions: {
        bannedEquipmentIds: [],
        bannedKeywords: [],
        bannedCategories: [],
      },
      externalEquipmentAllowances: [],
    },
    troops: {
      costs: {},
      limits: {},
      availability: {},
      restrictions: {
        requirements: [],
        maxKeywordCounts: {},
      },
    },
  }
}
