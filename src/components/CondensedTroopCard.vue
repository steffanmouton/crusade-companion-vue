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
          <h3 class="text-subtitle-1 font-weight-medium mb-0">{{ troop.name }}</h3>
          <span class="cost-text">{{ formatCost(troop.cost) }}</span>
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

defineProps<{
  troop: Troop
}>()

defineEmits(['add-troop', 'view-details'])
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
