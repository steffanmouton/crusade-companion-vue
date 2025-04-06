import { EquipmentCategory } from './equipment'
import type { Cost } from './cost'
import type { FactionEquipmentRules } from './faction'
import type { Troop } from './troop'
import type { Faction } from './faction'

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
  factionId: string
  description?: string
  
  // Custom rules specific to this warband variant
  rules: string[]
  
  // Equipment rules specific to this variant
  // If specified, these override or extend the faction's equipment rules
  equipmentRules?: FactionEquipmentRules
  
  // Complete override of equipment rules from parent faction
  equipmentRulesOverride?: FactionEquipmentRules;
  
  // Selective overrides (applied on top of parent faction rules)
  equipmentOverrides?: {
    // Override costs for specific equipment
    costs?: { [equipmentId: string]: Cost };
    
    // Override limits for specific equipment
    limits?: { [equipmentId: string]: number };
    
    // Override troop restrictions for equipment
    troopRestrictions?: {
      [equipmentId: string]: {
        allowedTroopIds?: string[];
        requiredKeywords?: string[];
        bannedKeywords?: string[];
      }
    };
    
    // Override global restrictions
    globalRestrictions?: {
      bannedEquipmentIds?: string[];
      bannedKeywords?: string[];
      bannedCategories?: EquipmentCategory[];
    };
    
    // Override external equipment allowances
    externalEquipmentAllowances?: {
      factionId: string;
      limit: number;
      restrictions?: {
        allowedTypes?: string[];
        allowedKeywords?: string[];
        bannedKeywords?: string[];
      }
    }[];
  };
  
  // Troop-specific overrides for individual troops in this variant
  troopSpecificOverrides?: {
    [troopId: string]: TroopSpecificOverride
  };
  
  // General troop-related overrides for this variant
  troopOverrides?: {
    // Override costs for specific troops
    costs?: { [troopId: string]: Cost };
    
    // Override availability of troops
    availability?: { [troopId: string]: boolean };
    
    // Override troop stats or properties
    troopProperties?: {
      [troopId: string]: Partial<Troop>;
    };
    
    // Add new troops only available to this variant
    additionalTroops?: Troop[];
  };
}
