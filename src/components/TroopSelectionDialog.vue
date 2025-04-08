<template>
  <v-dialog v-model="dialog" fullscreen persistent>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Add Unit</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-card-text class="pa-4">
        <div v-if="loading" class="d-flex align-center justify-center my-8">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </div>

        <template v-else>
          <v-text-field
            v-model="searchQuery"
            label="Search troops"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            clearable
            class="mb-4"
          ></v-text-field>

          <v-tabs v-model="activeTab" color="primary" class="mb-4">
            <v-tab value="elites">Elites</v-tab>
            <v-tab value="troops">Troops</v-tab>
            <v-tab value="mercenaries">Mercenaries</v-tab>
          </v-tabs>

          <div v-if="filteredTroopsByTab.length === 0" class="text-center py-8">
            <v-icon
              icon="mdi-alert-circle-outline"
              color="warning"
              size="large"
              class="mb-2"
            ></v-icon>
            <h3 class="text-h6 mb-1">No troops found</h3>
            <p class="text-body-2 text-medium-emphasis">
              No troops are available in the database. Please contact an administrator to initialize
              the game data.
            </p>
          </div>

          <div v-else class="troop-list">
            <CondensedTroopCard
              v-for="troop in filteredTroopsByTab"
              :key="troop.id"
              :troop="troop"
              :is-required="isRequiredUnit()"
              :warband-variant="currentWarbandVariant"
              @add-troop="selectTroop(troop)"
              @view-details="viewTroopDetails(troop)"
            />
          </div>
        </template>
      </v-card-text>
    </v-card>

    <!-- Troop detail dialog -->
    <v-dialog v-model="detailDialog" max-width="500">
      <v-card>
        <v-card-text class="pa-0">
          <TroopCard v-if="selectedTroop" :troop="selectedTroop" />
        </v-card-text>
        <v-card-actions class="justify-end pa-4">
          <v-btn variant="text" color="primary" @click="detailDialog = false"> Close </v-btn>
          <v-btn color="primary" variant="flat" @click="addSelectedTroop"> Add this troop </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Unit form dialog -->
    <v-dialog v-model="unitFormDialog" max-width="800" persistent>
      <UnitForm
        v-if="selectedTroop"
        :troop="selectedTroop"
        :armyId="props.armyId"
        @save="saveUnit"
        @close="unitFormDialog = false"
      />
    </v-dialog>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTroopStore } from '../stores/troopStore'
import { useEquipmentStore } from '../stores/equipmentStore'
import { useFactionStore } from '../stores/factionStore'
import { useArmyStore } from '../stores/army'
import CondensedTroopCard from './CondensedTroopCard.vue'
import TroopCard from './TroopCard.vue'
import UnitForm from './UnitForm.vue'
import type { Troop } from '../models/troop'
import type { Unit } from '../models/unit'

const props = defineProps<{
  modelValue: boolean
  factionName: string
  armyId: string
}>()

const emit = defineEmits(['update:modelValue', 'unit-added'])

// State
const dialog = ref(props.modelValue)
const detailDialog = ref(false)
const unitFormDialog = ref(false)
const loading = ref(true)
const searchQuery = ref('')
const selectedTroop = ref<Troop | null>(null)
const troopStore = useTroopStore()
const equipmentStore = useEquipmentStore()
const factionStore = useFactionStore()
const armyStore = useArmyStore()
const activeTab = ref('elites')

// Get faction ID from faction name
const factionId = computed(() => {
  return factionStore.factions.find(f => f.name === props.factionName)?.id || '';
})

// Get current warband variant
const currentWarbandVariant = computed(() => {
  if (!factionId.value) return null;
  const faction = factionStore.factions.find(f => f.id === factionId.value);
  if (!faction?.variants) return null;
  return faction.variants[0]; // For now, just use the first variant
})

// Add computed property for army rules
const currentArmyRules = computed(() => armyStore.currentArmyRules)

// Watch for changes to modelValue prop
watch(() => props.modelValue, (newValue) => {
  dialog.value = newValue
  if (newValue) {
    if (!props.factionName) {
      console.error('No faction name provided')
      closeDialog()
      return
    }
    loadTroops()
  }
})

// Watch for changes to dialog value
watch(dialog, (newValue) => {
  emit('update:modelValue', newValue)
})

