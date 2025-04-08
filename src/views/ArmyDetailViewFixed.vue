<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>Crusade Companion</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container v-if="isLoading">
        <v-progress-circular indeterminate />
      </v-container>

      <v-container v-else-if="army">
        <v-card>
          <v-card-title>
            <v-btn @click="goBack" prepend-icon="mdi-arrow-left">Back</v-btn>
          </v-card-title>

          <v-card-text>
            <h1>{{ army.name }}</h1>
            <div>Faction: {{ army.faction }}</div>
            <div>Points: {{ army.currentPoints }} / {{ army.targetPoints }}</div>

            <h2 class="mt-4">Units</h2>
            <v-btn @click="openAddUnitDialog" prepend-icon="mdi-plus">Add Unit</v-btn>

            <div v-if="units.length > 0" class="mt-2">
              <div v-for="unit in units" :key="unit.id" class="pa-2 mb-2 border rounded">
                <div>{{ unit.name }} ({{ getTroopName(unit.troopId) }})</div>
                <div>Cost: {{ unit.costPoints }} points</div>
              </div>
            </div>
            <div v-else>No units found</div>

            <v-switch v-model="showQuickRef" label="Quick Reference Mode"></v-switch>

            <div v-if="showQuickRef && units.length > 0">
              <h2>Quick Reference</h2>
              <QuickReferenceView :units="convertedUnits" :army="army" />
            </div>
          </v-card-text>
        </v-card>
      </v-container>

      <v-container v-else>
        <v-alert type="error">Army not found.</v-alert>
        <v-btn @click="goBack">Back to Dashboard</v-btn>
      </v-container>
    </v-main>

    <!-- Dialogs -->
    <TroopSelectionDialog
      v-model="showTroopSelectionDialog"
      :factionName="army?.faction || ''"
      :armyId="armyId"
      @unit-added="handleUnitAdded"
    />
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useArmyStore } from '../stores/army'
import { useUnitStore } from '../stores/unitStore'
import { useTroopStore } from '../stores/troopStore'
import TroopSelectionDialog from '../components/TroopSelectionDialog.vue'
import QuickReferenceView from '../components/QuickReferenceView.vue'
import type { Unit } from '../models/unit'

const router = useRouter()
const route = useRoute()
const armyStore = useArmyStore()
const unitStore = useUnitStore()
const troopStore = useTroopStore()

const isLoading = ref(true)
const showQuickRef = ref(false)
const showTroopSelectionDialog = ref(false)

const armyId = computed(() => route.params.id as string)
const army = computed(() => armyStore.currentArmy)
const units = computed(() => unitStore.units)

function goBack() {
  router.push('/dashboard')
}

function openAddUnitDialog() {
  showTroopSelectionDialog.value = true
}

function handleUnitAdded() {
  // Refresh units
  unitStore.loadUnitsByArmyId(armyId.value)
}

// Get the name of a troop from its ID
function getTroopName(troopId: string): string {
  const troop = troopStore.troops.find(t => t.id === troopId)
  return troop ? troop.name : 'Unknown'
}

// Convert Firebase units to application Unit model
function convertUnits(firebaseUnits: any[]): Unit[] {
  return firebaseUnits.map(fbUnit => {
    const unit: Unit = {
      id: fbUnit.id,
      name: fbUnit.name,
      troopId: fbUnit.troopId || '',
      costPoints: fbUnit.costPoints || 0,
      costCurrency: fbUnit.costCurrency || 0,
      currentEquipment: fbUnit.currentEquipment || [],
      purchasedAbilities: fbUnit.purchasedAbilities || [],
      isMercenary: false
    }

    // Add optional properties
    if (fbUnit.imageUrl) unit.imageUrl = fbUnit.imageUrl

    return unit
  })
}

// Create a computed property that converts the units
const convertedUnits = computed(() => convertUnits(unitStore.units))

onMounted(async () => {
  isLoading.value = true

  try {
    // Load troop data
    await troopStore.initializeTroops()

    // Load army data
    await armyStore.loadArmy(armyId.value)

    // Load units
    await unitStore.loadUnitsByArmyId(armyId.value)
  } catch (error) {
    console.error('Error loading army data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
