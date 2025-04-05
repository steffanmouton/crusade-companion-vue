import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  addDocument,
  updateDocument,
  deleteDocument,
  getDocuments,
  getTimestamp,
} from '../services/firestore'
import { where } from 'firebase/firestore'
import type { Unit } from '../types/firebase'
import { useArmyStore } from './army'

const COLLECTION_NAME = 'units'

// Extended Unit type that includes costPoints for our internal use
interface UnitWithCost extends Unit {
  costPoints: number
  troopId: string
  troopName?: string
  costCurrency: number
  currentEquipment: { name: string; type: string; modifiers?: string[]; rules?: string[] }[]
  purchasedAbilities: string[]
}

export const useUnitStore = defineStore('unit', () => {
  const units = ref<UnitWithCost[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const armyStore = useArmyStore()

  // Load all units for a specific army
  async function loadUnitsByArmyId(armyId: string) {
    loading.value = true
    error.value = null

    console.log('Loading units for army ID:', armyId)

    try {
      // Query units where armyId matches
      console.log('Querying Firestore collection:', COLLECTION_NAME)
      const result = await getDocuments<UnitWithCost>(COLLECTION_NAME, [
        where('armyId', '==', armyId),
      ])
      console.log('Units loaded from Firestore:', {
        count: result.length,
        units: result.map((u) => ({ id: u.id, name: u.name })),
      })

      // Check if units have proper properties
      if (result.length > 0) {
        const sampleUnit = result[0]
        console.log('Sample unit structure:', {
          hasId: !!sampleUnit.id,
          hasArmyId: !!sampleUnit.armyId,
          hasTroopId: !!sampleUnit.troopId,
          hasCostPoints: sampleUnit.costPoints !== undefined,
          keys: Object.keys(sampleUnit),
        })
      }

      units.value = result
      return result
    } catch (err: any) {
      console.error(`Error loading units for army ${armyId}:`, err)
      error.value = err.message || 'Failed to load units'
      return []
    } finally {
      loading.value = false
    }
  }

  // Add a function to recalculate and update army points total
  async function refreshArmyPoints(armyId: string) {
    if (!armyStore.currentArmy) return false

    try {
      // Calculate total points from all units in this army
      const armyUnits = units.value.filter((unit) => unit.armyId === armyId)
      const totalPoints = armyUnits.reduce((sum, unit) => sum + (unit.costPoints || 0), 0)

      // Update the army with the correct total
      await armyStore.updateArmy(armyId, {
        currentPoints: totalPoints,
      })

      return true
    } catch (err) {
      console.error(`Error refreshing points for army ${armyId}:`, err)
      return false
    }
  }

  // Create a new unit
  async function addUnit(
    unitData: Omit<UnitWithCost, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  ) {
    loading.value = true
    error.value = null

    console.log('Adding new unit:', {
      name: unitData.name,
      troopId: unitData.troopId,
      armyId: unitData.armyId,
    })

    try {
      // Add timestamps
      const timestamp = getTimestamp()

      // Create unit with default values and timestamps
      const newUnit = {
        ...unitData,
        ...timestamp,
      }

      console.log('Preparing to save unit to Firestore collection:', COLLECTION_NAME)

      // Add to Firestore
      const id = await addDocument(COLLECTION_NAME, newUnit)
      console.log('Unit saved to Firestore with ID:', id)

      // Create complete unit object with ID
      const createdUnit: UnitWithCost = {
        id,
        userId: '', // This will be overwritten by the addDocument function
        ...newUnit,
      }

      // Add to local state
      units.value.push(createdUnit)
      console.log('Unit added to local state. Total units:', units.value.length)

      // Refresh army points total if needed
      if (unitData.armyId) {
        await refreshArmyPoints(unitData.armyId)
      }

      return createdUnit
    } catch (err: any) {
      console.error('Error creating unit:', err)
      error.value = err.message || 'Failed to create unit'
      return null
    } finally {
      loading.value = false
    }
  }

  // Update an existing unit
  async function updateUnit(id: string, unitData: Partial<UnitWithCost>) {
    loading.value = true
    error.value = null

    try {
      // Get the original unit
      const originalUnit = units.value.find((u) => u.id === id)
      const originalArmyId = originalUnit?.armyId

      // Add updated timestamp
      const data = {
        ...unitData,
        updatedAt: Date.now(),
      }

      // Update in Firestore
      await updateDocument(COLLECTION_NAME, id, data)

      // Update in local state
      const index = units.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        units.value[index] = { ...units.value[index], ...data }
      }

      // Refresh army points total if cost or army ID changed
      if (originalArmyId) {
        await refreshArmyPoints(originalArmyId)
      }

      // If the unit was moved to a different army, update that one too
      if (unitData.armyId && unitData.armyId !== originalArmyId) {
        await refreshArmyPoints(unitData.armyId)
      }

      return true
    } catch (err: any) {
      console.error(`Error updating unit ${id}:`, err)
      error.value = err.message || 'Failed to update unit'
      return false
    } finally {
      loading.value = false
    }
  }

  // Delete a unit
  async function deleteUnit(id: string, armyId?: string) {
    loading.value = true
    error.value = null

    try {
      // Find the unit to get its army ID if not provided
      const unitToDelete = units.value.find((u) => u.id === id)
      console.log('Attempting to delete unit:', { id, unitToDelete })

      if (!unitToDelete) {
        console.warn('Unit not found in local state:', id)
      }

      const unitArmyId = armyId || unitToDelete?.armyId

      if (!unitArmyId) {
        console.warn('No army ID provided or found for unit:', id)
      }

      // Delete from Firestore
      console.log('Deleting unit from Firestore:', id)
      await deleteDocument(COLLECTION_NAME, id)

      // Verify the unit is deleted by trying to get it again
      try {
        const { getDocument } = await import('../services/firestore')
        const deletedUnit = await getDocument(COLLECTION_NAME, id)
        console.log('Verification after deletion:', { id, exists: !!deletedUnit })

        if (deletedUnit) {
          console.error('Unit still exists after deletion attempt:', deletedUnit)
        }
      } catch (verifyErr) {
        console.warn('Error verifying deletion:', verifyErr)
      }

      // Remove from local state
      const countBefore = units.value.length
      units.value = units.value.filter((u) => u.id !== id)
      const countAfter = units.value.length

      console.log('Unit removed from local state:', {
        id,
        removed: countBefore > countAfter,
        countBefore,
        countAfter,
      })

      // Refresh army points total
      if (unitArmyId) {
        await refreshArmyPoints(unitArmyId)
        console.log('Army points refreshed for:', unitArmyId)
      }

      return true
    } catch (err: any) {
      console.error(`Error deleting unit ${id}:`, err)
      error.value = err.message || 'Failed to delete unit'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    units,
    loading,
    error,
    loadUnitsByArmyId,
    addUnit,
    updateUnit,
    deleteUnit,
    refreshArmyPoints,
  }
})
