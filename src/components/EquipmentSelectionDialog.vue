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
          <v-col cols="12">
            <v-checkbox
              v-model="showExplorationOnlyItems"
              label="Show Exploration-Only Items"
              hide-details
              density="compact"
            ></v-checkbox>
          </v-col>
        </v-row>

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
                    <v-chip v-if="item.handedness" size="small" color="info" variant="outlined">
                      {{ formatHandedness(item.handedness) }}
                    </v-chip>
                    <v-chip v-if="item.isSpecial" size="small" color="purple" variant="outlined">
                      Special
                    </v-chip>
                    <v-chip v-if="hasLimit(item)" size="small" color="warning" variant="outlined">
                      Limit: {{ getLimit(item) }}
                    </v-chip>
                    <v-chip v-if="item.explorationOnly" size="small" color="error" variant="outlined">
                      Exploration Only
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
import EquipmentDetailView from './EquipmentDetailView.vue'
import { HandednessType } from '../models/equipment'
import { 
  formatEquipmentCost,
  getEquipmentCost,
  getEquipmentLimit,
  isEquipmentAllowedForTroop
} from '../utils/equipmentUtils'
import { useFactionStore } from '../stores/factionStore'

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
const showDetailsDialog = ref(false)
const selectedEquipmentForDetails = ref<Equipment | null>(null)

// Add state for the checkbox
const showExplorationOnlyItems = ref(false)

// Filter equipment by type
const filteredEquipment = computed(() => {
  return equipmentStore.equipment.filter((item) => {
    // Filter by type
    if (item.type !== props.filterType) return false
    
    // Filter out exploration-only items unless checkbox is checked
    if (item.explorationOnly && !showExplorationOnlyItems.value) return false
    
    // Check if available based on faction rules
    if (props.faction) {
      const cost = getEquipmentCost(item, props.faction, props.warbandVariant);
      if (!cost) return false;
      
      // If troop is provided, check if equipment is allowed for this troop
      if (props.troop && !isEquipmentAllowedForTroop(item, props.troop, props.faction, props.warbandVariant)) {
        return false;
      }
      
      return true;
    }
    
    // Fall back to simple type check if no faction provided
    return true;
  })
})

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
  if (!handedness) return '';
  
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
  if (!props.faction) return 'Not Available';
  
  const cost = getEquipmentCost(
    equipment,
    props.faction,
    props.warbandVariant
  );
  
  if (!cost) return 'Not Available';
  return formatCost(cost);
}

// Get equipment limit from faction rules
function getLimit(equipment: Equipment): number | null {
  if (!props.faction) return null;
  return getEquipmentLimit(equipment, props.faction, props.warbandVariant);
}

// Check if equipment has a limit
function hasLimit(equipment: Equipment): boolean {
  const limit = getLimit(equipment);
  return limit !== null && limit > 0;
}
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
