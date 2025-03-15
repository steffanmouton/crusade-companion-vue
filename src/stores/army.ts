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

const COLLECTION_NAME = 'armies'

export const useArmyStore = defineStore('army', () => {
  const armies = ref<Army[]>([])
  const currentArmy = ref<Army | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const hasArmies = computed(() => armies.value.length > 0)
  const totalArmies = computed(() => armies.value.length)

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

    try {
      const army = await getDocument<Army>(COLLECTION_NAME, id)
      currentArmy.value = army
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
        battles: 0,
        wins: 0,
        losses: 0,
        userId: '', // This will be overwritten by the addDocument function
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

  return {
    armies,
    currentArmy,
    loading,
    error,
    hasArmies,
    totalArmies,
    loadArmies,
    loadArmy,
    createArmy,
    updateArmy,
    deleteArmy,
  }
})
