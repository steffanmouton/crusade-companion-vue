import { getFirestore, doc, getDoc } from 'firebase/firestore'
import type { Faction } from '../models/faction'
import type { WarbandVariant } from '../models/warbandVariant'
import type { ArmyRules } from '../models/armyRules'

/**
 * Creates a deep clone of an object
 * @param obj The object to clone
 * @returns A deep clone of the object
 */
function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T
  }

  const clone = {} as Record<string, any>

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone((obj as Record<string, any>)[key])
    }
  }

  return clone as T
}

/**
 * Gets pre-compiled ArmyRules from Firebase based on faction and optional warband variant
 * @param faction The base faction
 * @param variant Optional warband variant
 * @returns A compiled ArmyRules object
 */
export async function getArmyRules(faction: Faction, variant?: WarbandVariant): Promise<ArmyRules> {
  try {
    const db = getFirestore()
    const docId = variant ? `${faction.id}-${variant.id}` : `${faction.id}-base`

    console.log(`Attempting to retrieve pre-compiled army rules for ${docId}`)

    const docRef = doc(db, 'armyRules', docId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      console.warn(`No pre-compiled rules found for ${docId}, falling back to runtime compilation`)
      return compileArmyRules(faction, variant)
    }

    console.log(`Successfully retrieved pre-compiled army rules for ${docId}`)
    return docSnap.data() as ArmyRules
  } catch (error) {
    console.error(
      `Error retrieving army rules: ${error instanceof Error ? error.message : String(error)}`,
    )
    console.warn('Falling back to runtime compilation')
    return compileArmyRules(faction, variant)
  }
}

/**
 * Compiles a complete set of ArmyRules from a faction and optional warband variant
 * This is now only used as a fallback when pre-compiled rules are not found
 * @param faction The base faction
 * @param variant Optional warband variant
 * @returns A compiled ArmyRules object with all rules merged
 */
