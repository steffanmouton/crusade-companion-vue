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
              :is-required="isRequiredUnit(troop)"
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
import CondensedTroopCard from './CondensedTroopCard.vue'
import TroopCard from './TroopCard.vue'
import UnitForm from './UnitForm.vue'
import type { Troop } from '../models/troop'
import type { Unit } from '../models/unit'

const props = defineProps<{
  modelValue: boolean
  factionId: number
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
const activeTab = ref('elites')

// Watch for changes to modelValue prop
watch(
  () => props.modelValue,
  (newValue) => {
    dialog.value = newValue
  },
)

// Watch for changes to dialog value
watch(dialog, (newValue) => {
  emit('update:modelValue', newValue)
  if (newValue) {
    loadTroops()
  }
})

// Computed property for filtered troops
const filteredTroops = computed(() => {
  // Filter troops by faction ID
  const troopsByFaction = troopStore.troops.filter((troop) => troop.factionId === props.factionId)

  if (!searchQuery.value) {
    return troopsByFaction
  }

  const query = searchQuery.value.toLowerCase()
  return troopsByFaction.filter((troop: Troop) => {
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
  const filtered =
    activeTab.value === 'elites'
      ? troops.filter((troop) => troop.keywords.includes('ELITE'))
      : troops.filter((troop) => !troop.keywords.includes('ELITE'))

  // Sort required units to the top
  return filtered.sort((a, b) => {
    const aRequired = isRequiredUnit(a)
    const bRequired = isRequiredUnit(b)
    if (aRequired && !bRequired) return -1
    if (!aRequired && bRequired) return 1
    return 0
  })
})

// Methods
async function loadTroops() {
  loading.value = true
  try {
    // Initialize both troops and equipment
    await Promise.all([troopStore.initializeTroops(), equipmentStore.initializeEquipment()])
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

// Function to check if a unit is required
function isRequiredUnit(troop: Troop): boolean {
  return troop.countAllowed.length === 1 && troop.countAllowed[0] === 1
}
</script>

<style scoped>
.troop-list {
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  padding-right: 8px;
}
</style>
