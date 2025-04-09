<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <v-card class="equipment-dialog">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5 text-wrap" style="max-width: 80%">Choose Equipment</span>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <!-- Add filter controls -->
        <v-row class="mb-4">
          <v-col cols="12" sm="8">
            <v-checkbox
              v-model="showExplorationOnlyItems"
              label="Show Exploration-Only Items"
              hide-details
              density="compact"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" sm="4" class="d-flex justify-end">
            <v-btn
              size="small"
              color="primary"
              variant="outlined"
              prepend-icon="mdi-refresh"
              :loading="refreshing"
              @click="forceRefreshData"
            >
              Refresh Data
            </v-btn>
          </v-col>
        </v-row>

        <!-- Debug tools row -->
        <v-expansion-panels v-if="isAdmin" variant="accordion" class="mb-4">
          <v-expansion-panel title="Debug Tools">
            <template v-slot:text>
              <v-row>
                <v-col cols="12">
                  <v-card variant="outlined" class="pa-2 mb-2">
                    <div class="d-flex mb-2">
                      <v-icon color="warning" class="mr-2">mdi-tools</v-icon>
                      <div class="text-subtitle-1">Admin Tools</div>
                    </div>
                    <v-btn
                      color="error"
                      variant="outlined"
                      size="small"
                      class="mr-2 mb-2"
                      prepend-icon="mdi-database-sync"
                      :loading="reseedingFactions"
                      @click="reseedFactionData"
                    >
                      Reseed Faction Data
                    </v-btn>
                    <v-btn
                      color="error"
                      variant="outlined"
                      size="small"
                      class="mb-2"
                      prepend-icon="mdi-database-sync"
                      :loading="reseedingEquipment"
                      @click="reseedEquipmentData"
                    >
                      Reseed Equipment Data
                    </v-btn>
                  </v-card>

                  <v-card variant="outlined" class="pa-2">
                    <div class="d-flex mb-2">
                      <v-icon color="info" class="mr-2">mdi-information</v-icon>
                      <div class="text-subtitle-1">Debug Information</div>
                    </div>
                    <div v-if="props.faction" class="text-caption">
                      <strong>Faction:</strong> {{ props.faction.name }} ({{
                        props.faction.id
                      }})<br />
                      <strong>Equipment Types:</strong> {{ equipmentTypes.join(', ') }}<br />
                      <strong>Total Equipment Items:</strong> {{ equipmentStore.equipment.length
                      }}<br />
                      <strong>Filtered Equipment:</strong> {{ filteredEquipment.length }}<br />
                      <strong>Troop:</strong>
                      {{ props.troop ? `${props.troop.name} (${props.troop.id})` : 'None' }}<br />
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-row>
          <v-col v-for="item in filteredEquipment" :key="item.id" cols="12" sm="6" md="4">
            <v-card
              class="equipment-card"
              :class="{ 'equipment-card-selected': isSelected(item) }"
              @click="selectItem(item)"
            >
              <v-card-text class="d-flex flex-column" style="height: 100%">
                <div>
                  <div class="d-flex align-center mb-2">
                    <v-icon class="mr-2">{{ getEquipmentIcon(item.type) }}</v-icon>
                    <span class="text-subtitle-1 font-weight-medium">{{ item.name }}</span>
                  </div>
                  <div class="text-caption text-medium-emphasis">{{ item.description }}</div>
                  <div class="mt-2 d-flex flex-wrap gap-1">
                    <v-chip size="small" color="primary" variant="outlined">
                      {{ formatEquipmentCostWithVariant(item) }}
                    </v-chip>
                    <!-- Show bayonet lug feature -->
                    <v-chip
                      v-if="item.equipmentIndicator?.hasBayonetLug"
                      size="small"
                      color="warning"
                      variant="flat"
                    >
                      Bayonet Lug
                    </v-chip>
                    <!-- Show shield combo feature -->
                    <v-chip
                      v-if="item.equipmentIndicator?.shieldCombo"
                      size="small"
                      color="warning"
                      variant="flat"
                    >
                      Shield Combo
                    </v-chip>
                    <!-- Show handedness more prominently for weapons -->
                    <v-chip
                      v-if="
                        item.handedness &&
                        item.handedness !== HandednessType.NO_HANDS &&
                        (item.category === EquipmentCategory.MELEE_WEAPON ||
                          item.category === EquipmentCategory.RANGED_WEAPON)
                      "
                      size="small"
                      color="info"
                      variant="flat"
                      class="font-weight-medium"
                    >
                      {{ formatHandedness(item.handedness) }}
                    </v-chip>
                    <!-- Show handedness for non-weapons with less emphasis -->
                    <v-chip
                      v-else-if="item.handedness && item.handedness !== HandednessType.NO_HANDS"
                      size="small"
                      color="info"
                      variant="outlined"
                    >
                      {{ formatHandedness(item.handedness) }}
                    </v-chip>
                    <v-chip v-if="hasLimit(item)" size="small" color="warning" variant="outlined">
                      Limit: {{ getLimit(item) }}
                    </v-chip>
                  </div>
                  <div v-if="item.keywords && item.keywords.length > 0" class="mt-1">
                    <div class="text-caption font-italic">
                      {{ item.keywords.join(', ') }}
                    </div>
                  </div>
                </div>
                <div class="mt-auto pt-2 d-flex justify-end">
                  <v-btn
                    size="small"
                    variant="text"
                    color="primary"
                    @click.stop="showEquipmentDetails(item)"
                  >
                    Details
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" variant="flat" @click="saveSelection">Save</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Equipment Details Dialog -->
    <v-dialog v-model="showDetailsDialog" max-width="800">
      <EquipmentDetailView
        v-if="selectedEquipmentForDetails"
        :equipment="selectedEquipmentForDetails"
        @close="closeDetailsDialog"
      />
    </v-dialog>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Equipment } from '../models/equipment'
