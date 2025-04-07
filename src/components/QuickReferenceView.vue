<template>
  <div class="quick-reference-container">
    <div class="quick-reference-header">
      <div>
        <h2 class="army-name">{{ army.name }} - {{ army.faction }}</h2>
        <p v-if="warbandVariant" class="warband-variant text-primary">
          Variant: {{ warbandVariant.name }}
        </p>
        <p class="text-body-2 text-medium-emphasis">
          <v-icon icon="mdi-target" size="small" class="mr-1"></v-icon>
          Points: {{ army.currentPoints }}
        </p>
      </div>

      <v-btn
        color="primary"
        variant="outlined"
        prepend-icon="mdi-printer"
        size="small"
        @click="printToPdf"
        class="print-btn"
      >
        Printer Friendly View
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
            <li v-for="(item, index) in getSortedEquipment(unit.currentEquipment)" :key="index" class="equipment-item" @click="showEquipmentDetail(item)">
              <div class="equipment-name">
                <v-icon size="small" class="mr-1">{{ getEquipmentIcon(item.type) }}</v-icon>
                {{ item.name }}
                <!-- Show FREE badge for default equipment -->
                <v-chip
                  v-if="
                    getTroop(unit.troopId)?.defaultEquipment?.some(
                      (name) => name.toLowerCase() === item.name.toLowerCase(),
                    )
                  "
                  size="x-small"
                  color="success"
                  label
                  class="ml-1"
                >
                  FREE
                </v-chip>
              </div>

              <!-- Display handedness, range for weapons -->
              <div v-if="item.type === 'Melee Weapon' || item.type === 'Ranged Weapon'" class="equipment-details">
                <div class="d-flex flex-wrap align-center gap-1 mt-1">
                  <!-- Handedness -->
                  <v-chip
                    v-if="item.handedness"
                    size="x-small"
                    color="info"
                    variant="flat"
                    class="mr-1"
                  >
                    {{ formatHandedness(item.handedness) }}
                  </v-chip>

                  <!-- Range -->
                  <v-chip
                    v-if="item.range"
                    size="x-small"
                    color="primary"
                    variant="flat"
                    class="mr-1"
                  >
                    {{ item.range }}
                  </v-chip>
                </div>
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

    <!-- Warband Variant Section -->
    <div v-if="warbandVariant" class="warband-variant-section">
      <h3>{{ warbandVariant.name }} Rules</h3>
      <ul>
        <li v-for="(rule, index) in warbandVariant.rules" :key="index">
          {{ rule }}
        </li>
      </ul>
    </div>

    <!-- Add equipment detail dialog -->
    <v-dialog v-model="showEquipmentDetailDialog" max-width="800">
      <EquipmentDetailView
        v-if="selectedEquipmentItem"
        :equipment="selectedEquipmentItem"
        @close="closeEquipmentDetailDialog"
      />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTroopStore } from '../stores/troopStore'
import { useWarbandVariantStore } from '../stores/warbandVariantStore'
import TroopStatsTable from './TroopStatsTable.vue'
import type { Army } from '../types/firebase'
import type { Unit } from '../models/unit'
import type { Equipment } from '../models/equipment'
import { HandednessType, EquipmentCategory } from '../models/equipment'
import EquipmentDetailView from './EquipmentDetailView.vue'

const props = defineProps<{
  units: Unit[]
  army: Army
}>()

const troopStore = useTroopStore()
const warbandVariantStore = useWarbandVariantStore()
const troopsLoading = ref(false)
const reloading = ref(false)

