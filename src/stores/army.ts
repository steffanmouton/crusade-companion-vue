import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { useWarbandVariantStore } from './warbandVariantStore'
import { useFactionStore } from './factionStore'
import { compileArmyRules } from '../services/armyRulesService'
import type { ArmyRules } from '../models/armyRules'
import type { WarbandVariant } from '../models/warbandVariant'
import type { Army as FirebaseArmy } from '../types/firebase'
import type { FactionTroopRules } from '../models/faction'
import { EquipmentCategory } from '../models/equipment'

const COLLECTION_NAME = 'armies'

export const useArmyStore = defineStore('army', () => {
  const armies = ref<FirebaseArmy[]>([])
  const currentArmy = ref<FirebaseArmy | null>(null)
  const currentArmyRules = ref<ArmyRules | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const warbandVariantStore = useWarbandVariantStore()
  const factionStore = useFactionStore()

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
      const querySnapshot = await getDocs(
        query(
          collection(getFirestore(), COLLECTION_NAME),
          where('userId', '==', getAuth().currentUser?.uid),
        ),
      )
      armies.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirebaseArmy[]
    } catch (err: any) {
      console.error('Error loading armies:', err)
      error.value = err.message
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
      const docRef = doc(getFirestore(), COLLECTION_NAME, id)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        error.value = 'Army not found'
        return null
      }
      currentArmy.value = { id: docSnap.id, ...docSnap.data() } as FirebaseArmy

      // Ensure warband variants are loaded
      if (currentArmy.value.warbandVariantId) {
        await warbandVariantStore.fetchWarbandVariants()
      }

      // Ensure factions are loaded for rule compilation
      await factionStore.syncWithFirestore()

      // Compile army rules
      await generateArmyRules()

      return currentArmy.value
    } catch (err: any) {
      console.error(`Error loading army ${id}:`, err)
      error.value = err.message || 'Failed to load army'
      return null
    } finally {
      loading.value = false
    }
  }

  // Create a new army
  async function createArmy(
    armyData: Omit<FirebaseArmy, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
  ) {
    loading.value = true
    error.value = null

    try {
      // Create army with default values
      const newArmy: Omit<FirebaseArmy, 'id'> = {
        ...armyData,
        currentPoints: armyData.currentPoints ?? 0,
        battles: 0,
        wins: 0,
        losses: 0,
        userId: getAuth().currentUser?.uid || '',
        warbandVariantId: armyData.warbandVariantId ?? null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      // Add to Firestore
      const docRef = await addDoc(collection(getFirestore(), COLLECTION_NAME), newArmy)

      // Create complete army object with ID
      const createdArmy: FirebaseArmy = {
        ...newArmy,
        id: docRef.id,
      }

      // Add to local state
      armies.value.push(createdArmy)

      // Set as current army
      currentArmy.value = createdArmy

      // Generate army rules
      await generateArmyRules()

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
  async function updateArmy(id: string, armyData: Partial<FirebaseArmy>) {
    loading.value = true
    error.value = null

    try {
      const data = {
        ...armyData,
        updatedAt: Date.now(),
      }

      // Update in Firestore
      await updateDoc(doc(getFirestore(), COLLECTION_NAME, id), data)

      // Update in local state
      if (currentArmy.value?.id === id) {
        currentArmy.value = { ...currentArmy.value, ...data }

        // If warband variant changed, regenerate rules
        if ('warbandVariantId' in armyData) {
          await generateArmyRules()
        }
      }

      const index = armies.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        armies.value[index] = { ...armies.value[index], ...data }
      }

      return currentArmy.value
    } catch (err: any) {
      console.error(`Error updating army ${id}:`, err)
      error.value = err.message || 'Failed to update army'
      return null
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
      await deleteDoc(doc(getFirestore(), COLLECTION_NAME, id))

      // Remove from local state
      armies.value = armies.value.filter((a) => a.id !== id)
      if (currentArmy.value?.id === id) {
        currentArmy.value = null
        currentArmyRules.value = null
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
  async function generateArmyRules() {
    if (!currentArmy.value) {
      console.warn('No current army to generate rules for')
      return
    }

    // Find the faction - handle different storage formats (ID, name, or object)
    let factionId: string = ''
    let factionName: string = ''

    // Handle the case where army.faction might be a string (ID or name) or an object
    if (typeof currentArmy.value.faction === 'string') {
      // Could be either an ID or a display name
      const factionString = currentArmy.value.faction

      // Store as both potential ID and name for flexible matching
      factionId = factionString
      factionName = factionString

      console.log(`Faction from army is string: "${factionString}"`)
    } else if (
      typeof currentArmy.value.faction === 'object' &&
      currentArmy.value.faction !== null
    ) {
      // Object with ID and potentially name
      const factionObject = currentArmy.value.faction as any
      factionId = factionObject.id || ''
      factionName = factionObject.name || ''

      console.log(`Faction from army is object: id="${factionId}", name="${factionName}"`)
    } else {
      console.warn(`Invalid faction format: ${JSON.stringify(currentArmy.value.faction)}`)
      return
    }

    // Try to find the faction by multiple approaches
    let faction = null

    // First try direct ID match
    faction = factionStore.factions.find((f) => f.id === factionId)

    // If not found, try case-insensitive name match
    if (!faction && factionName) {
      faction = factionStore.factions.find(
        (f) => f.name.toLowerCase() === factionName.toLowerCase(),
      )
      if (faction) {
        console.log(`Found faction by name match: ${faction.name} (${faction.id})`)
      }
    }

    // If still not found, try checking if the faction string contains the ID
    if (!faction) {
      for (const f of factionStore.factions) {
        if (
          (factionId && f.id.includes(factionId.toLowerCase())) ||
          (factionName && f.id.includes(factionName.toLowerCase()))
        ) {
          faction = f
          console.log(`Found faction by partial ID match: ${f.name} (${f.id})`)
          break
        }
      }
    }

    // Last resort - look for the faction name within the ID
    if (!faction && factionName) {
      // Create a slug from the faction name (e.g., "Heretic Legion" -> "heretic-legion")
      const nameSlug = factionName.toLowerCase().replace(/\s+/g, '-')

      for (const f of factionStore.factions) {
        if (f.id.includes(nameSlug)) {
          faction = f
          console.log(`Found faction by name-in-ID match: ${f.name} (${f.id})`)
          break
        }
      }

      // Special case for "Heretic Legion" -> "tc-fc-heretic-legion"
      if (!faction && factionName === 'Heretic Legion') {
        faction = factionStore.factions.find((f) => f.id === 'tc-fc-heretic-legion')
        if (faction) {
          console.log(`Found Heretic Legion by hardcoded ID: ${faction.id}`)
        }
      }
    }

    if (!faction) {
      console.warn(`Could not find faction for "${factionId}" / "${factionName}"`)
      console.log(
        'Available factions:',
        factionStore.factions.map((f) => ({ id: f.id, name: f.name })),
      )
      return
    }

    console.log(`Using faction: ${faction.name} (${faction.id})`)

    // Find the variant if specified
    let variant: WarbandVariant | undefined
    if (currentArmy.value.warbandVariantId) {
      // We need to cast to 'any' because the Firebase WarbandVariant has 'faction'
      // but the model WarbandVariant has 'factionId'
      console.log(`Looking for variant with ID: ${currentArmy.value.warbandVariantId}`)
      const firebaseVariant = warbandVariantStore.warbandVariants.find(
        (v) => v.id === currentArmy.value?.warbandVariantId,
      )

      console.log(`Firestore variant found: ${firebaseVariant ? 'Yes' : 'No'}`)
      if (firebaseVariant) {
        console.log(`Firestore variant details:`, {
          id: firebaseVariant.id,
          name: firebaseVariant.name,
          faction: (firebaseVariant as any).faction,
        })
        // Convert Firebase variant to model variant
        const troopRules: FactionTroopRules = {
          costs: (firebaseVariant as any).troopOverrides?.costOverrides || {},
          limits: {},
          restrictions: {
            requirements: [],
          },
        }

        variant = {
          id: firebaseVariant.id,
          name: firebaseVariant.name,
          description: firebaseVariant.description,
          factionId: (firebaseVariant as any).faction,
          specialRules: (firebaseVariant as any).rules,
          equipmentRules: {
            costs: (firebaseVariant as any).equipmentOverrides?.costOverrides || {},
            limits: (firebaseVariant as any).equipmentOverrides?.limitOverrides || {},
            globalRestrictions: {
              bannedKeywords: (firebaseVariant as any).equipmentRestrictions?.bannedKeywords || [],
              bannedCategories: (
                (firebaseVariant as any).equipmentRestrictions?.bannedCategories || []
              ).map((category: string) => {
                switch (category) {
                  case 'Melee Weapon':
                    return EquipmentCategory.MELEE_WEAPON
                  case 'Ranged Weapon':
                    return EquipmentCategory.RANGED_WEAPON
                  case 'Armour':
                    return EquipmentCategory.ARMOUR
                  case 'Headgear':
                    return EquipmentCategory.HEADGEAR
                  case 'Grenade':
                    return EquipmentCategory.GRENADE
                  case 'Shield':
                    return EquipmentCategory.SHIELD
                  case 'Musical Instrument':
                    return EquipmentCategory.MUSICAL_INSTRUMENT
                  case 'Standard':
                    return EquipmentCategory.STANDARD
                  case 'Equipment':
                    return EquipmentCategory.EQUIPMENT
                  default:
                    return EquipmentCategory.EQUIPMENT
                }
              }),
              bannedEquipmentIds:
                (firebaseVariant as any).equipmentRestrictions?.bannedEquipmentIds || [],
            },
          },
          troopRules,
        }

        if (variant) {
          console.log('Using variant:', variant.name, variant.id)
          console.log('Variant details:', {
            factionId: variant.factionId,
            specialRules: variant.specialRules,
            equipmentRules: variant.equipmentRules,
            troopRules: variant.troopRules,
          })
        }
      } else {
        console.warn(
          `Could not find variant with ID ${currentArmy.value.warbandVariantId} for faction ${faction.id} / ${faction.name}`,
        )
        console.log(
          'Available variants:',
          warbandVariantStore.warbandVariants.map((v) => ({
            id: v.id,
            name: v.name,
            faction: (v as any).faction,
          })),
        )
      }
    }

    // Get the army rules from Firebase
    try {
      // First try to get from Firebase armyRules collection
      const docId = variant ? `${faction.id}-${variant.id}` : `${faction.id}-base`
      console.log(`Looking for army rules with document ID: ${docId}`)
      console.log(`Searching in collection 'armyRules'`)

      const db = getFirestore()
      const docRef = doc(db, 'armyRules', docId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        // Use pre-compiled rules from Firebase
        currentArmyRules.value = docSnap.data() as ArmyRules
        console.log('Retrieved pre-compiled ArmyRules from Firebase:', docId)
      } else {
        // Fall back to compilation if Firebase retrieval fails
        console.log(`No pre-compiled rules found for ${docId}, falling back to runtime compilation`)

        // Try a different document ID format in case that's the issue
        const alternateDocId = `${faction.id}-${variant?.id || 'base'}`
        if (docId !== alternateDocId) {
          console.log(`Trying alternate document ID: ${alternateDocId}`)
          const altDocRef = doc(db, 'armyRules', alternateDocId)
          const altDocSnap = await getDoc(altDocRef)

          if (altDocSnap.exists()) {
            currentArmyRules.value = altDocSnap.data() as ArmyRules
            console.log(
              'Retrieved pre-compiled ArmyRules from Firebase with alternate ID:',
              alternateDocId,
            )
            return
          }
        }

        currentArmyRules.value = compileArmyRules(faction, variant)
      }

      console.log('Final ArmyRules:', currentArmyRules.value)
    } catch (error) {
      console.error('Error retrieving army rules:', error)
      // Fall back to compilation if Firebase retrieval fails
      currentArmyRules.value = compileArmyRules(faction, variant)
      console.log('Fell back to compiled ArmyRules:', currentArmyRules.value)
    }
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