import type { WarbandVariant } from '../models/warbandVariant'
import type { Faction } from '../models/faction'
import { formatCost } from '../models/cost'
import { useEquipmentStore } from '../stores/equipmentStore'
import { useFactionStore } from '../stores/factionStore'
import { useArmyStore } from '../stores/army'
import { HandednessType, EquipmentCategory } from '../models/equipment'
import {
  getEquipmentCost,
  getEquipmentLimit,
  isEquipmentAllowedForTroop,
} from '../utils/equipmentUtils'
import EquipmentDetailView from './EquipmentDetailView.vue'
import { auth } from '../services/firebase'
import { getFirestore, getDoc, doc } from 'firebase/firestore'
import { onMounted } from 'vue'

const props = defineProps<{
  modelValue: boolean
  selectedEquipment: Equipment[]
  filterType: string
  editingItem: Equipment | null
  variantName?: string
  warbandVariant?: WarbandVariant | null
  faction?: Faction | null
  troop?: any
}>()

const emit = defineEmits(['update:modelValue', 'save'])

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const equipmentStore = useEquipmentStore()
const factionStore = useFactionStore()
const armyStore = useArmyStore()
const showDetailsDialog = ref(false)
const selectedEquipmentForDetails = ref<Equipment | null>(null)
const showExplorationOnlyItems = ref(false)
const refreshing = ref(false)

// Add these variables for the debug panel
const reseedingFactions = ref(false)
const reseedingEquipment = ref(false)
const isAdmin = ref(false)

// Computed property to get unique equipment types
const equipmentTypes = computed(() => {
  const types = new Set(equipmentStore.equipment.map((item) => item.type))
  return Array.from(types)
})

// Add computed property to get army rules
const currentArmyRules = computed(() => armyStore.currentArmyRules)

