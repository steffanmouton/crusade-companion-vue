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
                {{ troopCost ? formatCost(troopCost) : 'FREE' }}
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

          <!-- Equipment validation warnings -->
          <v-alert
            v-if="validationResult && validationResult.warnings.length > 0"
            type="warning"
            variant="tonal"
            class="mb-3"
            density="compact"
          >
            <div class="text-subtitle-2 mb-1">Equipment Warnings:</div>
            <ul class="pl-4 mb-0">
              <li v-for="(warning, index) in validationResult.warnings" :key="index" class="text-caption">
                {{ warning.message }}
                <div v-if="warning.details" class="text-caption text-grey">
                  {{ warning.details }}
                </div>
              </li>
            </ul>
          </v-alert>

          <!-- Equipment validation errors -->
          <v-alert
            v-if="validationResult && validationResult.errors.length > 0"
            type="error"
            variant="tonal"
            class="mb-3"
            density="compact"
          >
            <div class="text-subtitle-2 mb-1">Equipment Errors:</div>
            <ul class="pl-4 mb-0">
              <li v-for="(error, index) in validationResult.errors" :key="index" class="text-caption">
                {{ error.message }}
                <div v-if="error.details" class="text-caption text-grey">
                  {{ error.details }}
                </div>
              </li>
            </ul>
          </v-alert>

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
                    :class="{'has-warning': hasWarning(item), 'has-error': hasError(item)}"
                    @click="editEquipment(item)"
                  >
                    <v-card-text class="d-flex align-center justify-space-between pa-4">
                      <div>
                        <div class="text-subtitle-2">{{ item.name }}</div>
                        <div class="d-flex align-center">
                          <div class="text-caption text-medium-emphasis mr-2">
                            {{ formatEquipmentCost(item) }}
                          </div>
                          <v-chip v-if="item.handedness" size="x-small" color="info" class="mr-1">
                            {{ formatHandedness(item.handedness) }}
                          </v-chip>
                          <v-chip v-if="item.isSpecial" size="x-small" color="purple" class="mr-1">
                            Special
                          </v-chip>
                          <v-chip v-if="item.explorationOnly" size="x-small" color="error" class="mr-1">
                            Exploration Only
                          </v-chip>
                        </div>
                      </div>
                      <v-btn
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        color="error"
                        @click.stop="removeEquipment(item)"
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
                    :class="{'has-warning': hasWarning(item), 'has-error': hasError(item)}"
                    @click="editEquipment(item)"
                  >
                    <v-card-text class="d-flex align-center justify-space-between pa-4">
                      <div>
                        <div class="text-subtitle-2">{{ item.name }}</div>
                        <div class="d-flex align-center">
                          <div class="text-caption text-medium-emphasis mr-2">
                            {{ formatEquipmentCost(item) }}
                          </div>
                          <v-chip v-if="item.handedness" size="x-small" color="info" class="mr-1">
                            {{ formatHandedness(item.handedness) }}
                          </v-chip>
                          <v-chip v-if="item.isSpecial" size="x-small" color="purple" class="mr-1">
                            Special
                          </v-chip>
                          <v-chip v-if="item.explorationOnly" size="x-small" color="error" class="mr-1">
                            Exploration Only
                          </v-chip>
                        </div>
                      </div>
                      <v-btn
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        color="error"
                        @click.stop="removeEquipment(item)"
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
                    :class="{'has-warning': hasWarning(item), 'has-error': hasError(item)}"
                    @click="editEquipment(item)"
                  >
                    <v-card-text class="d-flex align-center justify-space-between pa-4">
                      <div>
                        <div class="text-subtitle-2">{{ item.name }}</div>
                        <div class="d-flex align-center">
                          <div class="text-caption text-medium-emphasis mr-2">
                            {{ formatEquipmentCost(item) }}
                          </div>
                          <v-chip v-if="item.handedness" size="x-small" color="info" class="mr-1">
                            {{ formatHandedness(item.handedness) }}
                          </v-chip>
                          <v-chip v-if="item.isSpecial" size="x-small" color="purple" class="mr-1">
                            Special
                          </v-chip>
                          <v-chip v-if="item.explorationOnly" size="x-small" color="error" class="mr-1">
                            Exploration Only
                          </v-chip>
                        </div>
                      </div>
                      <v-btn
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        color="error"
                        @click.stop="removeEquipment(item)"
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
                    :class="{'has-warning': hasWarning(item), 'has-error': hasError(item)}"
                    @click="editEquipment(item)"
                  >
                    <v-card-text class="d-flex align-center justify-space-between pa-4">
                      <div>
                        <div class="text-subtitle-2">{{ item.name }}</div>
                        <div class="d-flex align-center">
                          <div class="text-caption text-medium-emphasis mr-2">
                            {{ formatEquipmentCost(item) }}
                          </div>
                          <v-chip v-if="item.handedness" size="x-small" color="info" class="mr-1">
                            {{ formatHandedness(item.handedness) }}
                          </v-chip>
                          <v-chip v-if="item.isSpecial" size="x-small" color="purple" class="mr-1">
                            Special
                          </v-chip>
                          <v-chip v-if="item.explorationOnly" size="x-small" color="error" class="mr-1">
                            Exploration Only
                          </v-chip>
                        </div>
                      </div>
                      <v-btn
                        icon="mdi-delete"
                        size="small"
                        variant="text"
                        color="error"
                        @click.stop="removeEquipment(item)"
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
          :variantName="getVariantName(props.troop)"
          :warbandVariant="currentWarbandVariant"
          :faction="currentFaction"
          :troop="props.troop"
          @save="handleEquipmentSelection"
        />

        <!-- Equipment Detail Dialog -->
        <EquipmentDetailDialog
          v-model="showEquipmentDetailDialog"
          :equipment="selectedEquipmentItem"
          :selectedEquipment="unitData.currentEquipment"
          :variantName="getVariantName(props.troop)"
          :warbandVariant="currentWarbandVariant"
          :faction="currentFaction"
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
                {{ troopCost ? formatCost(troopCost) : 'FREE' }}
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
import { HandednessType } from '../models/equipment'
import { validateEquipment, type ValidationResult } from '../utils/equipmentValidator'
import { useFactionStore } from '../stores/factionStore'
import { 
  getEquipmentCost, 
  formatEquipmentCost as formatEquipmentCostUtil, 
  getTroopCost 
} from '../utils/equipmentUtils'
import type { WarbandVariant } from '../models/warbandVariant'
import { useWarbandVariantStore } from '../stores/warbandVariantStore'
import { useArmyStore } from '../stores/army'

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
const armyStore = useArmyStore()
const warbandVariantStore = useWarbandVariantStore()
const error = ref<string | null>(null)

