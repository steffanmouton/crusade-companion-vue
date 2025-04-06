<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">{{ equipment?.name }}</span>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <v-row>
          <!-- Equipment Details -->
          <v-col cols="12" md="8">
            <div class="mb-4">
              <h3 class="text-h6 mb-2">Description</h3>
              <p class="text-body-1">{{ equipment?.description }}</p>
            </div>

            <div v-if="equipment?.rules && equipment.rules.length > 0" class="mb-4">
              <h3 class="text-h6 mb-2">Rules</h3>
              <ul class="rules-list">
                <li v-for="(rule, index) in equipment.rules" :key="index" class="mb-2">
                  <v-icon
                    icon="mdi-book-open-variant"
                    color="primary"
                    size="small"
                    class="mr-2"
                  ></v-icon>
                  {{ rule }}
                </li>
              </ul>
            </div>

            <div v-if="equipment?.modifiers && equipment.modifiers.length > 0" class="mb-4">
              <h3 class="text-h6 mb-2">Modifiers</h3>
              <div class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="(modifier, index) in equipment.modifiers"
                  :key="index"
                  size="small"
                  color="primary"
                  variant="outlined"
                >
                  {{ modifier }}
                </v-chip>
              </div>
            </div>

            <div v-if="equipment?.keywords && equipment.keywords.length > 0" class="mb-4">
              <h3 class="text-h6 mb-2">Keywords</h3>
              <div class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="(keyword, index) in equipment.keywords"
                  :key="index"
                  size="small"
                  color="secondary"
                  variant="outlined"
                >
                  {{ keyword }}
                </v-chip>
              </div>
            </div>
          </v-col>

          <!-- Cost and Actions -->
          <v-col cols="12" md="4">
            <v-card variant="outlined" class="mb-4">
              <v-card-text>
                <div class="text-center">
                  <v-icon size="large" color="primary" class="mb-2">
                    {{ getEquipmentIcon(equipment?.type) }}
                  </v-icon>
                  <div class="text-h5 mb-2">
                    {{ formatEquipmentCostWithVariant(equipment) }}
                  </div>
                  <div class="text-caption text-medium-emphasis">Cost</div>
                </div>
              </v-card-text>
            </v-card>

            <v-card v-if="getLimit(equipment)" variant="outlined" class="mb-4">
              <v-card-text>
                <div class="text-center">
                  <v-icon size="large" color="warning" class="mb-2">
                    mdi-counter
                  </v-icon>
                  <div class="text-h5 mb-2">
                    Limit: {{ getLimit(equipment) }}
                  </div>
                  <div class="text-caption text-medium-emphasis">Maximum allowed per warband</div>
                </div>
              </v-card-text>
            </v-card>

            <v-card variant="outlined">
              <v-card-text>
                <div class="text-center">
                  <v-btn
                    color="primary"
                    variant="flat"
                    block
                    class="mb-2"
                    @click="addToUnit"
                    :disabled="isAlreadyAdded"
                  >
                    {{ isAlreadyAdded ? 'Already Added' : 'Add to Unit' }}
                  </v-btn>
                  <v-btn variant="text" block @click="closeDialog">Cancel</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Equipment } from '../models/equipment'
import type { WarbandVariant } from '../models/warbandVariant'
import type { Faction } from '../models/faction'
import { formatCost } from '../models/cost'
import { getEquipmentCost, getEquipmentLimit } from '../utils/equipmentUtils'

const props = defineProps<{
  modelValue: boolean
  equipment: Equipment | null
  selectedEquipment: Equipment[]
  variantName?: string
  warbandVariant?: WarbandVariant | null
  faction?: Faction | null
}>()

const emit = defineEmits(['update:modelValue', 'add'])

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Check if the equipment is already added to the unit
const isAlreadyAdded = computed(() => {
  if (!props.equipment) return false
  return props.selectedEquipment.some((item) => item.id === props.equipment?.id)
})

// Get the appropriate icon for the equipment type
function getEquipmentIcon(type?: string) {
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

// Add the equipment to the unit
function addToUnit() {
  if (props.equipment) {
    emit('add', props.equipment)
    closeDialog()
  }
}

// Format equipment cost using faction info
function formatEquipmentCostWithVariant(equipment: Equipment | null): string {
  if (!equipment || !props.faction) return 'FREE'
  
  const cost = getEquipmentCost(
    equipment,
    props.faction,
    props.warbandVariant
  );
  
  if (!cost) return 'Not Available';
  return formatCost(cost);
}

// Get equipment limit from faction rules
function getLimit(equipment: Equipment | null): number | null {
  if (!equipment || !props.faction) return null;
  return getEquipmentLimit(equipment, props.faction, props.warbandVariant);
}

// Check if we should display variant costs section
function hasVariantCosts(equipment: Equipment | null): boolean {
  // This could be enhanced to actually check different variants of the same faction
  return false; // Simplified for now, as we're moving away from this model
}
</script>

<style scoped>
.rules-list {
  list-style-type: none;
  padding-left: 0;
}

.rules-list li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
}
</style>
