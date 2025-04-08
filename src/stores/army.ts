import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  getUserDocuments,
  getTimestamp,
} from '../services/firestore'
import type { Army } from '../types/firebase'
import { useWarbandVariantStore } from './warbandVariantStore'
import { useFactionStore } from './factionStore'
import { compileArmyRules } from '../services/armyRulesService'
import type { ArmyRules } from '../models/armyRules'

const COLLECTION_NAME = 'armies'

export const useArmyStore = defineStore('army', () => {
  const armies = ref<Army[]>([])
  const currentArmy = ref<Army | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const warbandVariantStore = useWarbandVariantStore()
  const factionStore = useFactionStore()
  const currentArmyRules = ref<ArmyRules | null>(null)

  // Computed properties
  const hasArmies = computed(() => armies.value.length > 0)
  const totalArmies = computed(() => armies.value.length)
  const currentWarbandVariant = computed(() => {
    if (!currentArmy.value?.warbandVariantId) return null
    return warbandVariantStore.warbandVariants.find(
      (variant) => variant.id === currentArmy.value?.warbandVariantId,
    )
  })

  // Load all armies for the current user
  async function loadArmies() {
    loading.value = true
    error.value = null

    try {
      armies.value = await getUserDocuments<Army>(COLLECTION_NAME)
    } catch (err: any) {
      console.error('Error loading armies:', err)
      error.value = err.message || 'Failed to load armies'
    } finally {
      loading.value = false
    }
  }

  // Load a single army by ID
  async function loadArmy(id: string) {
    loading.value = true
    error.value = null
    currentArmy.value = null
    currentArmyRules.value = null

    try {
      const army = await getDocument<Army>(COLLECTION_NAME, id)
      if (!army) {
        error.value = 'Army not found'
        return null
      }
      currentArmy.value = army

      // Ensure warband variants are loaded
      if (army.warbandVariantId) {
        await warbandVariantStore.fetchWarbandVariants()
      }

      // Ensure factions are loaded for rule compilation
      await factionStore.syncWithFirestore()

      // Compile army rules
      generateArmyRules()

      return army
    } catch (err: any) {
      console.error(`Error loading army ${id}:`, err)
      error.value = err.message || 'Failed to load army'
      return null
    } finally {
      loading.value = false
    }
  }

  // Create a new army
  async function createArmy(armyData: Omit<Army, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    error.value = null

    try {
      // Add timestamps
      const timestamp = getTimestamp()

      // Create army with default values
      const newArmy = {
        ...armyData,
        currentPoints: armyData.currentPoints ?? 0,
        battles: 0,
        wins: 0,
        losses: 0,
        userId: '', // This will be overwritten by the addDocument function
        warbandVariantId: armyData.warbandVariantId ?? null, // Ensure warbandVariantId is never undefined
        ...timestamp,
      }

      // Add to Firestore
      const id = await addDocument(COLLECTION_NAME, newArmy)

      // Create complete army object with ID
      const createdArmy: Army = {
        id,
        ...newArmy,
      }

      // Add to local state
      armies.value.push(createdArmy)

      return createdArmy
    } catch (err: any) {
      console.error('Error creating army:', err)
      error.value = err.message || 'Failed to create army'
      return null
    } finally {
      loading.value = false
    }
  }

  // Update an existing army
  async function updateArmy(id: string, armyData: Partial<Army>) {
    loading.value = true
    error.value = null

    try {
      // Add updated timestamp
      const data = {
        ...armyData,
        updatedAt: Date.now(),
      }

      // Update in Firestore
      await updateDocument(COLLECTION_NAME, id, data)

      // Update in local state
      const index = armies.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        armies.value[index] = { ...armies.value[index], ...data }
      }

      // Update current army if it's the one being edited
      if (currentArmy.value && currentArmy.value.id === id) {
        currentArmy.value = { ...currentArmy.value, ...data }

        // If warband variant changed, regenerate rules
        if ('warbandVariantId' in armyData) {
          generateArmyRules()
        }
      }

      return true
    } catch (err: any) {
      console.error(`Error updating army ${id}:`, err)
      error.value = err.message || 'Failed to update army'
      return false
    } finally {
      loading.value = false
    }
  }

  // Delete an army
  async function deleteArmy(id: string) {
    loading.value = true
    error.value = null

    try {
      // Delete from Firestore
      await deleteDocument(COLLECTION_NAME, id)

      // Remove from local state
      armies.value = armies.value.filter((a) => a.id !== id)

      // Clear current army if it's the one being deleted
      if (currentArmy.value && currentArmy.value.id === id) {
        currentArmy.value = null
      }

      return true
    } catch (err: any) {
      console.error(`Error deleting army ${id}:`, err)
      error.value = err.message || 'Failed to delete army'
      return false
    } finally {
      loading.value = false
    }
  }

  // Generate/regenerate army rules for the current army
  function generateArmyRules() {
    if (!currentArmy.value) {
      console.log('No current army available')
      currentArmyRules.value = null
      return
    }

    // In the Firebase model, Army.faction is just the faction ID as a string
    const factionId = currentArmy.value.faction
    console.log('Looking for faction ID:', factionId)
    console.log('Available factions:', factionStore.factions.map(f => ({ id: f.id, name: f.name })))

    // Try different approaches to find the faction
    let faction = factionStore.factions.find(f => f.id === factionId)

    // If not found by exact ID match, try to match by name
    if (!faction && typeof factionId === 'string') {
      faction = factionStore.factions.find(f =>
        f.name.toLowerCase() === factionId.toLowerCase()
      )
    }

    // If still not found, check if the factionId might be a full faction object (for backward compatibility)
    if (!faction && typeof factionId === 'object' && factionId !== null) {
      const factionObject = factionId as any
      if (factionObject.id) {
        faction = factionStore.factions.find(f => f.id === factionObject.id)
      }
    }

    if (!faction) {
      console.error('Could not find faction for army, using first available faction')
      // As a last resort, use the first available faction to avoid breaking the UI
      if (factionStore.factions.length > 0) {
        faction = factionStore.factions[0]
      } else {
        currentArmyRules.value = null
        return
      }
    }

    console.log('Using faction:', faction.name, faction.id)

    let variant = undefined
    if (currentArmy.value.warbandVariantId) {
      variant = warbandVariantStore.warbandVariants.find(
        v => v.id === currentArmy.value?.warbandVariantId &&
             (v.factionId === faction.id || v.factionId === faction.name)
      )
      if (variant) {
        console.log('Using variant:', variant.name, variant.id)
        console.log('Variant details:', {
          factionId: variant.factionId,
          specialRules: variant.specialRules,
          equipmentRules: variant.equipmentRules,
          troopRules: variant.troopRules,
          armyRulesOverrides: variant.armyRulesOverrides
        })
      } else {
        console.warn(`Could not find variant with ID ${currentArmy.value.warbandVariantId} for faction ${faction.id} / ${faction.name}`)
        console.log('Available variants:', warbandVariantStore.warbandVariants.map(v => ({
          id: v.id,
          name: v.name,
          factionId: v.factionId
        })))
      }
    }

    // Generate the army rules
    currentArmyRules.value = compileArmyRules(faction, variant)
    console.log('Generated ArmyRules:', currentArmyRules.value)
  }

  return {
    armies,
    currentArmy,
    currentArmyRules,
    loading,
    error,
    hasArmies,
    totalArmies,
    currentWarbandVariant,
    loadArmies,
    loadArmy,
    createArmy,
    updateArmy,
    deleteArmy,
    generateArmyRules,
  }
})
