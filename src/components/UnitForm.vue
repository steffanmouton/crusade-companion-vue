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
              <div class="text-caption">{{ troop.factionName }}</div>
            </div>
            <div class="text-subtitle-1 font-weight-medium">
              {{ formatCost(troop.cost) }}
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
        <h3 class="text-subtitle-1 font-weight-medium mb-2">Equipment</h3>

        <!-- Equipment table -->
        <v-table v-if="unitData.currentEquipment.length > 0" class="mb-3" density="compact">
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Type</th>
              <th class="text-right">Cost</th>
              <th class="text-center" width="60">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(equipment, index) in unitData.currentEquipment" :key="index">
              <td>{{ equipment.name }}</td>
              <td class="text-caption">{{ equipment.type }}</td>
              <td class="text-right">{{ equipment.cost ? formatCost(equipment.cost) : '-' }}</td>
              <td class="text-center">
                <v-btn
                  icon="mdi-delete"
                  size="x-small"
                  variant="text"
                  color="error"
                  @click="removeEquipment(index)"
                  density="comfortable"
                ></v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>

        <div v-else class="text-center py-4 mb-3 bg-grey-lighten-5 rounded">
          <v-icon
            icon="mdi-alert-circle-outline"
            color="grey-lighten-1"
            size="large"
            class="mb-2"
          ></v-icon>
          <div class="text-body-2 text-grey">No equipment added yet</div>
        </div>

        <!-- Add equipment section -->
        <div class="d-flex align-center mb-4">
          <v-select
            v-model="selectedEquipment"
            :items="availableEquipment"
            item-title="name"
            item-value="id"
            return-object
            label="Add equipment"
            variant="outlined"
            class="flex-grow-1 mr-2"
            :hint="selectedEquipment?.cost ? 'Cost: ' + formatCost(selectedEquipment.cost) : ''"
            persistent-hint
          >
            <template v-slot:item="{ item, props }">
              <v-list-item
                v-bind="props"
                :subtitle="item?.raw?.cost ? 'Cost: ' + formatCost(item.raw.cost) : ''"
              ></v-list-item>
            </template>
          </v-select>
          <v-btn
            color="primary"
            variant="flat"
            min-width="36"
            width="36"
            height="56"
            :disabled="!selectedEquipment"
            @click="addEquipment"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>

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
const selectedEquipment = ref<Equipment | null>(null)
const availableEquipment = ref<Equipment[]>([])
const equipmentStore = useEquipmentStore()
const unitStore = useUnitStore()
const error = ref<string | null>(null)

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
function addEquipment() {
  if (selectedEquipment.value) {
    unitData.currentEquipment.push(selectedEquipment.value)
    selectedEquipment.value = null
  }
}

function removeEquipment(index: number) {
  unitData.currentEquipment.splice(index, 1)
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
    unitData.currentEquipment = [...props.troop.defaultEquipment]
  }
})

// Load available equipment for this troop
async function loadAvailableEquipment() {
  // Ensure equipment is loaded first
  if (equipmentStore.equipment.length === 0) {
    await equipmentStore.initializeEquipment()
  }

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
</style>
