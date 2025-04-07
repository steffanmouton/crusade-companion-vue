import type { EquipmentCategory } from './equipment'
import type { Cost } from './cost'
import type { WarbandVariant } from './warbandVariant'

export enum FactionNames {
  HERETIC_LEGION = 'Heretic Legion',
  TRENCH_PILGRIMS = 'Trench Pilgrims',
  IRON_SULTANATE = 'Iron Sultanate',
  NEW_ANTIOCH = 'New Antioch',
  BLACK_GRAIL = 'Black Grail',
  COURT_OF_THE_SEVEN_HEADED_SERPENT = 'Court of the Seven Headed Serpent',
}

export interface FactionEquipmentRules {
  // Costs for equipment - also serves as the list of available equipment
  costs: Record<string, Cost>;

  // Equipment limits across the army
  limits?: Record<string, number>;

  // Equipment allowed only for specific troops
  troopRestrictions?: {
    [equipmentId: string]: {
      // Conditions that must be met for this equipment
      conditions?: {
        // Any of these conditions must be met
        or?: Array<{
          troopIds?: string[];      // Troop must be one of these IDs
          keywords?: string[];      // Troop must have ALL these keywords
          bannedKeywords?: string[]; // Troop must NOT have ANY of these keywords
        }>;
        // All of these conditions must be met
        and?: Array<{
          troopIds?: string[];      // Troop must be one of these IDs
          keywords?: string[];      // Troop must have ALL these keywords
          bannedKeywords?: string[]; // Troop must NOT have ANY of these keywords
        }>;
      };
    }
  };

  // Global equipment restrictions
  globalRestrictions?: {
    bannedEquipmentIds?: string[];        // Specific equipment that's banned
    bannedKeywords?: string[];            // Equipment with these keywords is banned
    bannedCategories?: EquipmentCategory[]; // Categories that are banned
  };

  // Cross-faction equipment allowances
  externalEquipmentAllowances?: {
    factionId: string;
    limit?: number;  // How many items can be taken from this faction
    restrictions?: {  // Optional further restrictions
      allowedTypes?: string[];
      allowedKeywords?: string[];
      bannedKeywords?: string[];
    }
  }[];

  // Rules for hiring mercenaries
  mercenaryRules?: {
    costs: { [troopId: string]: Cost };    // Costs to hire each mercenary
    limits: { [troopId: string]: number }; // Limits for each mercenary type
  };
}

export interface ExternalEquipmentAllowance {
  // The faction ID that equipment can be sourced from
  factionId: string;

  // Optional restrictions on what can be used
  restrictions?: {
    // Only these types are allowed
    allowedTypes?: string[];

    // Equipment with these keywords are not allowed
    bannedKeywords?: string[];

    // Only equipment with at least one of these keywords is allowed
    allowedKeywords?: string[];
  }
}

export interface Faction {
  id: string
  name: string
  description: string
  iconUrl: string
  troopTypes: string[]
  specialRules: string[]

  // Equipment rules for this faction
  equipmentRules: FactionEquipmentRules

  // Whether this faction can use equipment from other factions
  allowsExternalEquipment?: boolean

  // Which other factions' equipment can be used, if allowsExternalEquipment is true
  allowedExternalFactions?: string[]

  // Flag to indicate if this faction is selectable when creating a new army
  isPlayable?: boolean

  variants?: WarbandVariant[]
}
