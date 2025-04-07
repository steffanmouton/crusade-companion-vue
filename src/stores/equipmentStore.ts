import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc
} from 'firebase/firestore'
import { db } from '../services/firebase'
import type { Equipment } from '../models/equipment'
import { equipmentSeed } from '../seed/equipmentSeed'
import type { Troop } from '../models/troop'
import type { Faction } from '../models/faction'
import { useFactionStore } from './factionStore'

export const useEquipmentStore = defineStore('equipment', () => {
  const equipment = ref<Equipment[]>([])
  const equipmentFactionMap = ref(new Map<string, string>()) // Map equipment ID to faction ID
  const loading = ref(false)
  const error = ref<string | null>(null)

  const factionStore = useFactionStore()

  /**
   * Fetch all equipment from Firestore
   */
  const fetchEquipment = async () => {
    loading.value = true
    error.value = null
    try {
      const querySnapshot = await getDocs(collection(db, 'equipment'))
      const fetchedEquipment: Equipment[] = []
      querySnapshot.forEach((doc) => {
        // Use the document ID as the equipment ID
        fetchedEquipment.push({ ...doc.data(), id: doc.id } as Equipment)
      })
      equipment.value = fetchedEquipment
      rebuildEquipmentFactionMap()
    } catch (err) {
      console.error('Error fetching equipment:', err)
      error.value = 'Failed to fetch equipment'
    } finally {
      loading.value = false
    }
  }

  /**
   * Rebuild the map of equipment to factions
   */
  const rebuildEquipmentFactionMap = () => {
    equipmentFactionMap.value.clear()

    // For each faction, check which equipment they have costs for
    factionStore.factions.forEach((faction: Faction) => {
      if (!faction.equipmentRules?.costs) return

      // Add each equipment ID with its corresponding faction ID
      Object.keys(faction.equipmentRules.costs).forEach(equipmentId => {
        equipmentFactionMap.value.set(equipmentId, faction.id)
      })
    })
  }

  /**
   * Get equipment for a specific troop based on their ID and keywords
   */
  const getEquipmentForTroop = (troopId: string, keywords: string[] = []) => {
    console.log(`Getting equipment for troop ${troopId} with keywords: ${keywords.join(', ') || 'none'}`);

    if (!equipment.value.length) {
      console.log('Equipment store is empty!');
      return [];
    }

    const availableEquipment = new Set<Equipment>();
    console.log('Total factions to check:', factionStore.factions.length);

    // Go through all factions to find equipment that's available for this troop
    factionStore.factions.forEach((faction, index) => {
      console.log(`Checking faction ${index + 1}/${factionStore.factions.length}: ${faction.name} (${faction.id})`);

      if (!faction.equipmentRules?.costs) {
        console.log(`- No equipment costs defined for faction ${faction.name}`);
        return;
      }

      // Get all equipment items that this faction has costs for
      const equipmentWithCosts = Object.keys(faction.equipmentRules.costs);
      console.log(`- Faction has costs for ${equipmentWithCosts.length} items:`, equipmentWithCosts);

      equipmentWithCosts.forEach(equipmentId => {
        const item = equipment.value.find(e => e.id === equipmentId);
        if (!item) {
          console.log(`- Equipment ${equipmentId} not found in equipment store!`);
          return;
        }

        console.log(`- Checking ${item.name} (${item.id})`);

        // Check global restrictions first
        const globalRestrictions = faction.equipmentRules.globalRestrictions;
        if (globalRestrictions) {
          // Skip if equipment is banned by ID
          if (globalRestrictions.bannedEquipmentIds?.includes(item.id)) {
            console.log(`  - Banned by ID in global restrictions`);
            return;
          }

          // Skip if equipment has a banned keyword
          if (globalRestrictions.bannedKeywords?.some(keyword =>
            item.keywords?.includes(keyword))) {
            console.log(`  - Has banned keyword in global restrictions`);
            return;
          }

          // Skip if equipment is in a banned category
          if (globalRestrictions.bannedCategories?.some(cat =>
            item.category === cat)) {
            console.log(`  - In banned category in global restrictions`);
            return;
          }
        }

        // Get troop restrictions for this equipment
        const troopRestrictions = faction.equipmentRules.troopRestrictions?.[item.id];
        console.log(`  - Troop restrictions:`, troopRestrictions || 'none');

        // If no specific troop restrictions, the equipment is available to all troops
        if (!troopRestrictions) {
          console.log(`  - No restrictions, adding to available equipment`);
          availableEquipment.add(item);
          return;
        }

        // If there are troop restrictions but no conditions specified, it's allowed
        if (!troopRestrictions.conditions) {
          console.log(`  - Has restrictions but no conditions, adding to available equipment`);
          availableEquipment.add(item);
          return;
        }

        // Check AND conditions - all must be satisfied
        if (troopRestrictions.conditions.and) {
          const andConditions = troopRestrictions.conditions.and;
          console.log(`  - Checking AND conditions:`, andConditions);

          const meetsAllConditions = andConditions.every(condition => {
            // If troopIds is specified, the current troop must be in the list
            if (condition.troopIds && condition.troopIds.length > 0) {
              const meetsTroopIdCondition = condition.troopIds.includes(troopId);
              console.log(`    - Troop ID condition: ${meetsTroopIdCondition ? 'PASS' : 'FAIL'}`);
              if (!meetsTroopIdCondition) {
                return false;
              }
            }

            // If keywords are specified, the troop must have all of them
            if (condition.keywords && condition.keywords.length > 0) {
              const meetsKeywordCondition = condition.keywords.every(k => keywords.includes(k));
              console.log(`    - Keyword condition: ${meetsKeywordCondition ? 'PASS' : 'FAIL'}`);
              if (!meetsKeywordCondition) {
                return false;
              }
            }

            // If bannedKeywords are specified, the troop must not have any of them
            if (condition.bannedKeywords && condition.bannedKeywords.length > 0) {
              const meetsBannedKeywordCondition = !condition.bannedKeywords.some(k => keywords.includes(k));
              console.log(`    - Banned keyword condition: ${meetsBannedKeywordCondition ? 'PASS' : 'FAIL'}`);
              if (!meetsBannedKeywordCondition) {
                return false;
              }
            }

            return true;
          });

          // If all AND conditions are met, add the item and return
          if (meetsAllConditions) {
            console.log(`  - All AND conditions met, adding to available equipment`);
            availableEquipment.add(item);
          } else {
            console.log(`  - Not all AND conditions met, skipping`);
          }

          // Return here to prevent the item from being added by default
          return;
        }

        // Check OR conditions - at least one must be satisfied
        if (troopRestrictions.conditions.or) {
          const orConditions = troopRestrictions.conditions.or;
          console.log(`  - Checking OR conditions:`, orConditions);

          const meetsAnyCondition = orConditions.some(condition => {
            // If troopIds is specified and includes this troop, condition is met
            if (condition.troopIds && condition.troopIds.includes(troopId)) {
              console.log(`    - Troop ID condition: PASS`);
              return true;
            }

            // If keywords are specified and troop has all of them, condition is met
            if (condition.keywords && condition.keywords.every(k => keywords.includes(k))) {
              console.log(`    - Keyword condition: PASS`);
              return true;
            }

            // If bannedKeywords are specified and troop has none of them, condition is met
            if (condition.bannedKeywords && !condition.bannedKeywords.some(k => keywords.includes(k))) {
              console.log(`    - Banned keyword condition: PASS`);
              return true;
            }

            return false;
          });

          // If any OR condition is met, add the item and return
          if (meetsAnyCondition) {
            console.log(`  - At least one OR condition met, adding to available equipment`);
            availableEquipment.add(item);
          } else {
            console.log(`  - No OR conditions met, skipping`);
          }

          // Return here to prevent the item from being added by default
          return;
        }

        // If we have troop restrictions but no AND or OR conditions, don't add the item
        console.log(`  - Has restrictions but no AND/OR conditions, skipping`);
      });
    });

    const result = Array.from(availableEquipment);
    console.log(`Returning ${result.length} available equipment items:`, result.map(e => e.name));
    return result;
  }

  /**
   * Determine which faction an equipment item belongs to
   * based on which faction has costs defined for it
   */
  const getFactionForEquipment = (equipmentId: string): string | null => {
    // First check our cache
    if (equipmentFactionMap.value.has(equipmentId)) {
      return equipmentFactionMap.value.get(equipmentId) || null
    }

    // If not in cache, search through all factions
    const faction = factionStore.factions.find((f: Faction) =>
      f.equipmentRules?.costs && f.equipmentRules.costs[equipmentId] !== undefined
    )

    if (faction) {
      // Cache this result for future lookups
      equipmentFactionMap.value.set(equipmentId, faction.id)
      return faction.id
    }

    return null
  }

  /**
   * Check if an equipment item is default (free) for a specific troop
   */
  const isDefaultEquipment = (equipmentId: string, troop: Troop): boolean => {
    return troop.defaultEquipment?.includes(equipmentId) || false
  }

  /**
   * Add a new equipment item to Firestore
   */
  const addEquipment = async (newEquipment: Equipment) => {
    loading.value = true
    error.value = null
    try {
      // Use the provided id as the document ID in Firestore
      const equipmentRef = doc(db, 'equipment', newEquipment.id)
      await setDoc(equipmentRef, newEquipment)
      equipment.value.push(newEquipment)
      return newEquipment
    } catch (err) {
      console.error('Error adding equipment:', err)
      error.value = 'Failed to add equipment'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing equipment item in Firestore
   */
  const updateEquipment = async (updatedEquipment: Equipment) => {
    loading.value = true
    error.value = null
    try {
      const equipmentRef = doc(db, 'equipment', updatedEquipment.id)
      await setDoc(equipmentRef, updatedEquipment)
      const index = equipment.value.findIndex(item => item.id === updatedEquipment.id)
      if (index !== -1) {
        equipment.value[index] = updatedEquipment
      }
      return updatedEquipment
    } catch (err) {
      console.error('Error updating equipment:', err)
      error.value = 'Failed to update equipment'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete an equipment item from Firestore
   */
  const deleteEquipment = async (equipmentId: string) => {
    loading.value = true
    error.value = null
    try {
      await deleteDoc(doc(db, 'equipment', equipmentId))
      equipment.value = equipment.value.filter(item => item.id !== equipmentId)
    } catch (err) {
      console.error('Error deleting equipment:', err)
      error.value = 'Failed to delete equipment'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Seed the Firestore database with initial equipment data
   */
  const seedEquipment = async () => {
    loading.value = true
    error.value = null
    try {
      // Check if collection is empty first
      const snapshot = await getDocs(collection(db, 'equipment'))
      if (!snapshot.empty) {
        console.log('Equipment collection is not empty, skipping seed')
        return
      }

      const seedPromises = equipmentSeed.map(async (item) => {
        // Use the item's id as the document ID in Firestore
        const equipmentRef = doc(db, 'equipment', item.id)
        // Store the item directly without any ID modifications
        await setDoc(equipmentRef, item)
      })

      await Promise.all(seedPromises)
      console.log('Equipment collection seeded successfully')

      // Fetch the seeded data
      await fetchEquipment()
    } catch (err) {
      console.error('Error seeding equipment:', err)
      error.value = 'Failed to seed equipment'
    } finally {
      loading.value = false
    }
  }

  return {
    equipment,
    loading,
    error,
    fetchEquipment,
    getEquipmentForTroop,
    getFactionForEquipment,
    isDefaultEquipment,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    seedEquipment,
    rebuildEquipmentFactionMap
  }
})
