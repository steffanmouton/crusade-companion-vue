<template>
  <v-app class="bg-background">
    <!-- App Bar -->
    <v-app-bar color="primary" density="default" class="tc-app-bar" elevation="1">
      <v-app-bar-title class="text-h6 font-weight-medium tc-logo-text">
        Crusade Companion Admin
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <div v-if="!loading && user" class="text-body-2 mr-4">
        {{ user.email }}
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-background">
      <v-container v-if="!isAdmin" class="fill-height" fluid>
        <v-row justify="center" align="center">
          <v-col cols="12" md="6">
            <v-card class="mx-auto text-center pa-6" elevation="1">
              <v-icon icon="mdi-block-helper" color="error" size="x-large" class="mb-4"></v-icon>
              <h2 class="text-h4 font-weight-medium mb-2 tc-heading">Access Denied</h2>
              <p class="text-body-1 mb-4">
                You do not have administrator privileges to access this page.
              </p>
              <v-btn color="primary" prepend-icon="mdi-arrow-left" @click="goHome">
                Return to Home
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-else-if="loading" class="fill-height" fluid>
        <v-row justify="center" align="center">
          <v-col cols="auto">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          </v-col>
        </v-row>
      </v-container>

      <!-- Admin content -->
      <v-container v-else class="py-8">
        <h1 class="text-h4 font-weight-medium tc-heading mb-6">Admin Panel</h1>

        <v-row>
          <v-col cols="12" md="4">
            <v-card class="mb-4" elevation="1">
              <v-card-title class="text-h6 font-weight-medium bg-background">
                Database Seeding
              </v-card-title>
              <v-card-text>
                <p class="text-body-2 mb-4">
                  Seed your Firestore database with initial game data. These operations will only
                  add data if the collections are empty.
                </p>

                <v-card variant="outlined" class="mb-4 pa-3">
                  <div class="d-flex align-center mb-2">
                    <v-icon icon="mdi-sword" color="primary" class="mr-2"></v-icon>
                    <div class="text-subtitle-1 font-weight-medium">Troops</div>
                    <v-spacer></v-spacer>
                    <v-chip v-if="counts.troops > 0" color="success" size="small">
                      {{ counts.troops }} troops
                    </v-chip>
                    <v-chip v-else color="error" size="small"> Empty </v-chip>
                  </div>
                  <p class="text-caption mb-3">
                    Seed troop data for character creation and unit selection.
                  </p>
                  <v-btn
                    block
                    color="primary"
                    variant="flat"
                    :loading="seeding.troops"
                    :disabled="seeding.troops || counts.troops > 0"
                    @click="seedTroops"
                    class="mb-2"
                  >
                    Seed Troops
                  </v-btn>
                  <v-btn
                    v-if="counts.troops > 0"
                    block
                    color="warning"
                    variant="outlined"
                    :loading="seeding.troops"
                    :disabled="seeding.troops"
                    @click="reseedTroops"
                  >
                    Re-Seed Troops
                  </v-btn>
                </v-card>

                <v-card variant="outlined" class="mb-4 pa-3">
                  <div class="d-flex align-center mb-2">
                    <v-icon icon="mdi-shield" color="primary" class="mr-2"></v-icon>
                    <div class="text-subtitle-1 font-weight-medium">Equipment</div>
                    <v-spacer></v-spacer>
                    <v-chip v-if="counts.equipment > 0" color="success" size="small">
                      {{ counts.equipment }} items
                    </v-chip>
                    <v-chip v-else color="error" size="small"> Empty </v-chip>
                  </div>
                  <p class="text-caption mb-3">
                    Seed equipment data for weapons, armor, and other items.
                  </p>
                  <v-btn
                    block
                    color="primary"
                    variant="flat"
                    :loading="seeding.equipment"
                    :disabled="seeding.equipment || counts.equipment > 0"
                    @click="seedEquipment"
                    class="mb-2"
                  >
                    Seed Equipment
                  </v-btn>
                  <v-btn
                    v-if="counts.equipment > 0"
                    block
                    color="warning"
                    variant="outlined"
                    :loading="seeding.equipment"
                    :disabled="seeding.equipment"
                    @click="reseedEquipment"
                  >
                    Re-Seed Equipment
                  </v-btn>
                </v-card>

                <v-card variant="outlined" class="mb-4 pa-3">
                  <div class="d-flex align-center mb-2">
                    <v-icon icon="mdi-flag" color="primary" class="mr-2"></v-icon>
                    <div class="text-subtitle-1 font-weight-medium">Factions</div>
                    <v-spacer></v-spacer>
                    <v-chip v-if="counts.factions > 0" color="success" size="small">
                      {{ counts.factions }} factions
                    </v-chip>
                    <v-chip v-else color="error" size="small"> Empty </v-chip>
                  </div>
                  <p class="text-caption mb-3">
                    Seed faction data for army creation and unit organization.
                  </p>
                  <v-btn
                    block
                    color="primary"
                    variant="flat"
                    :loading="seeding.factions"
                    :disabled="seeding.factions || counts.factions > 0"
                    @click="seedFactions"
                    class="mb-2"
                  >
                    Seed Factions
                  </v-btn>
                  <v-btn
                    v-if="counts.factions > 0"
                    block
                    color="warning"
                    variant="outlined"
                    :loading="seeding.factions"
                    :disabled="seeding.factions"
                    @click="reseedFactions"
                  >
                    Re-Seed Factions
                  </v-btn>
                </v-card>

                <v-card variant="outlined" class="mb-4 pa-3">
                  <div class="d-flex align-center mb-2">
                    <v-icon icon="mdi-flag-variant" color="primary" class="mr-2"></v-icon>
                    <div class="text-subtitle-1 font-weight-medium">Warband Variants</div>
                    <v-spacer></v-spacer>
                    <v-chip v-if="counts.warbandVariants > 0" color="success" size="small">
                      {{ counts.warbandVariants }} variants
                    </v-chip>
                    <v-chip v-else color="error" size="small"> Empty </v-chip>
                  </div>
                  <p class="text-caption mb-3">
                    Seed warband variant data for special army configurations.
                  </p>
                  <v-btn
                    block
                    color="primary"
                    variant="flat"
                    :loading="seeding.warbandVariants"
                    :disabled="seeding.warbandVariants || counts.warbandVariants > 0"
                    @click="seedWarbandVariants"
                    class="mb-2"
                  >
                    Seed Warband Variants
                  </v-btn>
                  <v-btn
                    v-if="counts.warbandVariants > 0"
                    block
                    color="warning"
                    variant="outlined"
                    :loading="seeding.warbandVariants"
                    :disabled="seeding.warbandVariants"
                    @click="reseedWarbandVariants"
                  >
                    Re-Seed Warband Variants
                  </v-btn>
                </v-card>

                <v-btn
                  block
                  color="success"
                  variant="flat"
                  class="mt-4"
                  :loading="seedingAll"
                  :disabled="
                    seedingAll ||
                    counts.troops > 0 ||
                    counts.equipment > 0 ||
                    counts.factions > 0 ||
                    counts.warbandVariants > 0
                  "
                  @click="seedAll"
                >
                  Seed All Data
                </v-btn>

                <v-btn
                  v-if="
                    counts.troops > 0 ||
                    counts.equipment > 0 ||
                    counts.factions > 0 ||
                    counts.warbandVariants > 0
                  "
                  block
                  color="warning"
                  variant="flat"
                  class="mt-4"
                  :loading="seedingAll"
                  :disabled="seedingAll"
                  @click="reseedAll"
                >
                  Re-Seed All Data
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="8">
            <v-card elevation="1">
              <v-card-title class="text-h6 font-weight-medium bg-background d-flex align-center">
                Activity Log
                <v-spacer></v-spacer>
                <v-btn
                  size="small"
                  variant="text"
                  icon="mdi-refresh"
                  @click="loadLogs"
                  :loading="refreshingLogs"
                  class="mr-2"
                ></v-btn>
              </v-card-title>
              <v-card-text class="pb-0">
                <p class="text-body-2 mb-2">Recent operations and results</p>
              </v-card-text>
              <v-list lines="two" class="log-list">
                <v-list-item v-for="(log, index) in logs" :key="index">
                  <v-list-item-title>{{ log.message }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <span class="text-caption">
                      {{ formatTimestamp(log.timestamp) }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="logs.length === 0">
                  <v-list-item-title class="text-body-2 text-center text-medium-emphasis py-6">
                    No activity logged yet.
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-6">
          <v-col cols="12">
            <v-card elevation="1">
              <v-card-title class="text-h6 font-weight-medium bg-background">
                Admin Actions
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-btn
                      block
                      color="primary"
                      variant="outlined"
                      prepend-icon="mdi-refresh"
                      @click="refreshCounts"
                    >
                      Refresh Counts
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-btn
                      block
                      color="primary"
                      variant="outlined"
                      prepend-icon="mdi-home"
                      @click="goHome"
                    >
                      Return to Dashboard
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app class="tc-footer text-center d-flex justify-center">
      <span class="text-caption">
        &copy; {{ new Date().getFullYear() }} Crusade Companion Admin | RocketSheep LLC
      </span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { troopSeed } from '../seed/troopSeed'
import { equipmentSeed } from '../seed/equipmentSeed'
import { factionSeed } from '../seed/factionSeed'
import { warbandVariantsSeed } from '../seed/warbandVariantSeed'

import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  getFirestore,
  getDoc,
  doc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  setDoc,
} from 'firebase/firestore'
import { auth } from '../services/firebase'

// Router and stores
const router = useRouter()
const authStore = useAuthStore()

// State variables
const loading = ref(true)
const refreshingLogs = ref(false)
const user = computed(() => authStore.user)
const isAdmin = ref(false)

// Seeding state
interface SeedingState {
  troops: boolean
  equipment: boolean
  factions: boolean
  warbandVariants: boolean
}

interface CountsState {
  troops: number
  equipment: number
  factions: number
  warbandVariants: number
}

const seeding = ref<SeedingState>({
  troops: false,
  equipment: false,
  factions: false,
  warbandVariants: false,
})

const seedingAll = computed(
  () =>
    seeding.value.troops ||
    seeding.value.equipment ||
    seeding.value.factions ||
    seeding.value.warbandVariants,
)

const counts = ref<CountsState>({
  troops: 0,
  equipment: 0,
  factions: 0,
  warbandVariants: 0,
})

// Activity logs
const logs = ref<{ id?: string; message: string; timestamp: number | null }[]>([])
const maxDisplayedLogs = 50 // Maximum number of logs to display in the UI

// Functions
function goHome() {
  router.push('/dashboard')
}

// Format timestamp for display
function formatTimestamp(timestamp: number | null): string {
  if (!timestamp) return 'Unknown time'
  return new Date(timestamp).toLocaleString()
}

// Load logs from Firestore
async function loadLogs() {
  refreshingLogs.value = true
  try {
    const db = getFirestore()
    const logsCollection = collection(db, 'admin_logs')

    // Create a query to get the most recent logs, ordered by timestamp
    const logsQuery = query(logsCollection, orderBy('timestamp', 'desc'), limit(maxDisplayedLogs))

    const logsSnapshot = await getDocs(logsQuery)

    // Clear the current logs and load from Firestore
    logs.value = logsSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        message: data.message,
        timestamp: data.timestamp ? data.timestamp.toMillis() : null,
      }
    })
  } catch (error) {
    console.error('Error loading logs:', error)
  } finally {
    refreshingLogs.value = false
  }
}

