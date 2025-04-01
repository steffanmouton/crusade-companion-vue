import { defineStore } from 'pinia'
import type { WarbandVariant } from '../models/warbandVariant'
import {
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  getDocuments,
  getTimestamp,
} from '../services/firestore'
import { ref, computed } from 'vue'

const COLLECTION_NAME = 'warbandVariants'

interface FirestoreWarbandVariant extends WarbandVariant {
  id: string
  createdAt: number
  updatedAt: number
}

export const useWarbandVariantStore = defineStore('warbandVariant', () => {
  const warbandVariants = ref<FirestoreWarbandVariant[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // Computed properties
  const warbandVariantsByFaction = computed(() => {
    const result: Record<string, FirestoreWarbandVariant[]> = {}
    warbandVariants.value.forEach((variant) => {
      const faction = variant.faction
      if (!result[faction]) {
        result[faction] = []
      }
      result[faction].push(variant)
    })
    return result
  })

  // Actions
  async function fetchWarbandVariants() {
    if (initialized.value) return

    loading.value = true
    error.value = null

    try {
      const docs = await getDocuments<FirestoreWarbandVariant>(COLLECTION_NAME)
      warbandVariants.value = docs
      initialized.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch warband variants'
      console.error('Error fetching warband variants:', err)
    } finally {
      loading.value = false
    }
  }

  async function getWarbandVariantById(id: string) {
    try {
      return await getDocument<FirestoreWarbandVariant>(COLLECTION_NAME, id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch warband variant'
      console.error('Error fetching warband variant:', err)
      return null
    }
  }

  async function getWarbandVariantsByFaction(faction: string) {
    return warbandVariantsByFaction.value[faction] || []
  }

  function getVariantByName(name: string) {
    return warbandVariants.value.find((v) => v.name === name) || null
  }

  async function addWarbandVariant(
    variant: Omit<FirestoreWarbandVariant, 'id' | 'createdAt' | 'updatedAt'>,
  ) {
    try {
      const timestamp = getTimestamp()
      const newVariant = {
        ...variant,
        ...timestamp,
      }

      const id = await addDocument(COLLECTION_NAME, newVariant)
      const createdVariant: FirestoreWarbandVariant = {
        id,
        ...newVariant,
      }

      warbandVariants.value.push(createdVariant)
      return createdVariant
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add warband variant'
      console.error('Error adding warband variant:', err)
      throw err
    }
  }

  async function updateWarbandVariant(id: string, variant: Partial<FirestoreWarbandVariant>) {
    try {
      const data = {
        ...variant,
        updatedAt: Date.now(),
      }

      await updateDocument(COLLECTION_NAME, id, data)

      const index = warbandVariants.value.findIndex((v) => v.id === id)
      if (index !== -1) {
        warbandVariants.value[index] = { ...warbandVariants.value[index], ...data }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update warband variant'
      console.error('Error updating warband variant:', err)
      throw err
    }
  }

  async function deleteWarbandVariant(id: string) {
    try {
      await deleteDocument(COLLECTION_NAME, id)
      warbandVariants.value = warbandVariants.value.filter((v) => v.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete warband variant'
      console.error('Error deleting warband variant:', err)
      throw err
    }
  }

  return {
    warbandVariants,
    loading,
    error,
    initialized,
    warbandVariantsByFaction,
    fetchWarbandVariants,
    getWarbandVariantById,
    getWarbandVariantsByFaction,
    getVariantByName,
    addWarbandVariant,
    updateWarbandVariant,
    deleteWarbandVariant,
  }
})
