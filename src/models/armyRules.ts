import type { EquipmentCategory } from './equipment'
import type { Cost } from './cost'

/**
 * ArmyRules represents the complete set of rules for an army,
 * including all troop and equipment rules. This is a "compiled"
 * version of the rules that merges base faction rules with any
 * warband variant rules.
 */
export interface ArmyRules {
  // Basic information
  factionId: string
  factionName: string
  specialRules: string[]
  warbandVariantId?: string
  warbandVariantName?: string
  warbandVariantRules?: string[]
  rulebookVersion: string // The version of the rulebook these rules are based on

  // Equipment rules
  equipment: {
    // Costs for all available equipment
    costs: Record<string, Cost>

    // Limits on equipment across the army
    limits: Record<string, number>

    // Equipment allowed only for specific troops
    troopRestrictions: {
      [equipmentId: string]: {
        // Conditions that must be met for this equipment
        conditions?: {
          // Any of these conditions must be met
          or?: Array<{
            troopIds?: string[] // Troop must be one of these IDs
            keywords?: string[] // Troop must have ALL these keywords
            bannedKeywords?: string[] // Troop must NOT have ANY of these keywords
          }>
          // All of these conditions must be met
          and?: Array<{
            troopIds?: string[] // Troop must be one of these IDs
            keywords?: string[] // Troop must have ALL these keywords
            bannedKeywords?: string[] // Troop must NOT have ANY of these keywords
          }>
        }
      }
    }

    // Global equipment restrictions
    globalRestrictions: {
      bannedEquipmentIds: string[] // Specific equipment that's banned
      bannedKeywords: string[] // Equipment with these keywords is banned
      bannedCategories: EquipmentCategory[] // Categories that are banned
    }

    // Special equipment unique to this army (e.g., warband variant special items)
    specialEquipment?: {
      id: string
      name: string
      description: string
      rules: string[]
      keywords?: string[]
      category: EquipmentCategory
      conditions?: {
        // Same structure as troopRestrictions conditions
        or?: Array<{ troopIds?: string[]; keywords?: string[]; bannedKeywords?: string[] }>
        and?: Array<{ troopIds?: string[]; keywords?: string[]; bannedKeywords?: string[] }>
      }
    }[]

    // Cross-faction equipment allowances
    externalEquipmentAllowances: {
      factionId: string
      limit: number // How many items can be taken from this faction
      restrictions?: {
        // Optional further restrictions
        allowedTypes?: string[]
        allowedKeywords?: string[]
        bannedKeywords?: string[]
      }
    }[]

    // Modifications to existing equipment (e.g., changing keywords, stats)
    equipmentModifications?: {
      [equipmentId: string]: {
        replaceKeywords?: {
          original: string
          replacement: string
        }[]
        modifyStats?: Record<string, any>
        modifyDescription?: string
      }
    }
  }

  // Troop rules
  troops: {
    // Base costs for troops
    costs: Record<string, Cost>

    // Limits on how many of each troop can be included
    limits: Record<string, number>

    // Alternative costs for certain troops (e.g., paying ducats instead of glory points)
    alternativeCosts?: Record<
      string,
      {
        original: Cost
        alternative: Cost
      }
    >

    // Availability flags for troops (false means the troop is banned)
    availability: Record<string, boolean>

    // Special abilities or rules for specific troops
    troopAbilities?: {
      [troopId: string]: {
        replacementAbilities?: {
          original: string
          replacement: string
        }[]
        additionalAbilities?: string[]
      }
    }

    // Restrictions on troops
    restrictions: {
      // Minimum/maximum requirements for specific troop types
      requirements: Array<{
        minCount?: number
        maxCount?: number
        troopIds?: string[] // Applies to these specific troops
        keywords?: string[] // OR applies to troops with these keywords
      }>

      // Global keyword-based restrictions
      maxKeywordCounts: Record<string, number> // e.g. {"ELITE": 3} - max 3 ELITE troops
    }

    // Minimum model cost rule, if any (e.g., "Knights of Avarice minimum 80 ducats")
    minModelCost?: {
      cost: number
      exceptions?: {
        troopIds?: string[]
        keywords?: string[]
      }
    }

    // Maximum model cost rule, if any
    maxModelCost?: {
      cost: number
      exceptions?: {
        troopIds?: string[]
        keywords?: string[]
      }
    }
  }

  // Rules for hiring mercenaries
  mercenaries?: {
    costs: { [troopId: string]: Cost } // Costs to hire each mercenary
    limits: { [troopId: string]: number } // Limits for each mercenary type
  }

  // Other special rules or validations
  specialValidations?: {
    enforcePatron?: string // Enforce a specific patron for a warband
    // Add other special validation rules as needed
  }
}

/**
 * A simplified version of ArmyRules with just the essential properties for validation.
 * This can be used as a type for functions that only need basic rule information.
 */
export type ArmyRulesValidation = Pick<ArmyRules, 'equipment' | 'troops' | 'specialValidations'>
