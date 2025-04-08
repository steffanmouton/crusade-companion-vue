<template>
  <div>
    <h1>Army Detail</h1>
    <pre>{{ $route.params }}</pre>
    <button @click="goBack">Back</button>

    <div v-if="army">
      <h2>Army Data</h2>
      <div>
        <strong>Name:</strong> {{ army.name }}<br>
        <strong>Faction:</strong> {{ army.faction }}<br>
        <strong>Points:</strong> {{ army.currentPoints }}/{{ army.targetPoints }}<br>
        <strong>Currency:</strong> {{ army.currency }}<br>
        <strong>Battles:</strong> {{ army.battles }} (W: {{ army.wins }}, L: {{ army.losses }})<br>
        <strong>Warband Variant:</strong> {{ army.warbandVariantId || 'None' }}<br>
      </div>

      <h2>Army Rules</h2>
      <div v-if="armyRules">
        <pre>{{ JSON.stringify(armyRules, null, 2) }}</pre>
      </div>
      <div v-else>
        No army rules available
      </div>

      <h2>Units</h2>
      <div v-if="units.length > 0">
        <div v-for="unit in units" :key="unit.id">
          <strong>{{ unit.name }}</strong> ({{ unit.troopId }})
          <div>Cost: {{ unit.costPoints }} points</div>
          <div v-if="unit.currentEquipment && unit.currentEquipment.length > 0">
            <strong>Equipment:</strong>
            <ul>
              <li v-for="(item, index) in unit.currentEquipment" :key="index">
                {{ item.name }} ({{ item.type }})
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else>
        No units found
      </div>

      <!-- Only try QuickReferenceView if we have all the data needed -->
      <template v-if="armyRules && adaptedArmy && units.length > 0">
        <h2>Quick Reference Test</h2>
        <QuickReferenceView :units="convertedUnits" :army="adaptedArmy" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useArmyStore } from '../stores/army'
import { useUnitStore } from '../stores/unitStore'
import QuickReferenceView from '../components/QuickReferenceView.vue'
import type { Unit } from '../models/unit'

const router = useRouter()
const armyStore = useArmyStore()
const unitStore = useUnitStore()

const army = ref<any>(null)
const units = ref<any[]>([])
const convertedUnits = ref<Unit[]>([])

// Get the army rules from the store
const armyRules = computed(() => armyStore.currentArmyRules)

// Build an adapted army object that matches what QuickReferenceView expects
const adaptedArmy = computed(() => {
  if (!army.value) return null

  return {
    ...army.value,
    // Add any properties QuickReferenceView expects
  }
})

function goBack() {
  router.push('/dashboard')
}

// Convert Firebase Units to application Units
function convertUnits(firebaseUnits: any[]): Unit[] {
  return firebaseUnits.map((fbUnit) => {
    const unit: Unit = {
      id: fbUnit.id,
      name: fbUnit.name,
      troopId: fbUnit.troopId || '',
      costPoints: fbUnit.costPoints,
      costCurrency: fbUnit.costCurrency || 0,
      currentEquipment: fbUnit.currentEquipment || [],
      purchasedAbilities: fbUnit.purchasedAbilities || [],
      isMercenary: false
    }

    // Add any optional properties
    if (fbUnit.imageUrl) unit.imageUrl = fbUnit.imageUrl

    return unit
  })
}

onMounted(async () => {
  // Get army ID from route
  const armyId = router.currentRoute.value.params.id as string

  if (armyId) {
    try {
      // Load army data
      await armyStore.loadArmy(armyId)
      army.value = armyStore.currentArmy

      // Load units
      await unitStore.loadUnitsByArmyId(armyId)
      units.value = unitStore.units

      // Convert units for QuickReferenceView
      convertedUnits.value = convertUnits(units.value)

      console.log("ArmyRules:", armyRules.value)
    } catch (error) {
      console.error('Error loading army data:', error)
    }
  }
})
</script>