// Filter equipment by type
const filteredEquipment = computed(() => {
  console.log('Filtering equipment by type:', props.filterType)

  // First step: filter items by type
  let typeFiltered: Equipment[]

  if (props.filterType === 'Other') {
    // For "Other", we want to show all items with category EQUIPMENT
    typeFiltered = equipmentStore.equipment.filter(
      (item: Equipment) => item.category === EquipmentCategory.EQUIPMENT,
    )
  } else if (props.filterType === 'Armour') {
    // For Armour, include ARMOUR, HEADGEAR, and SHIELD categories
    typeFiltered = equipmentStore.equipment.filter(
      (item: Equipment) =>
        item.category === EquipmentCategory.ARMOUR ||
        item.category === EquipmentCategory.HEADGEAR ||
        item.category === EquipmentCategory.SHIELD,
    )
  } else {
    // For other types, filter by the type
    typeFiltered = equipmentStore.equipment.filter(
      (item: Equipment) => item.type === props.filterType,
    )
  }

  // If we have compiled army rules, use them to filter the equipment
  if (currentArmyRules.value) {
    console.log('Using compiled army rules to filter equipment')

    // Filter by equipment costs defined in army rules
    const equipmentWithCosts = Object.keys(currentArmyRules.value.equipment.costs)

    // Filter by equipment that's not banned by global restrictions
    const bannedEquipment = currentArmyRules.value.equipment.globalRestrictions.bannedEquipmentIds
    const bannedKeywords = currentArmyRules.value.equipment.globalRestrictions.bannedKeywords
    const bannedCategories = currentArmyRules.value.equipment.globalRestrictions.bannedCategories

    // Apply all the filters from army rules
    return typeFiltered.filter((item) => {
      // Check if the equipment has a cost defined
      if (!equipmentWithCosts.includes(item.id)) {
        return false
      }

      // Check if it's banned by ID
      if (bannedEquipment.includes(item.id)) {
        return false
      }

      // Check if it has a banned keyword
      if (item.keywords && bannedKeywords.some((keyword) => item.keywords.includes(keyword))) {
        return false
      }

      // Check if it's in a banned category
      if (bannedCategories.includes(item.category)) {
        return false
      }

      // Check troop restrictions if we have a troop
      if (props.troop) {
        const restrictions = currentArmyRules.value?.equipment.troopRestrictions[item.id]
        if (restrictions) {
          // Use our utility function to check if it's allowed
          return isEquipmentAllowedForTroop(
            item,
            props.troop,
            props.faction || null,
            props.warbandVariant || null,
          )
        }
      }

      // Filter out exploration-only items unless checkbox is checked
      if (item.keywords?.includes('EXPLORATION_ONLY') && !showExplorationOnlyItems.value) {
        return false
      }

      return true
    })
  }

  // If no faction, just return the type-filtered items
  if (!props.faction) {
    return typeFiltered
  }

  // Temporary solution: If we have a troop but no faction, try to find the faction
  if (props.troop && props.troop.factionId && !props.faction) {
    const faction = factionStore.factions.find((f) => f.id === props.troop.factionId)
    if (faction) {
      return filterEquipmentWithFaction(typeFiltered, faction)
    }
  }

  // Normal case: we have a faction
  return filterEquipmentWithFaction(typeFiltered, props.faction)
})

// Helper function to filter equipment with a faction
function filterEquipmentWithFaction(items: Equipment[], faction: Faction) {
  console.log(`Filtering ${items.length} items with faction ${faction.name}`)

  // Get the list of equipment IDs that have costs defined for this faction
  const equipmentIdsWithCosts = faction.equipmentRules?.costs
    ? Object.keys(faction.equipmentRules.costs)
    : []

  console.log(`Equipment IDs with costs in faction ${faction.name}:`, equipmentIdsWithCosts)

  // First filter: equipment must have a cost defined
  const costFiltered = items.filter((item) => {
    const hasCost = equipmentIdsWithCosts.includes(item.id)
    if (!hasCost) {
      console.log(`- ${item.name} (${item.id}) has no cost defined in faction ${faction.name}`)
    }
    return hasCost
  })

  console.log(`After cost filter: ${costFiltered.length} items left`)

  // Filter out exploration-only items unless checkbox is checked
  const explorationFiltered = costFiltered.filter(
    (item) => !(item.keywords?.includes('EXPLORATION_ONLY') && !showExplorationOnlyItems.value),
  )

  console.log(`After exploration filter: ${explorationFiltered.length} items left`)

  // If we don't have a troop, just return the items filtered by cost and exploration
  if (!props.troop) {
    return explorationFiltered
  }

  // Final filter: equipment must be allowed for this troop
  return explorationFiltered.filter((item) => {
    console.log(
      `Checking if ${item.name} (${item.id}) is allowed for ${props.troop.name} (${props.troop.id})`,
    )

    // Check troop restrictions specifically for this item
    const troopRestrictions = faction.equipmentRules?.troopRestrictions?.[item.id]
    if (troopRestrictions) {
      console.log(`- This equipment has troop restrictions:`, troopRestrictions)
    }

    const isAllowed = isEquipmentAllowedForTroop(item, props.troop, faction, props.warbandVariant)
    console.log(`- Is allowed: ${isAllowed}`)
    return isAllowed
  })
}

// Track selected items
const selectedItems = ref<Equipment[]>([])

// Watch for dialog opening to set initial selection
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      // If we're editing an item, select it
      if (props.editingItem) {
        selectedItems.value = [props.editingItem]
      } else {
        // Clear selection when opening for new item
        selectedItems.value = []
      }
    }
  },
)

