import type { Equipment } from '../models/equipment'
import type { Faction } from '../models/faction'
import type { WarbandVariant } from '../models/warbandVariant'
import type { Cost } from '../models/cost'
import type { Troop } from '../models/troop'
import { CurrencyType } from '../models/cost'
import type { ArmyRules } from '../models/armyRules'

/**
 * Gets the cost of equipment for a specific faction and optional variant
 */
export function getEquipmentCost(
  equipment: Equipment,
  faction: Faction | null,
  variant?: WarbandVariant | null
): Cost | null {
  if (!faction) return null;

  console.log(`Checking cost for equipment "${equipment.name}" (${equipment.id}) in faction "${faction.name}"`);

  // Check variant override first
  if (variant?.equipmentRules?.costs?.[equipment.id]) {
    console.log(`- Found cost in variant equipment rules`);
    return variant.equipmentRules.costs[equipment.id];
  }

  // Check base faction cost
  if (faction.equipmentRules?.costs?.[equipment.id]) {
    console.log(`- Found cost in faction rules: ${JSON.stringify(faction.equipmentRules.costs[equipment.id])}`);
    return faction.equipmentRules.costs[equipment.id];
  }

  console.log(`- No cost found for this equipment in faction ${faction.name}`);
  return null;
}

/**
 * Gets the limit of how many of this equipment can be included in a warband
 */
export function getEquipmentLimit(
  equipment: Equipment,
  faction: Faction,
  variant?: WarbandVariant | null
): number {
  // Check variant override first
  if (variant?.equipmentRules?.limits?.[equipment.id] !== undefined) {
    return variant.equipmentRules.limits[equipment.id];
  }

  // Check base faction limit
  if (faction.equipmentRules?.limits?.[equipment.id] !== undefined) {
    return faction.equipmentRules.limits[equipment.id];
  }

  return 0; // No limit by default
}

/**
 * Checks if the equipment is globally banned by faction or variant rules
 */
