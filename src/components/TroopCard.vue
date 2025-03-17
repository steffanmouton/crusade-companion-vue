<template>
  <v-card class="faction-card tc-card">
    <v-card-title class="d-flex align-center">
      <span class="tc-heading">{{ troop.name }}</span>
      <v-spacer></v-spacer>
      <span class="tc-subheading">{{ troop.factionName }}</span>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="6">
          <span class="tc-subheading">Movement</span>
          <span class="tc-heading">{{ troop.stats.movement }}</span>
        </v-col>
        <v-col cols="6">
          <span class="tc-subheading">Ranged</span>
          <span class="tc-heading">{{ troop.stats.ranged }}</span>
        </v-col>
        <v-col cols="6">
          <span class="tc-subheading">Melee</span>
          <span class="tc-heading">{{ troop.stats.melee }}</span>
        </v-col>
        <v-col cols="6">
          <span class="tc-subheading">Armor</span>
          <span class="tc-heading">{{ troop.stats.armor }}</span>
        </v-col>
        <v-col cols="6">
          <span class="tc-subheading">Size</span>
          <span class="tc-heading">{{ troop.stats.baseSize }}</span>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text>
      <p class="text-body-3">{{ troop.description }}</p>

      <p class="text-body-3">{{ troop.equipmentDescription }}</p>

      <p v-for="item in troop.specialEquipment" :key="item">
        {{ item }}
      </p>

      <v-chip-group class="mt-2">
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
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Troop } from '../models/troop'

defineProps<{
  troop: Troop
}>()
</script>

<style scoped>
.faction-card {
  max-width: 400px;
}
</style>