// Fetch collection counts
async function refreshCounts() {
  loading.value = true
  try {
    const db = getFirestore()

    // Get troops count
    const troopsSnapshot = await getDocs(collection(db, 'troops'))
    counts.value.troops = troopsSnapshot.size

    // Get equipment count
    const equipmentSnapshot = await getDocs(collection(db, 'equipment'))
    counts.value.equipment = equipmentSnapshot.size

    // Get factions count
    const factionsSnapshot = await getDocs(collection(db, 'factions'))
    counts.value.factions = factionsSnapshot.size

    // Get warband variants count
    const warbandVariantsSnapshot = await getDocs(collection(db, 'warbandVariants'))
    counts.value.warbandVariants = warbandVariantsSnapshot.size

    addLog(
      `Refreshed counts: Troops: ${counts.value.troops}, Equipment: ${counts.value.equipment}, Factions: ${counts.value.factions}, Warband Variants: ${counts.value.warbandVariants}`,
    )
  } catch (error) {
    console.error('Error refreshing counts:', error)
    addLog(`Error refreshing counts: ${error}`)
  } finally {
    loading.value = false
  }
}

// Seed troops
async function seedTroops() {
  if (counts.value.troops > 0) {
    addLog('Troops collection is not empty. Seeding skipped.')
    return
  }

  seeding.value.troops = true
  try {
    const db = getFirestore()
    const troopsCollection = collection(db, 'troops')

    // Add each troop to Firestore
    for (const troop of troopSeed) {
      // Use setDoc with the custom ID
      await setDoc(doc(troopsCollection, troop.id), {
        ...troop,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    }

    // Update count
    counts.value.troops = troopSeed.length
    addLog(`Successfully seeded ${troopSeed.length} troops`)
  } catch (error) {
    console.error('Error seeding troops:', error)
    addLog(`Error seeding troops: ${error}`)
  } finally {
    seeding.value.troops = false
  }
}

// Seed equipment
async function seedEquipment() {
  if (counts.value.equipment > 0) {
    addLog('Equipment collection is not empty. Seeding skipped.')
    return
  }

  seeding.value.equipment = true
  try {
    const db = getFirestore()

    // Add each equipment item to Firestore
    for (const item of equipmentSeed) {
      // Use the item's id as the document ID
      const equipmentRef = doc(db, 'equipment', item.id)
      await setDoc(equipmentRef, {
        ...item,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    }

    // Update count
    counts.value.equipment = equipmentSeed.length
    addLog(`Successfully seeded ${equipmentSeed.length} equipment items`)
  } catch (error) {
    console.error('Error seeding equipment:', error)
    addLog(`Error seeding equipment: ${error}`)
  } finally {
    seeding.value.equipment = false
  }
}

// Seed factions
async function seedFactions() {
  if (counts.value.factions > 0) {
    addLog('Factions collection is not empty. Seeding skipped.')
    return
  }

  seeding.value.factions = true
  try {
    const db = getFirestore()
    const factionsCollection = collection(db, 'factions')

    // Add each faction to Firestore
    for (const faction of factionSeed) {
      // Extract all properties except id using destructuring and rest
      const { id: _factionId, ...factionDataWithoutId } = faction
      await addDoc(factionsCollection, {
        originalId: _factionId, // Store the original ID as a field
        ...factionDataWithoutId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    }

    // Update count
    counts.value.factions = factionSeed.length
    addLog(`Successfully seeded ${factionSeed.length} factions`)
  } catch (error) {
    console.error('Error seeding factions:', error)
    addLog(`Error seeding factions: ${error}`)
  } finally {
    seeding.value.factions = false
  }
}

// Seed all data
async function seedAll() {
  addLog('Starting seeding of all data...')
  await seedTroops()
  await seedEquipment()
  await seedFactions()
  await seedWarbandVariants()
  addLog('Completed seeding all data')
}

// Add a log entry
async function addLog(message: string) {
  const logEntry = {
    message,
    timestamp: Date.now(),
  }

  // Add to local state first for immediate UI update
  logs.value.unshift(logEntry)

  // If we're displaying more than the maximum, trim the array
  if (logs.value.length > maxDisplayedLogs) {
    logs.value = logs.value.slice(0, maxDisplayedLogs)
  }

  // Save to Firestore
  try {
    const db = getFirestore()
    const logsCollection = collection(db, 'admin_logs')

    await addDoc(logsCollection, {
      message,
      timestamp: serverTimestamp(),
      userId: auth.currentUser?.uid || 'unknown',
      userEmail: auth.currentUser?.email || 'unknown',
    })
  } catch (error) {
    console.error('Error saving log to Firestore:', error)
  }
}

// Clear troops collection
async function clearTroopsCollection() {
  try {
    const db = getFirestore()
    const troopsCollection = collection(db, 'troops')
    const troopsSnapshot = await getDocs(troopsCollection)

    // Use batched writes for better performance
    const batch = writeBatch(db)

    troopsSnapshot.forEach((doc) => {
      batch.delete(doc.ref)
    })

    await batch.commit()
    addLog(`Cleared ${troopsSnapshot.size} troops from the database`)
    return true
  } catch (error) {
    console.error('Error clearing troops collection:', error)
    addLog(`Error clearing troops collection: ${error}`)
    return false
  }
}

// Clear equipment collection
async function clearEquipmentCollection() {
  try {
    const db = getFirestore()
    const equipmentCollection = collection(db, 'equipment')
    const equipmentSnapshot = await getDocs(equipmentCollection)

    // Use batched writes for better performance
    const batch = writeBatch(db)

    equipmentSnapshot.forEach((doc) => {
      batch.delete(doc.ref)
    })

    await batch.commit()
    addLog(`Cleared ${equipmentSnapshot.size} equipment items from the database`)
    return true
  } catch (error) {
    console.error('Error clearing equipment collection:', error)
    addLog(`Error clearing equipment collection: ${error}`)
    return false
  }
}

// Clear factions collection
async function clearFactionsCollection() {
  try {
    const db = getFirestore()
    const factionsCollection = collection(db, 'factions')
    const factionsSnapshot = await getDocs(factionsCollection)

    // Use batched writes for better performance
    const batch = writeBatch(db)

    factionsSnapshot.forEach((doc) => {
      batch.delete(doc.ref)
    })

    await batch.commit()
    addLog(`Cleared ${factionsSnapshot.size} factions from the database`)
    return true
  } catch (error) {
    console.error('Error clearing factions collection:', error)
    addLog(`Error clearing factions collection: ${error}`)
    return false
  }
}

// Re-seed troops
async function reseedTroops() {
  if (!confirm('This will delete all existing troop data and re-seed the collection. Continue?')) {
    return
  }

  seeding.value.troops = true
  try {
    addLog('Starting troops re-seeding process...')
    // First clear the collection
    const cleared = await clearTroopsCollection()
    if (!cleared) {
      throw new Error('Failed to clear troops collection')
    }

    // Reset the count
    counts.value.troops = 0

    // Then seed with fresh data
    await seedTroops()

    addLog('Troops re-seeding completed successfully')
  } catch (error) {
    console.error('Error re-seeding troops:', error)
    addLog(`Error re-seeding troops: ${error}`)
  } finally {
    seeding.value.troops = false
    await refreshCounts()
  }
}

// Re-seed equipment
async function reseedEquipment() {
  if (
    !confirm('This will delete all existing equipment data and re-seed the collection. Continue?')
  ) {
    return
  }

  seeding.value.equipment = true
  try {
    addLog('Starting equipment re-seeding process...')
    // First clear the collection
    const cleared = await clearEquipmentCollection()
    if (!cleared) {
      throw new Error('Failed to clear equipment collection')
    }

    // Reset the count
    counts.value.equipment = 0

    // Then seed with fresh data
    await seedEquipment()

    addLog('Equipment re-seeding completed successfully')
  } catch (error) {
    console.error('Error re-seeding equipment:', error)
    addLog(`Error re-seeding equipment: ${error}`)
  } finally {
    seeding.value.equipment = false
    await refreshCounts()
  }
}

// Re-seed factions
async function reseedFactions() {
  if (
    !confirm('This will delete all existing faction data and re-seed the collection. Continue?')
  ) {
    return
  }

  seeding.value.factions = true
  try {
    addLog('Starting factions re-seeding process...')
    // First clear the collection
    const cleared = await clearFactionsCollection()
    if (!cleared) {
      throw new Error('Failed to clear factions collection')
    }

    // Reset the count
    counts.value.factions = 0

    // Then seed with fresh data
    await seedFactions()

    addLog('Factions re-seeding completed successfully')
  } catch (error) {
    console.error('Error re-seeding factions:', error)
    addLog(`Error re-seeding factions: ${error}`)
  } finally {
    seeding.value.factions = false
    await refreshCounts()
  }
}

// Re-seed all data
async function reseedAll() {
  if (
    !confirm(
      'This will delete ALL existing game data (troops, equipment, factions, warband variants) and re-seed all collections. This cannot be undone. Continue?',
    )
  ) {
    return
  }

  addLog('Starting re-seeding of all game data...')

  // Re-seed each collection
  await reseedTroops()
  await reseedEquipment()
  await reseedFactions()
  await reseedWarbandVariants()

  addLog('Completed re-seeding of all game data')
  await refreshCounts()
}

// Seed warband variants
async function seedWarbandVariants() {
  if (counts.value.warbandVariants > 0) {
    addLog('Warband Variants collection is not empty. Seeding skipped.')
    return
  }

  seeding.value.warbandVariants = true
  try {
    const db = getFirestore()
    const warbandVariantsCollection = collection(db, 'warbandVariants')

    // Add each warband variant to Firestore
    for (const variant of warbandVariantsSeed) {
      // Use setDoc with the custom ID
      await setDoc(doc(warbandVariantsCollection, variant.id), {
        ...variant,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    }

    // Update count
    counts.value.warbandVariants = warbandVariantsSeed.length
    addLog(`Seeded ${warbandVariantsSeed.length} warband variants`)
  } catch (error) {
    console.error('Error seeding warband variants:', error)
    addLog(`Error seeding warband variants: ${error}`)
  } finally {
    seeding.value.warbandVariants = false
  }
}

// Re-seed warband variants
async function reseedWarbandVariants() {
  seeding.value.warbandVariants = true
  try {
    const db = getFirestore()
    const warbandVariantsCollection = collection(db, 'warbandVariants')

    // Clear existing data
    const snapshot = await getDocs(warbandVariantsCollection)
    const batch = writeBatch(db)
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })
    await batch.commit()

    // Add each warband variant to Firestore
    for (const variant of warbandVariantsSeed) {
      // Use setDoc with the custom ID
      await setDoc(doc(warbandVariantsCollection, variant.id), {
        ...variant,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    }

    // Update count
    counts.value.warbandVariants = warbandVariantsSeed.length
    addLog(`Re-seeded ${warbandVariantsSeed.length} warband variants`)
  } catch (error) {
    console.error('Error re-seeding warband variants:', error)
    addLog(`Error re-seeding warband variants: ${error}`)
  } finally {
    seeding.value.warbandVariants = false
  }
}

// Initialize
onMounted(async () => {
  loading.value = true
  try {
    // Check if user is authenticated
    if (!authStore.isAuthenticated || !auth.currentUser) {
      router.push('/login')
      return
    }

    // Check if user is admin by querying Firestore directly
    try {
      const db = getFirestore()
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
      const isAdminInFirestore = userDoc.exists() && userDoc.data()?.admin === true

      if (isAdminInFirestore) {
        isAdmin.value = true
        await Promise.all([
          refreshCounts(),
          loadLogs(), // Load logs when admin panel opens
        ])
      } else {
        console.error('User does not have admin privileges in Firestore')
      }
    } catch (adminCheckError) {
      console.error('Error checking admin status in Firestore:', adminCheckError)
    }
  } catch (error) {
    console.error('Error initializing admin view:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.log-list {
  max-height: 400px;
  overflow-y: auto;
}

.tc-heading {
  color: #8b0000;
}

.bg-background {
  background-color: #f5f5f0;
}
</style>
