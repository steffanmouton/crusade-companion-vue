<template>
  <div class="quick-reference-container">
    <div class="quick-reference-header">
      <h2 class="army-name">
        {{ army.name }} - {{ typeof army.faction === 'string' ? army.faction : army.faction.name }}
      </h2>

      <v-btn
        color="primary"
        variant="outlined"
        prepend-icon="mdi-printer"
        size="small"
        @click="printToPdf"
        class="print-btn"
      >
        Print to PDF
      </v-btn>
    </div>

    <div class="unit-list">
      <div v-if="troopsLoading" class="loading-container">
        <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
        <div class="loading-text">Loading troop data...</div>
      </div>

      <div v-else-if="troopStore.troops.length === 0" class="error-container">
        <v-alert
          type="warning"
          title="Data Missing"
          text="Troop data could not be loaded."
          class="w-100 mb-4"
        ></v-alert>
        <v-btn color="primary" @click="reloadTroops" :loading="reloading">
          Reload Troop Data
        </v-btn>
      </div>

      <div v-else v-for="unit in units" :key="unit.id" class="unit-quick-card">
        <div class="unit-header">
          <h3 class="unit-name">{{ unit.name }}</h3>
          <div class="troop-name">{{ getTroopName(unit.troopId) }}</div>
        </div>

        <div class="unit-stats">
          <TroopStatsTable
            v-if="getTroop(unit.troopId)"
            :movement="getTroop(unit.troopId)?.stats.movement || 0"
            :ranged="getTroop(unit.troopId)?.stats.ranged || 0"
            :melee="getTroop(unit.troopId)?.stats.melee || 0"
            :armor="getTroop(unit.troopId)?.stats.armor || 0"
          />
        </div>

        <div class="unit-equipment">
          <h4 class="section-title">Equipment</h4>
          <ul class="equipment-list">
            <li v-for="(item, index) in unit.currentEquipment" :key="index" class="equipment-item">
              <div class="equipment-name">
                <v-icon size="small" class="mr-1">{{ getEquipmentIcon(item.type) }}</v-icon>
                {{ item.name }}
              </div>

              <div v-if="item.modifiers && item.modifiers.length > 0" class="equipment-modifiers">
                {{ item.modifiers.join(', ') }}
              </div>

              <div v-if="item.rules && item.rules.length > 0" class="equipment-rules">
                <div v-for="(rule, ruleIndex) in item.rules" :key="ruleIndex" class="rule-text">
                  {{ rule }}
                </div>
              </div>
            </li>
            <li v-if="unit.currentEquipment.length === 0" class="no-equipment">No equipment</li>
          </ul>
        </div>

        <!-- Special Equipment -->
        <div v-if="getTroop(unit.troopId)?.specialEquipment?.length" class="unit-special-equipment">
          <h4 class="section-title">Special Equipment</h4>
          <ul class="special-equipment-list">
            <li
              v-for="(item, index) in getTroop(unit.troopId)?.specialEquipment ?? []"
              :key="index"
              class="special-equipment-item"
            >
              <div class="equipment-name">
                <v-icon size="small" class="mr-1">{{ getEquipmentIcon(item.type) }}</v-icon>
                <strong>{{ item.name }}</strong>
              </div>
              <div class="equipment-description">
                {{ item.description }}
              </div>
            </li>
          </ul>
        </div>

        <!-- Troop Abilities -->
        <div v-if="getTroop(unit.troopId)?.abilities?.length" class="unit-abilities">
          <ul class="abilities-list no-title">
            <li
              v-for="(ability, index) in getTroop(unit.troopId)?.abilities ?? []"
              :key="index"
              class="ability-item"
            >
              <div v-if="ability.includes(':')">
                <div class="ability-name">{{ ability.split(':')[0].trim() }}</div>
                <div class="ability-description">{{ ability.split(':')[1].trim() }}</div>
              </div>
              <div v-else class="ability-description">
                {{ ability }}
              </div>
            </li>
          </ul>
        </div>

        <!-- Keywords -->
        <div v-if="getTroop(unit.troopId)?.keywords?.length" class="unit-keywords">
          <div class="keywords-container">
            <v-chip
              v-for="(keyword, index) in getTroop(unit.troopId)?.keywords ?? []"
              :key="index"
              size="small"
              color="primary"
              variant="outlined"
              class="keyword-chip"
            >
              {{ keyword }}
            </v-chip>
          </div>
        </div>

        <div
          v-if="unit.purchasedAbilities && unit.purchasedAbilities.length > 0"
          class="unit-purchased-abilities"
        >
          <h4 class="section-title">Purchased Abilities</h4>
          <ul class="abilities-list">
            <li
              v-for="(ability, index) in unit.purchasedAbilities"
              :key="index"
              class="ability-item"
            >
              {{ ability }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Unit } from '../models/unit'
