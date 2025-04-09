<template>
  <v-card class="faction-card tc-card">
    <v-card-title class="d-flex align-center">
      <FactionIcon :faction="faction" :size="32" class="mr-2" />
      <span class="tc-heading" :style="titleStyle">{{ faction.name }}</span>
    </v-card-title>

    <v-card-text>
      <p class="text-body-2">{{ faction.description }}</p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Faction } from '../models/faction'
import FactionIcon from './FactionIcon.vue'
import { computed } from 'vue'

const props = defineProps<{
  faction: Faction
}>()

const titleStyle = computed(() => {
  const name = props.faction.name
  if (name.length <= 20) {
    return { fontSize: '1rem' } // Default size
  } else {
    return { fontSize: '0.9rem' }
  }
})
</script>

<style scoped>
.faction-card {
  max-width: 400px;
}
</style>
