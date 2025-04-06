import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore'
import { db } from '../services/firebase'
import type { Equipment } from '../models/equipment'
import { equipmentSeed } from '../seed/equipmentSeed'
import type { Troop } from '../models/troop'
import type { Faction } from '../models/faction'
import type { WarbandVariant } from '../models/warbandVariant'
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
        fetchedEquipment.push({ id: doc.id, ...doc.data() } as Equipment)
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
    if (!equipment.value.length) return []

    const availableEquipment = new Set<Equipment>()

    // Go through all factions to find equipment that's available for this troop
    factionStore.factions.forEach((faction: Faction) => {
      if (!faction.equipmentRules?.costs) return

      // Get all equipment items that this faction has costs for
      Object.keys(faction.equipmentRules.costs).forEach(equipmentId => {
        const item = equipment.value.find(e => e.id === equipmentId)
        if (!item) return

        // Check global restrictions
        const globalRestrictions = faction.equipmentRules.globalRestrictions
        if (globalRestrictions) {
          // Skip if equipment is banned by ID
          if (globalRestrictions.bannedEquipmentIds?.includes(item.id)) return

          // Skip if equipment has a banned keyword
          if (globalRestrictions.bannedKeywords?.some(keyword => 
            item.keywords?.includes(keyword))) return

          // Skip if equipment is in a banned category
          if (globalRestrictions.bannedCategories?.some(cat => 
            item.category === cat)) return
        }

        // Check troop restrictions
        const troopRestrictions = faction.equipmentRules.troopRestrictions?.[item.id]
        if (troopRestrictions) {
          // Skip if specific troop IDs are defined and this troop isn't in the list
          if (troopRestrictions.allowedTroopIds && 
              !troopRestrictions.allowedTroopIds.includes(troopId)) return

          // Skip if troop doesn't have all required keywords
          if (troopRestrictions.requiredKeywords && 
              !troopRestrictions.requiredKeywords.every(k => keywords.includes(k))) return

          // Skip if troop has any banned keywords
          if (troopRestrictions.bannedKeywords && 
              troopRestrictions.bannedKeywords.some(k => keywords.includes(k))) return
        }

        // If we got here, the equipment is available
        availableEquipment.add(item)
      })
    })

    return Array.from(availableEquipment)
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
  const addEquipment = async (newEquipment: Omit<Equipment, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      const equipmentRef = doc(collection(db, 'equipment'))
      await setDoc(equipmentRef, newEquipment)
      const createdEquipment = { id: equipmentRef.id, ...newEquipment }
      equipment.value.push(createdEquipment)
      return createdEquipment
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
        const { id, ...equipmentWithoutId } = item
        const equipmentRef = doc(db, 'equipment', id)
        await setDoc(equipmentRef, equipmentWithoutId)
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