import type { Faction } from '../models/faction'
import { useTroopStore } from '../stores/troopStore'
import TroopStatsTable from './TroopStatsTable.vue'

defineProps<{
  units: Unit[]
  army: {
    id: string
    name: string
    faction: string | Faction
    currentPoints: number
    targetPoints: number
    currency: number
    battles?: number
    wins?: number
    losses?: number
    description?: string
  }
}>()

const troopStore = useTroopStore()
const troopsLoading = ref(false)
const reloading = ref(false)

// Initialize troops if needed on component mount
onMounted(async () => {
  if (troopStore.troops.length === 0) {
    troopsLoading.value = true
    try {
      await troopStore.initializeTroops()
    } catch (error) {
      console.error('Error loading troops:', error)
    } finally {
      troopsLoading.value = false
    }
  }
})

// Get troop by ID
function getTroop(troopId: string) {
  return troopStore.troops.find((t) => t.id === troopId)
}

// Get troop name
function getTroopName(troopId: string) {
  const troop = getTroop(troopId)
  return troop ? troop.name : 'Unknown Troop'
}

// Function to get appropriate icon for equipment type
function getEquipmentIcon(type: string): string {
  const typeMap: Record<string, string> = {
    Weapon: 'mdi-sword',
    'Ranged Weapon': 'mdi-pistol',
    'Melee Weapon': 'mdi-sword',
    Armor: 'mdi-shield',
    Gear: 'mdi-toolbox',
    Upgrade: 'mdi-arrow-up-bold',
    Consumable: 'mdi-potion',
  }

  return typeMap[type] || 'mdi-circle-small'
}

// Function to print to PDF
function printToPdf() {
  window.print()
}

// Function to reload troops if needed
async function reloadTroops() {
  reloading.value = true
  try {
    await troopStore.forceReloadTroops()
  } catch (error) {
    console.error('Error reloading troops:', error)
  } finally {
    reloading.value = false
  }
}
</script>

<style scoped>
.quick-reference-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.quick-reference-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.army-name {
  font-size: 1.8rem;
  font-weight: bold;
  color: #8b0000;
}

.unit-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.unit-quick-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 16px;
  background-color: white;
}

.unit-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.unit-name {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0;
}

.troop-name {
  font-size: 0.9rem;
  color: #666;
}

.section-title {
  font-size: 1rem;
  font-weight: bold;
  margin: 10px 0 5px 0;
  color: #8b0000;
}

.equipment-list,
.abilities-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.equipment-item,
.ability-item {
  padding: 5px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.equipment-item:last-child,
.ability-item:last-child {
  border-bottom: none;
}

.equipment-name {
  font-weight: 500;
  display: flex;
  align-items: center;
}

.equipment-modifiers {
  font-style: italic;
  font-size: 0.85rem;
  margin-left: 24px;
  margin-top: 2px;
}

.equipment-rules {
  font-size: 0.85rem;
  margin-left: 24px;
  margin-top: 2px;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 4px 8px;
  border-radius: 4px;
}

.no-equipment {
  color: #999;
  font-style: italic;
}

/* Special Equipment Styles */
.special-equipment-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.special-equipment-item {
  padding: 5px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.special-equipment-item:last-child {
  border-bottom: none;
}

.equipment-description {
  font-size: 0.85rem;
  margin-left: 24px;
  margin-top: 2px;
}

/* Ability Styles */
.ability-name {
  font-weight: bold;
  color: #8b0000;
  font-size: 0.95rem;
}

.ability-description {
  font-size: 0.85rem;
  margin-left: 4px;
  margin-bottom: 4px;
}

/* Keyword Styles */
.keywords-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.keyword-chip {
  background-color: rgba(139, 0, 0, 0.05) !important;
}

/* Loading and error styles */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  text-align: center;
  min-height: 200px;
  width: 100%;
}

.loading-text {
  margin-top: 16px;
  color: #666;
  font-size: 1rem;
}

/* Headerless section adjustments */
.abilities-list.no-title {
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

/* Section spacing */
.unit-special-equipment,
.unit-abilities,
.unit-keywords,
.unit-purchased-abilities {
  margin-top: 16px;
}

/* Print styles */
@media print {
  .print-btn {
    display: none;
  }

  body {
    background-color: white;
  }

  .quick-reference-container {
    padding: 0;
  }

  .unit-quick-card {
    break-inside: avoid;
    page-break-inside: avoid;
    margin-bottom: 15px;
  }
}
</style>
