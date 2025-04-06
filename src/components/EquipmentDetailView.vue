<template>
  <v-card class="equipment-detail">
    <!-- Header -->
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2" :icon="getEquipmentIcon(equipment.type)" size="large"></v-icon>
      <span class="text-h5">{{ equipment.name }}</span>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-close" @click="closeDialog"></v-btn>
    </v-card-title>

    <v-divider class="my-4"></v-divider>

    <!-- Content -->
    <v-card-text>
      <!-- Type and Cost -->
      <div class="d-flex justify-space-between align-center mb-4">
        <v-chip color="primary" variant="outlined">
          {{ equipment.type }}
        </v-chip>
        <div class="text-h6">
          {{ getDisplayCost() }}
        </div>
      </div>

      <!-- Handedness -->
      <div v-if="equipment.handedness" class="mb-4">
        <div class="text-subtitle-2 font-weight-medium mb-2">Handedness</div>
        <v-chip color="info" variant="outlined">
          {{ formatHandedness(equipment.handedness) }}
        </v-chip>
      </div>

      <!-- Special and Limit indicators -->
      <div v-if="equipment.isSpecial || equipment.limit || equipment.explorationOnly" class="mb-4">
        <div class="text-subtitle-2 font-weight-medium mb-2">Special Rules</div>
        <div class="d-flex flex-wrap gap-2">
          <v-chip v-if="equipment.isSpecial" color="purple" variant="outlined">
            Special Equipment
          </v-chip>
          <v-chip v-if="equipment.limit" color="warning" variant="outlined">
            Limit: {{ equipment.limit }}
          </v-chip>
          <v-chip v-if="equipment.explorationOnly" color="error" variant="outlined">
            Exploration Only
          </v-chip>
        </div>
      </div>

      <!-- Description -->
      <div v-if="equipment.description" class="mb-4">
        <div class="text-subtitle-2 font-weight-medium mb-2">Description</div>
        <p class="text-body-1">{{ equipment.description }}</p>
      </div>

      <!-- Modifiers -->
      <div v-if="equipment.modifiers && equipment.modifiers.length > 0" class="mb-4">
        <div class="text-subtitle-2 font-weight-medium mb-2">Modifiers</div>
        <div class="d-flex flex-wrap gap-2">
          <v-chip
            v-for="(modifier, index) in equipment.modifiers"
            :key="index"
            color="primary"
            variant="outlined"
            size="small"
          >
            {{ modifier }}
          </v-chip>
        </div>
      </div>

      <!-- Keywords -->
      <div v-if="equipment.keywords && equipment.keywords.length > 0" class="mb-4">
        <div class="text-subtitle-2 font-weight-medium mb-2">Keywords</div>
        <div class="d-flex flex-wrap gap-2">
          <v-chip
            v-for="(keyword, index) in equipment.keywords"
            :key="index"
            color="secondary"
            variant="outlined"
            size="small"
          >
            {{ keyword }}
          </v-chip>
        </div>
      </div>

      <!-- Equipment Indicators -->
      <div class="mb-4">
        <div class="text-subtitle-2 font-weight-medium mb-2">Equipment Indicators</div>
        <div class="d-flex flex-wrap gap-1">
          <v-chip
            :color="equipment.equipmentIndicator?.hasBayonetLug ? 'success' : 'error'"
            variant="outlined"
            size="small"
            class="mr-1"
          >
            <v-icon
              :icon="
                equipment.equipmentIndicator?.hasBayonetLug
                  ? 'mdi-check-circle'
                  : 'mdi-close-circle'
              "
              class="mr-1"
              size="small"
            ></v-icon>
            Bayonet Lug
          </v-chip>
          <v-chip
            :color="equipment.equipmentIndicator?.shieldCombo ? 'success' : 'error'"
            variant="outlined"
            size="small"
          >
            <v-icon
              :icon="
                equipment.equipmentIndicator?.shieldCombo ? 'mdi-check-circle' : 'mdi-close-circle'
              "
              class="mr-1"
              size="small"
            ></v-icon>
            Shield Combo
          </v-chip>
        </div>
      </div>

      <!-- Rules -->
      <div v-if="equipment.rules && equipment.rules.length > 0" class="mb-4">
        <div class="text-subtitle-2 font-weight-medium mb-2">Rules</div>
        <ul class="rules-list">
          <li v-for="(rule, index) in equipment.rules" :key="index" class="mb-2">
            <v-icon icon="mdi-book-open-variant" color="primary" size="small" class="mr-2"></v-icon>
            {{ rule }}
          </li>
        </ul>
      </div>

      <!-- Costs Table -->
      <div v-if="shouldShowCostsTable()" class="mb-4">
        <div class="text-subtitle-2 font-weight-medium mb-2">Costs By Variant</div>
        <v-table density="compact">
          <thead>
            <tr>
              <th>Variant</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cost, variant) in equipment.costPerVariant" :key="variant">
              <td>{{ variant }}</td>
              <td>{{ formatCost(cost) }}</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Equipment } from '../models/equipment'
import { formatCost } from '../models/cost'
import { HandednessType } from '../models/equipment'
import { formatEquipmentCostWithFactionInfo, hasVariableCosts, getEquipmentCostForVariant } from '../utils/equipmentUtils'
import type { WarbandVariant } from '../models/warbandVariant'

const { equipment, variantName, warbandVariant } = defineProps<{
  equipment: Equipment,
  variantName?: string,
  warbandVariant?: WarbandVariant | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// Function to close the dialog
function closeDialog() {
  emit('close')
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

// Add the formatHandedness function
function formatHandedness(handedness: HandednessType | undefined): string {
  if (!handedness) return '';
  
  switch (handedness) {
    case HandednessType.ONE_HANDED:
      return 'One-Handed Weapon'
    case HandednessType.TWO_HANDED:
      return 'Two-Handed Weapon'
    case HandednessType.NO_HANDS:
      return 'Requires No Hands'
    case HandednessType.ONE_HAND_REQUIRED:
      return 'Requires One Hand'
    default:
      return ''
  }
}

// Add this to display the cost in the detail view
function getDisplayCost(): string {
  return formatEquipmentCostWithFactionInfo(equipment, variantName, formatCost, warbandVariant)
}

// Add this to check if we should display a costs table
function shouldShowCostsTable(): boolean {
  return hasVariableCosts(equipment) && Object.keys(equipment.costPerVariant).length > 1
}
</script>

<style scoped>
.equipment-detail {
  max-width: 800px;
  margin: 0 auto;
}

.rules-list {
  list-style-type: none;
  padding-left: 0;
}

.rules-list li {
  display: flex;
  align-items: flex-start;
  line-height: 1.5;
}
</style>