// Initialize troops and warband variants if needed on component mount
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

  // Load warband variants
  await warbandVariantStore.fetchWarbandVariants()
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
  // Create a new window
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  // Get the current component's content
  const content = document.querySelector('.quick-reference-container')?.innerHTML
  if (!content) return

  // Remove the print button from the content
  const contentWithoutPrintButton = content.replace(
    /<button[^>]*class="[^"]*print-btn[^"]*"[^>]*>[\s\S]*?<\/button>/g,
    '',
  )

  // Write the HTML structure with the same styles
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${props.army.name} - Quick Reference</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css" rel="stylesheet">
        <style>
          /* Vuetify base styles */
          :root {
            --v-theme-primary: #1976d2;
            --v-theme-secondary: #424242;
            --v-theme-error: #ff5252;
            --v-theme-info: #2196f3;
            --v-theme-success: #4caf50;
            --v-theme-warning: #fb8c00;
          }

          /* Material Design Icons */
          .mdi::before {
            font-family: 'Material Design Icons';
            font-weight: normal;
            font-style: normal;
            font-size: 1.5em;
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
          }

          .mdi-dice-multiple::before {
            content: "\\F076E";
          }

          /* Vuetify icon compatibility */
          .v-icon {
            font-family: 'Material Design Icons';
            font-size: 1em;
            vertical-align: middle;
            display: inline-flex;
          }

          .v-icon.v-icon--size-small {
            font-size: 0.75em;
          }

          .v-icon.ml-1 {
            margin-left: 0.25em;
          }

          body {
            font-family: 'Roboto', sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: white;
          }

          .print-controls {
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            z-index: 1000;
          }

          .print-btn, .close-btn {
            padding: 8px 16px;
            border: 1px solid #1976d2;
            border-radius: 4px;
            background-color: white;
            color: #1976d2;
            cursor: pointer;
            font-family: 'Roboto', sans-serif;
            font-weight: 500;
            transition: all 0.2s;
          }

          .print-btn:hover, .close-btn:hover {
            background-color: #1976d2;
            color: white;
          }

          /* Troop Stats Table Styles */
          .troop-stats-table {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: calc(100% - 16px);
            padding: 10px 8px;
            background-color: #fafafa;
            border-radius: 8px;
            margin: 8px 8px;
            border: 1px solid rgba(139, 0, 0, 0.1);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }

          .stat-container {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            padding: 0 8px;
          }

          .stat-name {
            font-size: 12px;
            color: #8b0000;
            font-weight: 500;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .stat-value {
            font-size: 20px;
            font-weight: 600;
            color: #212121;
          }

          .stat-divider {
            position: absolute;
            right: 0;
            top: 12%;
            height: 76%;
            width: 1px;
            background-color: rgba(139, 0, 0, 0.2);
          }

          /* Existing styles */
          .quick-reference-container {
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          .quick-reference-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.12);
          }
          .quick-reference-header > div {
            flex: 1;
          }
          .army-name {
            font-size: 1.8rem;
            font-weight: bold;
            color: #8b0000;
            margin: 0 0 8px 0;
          }
          .warband-variant {
            font-size: 1.1rem;
            margin: 0 0 8px 0;
          }
          .text-medium-emphasis {
            margin: 0;
            display: flex;
            align-items: center;
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
          .keywords-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
          }
          .keyword-chip {
            background-color: rgba(139, 0, 0, 0.05) !important;
          }
          .warband-variant-section {
            margin: 1rem 0;
            padding: 1rem;
            background-color: rgba(0, 0, 0, 0.05);
            border-radius: 4px;
          }
          .warband-variant-section h3 {
            margin-bottom: 0.5rem;
            font-weight: 500;
          }
          .warband-variant-section ul {
            list-style-type: none;
            padding-left: 0;
            margin: 0;
          }
          .warband-variant-section li {
            margin-bottom: 0.5rem;
            padding-left: 1.5rem;
            position: relative;
          }
          .warband-variant-section li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: var(--v-primary-base);
          }
        </style>
      </head>
      <body>
        <div class="print-controls">
          <button class="print-btn" onclick="window.print()">Print</button>
          <button class="close-btn" onclick="window.close()">Return to App</button>
        </div>
        ${contentWithoutPrintButton}
      </body>
    </html>
  `)

  // Close the document
  printWindow.document.close()
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

// Computed property for warband variant
const warbandVariant = computed(() => {
  if (!props.army.warbandVariantId) return null
  return warbandVariantStore.warbandVariants.find((v) => v.id === props.army.warbandVariantId)
})

// Equipment detail dialog state
const showEquipmentDetailDialog = ref(false)
const selectedEquipmentItem = ref<Equipment | null>(null)

// Function to show equipment detail dialog
function showEquipmentDetail(equipment: Equipment) {
  selectedEquipmentItem.value = equipment
  showEquipmentDetailDialog.value = true
}

// Function to close equipment detail dialog
function closeEquipmentDetailDialog() {
  showEquipmentDetailDialog.value = false
  selectedEquipmentItem.value = null
}

// Format handedness for display
function formatHandedness(handedness: HandednessType | undefined): string {
  if (!handedness) return '';

  switch (handedness) {
    case HandednessType.ONE_HANDED:
      return '1-Hand'
    case HandednessType.TWO_HANDED:
      return '2-Hand'
    case HandednessType.NO_HANDS:
      return 'No Hands'
    case HandednessType.ONE_HAND_REQUIRED:
      return 'Requires Hand'
    default:
      return ''
  }
}

// Add getSortedEquipment function to the script section to sort equipment in the same order as UnitForm
function getSortedEquipment(equipment: Equipment[]) {
  // Create a copy of the equipment array to avoid modifying the original
  const equipmentCopy = [...equipment];

  return equipmentCopy.sort((a, b) => {
    // Define category priorities (lower number = higher priority)
    const categoryPriority = {
      [EquipmentCategory.MELEE_WEAPON]: 1,
      [EquipmentCategory.RANGED_WEAPON]: 2,
      [EquipmentCategory.ARMOUR]: 3,
      [EquipmentCategory.SHIELD]: 3,
      [EquipmentCategory.HEADGEAR]: 3,
      [EquipmentCategory.EQUIPMENT]: 4,
      [EquipmentCategory.GRENADE]: 4,
      [EquipmentCategory.MUSICAL_INSTRUMENT]: 4,
      [EquipmentCategory.STANDARD]: 4
    };

    // Get priorities or default to lowest priority (5)
    const priorityA = categoryPriority[a.category] || 5;
    const priorityB = categoryPriority[b.category] || 5;

    // Sort by priority (ascending)
    return priorityA - priorityB;
  });
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
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.quick-reference-header > div {
  flex: 1;
}

.army-name {
  font-size: 1.8rem;
  font-weight: bold;
  color: #8b0000;
  margin: 0 0 8px 0;
}

.warband-variant {
  font-size: 1.1rem;
  margin: 0 0 8px 0;
}

.text-medium-emphasis {
  margin: 0;
  display: flex;
  align-items: center;
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

  .quick-reference-header {
    border-bottom: 1px solid #000;
    margin-bottom: 24px;
  }

  .unit-quick-card {
    break-inside: avoid;
    page-break-inside: avoid;
    margin-bottom: 15px;
  }
}

.warband-variant-section {
  margin: 1rem 0;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.warband-variant-section h3 {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.warband-variant-section ul {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}

.warband-variant-section li {
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.warband-variant-section li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--v-primary-base);
}

.equipment-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 8px;
  border-radius: 4px;
}

.equipment-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.equipment-details {
  margin-left: 24px;
}
</style>
