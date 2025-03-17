<template>
  <v-app class="bg-background">
    <!-- App Bar -->
    <v-app-bar color="primary" density="default" class="tc-app-bar" elevation="1">
      <v-app-bar-title class="text-h6 font-weight-medium tc-logo-text">
        Crusade Companion
      </v-app-bar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-background">
      <v-container class="py-8">
        <h1 class="text-h4 font-weight-medium tc-heading mb-6">Troops</h1>

        <v-row>
          <v-col v-for="troop in troops" :key="troop.id" cols="12" md="6" lg="4">
            <TroopCard :troop="troop" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTroopStore } from '../stores/troopStore'
import TroopCard from '../components/TroopCard.vue'

const troopStore = useTroopStore()
const troops = computed(() => troopStore.troops)
</script>
