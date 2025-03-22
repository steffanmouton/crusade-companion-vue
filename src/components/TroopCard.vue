<template>
  <v-card
    class="faction-card tc-card"
    :class="{ 'has-header-image': troop.cardHeaderImageURI }"
    :style="headerImageStyle"
  >
    <v-card-title class="d-flex justify-space-between">
      <span class="tc-card-title">{{ troop.name }}</span>
      <span v-show="troop.countAllowed.length > 0" class="tc-card-limit"
        >Max: {{ maxUnits }} {{ troop.armyBuildingRules ? '(See Details)' : '' }}</span
      >
    </v-card-title>
    <v-card-subtitle class="d-flex justify-space-between">
      <span class="tc-card-subtitle">{{ troop.factionName }}</span>
    </v-card-subtitle>

    <v-card-text>
      <TroopStatsTable
        :movement="troop.stats.movement"
        :ranged="troop.stats.ranged"
        :melee="troop.stats.melee"
        :armor="troop.stats.armor"
      />
      <span class="tc-card-subtitle-small">Cost: {{ troop.costCurrency }} Ducats</span>
      <p class="text-body-3">{{ troop.description }}</p>
    </v-card-text>

    <v-card-actions v-show="hasDetails" @click="showDetails = !showDetails" class="card-actions">
      <v-btn color="#8b0000" text="Details"></v-btn>

      <v-spacer></v-spacer>

      <v-btn :icon="showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="showDetails">
        <v-divider></v-divider>
        <v-card-text>
          <p v-for="rule in troop.armyBuildingRules" :key="rule" class="text-body-2">
            {{ rule }}
          </p>

          <p class="text-body-3">{{ troop.equipmentDescription }}</p>

          <p v-for="item in troop.specialEquipment" :key="item">
            {{ item }}
          </p>
        </v-card-text>
      </div>
    </v-expand-transition>

    <v-card-actions
      v-show="hasAbilities"
      @click="showAbilities = !showAbilities"
      class="card-actions"
    >
      <v-btn color="#8b0000" text="Abilities"></v-btn>

      <v-spacer></v-spacer>

      <v-btn :icon="showAbilities ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="showAbilities">
        <v-divider></v-divider>
        <v-card-text>
          <div v-for="ability in troop.abilities" :key="ability" class="text-body-3 ability-item">
            <div v-if="ability.includes(':')">
              <h4 class="ability-name">{{ ability.split(':')[0].trim() }}</h4>
              <p>{{ ability.split(':')[1].trim() }}</p>
            </div>
            <p v-else>{{ ability }}</p>
          </div>
        </v-card-text>
      </div>
    </v-expand-transition>

    <v-chip-group class="mt-2 pa-4">
      <v-chip
        v-for="keyword in troop.keywords"
        :key="keyword"
        size="small"
        color="primary"
        variant="outlined"
      >
        {{ keyword }}
      </v-chip>
    </v-chip-group>
  </v-card>
</template>

<script setup lang="ts">
import type { Troop } from '../models/troop'
import TroopStatsTable from './TroopStatsTable.vue'
import { ref, computed } from 'vue'

const props = defineProps<{
  troop: Troop
}>()

const hasDetails = computed(() => {
  return (
    props.troop.equipmentDescription ||
    props.troop.specialEquipment ||
    props.troop.armyBuildingRules
  )
})

const hasAbilities = computed(() => {
  return props.troop.abilities.length > 0
})

const headerImageStyle = computed(() => {
  if (props.troop.cardHeaderImageURI) {
    return {
      '--header-image-url': `url(${props.troop.cardHeaderImageURI})`,
    }
  }
  return {
    '--header-image-url': 'none',
  }
})

const showDetails = ref(false)
const showAbilities = ref(false)
const maxUnits = computed(() => Math.max(...props.troop.countAllowed))
</script>

<style scoped>
.faction-card {
  max-width: 400px;
  position: relative;
}

/* Softer, more subtle outline for title */
.has-header-image .tc-card-title {
  text-shadow:
    -1px -1px 0.5px rgba(255, 255, 255, 0.85),
    1px -1px 0.5px rgba(255, 255, 255, 0.85),
    -1px 1px 0.5px rgba(255, 255, 255, 0.85),
    1px 1px 0.5px rgba(255, 255, 255, 0.85),
    0 0 1px rgba(255, 255, 255, 0.7);
  position: relative;
  z-index: 3;
}

/* Softer, more subtle outline for other header text */
.has-header-image .tc-card-subtitle,
.has-header-image .tc-card-limit,
.has-header-image .tc-card-subtitle-small {
  text-shadow:
    -0.5px -0.5px 0.5px rgba(255, 255, 255, 0.85),
    0.5px -0.5px 0.5px rgba(255, 255, 255, 0.85),
    -0.5px 0.5px 0.5px rgba(255, 255, 255, 0.85),
    0.5px 0.5px 0.5px rgba(255, 255, 255, 0.85);
  position: relative;
  z-index: 3;
}

.has-header-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  background-image: var(--header-image-url);
  background-position: top;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.5;
  pointer-events: none; /* Allow clicks to pass through */
  z-index: 1;
}

/* Ensure content appears above the background image */
.faction-card > * {
  position: relative;
  z-index: 2;
}

.ability-divider {
  margin: 5px 0;
}

.ability-name {
  font-weight: bold;
  color: #8b0000;
  margin-bottom: 4px;
}

.ability-item {
  margin-bottom: 10px;
}

.card-actions {
  cursor: pointer;
  background-color: #ec88880d;
  border-radius: 10px;
  margin: 10px;
}
</style>
