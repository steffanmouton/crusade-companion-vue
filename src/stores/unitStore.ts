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
import { deleteImage } from '../services/storage'

const COLLECTION_NAME = 'units'

// Extended Unit type that includes costPoints for our internal use
interface UnitWithCost extends Unit {
  costPoints: number
  troopId: string
  troopName?: string
  costCurrency: number
  currentEquipment: { name: string; type: string; modifiers?: string[]; rules?: string[] }[]
  purchasedAbilities: string[]
  imageUrl?: string
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

    try {
      // Query units where armyId matches
      const result = await getDocuments<UnitWithCost>(COLLECTION_NAME, [
        where('armyId', '==', armyId),
      ])

      // Process and store units with imageUrl properly preserved
      units.value = result.map(unit => {
        // Explicitly ensure the imageUrl is included and not undefined
        const processedUnit = {
          ...unit,
          // Keep imageUrl if it exists
          imageUrl: unit.imageUrl || undefined
        };

        return processedUnit;
      });

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
      const originalImageUrl = originalUnit?.imageUrl

      // Check if we need to delete the old image - this happens when:
      // 1. There was an original image
      // 2. The image is being changed (either to a new image or to null/undefined)
      // 3. The new image URL is different from the old one
      if (originalImageUrl &&
          unitData.imageUrl !== undefined &&
          originalImageUrl !== unitData.imageUrl) {
        try {
          await deleteImage(originalImageUrl);
        } catch {
          // Continue with unit update even if image deletion fails
        }
      }

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
        // Ensure we preserve important fields like imageUrl when updating
        units.value[index] = {
          ...units.value[index],
          ...data,
          // Explicitly ensure imageUrl is preserved if it exists in the update
          imageUrl: unitData.imageUrl !== undefined
            ? unitData.imageUrl
            : units.value[index].imageUrl
        }
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
    loading.value = true;
    error.value = null;

    try {
      // Find the unit to get its army ID if not provided
      const unitToDelete = units.value.find((u) => u.id === id);
      const unitArmyId = armyId || unitToDelete?.armyId;

      // If the unit has an image, delete it from storage
      if (unitToDelete?.imageUrl) {
        try {
          await deleteImage(unitToDelete.imageUrl);
        } catch {
          // Continue with unit deletion even if image deletion fails
        }
      }

      // Delete from Firestore
      await deleteDocument(COLLECTION_NAME, id);

      // Remove from local state
      units.value = units.value.filter((u) => u.id !== id);

      // Refresh army points total
      if (unitArmyId) {
        await refreshArmyPoints(unitArmyId);
      }

      return true;
    } catch (err: any) {
      console.error(`Error deleting unit ${id}:`, err);
      error.value = err.message || 'Failed to delete unit';
      return false;
    } finally {
      loading.value = false;
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
