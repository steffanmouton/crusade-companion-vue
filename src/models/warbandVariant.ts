import { EquipmentCategory } from './equipment'
import type { Cost } from './cost'
import type { FactionEquipmentRules } from './faction'

export interface TroopSpecificOverride {
  // New point cost for this troop in this variant
  pointCost?: number

  // New limit for this troop in this variant
  limit?: number

  // Default equipment for this troop in this variant
  defaultEquipment?: string[]

  // Allowed equipment types for this troop in this variant
  allowedEquipmentTypes?: string[]
}

export interface WarbandVariant {
  id: string
  name: string
  description: string
  factionId: string
  rules?: string[] // Special rules for this warband variant
  equipmentRulesOverride?: FactionEquipmentRules
  equipmentOverrides?: {
    costs?: Record<string, Cost>
    limits?: Record<string, number>
    troopRestrictions?: {
      [equipmentId: string]: {
        conditions?: {
          or?: Array<{
            troopIds?: string[]
            keywords?: string[]
            bannedKeywords?: string[]
          }>
          and?: Array<{
            troopIds?: string[]
            keywords?: string[]
            bannedKeywords?: string[]
          }>
        }
      }
    }
    globalRestrictions?: {
      bannedEquipmentIds?: string[]
      bannedKeywords?: string[]
      bannedCategories?: EquipmentCategory[]
    }
    externalEquipmentAllowances?: {
      factionId: string
      limit: number
      restrictions?: {
        allowedTypes?: string[]
        allowedKeywords?: string[]
        bannedKeywords?: string[]
      }
    }[]
  }
  troopOverrides?: {
    costs?: Record<string, Cost>
    availability?: Record<string, boolean>
  }
  troopSpecificOverrides?: Record<string, {
    pointCost?: number
    equipment?: string[]
  }>
}
