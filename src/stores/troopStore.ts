import { defineStore } from 'pinia'
import type { Troop } from '../models/troop'
import {
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  getDocuments,
  getTimestamp,
} from '../services/firestore'
import { ref, computed } from 'vue'
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { troopSeed } from '../seed/troopSeed'

const COLLECTION_NAME = 'troops'

export const useTroopStore = defineStore('troop', () => {
  const troops = ref<Troop[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // Computed properties
  const troopsByFaction = computed(() => {
    const result: Record<string, Troop[]> = {}
    troops.value.forEach((troop) => {
      const faction = troop.factionName
      if (!result[faction]) {
        result[faction] = []
      }
      result[faction].push(troop)
    })
    return result
  })

  // Get all troops (admin function)
  async function getAllTroops() {
    loading.value = true
    error.value = null

    try {
      const troopsData = await getDocuments<Troop>(COLLECTION_NAME)
      troops.value = troopsData
    } catch (err: any) {
      console.error('Error loading troops:', err)
      error.value = err.message || 'Failed to load troops'
    } finally {
      loading.value = false
    }
  }

  // Initialize the store by loading troops from Firestore
  async function initializeTroops() {
    if (initialized.value && troops.value.length > 0) {
      console.log('Troops already initialized with', troops.value.length, 'troops')
      return
    }

    loading.value = true
    error.value = null

    try {
      console.log('Loading troops from Firestore')
      // Get all troops from Firestore
      const troopsData = await getDocuments<Troop>(COLLECTION_NAME)
      console.log('Loaded', troopsData.length, 'troops from Firestore')

      if (troopsData.length === 0) {
        console.warn('No troops found in Firestore collection')
      }

      troops.value = troopsData
      initialized.value = true
    } catch (err: any) {
      console.error('Error initializing troops:', err)
      error.value = err.message || 'Failed to initialize troops'
      throw err // Re-throw to allow handling by components
    } finally {
      loading.value = false
    }
  }

  // Force reload all troops even if already initialized
  async function forceReloadTroops() {
    initialized.value = false
    troops.value = []
    return initializeTroops()
  }

  // Get a specific troop by ID
  async function getTroop(id: string) {
    try {
      return await getDocument<Troop>(COLLECTION_NAME, id)
    } catch (err: any) {
      console.error(`Error getting troop ${id}:`, err)
      error.value = err.message || 'Failed to get troop'
      return null
    }
  }

  // Add a new troop
  async function addTroop(troopData: Omit<Troop, 'id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    error.value = null

    try {
      const timestamp = getTimestamp()
      const newTroop = {
        ...troopData,
        ...timestamp,
      }

      const id = await addDocument(COLLECTION_NAME, newTroop)
      const createdTroop: Troop = {
        id,
        ...newTroop,
      }

      troops.value.push(createdTroop)
      return createdTroop
    } catch (err: any) {
      console.error('Error adding troop:', err)
      error.value = err.message || 'Failed to add troop'
      return null
    } finally {
      loading.value = false
    }
  }

  // Update a troop
  async function updateTroop(id: string, troopData: Partial<Troop>) {
    loading.value = true
    error.value = null

    try {
      const data = {
        ...troopData,
        updatedAt: Date.now(),
      }

      await updateDocument(COLLECTION_NAME, id, data)

      const index = troops.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        troops.value[index] = { ...troops.value[index], ...data }
      }

      return true
    } catch (err: any) {
      console.error(`Error updating troop ${id}:`, err)
      error.value = err.message || 'Failed to update troop'
      return false
    } finally {
      loading.value = false
    }
  }

  // Delete a troop
  async function deleteTroop(id: string) {
    loading.value = true
    error.value = null

    try {
      await deleteDocument(COLLECTION_NAME, id)
      troops.value = troops.value.filter((t) => t.id !== id)
      return true
    } catch (err: any) {
      console.error(`Error deleting troop ${id}:`, err)
      error.value = err.message || 'Failed to delete troop'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Seed the Firestore database with initial troop data
   * Uses predefined IDs from the seed data as Firestore document IDs
   */
  async function seedTroops(force = false) {
    loading.value = true
    error.value = null
    try {
      // Check if collection is empty first, unless force is true
      if (!force) {
        const snapshot = await getDocs(collection(db, COLLECTION_NAME))
        if (!snapshot.empty) {
          console.log('Troops collection is not empty, skipping seed')
          return
        }
      } else {
        console.log('Force reseeding troops...')
        // If force is true, delete existing documents first
        const snapshot = await getDocs(collection(db, COLLECTION_NAME))
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
        await Promise.all(deletePromises)
        console.log(`Deleted ${snapshot.size} existing troop documents`)
      }

      // Combine all troop seed data into a single array for seeding
      const allTroops = troopSeed

      const seedPromises = allTroops.map(async (troop) => {
        // Use the troop's predefined ID as the document ID
        const troopRef = doc(db, COLLECTION_NAME, troop.id)
        await setDoc(troopRef, troop)
        console.log(`Seeded troop: ${troop.name} with ID ${troop.id}`)
      })

      await Promise.all(seedPromises)
      console.log('Troops collection seeded successfully')

      // Reload troops after seeding
      await forceReloadTroops()
    } catch (err) {
      console.error('Error seeding troops:', err)
      error.value = typeof err === 'string' ? err : 'Failed to seed troops'
    } finally {
      loading.value = false
    }
  }

  return {
    troops,
    loading,
    error,
    troopsByFaction,
    getAllTroops,
    initializeTroops,
    forceReloadTroops,
    getTroop,
    addTroop,
    updateTroop,
    deleteTroop,
    seedTroops
  }
})