export function compileArmyRules(faction: Faction, variant?: WarbandVariant): ArmyRules {
  console.log(`Compiling army rules for faction ${faction.name} ${faction.id}`)

  if (variant) {
    console.log(`Including variant ${variant.name} ${variant.id}`)
    console.log(`Variant configuration:`, {
      factionId: variant.factionId,
      equipmentRules: variant.equipmentRules || 'none',
      troopRules: variant.troopRules || 'none',
      armyRulesOverrides: variant.armyRulesOverrides || 'none',
    })
  }

  // Start with a blank ArmyRules object
  const armyRules: ArmyRules = {
    factionId: faction.id,
    factionName: faction.name,
    specialRules: [...faction.specialRules], // Clone the special rules array

    // Initialize equipment rules
    equipment: {
      costs: { ...faction.equipmentRules.costs },
      limits: { ...(faction.equipmentRules.limits || {}) },
      troopRestrictions: deepClone(faction.equipmentRules.troopRestrictions || {}),
      globalRestrictions: {
        bannedEquipmentIds: [
          ...(faction.equipmentRules.globalRestrictions?.bannedEquipmentIds || []),
        ],
        bannedKeywords: [...(faction.equipmentRules.globalRestrictions?.bannedKeywords || [])],
        bannedCategories: [...(faction.equipmentRules.globalRestrictions?.bannedCategories || [])],
      },
      externalEquipmentAllowances: (faction.equipmentRules.externalEquipmentAllowances || []).map(
        (allowance) => ({
          ...deepClone(allowance),
          limit: allowance.limit ?? 0, // Default to 0 if limit is undefined
        }),
      ),
    },

    // Initialize troop rules
    troops: {
      costs: { ...(faction.troopRules?.costs || {}) },
      limits: { ...(faction.troopRules?.limits || {}) },
      availability: {}, // Will be populated with troop availability
      restrictions: {
        requirements: deepClone(faction.troopRules?.restrictions?.requirements || []),
        maxKeywordCounts: { ...(faction.troopRules?.restrictions?.maxKeywordCounts || {}) },
      },
    },
  }

  // Add mercenary rules if they exist in the faction
  if (faction.equipmentRules.mercenaryRules) {
    armyRules.mercenaries = {
      costs: { ...faction.equipmentRules.mercenaryRules.costs },
      limits: { ...faction.equipmentRules.mercenaryRules.limits },
    }
  }

  // Populate troop availability based on what troops have costs defined
  // By default, all troops with costs are available
  for (const troopId in armyRules.troops.costs) {
    armyRules.troops.availability[troopId] = true
  }

  // Mark troops as unavailable if they have a maxCount: 0 restriction in the base faction
  if (faction.troopRules?.restrictions?.requirements) {
    for (const requirement of faction.troopRules.restrictions.requirements) {
      if (requirement.maxCount === 0 && requirement.troopIds) {
        for (const troopId of requirement.troopIds) {
          console.log(
            `Setting troop ${troopId} to unavailable due to maxCount: 0 restriction in base faction`,
          )
          armyRules.troops.availability[troopId] = false
        }
      }
    }
  }

  // If a warband variant is provided, apply its rules on top of faction rules
  if (variant) {
    // Add basic information
    armyRules.warbandVariantId = variant.id
    armyRules.warbandVariantName = variant.name
    armyRules.warbandVariantRules = variant.specialRules || []

    // Apply equipment rules if defined
    if (variant.equipmentRules) {
      // Override or add equipment costs
      if (variant.equipmentRules.costs) {
        Object.assign(armyRules.equipment.costs, variant.equipmentRules.costs)
      }

      // Override or add equipment limits
      if (variant.equipmentRules.limits) {
        Object.assign(armyRules.equipment.limits, variant.equipmentRules.limits)
      }

      // Override or add troop restrictions
      if (variant.equipmentRules.troopRestrictions) {
        for (const equipId in variant.equipmentRules.troopRestrictions) {
          armyRules.equipment.troopRestrictions[equipId] = deepClone(
            variant.equipmentRules.troopRestrictions[equipId],
          )
        }
      }

      // Override or add global restrictions
      if (variant.equipmentRules.globalRestrictions) {
        const globalRestrictions = variant.equipmentRules.globalRestrictions

        if (globalRestrictions.bannedEquipmentIds) {
          armyRules.equipment.globalRestrictions.bannedEquipmentIds = [
            ...armyRules.equipment.globalRestrictions.bannedEquipmentIds,
            ...globalRestrictions.bannedEquipmentIds,
          ]
        }

        if (globalRestrictions.bannedKeywords) {
          armyRules.equipment.globalRestrictions.bannedKeywords = [
            ...armyRules.equipment.globalRestrictions.bannedKeywords,
            ...globalRestrictions.bannedKeywords,
          ]
        }

        if (globalRestrictions.bannedCategories) {
          armyRules.equipment.globalRestrictions.bannedCategories = [
            ...armyRules.equipment.globalRestrictions.bannedCategories,
            ...globalRestrictions.bannedCategories,
          ]
        }
      }

      // Override or add external equipment allowances
      if (variant.equipmentRules.externalEquipmentAllowances) {
        armyRules.equipment.externalEquipmentAllowances =
          variant.equipmentRules.externalEquipmentAllowances.map((allowance) => ({
            ...deepClone(allowance),
            limit: allowance.limit ?? 0, // Default to 0 if limit is undefined
          }))
      }

      // Apply mercenary rules
      if (variant.equipmentRules.mercenaryRules) {
        if (!armyRules.mercenaries) {
          armyRules.mercenaries = {
            costs: {},
            limits: {},
          }
        }

        // Merge costs and limits
        Object.assign(armyRules.mercenaries.costs, variant.equipmentRules.mercenaryRules.costs)
        Object.assign(armyRules.mercenaries.limits, variant.equipmentRules.mercenaryRules.limits)
      }
    }

    // Apply troop rules if defined
    if (variant.troopRules) {
      // Override or add troop costs
      if (variant.troopRules.costs) {
        Object.assign(armyRules.troops.costs, variant.troopRules.costs)
      }

      // Override or add troop limits
      if (variant.troopRules.limits) {
        Object.assign(armyRules.troops.limits, variant.troopRules.limits)
      }

      // Update troop availability based on the costs
      // This ensures any new troops added by the variant are marked as available
      for (const troopId in variant.troopRules.costs) {
        armyRules.troops.availability[troopId] = true
      }

      // Apply troop restrictions if they exist
      if (variant.troopRules.restrictions) {
        // Override or add requirements
        if (variant.troopRules.restrictions.requirements) {
          armyRules.troops.restrictions.requirements = [
            ...armyRules.troops.restrictions.requirements,
            ...deepClone(variant.troopRules.restrictions.requirements),
          ]

          // Find any troops with maxCount: 0 and mark them as unavailable
          for (const requirement of variant.troopRules.restrictions.requirements) {
            if (requirement.maxCount === 0 && requirement.troopIds) {
              for (const troopId of requirement.troopIds) {
                console.log(
                  `Setting troop ${troopId} to unavailable due to maxCount: 0 restriction`,
                )
                armyRules.troops.availability[troopId] = false
              }
            }
          }
        }

        // Override or add max keyword counts
        if (variant.troopRules.restrictions.maxKeywordCounts) {
          Object.assign(
            armyRules.troops.restrictions.maxKeywordCounts,
            variant.troopRules.restrictions.maxKeywordCounts,
          )
        }
      }

      // Apply allowed equipment for troops
      if (variant.troopRules.allowedEquipment) {
        if (!armyRules.troops.troopAbilities) {
          armyRules.troops.troopAbilities = {}
        }

        for (const troopId in variant.troopRules.allowedEquipment) {
          const allowedEquipment = variant.troopRules.allowedEquipment[troopId]

          if (!armyRules.troops.troopAbilities[troopId]) {
            armyRules.troops.troopAbilities[troopId] = {
              additionalAbilities: [],
            }
          }

          // Add a note about special equipment
          if (allowedEquipment && allowedEquipment.length > 0) {
            armyRules.troops.troopAbilities[troopId].additionalAbilities = [
              ...(armyRules.troops.troopAbilities[troopId].additionalAbilities || []),
              `Has special equipment allowances: ${allowedEquipment.join(', ')}`,
            ]
          }
        }
      }
    }

    // Apply army rules overrides if defined
    if (variant.armyRulesOverrides) {
      console.log(`Applying data-driven rules for ${variant.name}`)

      // Add minimum model cost rule if defined
      if (variant.armyRulesOverrides.minModelCost) {
        armyRules.troops.minModelCost = {
          cost: variant.armyRulesOverrides.minModelCost.cost,
          exceptions: variant.armyRulesOverrides.minModelCost.exceptions || {},
        }
        console.log(
          `Applied minimum model cost: ${variant.armyRulesOverrides.minModelCost.cost} ducats`,
        )
      }

      // Add maximum model cost rule if defined
      if (variant.armyRulesOverrides.maxModelCost) {
        armyRules.troops.maxModelCost = {
          cost: variant.armyRulesOverrides.maxModelCost.cost,
          exceptions: variant.armyRulesOverrides.maxModelCost.exceptions || {},
        }
        console.log(
          `Applied maximum model cost: ${variant.armyRulesOverrides.maxModelCost.cost} ducats`,
        )
      }

      // Add special validations if defined
      if (variant.armyRulesOverrides.specialValidations) {
        armyRules.specialValidations = variant.armyRulesOverrides.specialValidations
        console.log('Applied special validations:', armyRules.specialValidations)
      }
    }
  }

  // Log final state of warband-specific items
  if (variant && variant.id === 'tc-wb-knights-of-avarice') {
    console.log('Final state of Knights of Avarice special equipment:')
    const specialItems = [
      'tc-eq-coinhammer',
      'tc-eq-tarnished-armour',
      'tc-eq-standard-of-mammon',
      'tc-eq-golden-calf-altar',
    ]

    for (const itemId of specialItems) {
      console.log(`  - ${itemId}: ${armyRules.equipment.costs[itemId] ? 'Added' : 'Missing'}`)
    }

    console.log('Global restrictions:', armyRules.equipment.globalRestrictions)
  }

  return armyRules
}

/**
 * Creates ArmyRules for an existing army, based on its faction and optional warband variant
 * @param factionId The faction ID
 * @param warbandVariantId Optional warband variant ID
 * @param factions All available factions
 * @param variants All available warband variants
 * @returns Compiled ArmyRules object
 */
export function createArmyRules(
  factionId: string,
  warbandVariantId: string | undefined,
  factions: Faction[],
  variants: WarbandVariant[],
): ArmyRules | null {
  // Find the faction
  const faction = factions.find((f) => f.id === factionId)
  if (!faction) return null

  // Find the variant if specified
  let variant: WarbandVariant | undefined
  if (warbandVariantId) {
    variant = variants.find((v) => v.id === warbandVariantId && v.factionId === factionId)
  }

  // Compile the rules
  return compileArmyRules(faction, variant)
}
