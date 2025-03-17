<template>
  <v-card class="faction-card tc-card">
    <v-card-title class="d-flex align-center">
      <FactionIcon :faction="faction" :size="32" class="mr-2" />
      <span class="tc-heading">{{ faction.name }}</span>
    </v-card-title>

    <v-card-text>
      <p class="text-body-2">{{ faction.description }}</p>

      <v-chip-group class="mt-2">
        <v-chip
          v-for="type in faction.troopTypes"
          :key="type"
          size="small"
          color="primary"
          variant="outlined"
        >
          {{ type }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Faction } from '../models/faction'
import FactionIcon from './FactionIcon.vue'

defineProps<{
  faction: Faction
}>()
</script>

<style scoped>
.faction-card {
  max-width: 400px;
}
</style>