// Computed property for filtered troops
const filteredTroops = computed(() => {
  // Show all troops and let filteredTroopsByTab handle the filtering
  const troops = troopStore.troops

  if (!searchQuery.value) {
    return troops
  }

  const query = searchQuery.value.toLowerCase()
  return troops.filter((troop: Troop) => {
    return (
      troop.name.toLowerCase().includes(query) ||
      troop.description.toLowerCase().includes(query) ||
      troop.type.toLowerCase().includes(query) ||
      troop.keywords.some((keyword: string) => keyword.toLowerCase().includes(query))
    )
  })
})

// Computed property for filtered troops by tab
const filteredTroopsByTab = computed(() => {
  const troops = filteredTroops.value

  // If we have army rules, use them to filter troops
  if (currentArmyRules.value) {
    console.log('Using ArmyRules to filter troops')

    // Get the available troops from army rules
    const availableTroopIds = Object.keys(currentArmyRules.value.troops.availability)
      .filter(id => currentArmyRules.value?.troops.availability[id])

    console.log('Available troop IDs:', availableTroopIds)
    console.log('Current tab:', activeTab.value)

    // Filter troops based on army rules and tab
    const filteredByAvailability = troops.filter(troop => {
      const isAvailable = availableTroopIds.includes(troop.id)
      if (!isAvailable) {
        console.log(`Troop ${troop.name} (${troop.id}) not available according to ArmyRules`)
      }
      return isAvailable
    })

    // Now filter by tab type
    const result = activeTab.value === 'elites'
      ? filteredByAvailability.filter(troop => troop.type === 'Elite')
      : activeTab.value === 'troops'
        ? filteredByAvailability.filter(troop => troop.type === 'Troop')
        : filteredByAvailability.filter(troop => troop.type === 'Mercenary')

    console.log(`Found ${result.length} troops for tab ${activeTab.value}`)
    return result
  }

  // Fallback to original filtering
  console.log('Falling back to original filtering (no ArmyRules)')
  const filtered =
    activeTab.value === 'elites'
      ? troops.filter((troop) => troop.type === 'Elite' && troop.factionName === props.factionName)
      : activeTab.value === 'troops'
        ? troops.filter(
            (troop) => troop.type === 'Troop' && troop.factionName === props.factionName,
          )
        : troops.filter(
            // Filter mercenaries based on mercenaryFactions property
            (troop) => troop.type === 'Mercenary' &&
              (troop.mercenaryFactions?.includes(props.factionName) ||
               troop.factionId === 'mercenary')
          )

  // Sort required units to the top
  return filtered.sort(() => 0)
})

// Methods
async function loadTroops() {
  loading.value = true
  try {
    // Make sure factions are loaded first
    await factionStore.syncWithFirestore()
    console.log("Loaded factions:", factionStore.factions.length)

    // Initialize both troops and equipment
    await Promise.all([
      troopStore.initializeTroops(),
      equipmentStore.fetchEquipment()
    ])

    // If we have an army ID, load that army
    if (props.armyId) {
      await armyStore.loadArmy(props.armyId)
      console.log("Loaded army:", armyStore.currentArmy?.name)
      console.log("Army rules loaded:", armyStore.currentArmyRules ? "Yes" : "No")

      // If ArmyRules weren't generated, try to generate them
      if (!armyStore.currentArmyRules) {
        console.log("Generating army rules...")
        armyStore.generateArmyRules()
        console.log("Army rules after generation:", armyStore.currentArmyRules ? "Available" : "Still missing")
      }
    }
  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
}

function closeDialog() {
  dialog.value = false
}

function selectTroop(troop: Troop) {
  selectedTroop.value = troop
  unitFormDialog.value = true
}

function viewTroopDetails(troop: Troop) {
  selectedTroop.value = troop
  detailDialog.value = true
}

function addSelectedTroop() {
  detailDialog.value = false
  if (selectedTroop.value) {
    unitFormDialog.value = true
  }
}

function saveUnit(unit: Unit) {
  unitFormDialog.value = false
  // We only emit the event with the unit but don't save it again
  // The unit has already been saved to Firestore by the UnitForm component
  emit('unit-added', unit)
  dialog.value = false
}

// Function to check if a unit is required - we don't have this concept yet, so return false
function isRequiredUnit(): boolean {
  // For now, no troops are required
  return false;
}
</script>

<style scoped>
.troop-list {
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  padding-right: 8px;
}
</style>
