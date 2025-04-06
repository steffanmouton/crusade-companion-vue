import type { Equipment, EquipmentCategory } from '../models/equipment'
import type { Faction } from '../models/faction'
import type { WarbandVariant } from '../models/warbandVariant'
import type { Cost } from '../models/cost'
import type { Troop } from '../models/troop'
import { createDucatsCost } from '../models/cost'

/**
 * Gets the cost of equipment for a specific faction and optional variant
 */
export function getEquipmentCost(
  equipment: Equipment,
  faction: Faction,
  variant?: WarbandVariant | null
): Cost | null {
  // Check variant complete override first
  if (variant?.equipmentRulesOverride?.costs?.[equipment.id]) {
    return variant.equipmentRulesOverride.costs[equipment.id];
  }
  
  // Check variant selective override
  if (variant?.equipmentOverrides?.costs?.[equipment.id]) {
    return variant.equipmentOverrides.costs[equipment.id];
  }
  
  // Check base faction cost
  if (faction.equipmentRules?.costs?.[equipment.id]) {
    return faction.equipmentRules.costs[equipment.id];
  }
  
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
  // Check variant complete override first
  if (variant?.equipmentRulesOverride?.limits?.[equipment.id] !== undefined) {
    return variant.equipmentRulesOverride.limits[equipment.id];
  }
  
  // Check variant selective override
  if (variant?.equipmentOverrides?.limits?.[equipment.id] !== undefined) {
    return variant.equipmentOverrides.limits[equipment.id];
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
  faction: Faction,
  variant?: WarbandVariant | null
): boolean {
  // Check if equipment is directly banned by ID
  if (variant?.equipmentRulesOverride?.globalRestrictions?.bannedEquipmentIds?.includes(equipment.id)) {
    return true;
  }
  
  if (variant?.equipmentOverrides?.globalRestrictions?.bannedEquipmentIds?.includes(equipment.id) || 
      faction.equipmentRules?.globalRestrictions?.bannedEquipmentIds?.includes(equipment.id)) {
    return true;
  }
  
  // Check if equipment category is banned
  if (equipment.category) {
    if (variant?.equipmentRulesOverride?.globalRestrictions?.bannedCategories?.includes(equipment.category)) {
      return true;
    }
    
    if (variant?.equipmentOverrides?.globalRestrictions?.bannedCategories?.includes(equipment.category) || 
        faction.equipmentRules?.globalRestrictions?.bannedCategories?.includes(equipment.category)) {
      return true;
    }
  }
  
  // Check if any keywords are banned
  if (equipment.keywords && equipment.keywords.length > 0) {
    // Check variant override rules
    const variantBannedKeywords = variant?.equipmentRulesOverride?.globalRestrictions?.bannedKeywords || 
                                 variant?.equipmentOverrides?.globalRestrictions?.bannedKeywords || 
                                 [];
    
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
  faction: Faction,
  variant?: WarbandVariant | null
): boolean {
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
  
  // Check allowed troop IDs
  if (troopRestrictions.allowedTroopIds && 
      troopRestrictions.allowedTroopIds.length > 0 && 
      !troopRestrictions.allowedTroopIds.includes(troop.id)) {
    return false;
  }
  
  // Check required keywords
  if (troopRestrictions.requiredKeywords && 
      troopRestrictions.requiredKeywords.length > 0 && 
      !troopRestrictions.requiredKeywords.every(keyword => troop.keywords.includes(keyword))) {
    return false;
  }
  
  // Check banned keywords
  if (troopRestrictions.bannedKeywords && 
      troopRestrictions.bannedKeywords.length > 0 && 
      troopRestrictions.bannedKeywords.some(keyword => troop.keywords.includes(keyword))) {
    return false;
  }
  
  return true;
}

/**
 * Helper function to get the effective troop restrictions for an equipment
 */
function getEquipmentTroopRestrictions(
  equipmentId: string,
  faction: Faction,
  variant?: WarbandVariant | null
) {
  // Check variant complete override first
  if (variant?.equipmentRulesOverride?.troopRestrictions?.[equipmentId]) {
    return variant.equipmentRulesOverride.troopRestrictions[equipmentId];
  }
  
  // Check variant selective override
  if (variant?.equipmentOverrides?.troopRestrictions?.[equipmentId]) {
    return variant.equipmentOverrides.troopRestrictions[equipmentId];
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
  faction: Faction,
  formatCostFn: (cost: Cost) => string,
  variant?: WarbandVariant | null
): string {
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
  // Check variant complete override first
  if (variant?.equipmentRulesOverride?.externalEquipmentAllowances) {
    return variant.equipmentRulesOverride.externalEquipmentAllowances;
  }
  
  // Check variant selective override
  if (variant?.equipmentOverrides?.externalEquipmentAllowances) {
    return variant.equipmentOverrides.externalEquipmentAllowances;
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
  faction: Faction,
  variant?: WarbandVariant | null
): Cost | null {
  // Check variant troop-specific overrides
  if (variant?.troopSpecificOverrides?.[troopId]?.pointCost !== undefined) {
    return createDucatsCost(variant.troopSpecificOverrides[troopId].pointCost as number);
  }
  
  // Check variant troop overrides
  if (variant?.troopOverrides?.costs?.[troopId]) {
    return variant.troopOverrides.costs[troopId];
  }
  
  // Check for mercenary costs if applicable
  if (faction.equipmentRules.mercenaryRules?.costs?.[troopId]) {
    return faction.equipmentRules.mercenaryRules.costs[troopId];
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
    // Check variant availability override
    if (variant?.troopOverrides?.availability?.[troop.id] !== undefined) {
      return variant.troopOverrides.availability[troop.id];
    }
    return true; // Troops belonging to the faction are available by default
  }
  
  // For mercenaries, check if this faction can hire them
  if (troop.factionId === "mercenary") {
    // First check if this mercenary can work for this faction
    if (!troop.mercenaryFactions?.includes(faction.name)) {
      return false;
    }
    
    // Then check if the faction has rules for hiring this mercenary
    const canHire = !!faction.equipmentRules.mercenaryRules?.costs?.[troop.id];
    
    // Check variant override if available
    if (variant?.troopOverrides?.availability?.[troop.id] !== undefined) {
      return variant.troopOverrides.availability[troop.id] && canHire;
    }
    
    return canHire;
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