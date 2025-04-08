import type { FactionEquipmentRules, FactionTroopRules } from './faction'

export interface WarbandVariant {
  id: string
  name: string
  description: string
  factionId: string
  specialRules?: string[] // Special rules for this warband variant

  // Equipment rules that override or extend the faction's equipment rules
  equipmentRules?: FactionEquipmentRules

  // Troop rules that override or extend the faction's troop rules
  troopRules?: FactionTroopRules

  // Army rules overrides
  armyRulesOverrides?: {
    // Minimum model cost rule
    minModelCost?: {
      cost: number
      exceptions?: {
        keywords?: string[]
        troopIds?: string[]
      }
    }

    // Maximum model cost rule
    maxModelCost?: {
      cost: number
      exceptions?: {
        keywords?: string[]
        troopIds?: string[]
      }
    }

    // Special validations
    specialValidations?: {
      enforcePatron?: string
      otherRequirements?: string[]
    }
  }
}
