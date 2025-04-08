<template>
  <v-card
    class="condensed-troop-card mb-2"
    :class="{ 'has-header-image': troop.cardHeaderImageURI }"
  >
    <div class="d-flex">
      <!-- Left side with image or placeholder -->
      <div class="troop-image-container">
        <v-img
          v-if="troop.cardHeaderImageURI"
          :src="troop.cardHeaderImageURI"
          height="80"
          width="100"
          cover
          class="grey lighten-2"
        ></v-img>
        <div v-else class="placeholder-image d-flex align-center justify-center">
          <v-icon>mdi-shield-outline</v-icon>
        </div>
      </div>

      <!-- Middle with troop info -->
      <div class="px-3 py-2 troop-info flex-grow-1">
        <div class="d-flex justify-space-between">
          <div class="d-flex align-center">
            <h3 class="text-subtitle-1 font-weight-medium mb-0">{{ troop.name }}</h3>
            <v-chip v-if="isRequired" color="error" size="small" class="ml-2" variant="flat">
              Required
            </v-chip>
          </div>
          <span class="cost-text">{{ formattedCost }}</span>
        </div>
        <div class="text-caption text-grey">{{ troop.factionName }}</div>

        <div class="d-flex stats-container mt-2">
          <span class="stat-item">
            <v-icon size="x-small" class="mr-1">mdi-run</v-icon>{{ troop.stats.movement }}
          </span>
          <span class="stat-item">
            <v-icon size="x-small" class="mr-1">mdi-target</v-icon>{{ troop.stats.ranged }}
          </span>
          <span class="stat-item">
            <v-icon size="x-small" class="mr-1">mdi-sword</v-icon>{{ troop.stats.melee }}
          </span>
          <span class="stat-item">
            <v-icon size="x-small" class="mr-1">mdi-shield</v-icon>{{ troop.stats.armor }}
          </span>
        </div>
      </div>

      <!-- Right side with actions -->
      <div class="d-flex flex-column card-actions">
        <v-btn
          color="primary"
          variant="flat"
          size="small"
          @click="$emit('add-troop', troop)"
          class="flex-grow-1"
        >
          Add
        </v-btn>
        <v-btn
          variant="text"
          size="small"
          @click="$emit('view-details', troop)"
          class="flex-grow-1"
        >
          Details
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { Troop } from '../models/troop'
import { formatCost } from '../models/cost'
import { useFactionStore } from '../stores/factionStore'
import { getTroopCost, getTroopCostFromArmyRules } from '../utils/equipmentUtils'
import { computed } from 'vue'
import { useArmyStore } from '../stores/army'

const props = defineProps<{
  troop: Troop
  isRequired?: boolean
  warbandVariant?: any
}>()

defineEmits(['add-troop', 'view-details'])

// Get the faction store
const factionStore = useFactionStore()
const armyStore = useArmyStore()

// First try to get the cost from ArmyRules
const troopCostFromRules = computed(() => {
  // If we have ArmyRules in the store, use it
  if (armyStore.currentArmyRules) {
    console.log(`Checking cost for troop ${props.troop.name} (${props.troop.id}) in ArmyRules`)
    const cost = getTroopCostFromArmyRules(props.troop.id, armyStore.currentArmyRules)
    if (cost) {
      console.log(`Found cost in ArmyRules: ${JSON.stringify(cost)}`)
      return cost
    }
    console.log(`No cost found in ArmyRules for troop ${props.troop.id}`)
  } else {
    console.log(`No ArmyRules available for troop ${props.troop.id}`)
  }
  return null
})

// Get the faction for this troop (fallback approach)
const faction = computed(() => {
  return props.troop?.factionId
    ? factionStore.factions.find(f => f.id === props.troop.factionId)
    : null
})

// Get the cost using the original method as fallback
const troopCostFallback = computed(() => {
  if (!faction.value) return null
  return getTroopCost(props.troop.id, faction.value, props.warbandVariant)
})

// Format the troop cost for display, preferring the ArmyRules cost if available
const formattedCost = computed(() => {
  // First try the cost from ArmyRules
  if (troopCostFromRules.value) {
    return formatCost(troopCostFromRules.value)
  }

  // Then fallback to the traditional cost
  return troopCostFallback.value ? formatCost(troopCostFallback.value) : 'FREE'
})
</script>

<style scoped>
.condensed-troop-card {
  overflow: hidden;
  width: 100%;
}

.troop-image-container {
  width: 100px;
  min-width: 100px;
  height: 80px;
  background-color: #f5f5f5;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
}

.troop-info {
  min-width: 0;
}

.stats-container {
  gap: 12px;
}

.stat-item {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
}

.card-actions {
  min-width: 90px;
  border-left: 1px solid rgba(0, 0, 0, 0.12);
}

.cost-text {
  font-weight: bold;
  color: #8b0000;
}
</style>
