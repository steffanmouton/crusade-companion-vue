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
        <h1 class="text-h4 font-weight-medium tc-heading mb-6">Factions</h1>

        <v-row>
          <v-col v-for="faction in factions" :key="faction.id" cols="12" md="6" lg="4">
            <FactionCard :faction="faction" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFactionStore } from '../stores/factionStore'
import FactionCard from '../components/FactionCard.vue'

const factionStore = useFactionStore()
const factions = computed(() => factionStore.factions)
</script>
