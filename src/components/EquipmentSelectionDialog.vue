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
                  <div class="mt-2">
                    <v-chip size="small" color="primary" variant="outlined">
                      {{ item.cost ? formatCost(item.cost) : 'FREE' }}
                    </v-chip>
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
import { formatCost } from '../models/cost'
import { useEquipmentStore } from '../stores/equipmentStore'
import EquipmentDetailView from './EquipmentDetailView.vue'

const props = defineProps<{
  modelValue: boolean
  selectedEquipment: Equipment[]
  filterType: string
  editingItem: Equipment | null
}>()

const emit = defineEmits(['update:modelValue', 'save'])

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const equipmentStore = useEquipmentStore()
const showDetailsDialog = ref(false)
const selectedEquipmentForDetails = ref<Equipment | null>(null)

// Filter equipment by type
const filteredEquipment = computed(() =>
  equipmentStore.equipment.filter((item) => item.type === props.filterType),
)

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
</style>