export function isEquipmentGloballyBanned(
  equipment: Equipment,
  faction: Faction | null,
  variant?: WarbandVariant | null
): boolean {
  if (!faction) return false;

  // Check if equipment is directly banned by ID
  if (variant?.equipmentRules?.globalRestrictions?.bannedEquipmentIds?.includes(equipment.id)) {
    return true;
  }

  if (faction.equipmentRules?.globalRestrictions?.bannedEquipmentIds?.includes(equipment.id)) {
    return true;
  }

  // Check if equipment category is banned
  if (equipment.category) {
    if (variant?.equipmentRules?.globalRestrictions?.bannedCategories?.includes(equipment.category)) {
      return true;
    }

    if (faction.equipmentRules?.globalRestrictions?.bannedCategories?.includes(equipment.category)) {
      return true;
    }
  }

  // Check if any keywords are banned
  if (equipment.keywords && equipment.keywords.length > 0) {
    // Check variant override rules
    const variantBannedKeywords = variant?.equipmentRules?.globalRestrictions?.bannedKeywords || [];

    // Check faction rules
    const factionBannedKeywords = faction.equipmentRules?.globalRestrictions?.bannedKeywords || [];

    // Combine all banned keywords
    const bannedKeywords = [...new Set([...variantBannedKeywords, ...factionBannedKeywords])];

    if (bannedKeywords.some(banned => equipment.keywords?.includes(banned))) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if the equipment is allowed for a specific troop
 */
export function isEquipmentAllowedForTroop(
  equipment: Equipment,
  troop: Troop,
  faction: Faction | null,
  variant?: WarbandVariant | null
): boolean {
  if (!faction) return false;

  // First check if it's globally banned
  if (isEquipmentGloballyBanned(equipment, faction, variant)) {
    return false;
  }

  // Get the effective troop restrictions for this equipment
  const troopRestrictions = getEquipmentTroopRestrictions(equipment.id, faction, variant);

  // If no restrictions, it's allowed
  if (!troopRestrictions) {
    return true;
  }

  // Helper function to check if a single condition is met
  const isConditionMet = (condition: {
    troopIds?: string[];
    keywords?: string[];
    bannedKeywords?: string[];
  }): boolean => {
    // Check troop IDs if specified
    if (condition.troopIds && condition.troopIds.length > 0) {
      if (!condition.troopIds.includes(troop.id)) {
        return false;
      }
    }

    // Check required keywords if specified
    if (condition.keywords && condition.keywords.length > 0) {
      if (!condition.keywords.every((keyword: string) => troop.keywords.includes(keyword))) {
        return false;
      }
    }

    // Check banned keywords if specified
    if (condition.bannedKeywords && condition.bannedKeywords.length > 0) {
      if (condition.bannedKeywords.some((keyword: string) => troop.keywords.includes(keyword))) {
        return false;
      }
    }

    // If we got here, this condition is met
    return true;
  };

  // Check conditions if present
  if (troopRestrictions.conditions) {
    const { or, and } = troopRestrictions.conditions;

    // If we have AND conditions, all must be met
    if (and && and.length > 0) {
      if (!and.every(isConditionMet)) {
        return false;
      }
    }

    // If we have OR conditions, at least one must be met
    if (or && or.length > 0) {
      if (!or.some(isConditionMet)) {
        return false;
      }
    }
  }

  // If we have troop IDs, check if this troop is allowed
  if (troopRestrictions.allowedTroopIds && troopRestrictions.allowedTroopIds.length > 0) {
    if (!troopRestrictions.allowedTroopIds.includes(troop.id)) {
      return false;
    }
  }

  // If we have required keywords, check if troop has them
  if (troopRestrictions.requiredKeywords && troopRestrictions.requiredKeywords.length > 0) {
    if (!troopRestrictions.requiredKeywords.every(keyword => troop.keywords.includes(keyword))) {
      return false;
    }
  }

  // If we have banned keywords, check if troop doesn't have them
  if (troopRestrictions.bannedKeywords && troopRestrictions.bannedKeywords.length > 0) {
    if (troopRestrictions.bannedKeywords.some(keyword => troop.keywords.includes(keyword))) {
      return false;
    }
  }

  // If we got here, all checks passed
  return true;
}

/**
 * Helper function to get the effective troop restrictions for an equipment
 */
function getEquipmentTroopRestrictions(
  equipmentId: string,
  faction: Faction,
  variant?: WarbandVariant | null
): {
  conditions?: {
    or?: Array<{
      troopIds?: string[];
      keywords?: string[];
      bannedKeywords?: string[];
    }>;
    and?: Array<{
      troopIds?: string[];
      keywords?: string[];
      bannedKeywords?: string[];
    }>;
  };
  allowedTroopIds?: string[];
  requiredKeywords?: string[];
  bannedKeywords?: string[];
} | null {
  // Check variant override first
  if (variant?.equipmentRules?.troopRestrictions?.[equipmentId]) {
    return variant.equipmentRules.troopRestrictions[equipmentId];
  }

  // Check base faction restrictions
  if (faction.equipmentRules?.troopRestrictions?.[equipmentId]) {
    return faction.equipmentRules.troopRestrictions[equipmentId];
  }

  return null;
}

/**
 * Formats equipment cost with faction and variant information
 */
export function formatEquipmentCost(
  equipment: Equipment,
  faction: Faction | null,
  formatCostFn: (cost: Cost) => string,
  variant?: WarbandVariant | null
): string {
  if (!faction) return 'Not Available';

  const cost = getEquipmentCost(equipment, faction, variant);

  if (!cost) {
    return 'Not Available';
  }

  return formatCostFn(cost);
}

/**
 * Checks if an equipment can be used from an external faction
 */
export function canUseExternalEquipment(
  equipment: Equipment,
  sourceFaction: Faction,
  currentFaction: Faction,
  variant?: WarbandVariant | null
): boolean {
  // Get all external equipment allowances
  const allowances = getExternalEquipmentAllowances(currentFaction, variant);

  // Check if source faction is allowed
  const allowance = allowances.find(a => a.factionId === sourceFaction.id);

  if (!allowance) {
    return false;
  }

  // Check type restrictions
  if (allowance.restrictions?.allowedTypes &&
      !allowance.restrictions.allowedTypes.includes(equipment.type)) {
    return false;
  }

  // Check keyword restrictions
  if (equipment.keywords) {
    // Check allowed keywords
    if (allowance.restrictions?.allowedKeywords &&
        !equipment.keywords.some(k => allowance.restrictions?.allowedKeywords?.includes(k))) {
      return false;
    }

    // Check banned keywords
    if (allowance.restrictions?.bannedKeywords &&
        equipment.keywords.some(k => allowance.restrictions?.bannedKeywords?.includes(k))) {
      return false;
    }
  }

  return true;
}

/**
 * Helper function to get all external equipment allowances
 */
function getExternalEquipmentAllowances(
  faction: Faction,
  variant?: WarbandVariant | null
) {
  // Check variant override first
  if (variant?.equipmentRules?.externalEquipmentAllowances) {
    return variant.equipmentRules.externalEquipmentAllowances;
  }

  // Check base faction allowances
  if (faction.equipmentRules?.externalEquipmentAllowances) {
    return faction.equipmentRules.externalEquipmentAllowances;
  }

  return [];
}

/**
 * Gets the cost for a specific troop based on faction and variant
 */
export function getTroopCost(
  troopId: string,
  faction: Faction | null,
  variant?: WarbandVariant | null
): Cost | null {
  if (!faction) return null;

  // Check variant troop costs override
  if (variant?.troopRules?.costs?.[troopId]) {
    return variant.troopRules.costs[troopId];
  }

  // Check for mercenary costs if applicable
  if (faction.equipmentRules.mercenaryRules?.costs?.[troopId]) {
    return faction.equipmentRules.mercenaryRules.costs[troopId];
  }

  // Check faction base troop costs
  if (faction.troopRules?.costs?.[troopId]) {
    return faction.troopRules.costs[troopId];
  }

  // If no cost defined, troop is not available for this faction/variant
  return null;
}

/**
 * Checks if a troop is available to this faction/variant
 */
export function isTroopAvailable(
  troop: Troop,
  faction: Faction,
  variant?: WarbandVariant | null
): boolean {
  // For regular troops, check if they belong to this faction
  if (troop.factionId === faction.id) {
    // We now determine availability based on whether the troop has a cost defined
    const hasCost = getTroopCost(troop.id, faction, variant) !== null;
    return hasCost;
  }

  // For mercenaries, check if this faction can hire them
  if (troop.factionId === "mercenary") {
    // First check if this mercenary can work for this faction
    if (!troop.mercenaryFactions?.includes(faction.name)) {
      return false;
    }

    // Then check if the faction or variant has rules for hiring this mercenary
    const factionHasRules = !!faction.equipmentRules.mercenaryRules?.costs?.[troop.id];
    const variantHasRules = !!variant?.equipmentRules?.mercenaryRules?.costs?.[troop.id];

    return factionHasRules || variantHasRules;
  }

  return false; // Troops from other factions (non-mercenary) are not available
}

/**
 * Gets all available equipment for a troop based on faction rules
 */
export function getAvailableEquipmentForTroop(
  troop: Troop,
  allEquipment: Equipment[],
  faction: Faction,
  variant?: WarbandVariant | null
): Equipment[] {
  // Filter equipment based on faction/variant rules
  return allEquipment.filter(equipment => {
    // Check if equipment is available in faction/variant (has a cost defined)
    const hasCost = getEquipmentCost(equipment, faction, variant) !== null;

    if (!hasCost) return false;

    // Check if equipment is allowed for this troop
    return isEquipmentAllowedForTroop(equipment, troop, faction, variant);
  });
}

/**
 * Gets the limit of how many of a specific troop can be included in a warband
 */
export function getTroopLimit(
  troopId: string,
  faction: Faction,
  variant?: WarbandVariant | null
): number {
  // Check variant troop limits override
  if (variant?.troopRules?.limits?.[troopId] !== undefined) {
    return variant.troopRules.limits[troopId];
  }

  // Check faction base limits
  if (faction.troopRules?.limits?.[troopId] !== undefined) {
    return faction.troopRules.limits[troopId];
  }

  // If no specific limit defined, check if there's a mercenary limit
  if (faction.equipmentRules.mercenaryRules?.limits?.[troopId] !== undefined) {
    return faction.equipmentRules.mercenaryRules.limits[troopId];
  }

  return 0; // No limit by default
}

/**
 * Checks if a troop composition meets the requirements specified in faction rules
 */
export function meetsTroopRequirements(
  troopComposition: Record<string, number>,
  troops: Troop[],
  faction: Faction,
  variant?: WarbandVariant | null
): { meets: boolean; reason?: string } {
  const requirements = [];

  // Get faction requirements
  if (faction.troopRules?.restrictions?.requirements) {
    requirements.push(...faction.troopRules.restrictions.requirements);
  }

  // Add variant requirements if they exist
  if (variant?.troopRules?.restrictions?.requirements) {
    requirements.push(...variant.troopRules.restrictions.requirements);
  }

  if (requirements.length === 0) {
    return { meets: true };
  }

  // Check minimum/maximum requirements
  for (const req of requirements) {
    // Calculate how many troops in the composition match this requirement
    let matchCount = 0;

    // Check specific troop IDs
    if (req.troopIds) {
      for (const troopId of req.troopIds) {
        matchCount += troopComposition[troopId] || 0;
      }
    }

    // Check keywords
    if (req.keywords) {
      const troopsWithKeywords = troops.filter(troop =>
        req.keywords?.every(keyword => troop.keywords.includes(keyword))
      );
      for (const troop of troopsWithKeywords) {
        matchCount += troopComposition[troop.id] || 0;
      }
    }

    // Check minimum requirement
    if (req.minCount !== undefined && matchCount < req.minCount) {
      const description = req.troopIds ?
        `troops (${req.troopIds.join(', ')})` :
        `troops with keywords [${req.keywords?.join(', ')}]`;
      return {
        meets: false,
        reason: `Need at least ${req.minCount} ${description}, only have ${matchCount}`
      };
    }

    // Check maximum requirement
    if (req.maxCount !== undefined && matchCount > req.maxCount) {
      const description = req.troopIds ?
        `troops (${req.troopIds.join(', ')})` :
        `troops with keywords [${req.keywords?.join(', ')}]`;
      return {
        meets: false,
        reason: `Can have at most ${req.maxCount} ${description}, have ${matchCount}`
      };
    }
  }

  // Get max keyword counts from faction
  let maxKeywordCounts = { ...faction.troopRules?.restrictions?.maxKeywordCounts };

  // Override with variant max keyword counts if they exist
  if (variant?.troopRules?.restrictions?.maxKeywordCounts) {
    maxKeywordCounts = { ...maxKeywordCounts, ...variant.troopRules.restrictions.maxKeywordCounts };
  }

  // Check keyword-based maximums
  if (Object.keys(maxKeywordCounts).length > 0) {
    const keywordCounts: Record<string, number> = {};

    // Count troops with each keyword
    for (const [troopId, count] of Object.entries(troopComposition)) {
      const troop = troops.find(t => t.id === troopId);
      if (troop) {
        for (const keyword of troop.keywords) {
          keywordCounts[keyword] = (keywordCounts[keyword] || 0) + count;
        }
      }
    }

    // Check against maximum allowed
    for (const [keyword, maxCount] of Object.entries(maxKeywordCounts)) {
      const currentCount = keywordCounts[keyword] || 0;
      if (currentCount > maxCount) {
        return {
          meets: false,
          reason: `Can have at most ${maxCount} troops with the ${keyword} keyword, have ${currentCount}`
        };
      }
    }
  }

  // All checks passed
  return { meets: true };
}

/**
 * Calculates the total cost of a warband
 */
export function calculateWarbandCost(
  units: Array<{
    troopId: string,
    equipment: Equipment[]
  }>,
  troops: Troop[],
  faction: Faction,
  variant?: WarbandVariant | null
): { ducats: number; gloryPoints: number } {
  let totalDucats = 0;
  let totalGloryPoints = 0;

  for (const unit of units) {
    // Get the troop
    const troop = troops.find(t => t.id === unit.troopId);
    if (!troop) continue;

    // Add troop cost
    const troopCost = getTroopCost(unit.troopId, faction, variant);
    if (troopCost) {
      for (const currency of troopCost.currencies) {
        if (currency.type === CurrencyType.DUCATS) {
          totalDucats += currency.amount;
        } else if (currency.type === CurrencyType.GLORY_POINTS) {
          totalGloryPoints += currency.amount;
        }
      }
    }

    // Add equipment costs
    for (const equipment of unit.equipment) {
      // Skip equipment that is part of default loadout
      if (troop.defaultEquipment?.includes(equipment.id)) {
        continue;
      }

      const equipmentCost = getEquipmentCost(equipment, faction, variant);
      if (equipmentCost) {
        for (const currency of equipmentCost.currencies) {
          if (currency.type === CurrencyType.DUCATS) {
            totalDucats += currency.amount;
          } else if (currency.type === CurrencyType.GLORY_POINTS) {
            totalGloryPoints += currency.amount;
          }
        }
      }
    }
  }

  return { ducats: totalDucats, gloryPoints: totalGloryPoints };
}

// Add a function to get equipment cost from ArmyRules
export function getEquipmentCostFromArmyRules(
  equipmentId: string,
  armyRules: ArmyRules | null
): Cost | null {
  if (!armyRules) return null
  return armyRules.equipment.costs[equipmentId] || null
}

// Add a function to get troop cost from ArmyRules
export function getTroopCostFromArmyRules(
  troopId: string,
  armyRules: ArmyRules | null
): Cost | null {
  if (!armyRules) return null
  return armyRules.troops.costs[troopId] || null
}

// Add a function to get equipment limit from ArmyRules
export function getEquipmentLimitFromArmyRules(
  equipmentId: string,
  armyRules: ArmyRules | null
): number | null {
  if (!armyRules) return null
  return armyRules.equipment.limits[equipmentId] ?? null
}

// Add a function to get troop limit from ArmyRules
export function getTroopLimitFromArmyRules(
  troopId: string,
  armyRules: ArmyRules | null
): number | null {
  if (!armyRules) return null
  return armyRules.troops.limits[troopId] ?? null
}

// Add a function to check if a troop is available in ArmyRules
export function isTroopAvailableInArmyRules(
  troopId: string,
  armyRules: ArmyRules | null
): boolean {
  if (!armyRules) return false
  return armyRules.troops.availability[troopId] || false
}

// Add a function to check if equipment has troop restrictions in ArmyRules
export function hasEquipmentTroopRestrictionsInArmyRules(
  equipmentId: string,
  armyRules: ArmyRules | null
): boolean {
  if (!armyRules) return false
  return !!armyRules.equipment.troopRestrictions[equipmentId]
}

// Add a function to check if equipment is allowed for a troop in ArmyRules
export function isEquipmentAllowedForTroopInArmyRules(
  equipmentId: string,
  troopId: string,
  troopKeywords: string[],
  armyRules: ArmyRules | null
): boolean {
  if (!armyRules) return false

  // Check if the equipment exists and is available
  if (!armyRules.equipment.costs[equipmentId]) return false

  // Check global restrictions
  const globalRestrictions = armyRules.equipment.globalRestrictions
  if (globalRestrictions.bannedEquipmentIds.includes(equipmentId)) return false

  // Check troop-specific restrictions
  const troopRestrictions = armyRules.equipment.troopRestrictions[equipmentId]
  if (!troopRestrictions) return true // No restrictions means allowed for all troops

  // Check conditions
  const conditions = troopRestrictions.conditions
  if (!conditions) return true // No conditions means allowed

  // Check 'or' conditions (any match allows)
  if (conditions.or && conditions.or.length > 0) {
    const orMatches = conditions.or.some(condition => {
      // Check troopIds
      if (condition.troopIds && condition.troopIds.includes(troopId)) {
        return true
      }

      // Check keywords
      if (condition.keywords && condition.keywords.every(keyword => troopKeywords.includes(keyword))) {
        return true
      }

      // Check banned keywords
      if (condition.bannedKeywords && !condition.bannedKeywords.some(keyword => troopKeywords.includes(keyword))) {
        return true
      }

      return false
    })

    if (orMatches) return true
  }

  // Check 'and' conditions (all must match)
  if (conditions.and && conditions.and.length > 0) {
    const andMatches = conditions.and.every(condition => {
      // Check troopIds
      if (condition.troopIds && !condition.troopIds.includes(troopId)) {
        return false
      }

      // Check keywords
      if (condition.keywords && !condition.keywords.every(keyword => troopKeywords.includes(keyword))) {
        return false
      }

      // Check banned keywords
      if (condition.bannedKeywords && condition.bannedKeywords.some(keyword => troopKeywords.includes(keyword))) {
        return false
      }

      return true
    })

    if (andMatches) return true
  }

  // If we get here and there are conditions, but none matched, it's not allowed
  return false
}