// Check if an item is selected
function isSelected(item: Equipment) {
  return selectedItems.value.some((selected) => selected.id === item.id)
}

// Select/deselect an item
function selectItem(item: Equipment) {
  const index = selectedItems.value.findIndex((selected) => selected.id === item.id)
  if (index === -1) {
    selectedItems.value = [item] // Only allow one item of each type
  } else {
    selectedItems.value = []
  }
}

// Format handedness for display
function formatHandedness(handedness: HandednessType | undefined): string {
  if (!handedness) return ''

  switch (handedness) {
    case HandednessType.ONE_HANDED:
      return '1-Hand'
    case HandednessType.TWO_HANDED:
      return '2-Hand'
    case HandednessType.NO_HANDS:
      return 'No Hands'
    case HandednessType.ONE_HAND_REQUIRED:
      return 'Requires Hand'
    default:
      return ''
  }
}

// Get the appropriate icon for the equipment type
function getEquipmentIcon(type: string) {
  switch (type) {
    case 'Melee Weapon':
      return 'mdi-sword'
    case 'Ranged Weapon':
      return 'mdi-pistol'
    case 'Armour':
      return 'mdi-shield'
    default:
      return 'mdi-toolbox'
  }
}

// Close the dialog
function closeDialog() {
  dialog.value = false
}

// Save the selection
function saveSelection() {
  emit('save', selectedItems.value)
  closeDialog()
}

// Function to show equipment details
function showEquipmentDetails(equipment: Equipment) {
  selectedEquipmentForDetails.value = equipment
  showDetailsDialog.value = true
}

// Function to close details dialog
function closeDetailsDialog() {
  showDetailsDialog.value = false
  selectedEquipmentForDetails.value = null
}

// Format equipment cost using faction and variant info
function formatEquipmentCostWithVariant(equipment: Equipment): string {
  if (!props.faction) return 'Not Available'

  const cost = getEquipmentCost(equipment, props.faction, props.warbandVariant)

  if (!cost) return 'Not Available'
  return formatCost(cost)
}

// Get equipment limit from faction rules
function getLimit(equipment: Equipment): number | null {
  if (!props.faction) return null
  return getEquipmentLimit(equipment, props.faction, props.warbandVariant)
}

// Check if equipment has a limit
function hasLimit(equipment: Equipment): boolean {
  const limit = getLimit(equipment)
  return limit !== null && limit > 0
}

// Add this function to force refresh equipment data
async function forceRefreshData() {
  refreshing.value = true
  try {
    console.log('Force refreshing data...')
    await factionStore.syncWithFirestore()
    await equipmentStore.fetchEquipment()
    console.log('Data refresh complete')
  } catch (error) {
    console.error('Error refreshing data:', error)
  } finally {
    refreshing.value = false
  }
}

// Functions for the debug panel
async function reseedFactionData() {
  reseedingFactions.value = true
  try {
    console.log('Force reseeding factions...')
    await factionStore.seedFactions(true)
    console.log('Faction reseed complete')
  } catch (error) {
    console.error('Error reseeding factions:', error)
  } finally {
    reseedingFactions.value = false
  }
}

async function reseedEquipmentData() {
  reseedingEquipment.value = true
  try {
    console.log('Force reseeding equipment...')
    // First fetch equipment to ensure store is initialized
    await equipmentStore.fetchEquipment()

    // Then reseed
    await equipmentStore.seedEquipment()

    // Finally fetch the new data
    await equipmentStore.fetchEquipment()
    console.log('Equipment reseed complete')
  } catch (error) {
    console.error('Error reseeding equipment:', error)
  } finally {
    reseedingEquipment.value = false
  }
}

// Function to check if user is admin
async function checkAdminStatus() {
  if (!auth.currentUser) return

  try {
    const db = getFirestore()
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
    isAdmin.value = userDoc.exists() && userDoc.data()?.admin === true
  } catch (error) {
    console.error('Error checking admin status:', error)
    isAdmin.value = false
  }
}

// Check admin status when component mounts
onMounted(async () => {
  await checkAdminStatus()
})
</script>

<style scoped>
.equipment-dialog {
  max-height: 90vh;
  overflow-y: auto;
}

.equipment-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.equipment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.equipment-card-selected {
  border: 2px solid rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.gap-1 {
  gap: 4px;
}
</style>
