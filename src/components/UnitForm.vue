<template>
  <v-card class="unit-form-card">
    <v-card-title class="d-flex justify-space-between align-center pb-2">
      <span>{{ isEditing ? 'Edit Unit' : 'Add Unit' }}</span>
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text>
      <v-form ref="form" @submit.prevent="saveUnit">
        <!-- Troop information (non-editable) -->
        <div class="mb-4 py-2 px-4 bg-grey-lighten-4 rounded">
          <div class="d-flex justify-space-between">
            <div>
              <div class="text-subtitle-1 font-weight-medium">{{ troop.name }}</div>
              <div class="text-caption font-weight-medium">{{ troop.factionName }}</div>
              <div class="text-caption">
                {{ formatCost(troop.cost) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Unit name -->
        <v-text-field
          v-model="unitData.name"
          label="Unit Name"
          hint="Give this unit a custom name (optional)"
          persistent-hint
          variant="outlined"
          class="mb-4"
        ></v-text-field>

        <!-- Equipment section -->
        <div class="mb-4">
          <div class="d-flex justify-space-between align-center mb-2">
            <h3 class="text-subtitle-1 font-weight-medium">Equipment</h3>
          </div>

          <!-- Equipment categories -->
          <v-row>
            <!-- Melee Weapons -->
            <v-col cols="12">
              <div class="mb-2">
                <div class="d-flex align-center mb-2">
                  <v-icon class="mr-2">mdi-sword</v-icon>
                  <span class="text-subtitle-2 font-weight-medium">Melee Weapons</span>
                </div>
                <div class="equipment-list">
                  <v-card
                    v-for="item in getEquipmentOfType('Melee Weapon')"
                    :key="item.id"
                    class="equipment-slot equipment-slot-filled mb-2"
                    @click="editEquipment(item)"
                  >
                    <v-card-text class="d-flex align-center justify-space-between pa-4">
                      <div>
                        <div class="text-subtitle-2">{{ item.name }}</div>
                        <div class="text-caption text-medium-emphasis">
                          {{ formatEquipmentCost(item) }}
                        </div>
                      </div>
                      <v-btn
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        color="error"
                        @click="removeEquipment(item)"
                      ></v-btn>
                    </v-card-text>
                  </v-card>
                  <v-card class="equipment-slot" @click="openEquipmentSelection('Melee Weapon')">
                    <v-card-text class="text-center pa-4">
                      <v-icon size="large" color="grey-lighten-1">mdi-plus</v-icon>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </v-col>

            <!-- Ranged Weapons -->
            <v-col cols="12">
              <div class="mb-2">
                <div class="d-flex align-center mb-2">
                  <v-icon class="mr-2">mdi-pistol</v-icon>
                  <span class="text-subtitle-2 font-weight-medium">Ranged Weapons</span>
                </div>
                <div class="equipment-list">
                  <v-card
                    v-for="item in getEquipmentOfType('Ranged Weapon')"
                    :key="item.id"
                    class="equipment-slot equipment-slot-filled mb-2"
                    @click="editEquipment(item)"
                  >
                    <v-card-text class="d-flex align-center justify-space-between pa-4">
                      <div>
                        <div class="text-subtitle-2">{{ item.name }}</div>
                        <div class="text-caption text-medium-emphasis">
                          {{ formatEquipmentCost(item) }}
                        </div>
                      </div>
                      <v-btn
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        color="error"
                        @click="removeEquipment(item)"
                      ></v-btn>
                    </v-card-text>
                  </v-card>
                  <v-card class="equipment-slot" @click="openEquipmentSelection('Ranged Weapon')">
                    <v-card-text class="text-center pa-4">
                      <v-icon size="large" color="grey-lighten-1">mdi-plus</v-icon>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </v-col>

            <!-- Armor -->
            <v-col cols="12">
              <div class="mb-2">
                <div class="d-flex align-center mb-2">
                  <v-icon class="mr-2">mdi-shield</v-icon>
                  <span class="text-subtitle-2 font-weight-medium">Armor</span>
                </div>
                <div class="equipment-list">
                  <v-card
                    v-for="item in getEquipmentOfType('Armour')"
                    :key="item.id"
                    class="equipment-slot equipment-slot-filled mb-2"
                    @click="editEquipment(item)"
                  >
                    <v-card-text class="d-flex align-center justify-space-between pa-4">
                      <div>
                        <div class="text-subtitle-2">{{ item.name }}</div>
                        <div class="text-caption text-medium-emphasis">
                          {{ formatEquipmentCost(item) }}
                        </div>
                      </div>
                      <v-btn
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        color="error"
                        @click="removeEquipment(item)"
                      ></v-btn>
                    </v-card-text>
                  </v-card>
                  <v-card class="equipment-slot" @click="openEquipmentSelection('Armour')">
                    <v-card-text class="text-center pa-4">
                      <v-icon size="large" color="grey-lighten-1">mdi-plus</v-icon>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </v-col>

            <!-- Other Equipment -->
            <v-col cols="12">
              <div class="mb-2">
                <div class="d-flex align-center mb-2">
                  <v-icon class="mr-2">mdi-toolbox</v-icon>
                  <span class="text-subtitle-2 font-weight-medium">Other Equipment</span>
                </div>
                <div class="equipment-list">
                  <v-card
                    v-for="item in getEquipmentOfType('Other')"
                    :key="item.id"
                    class="equipment-slot equipment-slot-filled mb-2"
                    @click="editEquipment(item)"
                  >
                    <v-card-text class="d-flex align-center justify-space-between pa-4">
                      <div>
                        <div class="text-subtitle-2">{{ item.name }}</div>
                        <div class="text-caption text-medium-emphasis">
                          {{ formatEquipmentCost(item) }}
                        </div>
                      </div>
                      <v-btn
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        color="error"
                        @click="removeEquipment(item)"
                      ></v-btn>
                    </v-card-text>
                  </v-card>
                  <v-card class="equipment-slot" @click="openEquipmentSelection('Other')">
                    <v-card-text class="text-center pa-4">
                      <v-icon size="large" color="grey-lighten-1">mdi-plus</v-icon>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Equipment Selection Dialog -->
        <EquipmentSelectionDialog
          v-model="showEquipmentSelectionDialog"
          :selectedEquipment="unitData.currentEquipment"
          :filterType="selectedEquipmentType"
          :editingItem="selectedEquipmentForEdit"
          @save="handleEquipmentSelection"
        />

        <!-- Equipment Detail Dialog -->
        <EquipmentDetailDialog
          v-model="showEquipmentDetailDialog"
          :equipment="selectedEquipmentItem"
          :selectedEquipment="unitData.currentEquipment"
          @add="addEquipment"
        />

        <!-- Cost summary -->
        <v-card class="cost-summary mb-4" elevation="0" variant="outlined">
          <v-list density="compact">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-currency-usd" color="primary" class="mr-2"></v-icon>
              </template>
              <v-list-item-title class="text-body-1">Base troop cost</v-list-item-title>
              <v-list-item-subtitle class="text-right font-weight-medium">
                {{ formatCost(troop.cost) }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-sword" color="primary" class="mr-2"></v-icon>
              </template>
              <v-list-item-title class="text-body-1">Equipment cost</v-list-item-title>
              <v-list-item-subtitle class="text-right font-weight-medium">
                {{ formatCost(equipmentCost) }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider class="my-2"></v-divider>

            <v-list-item class="bg-grey-lighten-5">
              <template v-slot:prepend>
                <v-icon icon="mdi-cash" color="success" class="mr-2"></v-icon>
              </template>
              <v-list-item-title class="text-body-1 font-weight-bold">Total cost</v-list-item-title>
              <v-list-item-subtitle class="text-right font-weight-bold">
                {{ formatCost(totalCost) }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Form actions -->
        <div class="d-flex justify-end">
          <v-btn variant="outlined" color="primary" class="mr-2" @click="$emit('close')">
            Cancel
          </v-btn>
          <v-btn color="primary" type="submit" :loading="saving"> Save Unit </v-btn>
        </div>

        <!-- At the end of the form after buttons, add the loading indicator -->
        <div class="mt-4">
          <LoadingIndicator :loading="saving" :error="error || ''" text="Saving unit..." />
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import type { Troop } from '../models/troop'
import type { Equipment } from '../models/equipment'
import type { Unit } from '../models/unit'
import { formatCost, CurrencyType, getCostForCurrency } from '../models/cost'
import { v4 as uuidv4 } from 'uuid'
import { useEquipmentStore } from '../stores/equipmentStore'
import { useUnitStore } from '../stores/unitStore'
import LoadingIndicator from './LoadingIndicator.vue'
import EquipmentSelectionDialog from './EquipmentSelectionDialog.vue'
import EquipmentDetailDialog from './EquipmentDetailDialog.vue'

// Props
const props = defineProps<{
  troop: Troop
  unit?: Unit
  armyId: string
}>()

// Emits
const emit = defineEmits(['save', 'close'])

// State
const form = ref()
const saving = ref(false)
const availableEquipment = ref<Equipment[]>([])
const equipmentStore = useEquipmentStore()
const unitStore = useUnitStore()
const error = ref<string | null>(null)

// Add state for equipment dialogs
const showEquipmentSelectionDialog = ref(false)
const showEquipmentDetailDialog = ref(false)
const selectedEquipmentItem = ref<Equipment | null>(null)
const selectedEquipmentType = ref<string>('')
const selectedEquipmentForEdit = ref<Equipment | null>(null)

// Computed
const isEditing = computed(() => !!props.unit)

// Create reactive unit data
const unitData = reactive<{
  id: string
  name: string
  troopId: string
  costPoints: number
  costCurrency: number
  currentEquipment: Equipment[]
  purchasedAbilities: string[]
}>({
  id: props.unit?.id || uuidv4(),
  name: props.unit?.name || props.troop.name,
  troopId: props.troop.id,
  costPoints: props.unit?.costPoints || 0,
  costCurrency: props.unit?.costCurrency || 0,
  currentEquipment: props.unit?.currentEquipment || [],
  purchasedAbilities: props.unit?.purchasedAbilities || [],
})

// Calculate equipment cost
const equipmentCost = computed(() => {
  return unitData.currentEquipment.reduce(
    (total, equipment) => {
      // Skip cost calculation for default equipment items by name
      if (
        props.troop.defaultEquipment?.some(
          (name) => name.toLowerCase() === equipment.name.toLowerCase(),
        )
      ) {
        return total
      }

      if (equipment.cost) {
        return {
          currencies: [
            {
              type: CurrencyType.DUCATS,
              amount:
                getCostForCurrency(equipment.cost, CurrencyType.DUCATS) +
                getCostForCurrency(total, CurrencyType.DUCATS),
            },
            {
              type: CurrencyType.GLORY_POINTS,
              amount:
                getCostForCurrency(equipment.cost, CurrencyType.GLORY_POINTS) +
                getCostForCurrency(total, CurrencyType.GLORY_POINTS),
            },
          ],
        }
      }
      return total
    },
    {
      currencies: [
        { type: CurrencyType.DUCATS, amount: 0 },
        { type: CurrencyType.GLORY_POINTS, amount: 0 },
      ],
    },
  )
})

// Calculate total cost
const totalCost = computed(() => {
  if (!props.troop.cost) {
    return equipmentCost.value
  }

  return {
    currencies: [
      {
        type: CurrencyType.DUCATS,
        amount:
          getCostForCurrency(props.troop.cost, CurrencyType.DUCATS) +
          getCostForCurrency(equipmentCost.value, CurrencyType.DUCATS),
      },
      {
        type: CurrencyType.GLORY_POINTS,
        amount:
          getCostForCurrency(props.troop.cost, CurrencyType.GLORY_POINTS) +
          getCostForCurrency(equipmentCost.value, CurrencyType.GLORY_POINTS),
      },
    ],
  }
})

// Methods
function addEquipment(equipment: Equipment) {
  if (!unitData.currentEquipment.some((item) => item.id === equipment.id)) {
    unitData.currentEquipment.push(equipment)
  }
  showEquipmentDetailDialog.value = false
  selectedEquipmentItem.value = null
}

function handleEquipmentSelection(items: Equipment[]) {
  if (selectedEquipmentForEdit.value) {
    // Replace the edited item
    const index = unitData.currentEquipment.findIndex(
      (item) => item.id === selectedEquipmentForEdit.value?.id,
    )
    if (index !== -1) {
      unitData.currentEquipment.splice(index, 1)
    }
  }
  // Add the new items
  unitData.currentEquipment.push(...items)
  selectedEquipmentForEdit.value = null
  showEquipmentSelectionDialog.value = false
}

async function saveUnit() {
  saving.value = true
  error.value = null

  try {
    // Update cost values from calculated totals
    const ducatsCost = getCostForCurrency(totalCost.value, CurrencyType.DUCATS)
    const gloryCost = getCostForCurrency(totalCost.value, CurrencyType.GLORY_POINTS)

    console.log('Cost calculation:', {
      totalCost: totalCost.value,
      ducatsCost,
      gloryCost,
      baseCost: props.troop.cost ? getCostForCurrency(props.troop.cost, CurrencyType.DUCATS) : 0,
      equipmentCost: getCostForCurrency(equipmentCost.value, CurrencyType.DUCATS),
    })

    unitData.costPoints = ducatsCost
    unitData.costCurrency = gloryCost

    // Create a new unit object to save to Firestore
    const unitToSave = {
      name: unitData.name || props.troop.name, // Default to troop name if empty
      troopId: props.troop.id,
      troopName: props.troop.name,
      armyId: props.armyId,
      costPoints: unitData.costPoints,
      costCurrency: unitData.costCurrency,
      currentEquipment: [...unitData.currentEquipment],
      purchasedAbilities: [...unitData.purchasedAbilities],
      type: props.troop.type,
      power: 0, // Initialize to 0, can be updated later
      points: 0,
      experience: 0,
      rank: 'Recruit', // Default rank
      battles: 0,
      kills: 0,
      notes: '',
    }

    let result: any

    // If this is an edit, update the existing document
    if (props.unit?.id) {
      await unitStore.updateUnit(props.unit.id, unitToSave)
      result = {
        id: props.unit.id,
        ...unitToSave,
      }
    } else {
      // This is a new unit, create a new document
      result = await unitStore.addUnit(unitToSave)
    }

    // Emit the save event with the unit data
    emit('save', result)
  } catch (err: any) {
    console.error('Error saving unit:', err)
    error.value = err.message || 'Failed to save unit'
  } finally {
    saving.value = false
  }
}

// Load equipment and default equipment on mount
onMounted(async () => {
  // Load available equipment from the equipment store
  await loadAvailableEquipment()

  // If editing existing unit, don't add default equipment
  if (isEditing.value) {
    return
  }

  // Add default equipment for new units
  if (props.troop.defaultEquipment && props.troop.defaultEquipment.length > 0) {
    console.log('Adding default equipment:', props.troop.defaultEquipment)

    // Ensure equipment store is loaded
    if (equipmentStore.equipment.length === 0) {
      console.log('Equipment store not loaded, initializing...')
      await equipmentStore.initializeEquipment()
    }

    // Find the equipment objects that match the names in defaultEquipment
    const defaultEquipmentItems = []

    for (const equipName of props.troop.defaultEquipment) {
      // Find equipment by name (case-insensitive comparison)
      const item = equipmentStore.equipment.find(
        (item) => item.name.toLowerCase() === equipName.toLowerCase(),
      )

      if (item) {
        console.log(`Found equipment item for "${equipName}":`, item)
        defaultEquipmentItems.push(item)
      } else {
        console.warn(`Default equipment item with name "${equipName}" not found in equipment store`)
      }
    }

    console.log('Found default equipment items:', defaultEquipmentItems)

    if (defaultEquipmentItems.length > 0) {
      unitData.currentEquipment = [...defaultEquipmentItems]
    }
  }
})

// Load available equipment for this troop
async function loadAvailableEquipment() {
  // Ensure equipment is loaded first
  if (equipmentStore.equipment.length === 0) {
    console.log('Initializing equipment store in loadAvailableEquipment')
    await equipmentStore.initializeEquipment()
  }

  console.log('Equipment store items:', equipmentStore.equipment.length)

  if (props.troop.keywords) {
    // Get equipment that's available for this troop based on its ID and keywords
    availableEquipment.value = equipmentStore.getEquipmentForTroop(
      props.troop.id,
      props.troop.keywords,
    )
  } else {
    // Fallback to all equipment if needed
    availableEquipment.value = equipmentStore.equipment
  }
}

// Watch for troop changes to reload available equipment
watch(() => props.troop, loadAvailableEquipment)

function getEquipmentOfType(type: string) {
  return unitData.currentEquipment.filter((item) => item.type === type)
}

// Add this helper function to handle cost formatting
function formatEquipmentCost(equipment: Equipment | undefined) {
  if (!equipment?.cost) return 'FREE'
  return formatCost(equipment.cost)
}

function removeEquipment(equipment: Equipment) {
  const index = unitData.currentEquipment.findIndex((item) => item.id === equipment.id)
  if (index !== -1) {
    unitData.currentEquipment.splice(index, 1)
  }
}

// Add this function to handle opening the equipment selection dialog
function openEquipmentSelection(type: string) {
  selectedEquipmentForEdit.value = null
  selectedEquipmentType.value = type
  showEquipmentSelectionDialog.value = true
}

// Add the editEquipment function
function editEquipment(item: Equipment) {
  selectedEquipmentForEdit.value = item
  selectedEquipmentType.value = item.type
  showEquipmentSelectionDialog.value = true
}
</script>

<style scoped>
.unit-form-card {
  max-width: 800px;
  margin: 0 auto;
}

.cost-summary {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  overflow: hidden;
}

.text-right {
  text-align: right !important;
}

/* Make the equipment table rounded */
:deep(.v-table) {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

:deep(.v-table > .v-table__wrapper > table > thead > tr > th) {
  background-color: rgba(0, 0, 0, 0.02);
  font-weight: 600;
}

.original-cost {
  text-decoration: line-through;
  color: rgba(0, 0, 0, 0.4);
  font-size: 0.8em;
  margin-left: 4px;
}

.free-label {
  color: #2e7d32;
  font-weight: 500;
}

.equipment-slot {
  height: 100%;
  min-height: 80px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: rgba(0, 0, 0, 0.02);
  border: 2px dashed rgba(0, 0, 0, 0.12);
}

.equipment-slot:hover {
  background-color: rgba(0, 0, 0, 0.05);
  border-color: rgba(var(--v-theme-primary), 0.5);
}

.equipment-slot-filled {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.equipment-slot-filled:hover {
  border-color: rgba(var(--v-theme-primary), 0.5);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.equipment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