// Add state for equipment dialogs
const showEquipmentSelectionDialog = ref(false)
const showEquipmentDetailDialog = ref(false)
const selectedEquipmentItem = ref<Equipment | null>(null)
const selectedEquipmentType = ref<string>('')
const selectedEquipmentForEdit = ref<Equipment | null>(null)

// Add state for warband variant
const currentWarbandVariant = ref<WarbandVariant | null>(null)

// Computed
const isEditing = computed(() => !!props.unit)

// Add a new computed property to get faction
const faction = computed(() => {
  return props.troop?.factionId 
    ? factionStore.factions.find(f => f.id === props.troop.factionId.toString())
    : null
})

// Add a new computed property that handles the type checking properly
const currentFaction = computed(() => {
  return faction.value || null
})

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

// Create a new computed property for troopCost
const troopCost = computed(() => {
  if (!faction.value) return null
  return getTroopCost(props.troop.id, faction.value, currentWarbandVariant.value)
})

// Update equipment cost calculation to use faction rules
const equipmentCost = computed(() => {
  if (!faction.value) return {
    currencies: [
      { type: CurrencyType.DUCATS, amount: 0 },
      { type: CurrencyType.GLORY_POINTS, amount: 0 },
    ],
  }
  
  // Get the variant name from the troop
  const variantName = getVariantName(props.troop)
  
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

      // Get the equipment cost using faction rules
      const cost = getEquipmentCost(equipment, faction.value!, currentWarbandVariant.value)
      
      if (cost) {
        return {
          currencies: [
            {
              type: CurrencyType.DUCATS,
              amount:
                getCostForCurrency(cost, CurrencyType.DUCATS) +
                getCostForCurrency(total, CurrencyType.DUCATS),
            },
            {
              type: CurrencyType.GLORY_POINTS,
              amount:
                getCostForCurrency(cost, CurrencyType.GLORY_POINTS) +
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

// Update total cost computation to use troopCost
const totalCost = computed(() => {
  if (!troopCost.value) {
    return equipmentCost.value
  }

  return {
    currencies: [
      {
        type: CurrencyType.DUCATS,
        amount:
          getCostForCurrency(troopCost.value, CurrencyType.DUCATS) +
          getCostForCurrency(equipmentCost.value, CurrencyType.DUCATS),
      },
      {
        type: CurrencyType.GLORY_POINTS,
        amount:
          getCostForCurrency(troopCost.value, CurrencyType.GLORY_POINTS) +
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
    // Remove the old item
    const index = unitData.currentEquipment.findIndex(
      (item) => item.id === selectedEquipmentForEdit.value?.id
    )
    if (index !== -1) {
      unitData.currentEquipment.splice(index, 1)
    }
  }

  // Add the selected items
  unitData.currentEquipment.push(...items)
  
  // Run validation
  validateCurrentEquipment()
}

async function saveUnit() {
  // Validate one more time
  validateCurrentEquipment()
  
  // If there are errors, ask for confirmation before saving
  if (validationResult.value && validationResult.value.errors.length > 0) {
    const confirmSave = confirm('There are equipment validation errors. Do you want to save anyway?')
    if (!confirmSave) {
      return
    }
  }

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
      baseCost: troopCost.value ? getCostForCurrency(troopCost.value, CurrencyType.DUCATS) : 0,
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
  try {
    await equipmentStore.fetchEquipment()

    // Set default name based on troop type if new unit
    if (!isEditing.value && props.troop) {
      unitData.name = `${props.troop.name} #${uuidv4().substring(0, 4)}`
    }

    // Load associated army and warband variant if available
    if (props.armyId) {
      // Get army data
      const army = await armyStore.loadArmy(props.armyId)
      
      // Load warband variant if the army has one
      if (army && army.warbandVariantId) {
        await warbandVariantStore.fetchWarbandVariants()
        
        const variant = warbandVariantStore.warbandVariants.find(v => v.id === army.warbandVariantId)
        if (variant) {
          currentWarbandVariant.value = variant
        }
      }
    }

    // Now that everything's loaded, get available equipment
    await loadAvailableEquipment()

    // Run validation
    validateCurrentEquipment()
  } catch (err) {
    console.error('Error initializing unit form:', err)
    error.value = 'Failed to load equipment data'
  }
})

// Load available equipment for this troop
async function loadAvailableEquipment() {
  // Ensure equipment is loaded first
  if (equipmentStore.equipment.length === 0) {
    console.log('Initializing equipment store in loadAvailableEquipment')
    await equipmentStore.fetchEquipment()
  }

  console.log('Equipment store items:', equipmentStore.equipment.length)

  try {
    // Get the army to find the faction
    const army = await armyStore.loadArmy(props.armyId)
    if (!army) {
      console.error('Could not load army')
      return
    }

    // Get equipment available for the troop based on faction rules
    let troopEquipment = equipmentStore.getEquipmentForTroop(
      props.troop.id,
      props.troop.keywords || []
    )
    
    // Filter by warband variant if applicable
    if (currentWarbandVariant.value) {
      // Check if there are warband-specific overrides
      const variantOverrides = currentWarbandVariant.value.troopSpecificOverrides?.[props.troop.id]
      if (variantOverrides?.allowedEquipmentTypes) {
        // Filter by allowed equipment types in the variant
        troopEquipment = troopEquipment.filter(item => 
          variantOverrides.allowedEquipmentTypes?.includes(item.type))
      }
    }
    
    availableEquipment.value = troopEquipment
  } catch (err) {
    console.error('Error loading available equipment:', err)
    availableEquipment.value = []
  }
}

// Watch for troop changes to reload available equipment
watch(() => props.troop, loadAvailableEquipment)

function getEquipmentOfType(type: string) {
  return unitData.currentEquipment.filter((item) => item.type === type)
}

// Replace formatEquipmentCost function
function formatEquipmentCost(equipment: Equipment | undefined) {
  if (!equipment || !faction.value) return 'FREE'
  
  // Format the equipment cost using the utility function
  return formatEquipmentCostUtil(
    equipment,
    faction.value,
    formatCost,
    currentWarbandVariant.value
  )
}

function removeEquipment(equipment: Equipment) {
  const index = unitData.currentEquipment.findIndex((item) => item.id === equipment.id)
  if (index !== -1) {
    unitData.currentEquipment.splice(index, 1)
    // Run validation
    validateCurrentEquipment()
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

// Add these lines to your component's script
const factionStore = useFactionStore()
const validationResult = ref<ValidationResult | null>(null)

// Add this function to format handedness for display
function formatHandedness(handedness: HandednessType): string {
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

// Add these functions to check for warnings and errors on specific items
function hasWarning(item: Equipment): boolean {
  if (!validationResult.value) return false
  return validationResult.value.warnings.some(w => 
    w.details?.includes(item.name) || w.message.includes(item.name)
  )
}

function hasError(item: Equipment): boolean {
  if (!validationResult.value) return false
  return validationResult.value.errors.some(e => 
    e.details?.includes(item.name) || e.message.includes(item.name)
  )
}

// Add a function to validate the current equipment
function validateCurrentEquipment() {
  // Run the validation - no warbandVariantId passed to avoid errors
  validationResult.value = validateEquipment(
    unitData.currentEquipment, 
    faction.value || null, // Ensure we pass null instead of undefined
    props.troop,
    currentWarbandVariant.value // Pass the whole variant object
  )
}

// Run initial validation on mount and when equipment changes
onMounted(() => {
  setTimeout(() => {
    validateCurrentEquipment()
  }, 500) // Short delay to allow for default equipment to be loaded
})

// Watch for changes to equipment and revalidate
watch(() => unitData.currentEquipment.length, () => {
  validateCurrentEquipment()
})

// Add a helper function to get the variant name
function getVariantName(troop?: Troop): string {
  if (troop?.warbandVariant) {
    return troop.warbandVariant
  }
  return 'No Variant'
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

.has-warning {
  border: 1px solid orange !important;
}

.has-error {
  border: 1px solid red !important;
}
</style>
