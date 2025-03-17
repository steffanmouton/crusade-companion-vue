<template>
  <v-card class="faction-card tc-card">
    <v-card-title class="d-flex justify-space-between">
      <span class="tc-card-title">{{ troop.name }}</span>
      <span v-show="troop.countAllowed.length > 0" class="tc-card-limit"
        >Max: {{ maxUnits }} {{ troop.armyBuildingRules ? '(See Details)' : '' }}</span
      >
    </v-card-title>
    <v-card-subtitle class="d-flex justify-space-between">
      <span class="tc-card-subtitle">{{ troop.factionName }}</span>
      <span class="tc-card-subtitle-small">{{ troop.costCurrency }} Ducats</span>
    </v-card-subtitle>

    <v-card-text>
      <TroopStatsTable
        :movement="troop.stats.movement"
        :ranged="troop.stats.ranged"
        :melee="troop.stats.melee"
        :armor="troop.stats.armor"
      />
      <p class="text-body-3">{{ troop.description }}</p>
    </v-card-text>

    <v-card-actions v-show="hasDetails">
      <v-btn color="#8b0000" text="Details"></v-btn>

      <v-spacer></v-spacer>

      <v-btn
        :icon="showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="showDetails = !showDetails"
      ></v-btn>
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

const showDetails = ref(false)
const maxUnits = computed(() => Math.max(...props.troop.countAllowed))
</script>

<style scoped>
.faction-card {
  max-width: 400px;
}
</style>
