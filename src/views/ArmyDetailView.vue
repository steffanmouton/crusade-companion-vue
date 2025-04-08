<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useArmyStore } from '../stores/army'
import { useUnitStore } from '../stores/unitStore'
import { useWarbandVariantStore } from '../stores/warbandVariantStore'
import TroopSelectionDialog from '../components/TroopSelectionDialog.vue'
import UnitCard from '../components/UnitCard.vue'
import UnitForm from '../components/UnitForm.vue'
import type { Unit as ModelUnit } from '../models/unit'
import type { Troop } from '../models/troop'
import { useTroopStore } from '../stores/troopStore'
import { useEquipmentStore } from '../stores/equipmentStore'
import QuickReferenceView from '../components/QuickReferenceView.vue'
import { useFactionStore } from '../stores/factionStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const armyStore = useArmyStore()
const unitStore = useUnitStore()
const troopStore = useTroopStore()
const warbandVariantStore = useWarbandVariantStore()
const factionStore = useFactionStore()

// Get the army ID from the route params
const armyId = computed(() => route.params.id as string)

// Computed properties
const user = computed(() => authStore.user)
const army = computed(() => armyStore.currentArmy)
const unitsFromStore = computed(() => unitStore.units)

// Convert units from Firestore format to the format expected by components
const units = computed(() => {
  // Log the units from store for debugging
  console.log('Units from store before conversion:',
    unitsFromStore.value.map(u => ({
      id: u.id,
      name: u.name,
      imageUrl: u.imageUrl,
      hasImageUrl: !!u.imageUrl
    }))
  );

  const convertedUnits = unitsFromStore.value.map((firestoreUnit) => {
    // First, create an object with optional properties expected by the UI
    const uiUnit: ModelUnit = {
      id: firestoreUnit.id,
      name: firestoreUnit.name,
      troopId: firestoreUnit.troopId || '',
      costPoints: firestoreUnit.costPoints,
      costCurrency: firestoreUnit.costCurrency || 0,
      currentEquipment: (firestoreUnit.currentEquipment || []) as unknown as ModelUnit['currentEquipment'],
      purchasedAbilities: firestoreUnit.purchasedAbilities || [],
      isMercenary: false,
    }

    // Copy imageUrl if it exists
    if (firestoreUnit.imageUrl)
      uiUnit.imageUrl = firestoreUnit.imageUrl

    return uiUnit
  })

  // Log converted units to debug
  console.log('Units after conversion:',
    convertedUnits.map(u => ({
      id: u.id,
      name: u.name,
      imageUrl: u.imageUrl,
      hasImageUrl: !!u.imageUrl
    }))
  );

  return convertedUnits
})

const isLoading = computed(() => authStore.loading || armyStore.loading || unitStore.loading)
const hasAttemptedLoad = ref(false)

// Add state for dialogs and unit operations
const showTroopSelectionDialog = ref(false)
const showUnitFormDialog = ref(false)
const selectedUnit = ref<ModelUnit | null>(null)
const selectedTroop = ref<Troop | null>(null)
const quickReferenceMode = ref(false)

// Computed properties for the cost counter
const currentCost = computed(() => army.value?.currentPoints || 0)
const targetPoints = computed(() => army.value?.targetPoints || 0)
const isOverBudget = computed(() => {
  if (!army.value) return false
  return army.value.currentPoints > army.value.targetPoints
})
const costCounterColor = computed(() => {
  return isOverBudget.value ? 'rgba(244, 67, 54, 0.08)' : 'rgba(76, 175, 80, 0.08)'
})

// Track if the counter should be floating
const isScrolled = ref(false)

// Function to check scroll position
const handleScroll = () => {
  isScrolled.value = window.scrollY > 100
}

// Add scroll event listener
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

// Clean up the event listener
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Load army on component mount
onMounted(async () => {
  // Initialize the equipment store first to ensure equipment data is available for the UnitForm
  const equipmentStore = useEquipmentStore()
  await equipmentStore.fetchEquipment()

  // Initialize troops if they're not already loaded
  if (troopStore.troops.length === 0) {
    await troopStore.initializeTroops()
  }

  // Load warband variants
  await warbandVariantStore.fetchWarbandVariants()

  // Load factions
  await factionStore.syncWithFirestore()
  console.log("Loaded factions:", factionStore.factions.length)

  if (armyId.value) {
    await armyStore.loadArmy(armyId.value)
    await unitStore.loadUnitsByArmyId(armyId.value)
    hasAttemptedLoad.value = true

    // Add this console log to help diagnose any issues
    console.log("Current army:", armyStore.currentArmy?.name,
                "Faction:", armyStore.currentArmy?.faction,
                "ArmyRules:", armyStore.currentArmyRules ? "Available" : "Not available")

    // Add detailed logging of the ArmyRules object
    console.log("ArmyRules object:", JSON.stringify(armyStore.currentArmyRules, null, 2))
  }
})

// Navigate back to dashboard
const goBack = () => {
  router.push('/dashboard')
}

// Navigate to edit page
const editArmy = () => {
  router.push(`/army/${armyId.value}/edit`)
}

// Function to open the troop selection dialog
async function openAddUnitDialog() {
  if (!army.value) {
    await armyStore.loadArmy(armyId.value)
  }
  showTroopSelectionDialog.value = true
}

// Create a UnitData type for internal use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type UnitData = {
  id: string
  name: string
  troopId: string
  troopName: string
  armyId: string
  costPoints: number
  costCurrency: number
  currentEquipment: any[]
  purchasedAbilities: string[]
  type: string
  power: number
  points: number
  experience: number
  rank: string
  battles: number
  kills: number
  notes?: string
}

// Function to handle adding a new unit
function handleAddUnit(unit: any) {
  if (!army.value) return

  // The unit has already been saved to Firestore by the UnitForm component
  // We don't need to call unitStore.addUnit again
  console.log('Unit added:', unit)

  // Manually refresh the units if needed
  // This should not be necessary because the loadUnitsByArmyId should be called
  // when the unit is added to Firestore, but we keep it as a safety measure
  if (unit && unit.id && !unitsFromStore.value.some((u) => u.id === unit.id)) {
    unitStore.loadUnitsByArmyId(armyId.value)
  }
}

// Function to handle editing a unit
function handleEditUnit(unit: ModelUnit) {
  selectedUnit.value = unit

  // Find the troop that this unit is based on
  selectedTroop.value = troopStore.troops.find((t) => t.id === unit.troopId) || null

  if (selectedTroop.value) {
    showUnitFormDialog.value = true
  }
}

// Function to save changes to an edited unit
function handleSaveEditedUnit(updatedUnit: ModelUnit) {
  if (!army.value) return

  // Update the unit using unitStore
  unitStore.updateUnit(updatedUnit.id, updatedUnit)

  // Reset selection
  selectedUnit.value = null
  selectedTroop.value = null
  showUnitFormDialog.value = false
}

// Function to delete a unit
function handleDeleteUnit(unitId: string) {
  if (!army.value) return

  if (confirm('Are you sure you want to remove this unit from your army?')) {
    // Delete the unit using unitStore
    unitStore.deleteUnit(unitId, armyId.value)
  }
}

// Computed property for warband variant
const warbandVariant = computed(() => armyStore.currentWarbandVariant)

// Computed property to check if the warband has special equipment
const hasWarbandSpecialEquipment = computed(() => {
  if (!armyStore.currentArmyRules) return false

  // Knights of Avarice special equipment
  if (warbandVariant.value?.id === 'tc-wb-knights-of-avarice') {
    return true
  }

  return false
})

// Computed property to get warband-specific equipment names
const warbandSpecialEquipment = computed(() => {
  if (!armyStore.currentArmyRules) return []

  // Knights of Avarice special equipment
  if (warbandVariant.value?.id === 'tc-wb-knights-of-avarice') {
    return [
      'Coin Hammer',
      'Tarnished Armour',
      'Standard of Mammon',
      'Golden Calf Altar'
    ]
  }

  return []
})

// Add this function to force reseed
async function forceReseedVariants() {
  if (confirm('This will reset all warband variants to their initial seed data. Continue?')) {
    await warbandVariantStore.seedWarbandVariants(true);
    // Force reload the army after reseeding
    await armyStore.loadArmy(armyId.value);
    alert('Warband variants have been reseeded!');
  }
}
</script>

<template>
  <v-app class="bg-background">
    <!-- App Bar -->
    <v-app-bar color="primary" density="default" class="tc-app-bar" elevation="1">
      <v-app-bar-title class="text-h6 font-weight-medium tc-logo-text">
        Crusade Companion
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <div v-if="!isLoading && user" class="text-body-2 mr-4">
        {{ user.email }}
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-background">
      <!-- Loading state -->
      <v-container v-if="isLoading" class="fill-height" fluid>
        <v-row justify="center" align="center">
          <v-col cols="auto">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          </v-col>
        </v-row>
      </v-container>

      <!-- Army detail content when loaded -->
      <v-container v-else-if="army" class="py-8">
        <v-card class="mx-auto tc-card" max-width="800" elevation="1">
          <v-card-text>
            <!-- Back button -->
            <v-btn
              @click="goBack"
              color="primary"
              variant="text"
              prepend-icon="mdi-arrow-left"
              class="mb-4 tc-btn"
            >
              Back to Dashboard
            </v-btn>

            <!-- Army header -->
            <div class="d-flex flex-column mb-6">
              <!-- Action buttons -->
              <div class="d-flex flex-wrap gap-2 mb-4">
                <v-btn
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-book-open-variant"
                  class="mr-2"
                  @click="quickReferenceMode = !quickReferenceMode"
                >
                  {{ quickReferenceMode ? 'Normal View' : 'Quick Reference Mode' }}
                </v-btn>
                <v-btn
                  color="primary"
                  variant="flat"
                  prepend-icon="mdi-pencil"
                  class="mr-2 tc-btn"
                  elevation="0"
                  @click="editArmy"
                >
                  Edit
                </v-btn>
                <v-btn
                  color="primary"
                  variant="flat"
                  prepend-icon="mdi-refresh"
                  class="mr-2 tc-btn"
                  elevation="0"
                  @click="forceReseedVariants"
                >
                  Force Reseed
                </v-btn>
              </div>
              <!-- Army details -->
              <div>
                <h2 class="text-h4 font-weight-medium tc-heading mb-1">{{ army.name }}</h2>
                <p class="text-subtitle-1 mb-1">{{ army.faction }}</p>
                <p v-if="warbandVariant" class="text-subtitle-2 mb-1 text-primary">
                  Variant: {{ warbandVariant.name }}
                </p>
                <p class="text-body-2 text-medium-emphasis">
                  <v-icon icon="mdi-target" size="small" class="mr-1"></v-icon>
                  Current Points: {{ army.currentPoints }}
                </p>
              </div>
            </div>

            <hr class="tc-divider" />

            <!-- Quick Reference View when enabled -->
            <QuickReferenceView v-if="quickReferenceMode" :units="units" :army="army" />

            <!-- Standard View Content -->
            <template v-else>
              <!-- Army stats -->
              <v-row class="mb-6">
                <v-col cols="12" sm="6">
                  <v-card
                    variant="outlined"
                    class="text-center pa-4 tc-card tc-highlight-bg"
                    elevation="0"
                  >
                    <v-icon
                      icon="mdi-currency-usd"
                      color="success"
                      size="large"
                      class="mb-2"
                    ></v-icon>
                    <h3 class="text-h6 font-weight-medium mb-1 tc-heading">Glory Points</h3>
                    <p class="text-h4 font-weight-medium">{{ army.currency }}</p>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-card
                    variant="outlined"
                    class="text-center pa-4 tc-card tc-highlight-bg"
                    elevation="0"
                  >
                    <v-icon icon="mdi-sword-cross" color="info" size="large" class="mb-2"></v-icon>
                    <h3 class="text-h6 font-weight-medium mb-1 tc-heading">Battles</h3>
                    <p class="text-h4 font-weight-medium">{{ army.battles }}</p>
                    <div class="d-flex justify-center mt-2">
                      <v-chip size="small" color="success" variant="flat" class="mr-2">
                        W: {{ army.wins }}
                      </v-chip>
                      <v-chip size="small" color="error" variant="flat">
                        L: {{ army.losses }}
                      </v-chip>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Army description -->
              <v-card variant="outlined" class="mb-6 pa-4 tc-card" elevation="0">
                <h3 class="text-h6 font-weight-medium mb-2 tc-heading">Description</h3>
                <p v-if="army.description" class="text-body-1">{{ army.description }}</p>
                <p v-else class="text-body-1 text-medium-emphasis">No description provided.</p>
              </v-card>

              <!-- Units section -->
              <v-card variant="outlined" class="mb-6 pa-4 tc-card" elevation="0">
                <div class="d-flex align-center mb-4">
                  <h3 class="text-h6 font-weight-medium mb-0 tc-heading">Units</h3>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    size="small"
                    prepend-icon="mdi-plus"
                    class="tc-btn"
                    elevation="0"
                    variant="flat"
                    @click="openAddUnitDialog"
                  >
                    Add Unit
                  </v-btn>
                </div>

                <!-- Units list -->
                <div v-if="units && units.length > 0">
                  <div class="unit-list">
                    <UnitCard
                      v-for="unit in units"
                      :key="unit.id"
                      :unit="unit"
                      :armyId="armyId"
                      @edit-unit="handleEditUnit"
                      @delete-unit="handleDeleteUnit"
                      class="mb-4"
                    />
                  </div>
                </div>
                <p v-else class="text-medium-emphasis text-center py-4">
                  No units added yet. Click "Add Unit" to add your first unit.
                </p>
              </v-card>

              <!-- Warband Variant Section -->
              <v-card v-if="warbandVariant" variant="outlined" class="pa-4 tc-card" elevation="0">
                <h3 class="text-h6 font-weight-medium mb-2 tc-heading">
                  Variant - {{ warbandVariant.name }}
                </h3>
                <p class="text-body-1 mb-4">{{ warbandVariant.description }}</p>
                <div class="rules-list">
                  <h4 class="text-subtitle-1 font-weight-medium mb-2">Special Rules:</h4>
                  <ul class="list-unstyled">
                    <li v-for="(rule, index) in warbandVariant.specialRules" :key="index" class="mb-2">
                      <v-icon
                        icon="mdi-book-open-variant"
                        color="primary"
                        size="small"
                        class="mr-2"
                      ></v-icon>
                      {{ rule }}
                    </li>
                  </ul>
                </div>

                <!-- Show army rules information when available -->
                <div v-if="armyStore.currentArmyRules" class="rules-list mt-4">
                  <h4 class="text-subtitle-1 font-weight-medium mb-2">Game Restrictions:</h4>

                  <!-- Minimum Model Cost -->
                  <div v-if="armyStore.currentArmyRules.troops.minModelCost" class="mb-2">
                    <v-icon icon="mdi-alert" color="warning" size="small" class="mr-2"></v-icon>
                    <strong>Minimum Model Cost:</strong> {{ armyStore.currentArmyRules.troops.minModelCost.cost }} ducats
                    <span v-if="armyStore.currentArmyRules.troops.minModelCost.exceptions">
                      (Except for models with
                      <span v-if="armyStore.currentArmyRules.troops.minModelCost.exceptions.keywords">
                        keywords: {{ armyStore.currentArmyRules.troops.minModelCost.exceptions.keywords.join(', ') }}
                      </span>
                      <span v-if="armyStore.currentArmyRules.troops.minModelCost.exceptions.troopIds">
                        troops: {{ armyStore.currentArmyRules.troops.minModelCost.exceptions.troopIds.join(', ') }}
                      </span>
                      )
                    </span>
                  </div>

                  <!-- Banned Keywords -->
                  <div v-if="armyStore.currentArmyRules.equipment.globalRestrictions.bannedKeywords.length > 0" class="mb-2">
                    <v-icon icon="mdi-block-helper" color="error" size="small" class="mr-2"></v-icon>
                    <strong>Banned Equipment Keywords:</strong>
                    {{ armyStore.currentArmyRules.equipment.globalRestrictions.bannedKeywords.join(', ') }}
                  </div>

                  <!-- Special Equipment -->
                  <div v-if="hasWarbandSpecialEquipment" class="mb-2">
                    <v-icon icon="mdi-sword" color="success" size="small" class="mr-2"></v-icon>
                    <strong>Special Equipment Available:</strong>
                    <div v-for="(equip, index) in warbandSpecialEquipment" :key="index" class="ml-6 mt-1">
                      {{ equip }}
                    </div>
                  </div>

                  <!-- Enforced Patron -->
                  <div v-if="armyStore.currentArmyRules.specialValidations?.enforcePatron" class="mb-2">
                    <v-icon icon="mdi-crown" color="primary" size="small" class="mr-2"></v-icon>
                    <strong>Patron:</strong> {{ armyStore.currentArmyRules.specialValidations.enforcePatron }}
                  </div>
                </div>
              </v-card>
            </template>
          </v-card-text>
        </v-card>
      </v-container>

      <!-- Not found message - only show after loading attempt has been made -->
      <v-container v-else-if="hasAttemptedLoad" class="py-8">
        <v-card class="mx-auto text-center pa-6 tc-card" max-width="500" elevation="1">
          <v-icon icon="mdi-alert" color="warning" size="x-large" class="mb-4"></v-icon>
          <h2 class="text-h4 font-weight-medium mb-2 tc-heading">Army Not Found</h2>
          <p class="text-body-1 mb-4">
            The army you're looking for doesn't exist or has been deleted.
          </p>
          <v-btn
            color="primary"
            prepend-icon="mdi-arrow-left"
            @click="goBack"
            class="tc-btn"
            elevation="0"
            variant="flat"
          >
            Back to Dashboard
          </v-btn>
        </v-card>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app class="tc-footer text-center d-flex justify-center">
      <span class="text-caption">
        &copy; {{ new Date().getFullYear() }} Crusade Companion | RocketSheep LLC
      </span>
    </v-footer>

    <!-- Troop Selection Dialog -->
    <TroopSelectionDialog
      v-model="showTroopSelectionDialog"
      :factionName="army?.faction || ''"
      :armyId="armyId"
      @unit-added="handleAddUnit"
    />

    <!-- Unit Form Dialog -->
    <v-dialog v-model="showUnitFormDialog" max-width="800" persistent>
      <UnitForm
        v-if="selectedTroop && selectedUnit"
        :troop="selectedTroop"
        :unit="selectedUnit"
        :armyId="armyId"
        @save="handleSaveEditedUnit"
        @close="showUnitFormDialog = false"
      />
    </v-dialog>

    <!-- Floating cost counter -->
    <div
      class="cost-counter"
      :class="{ 'cost-counter-floating': isScrolled }"
      :style="{ 'background-color': costCounterColor }"
      v-if="army"
    >
      <v-icon
        class="cost-counter-icon mr-2"
        :icon="isOverBudget ? 'mdi-alert-circle' : 'mdi-check-circle'"
        :color="isOverBudget ? 'error' : 'success'"
      ></v-icon>
      <div class="cost-counter-content">
        <div class="cost-counter-title">POINTS</div>
        <div class="cost-counter-value">{{ currentCost }} / {{ targetPoints }}</div>
        <div class="cost-counter-progress">
          <div
            class="cost-counter-progress-bar"
            :style="{
              width: `${Math.min(100, (currentCost / targetPoints) * 100)}%`,
              'background-color': isOverBudget ? '#ff5252' : '#4caf50',
            }"
          ></div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<style scoped>
.cost-counter {
  position: fixed;
  top: 70px; /* Position below the app bar */
  right: 20px;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  z-index: 99; /* Below app bar z-index but above other content */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition:
    all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
    opacity 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  opacity: 1;
}

.cost-counter:hover {
  opacity: 1;
}

.cost-counter-floating {
  top: 70px; /* Maintain position below app bar when floating */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transform: translateY(0) scale(1.02);
}

.cost-counter-icon {
  transition: transform 0.3s ease;
}

.cost-counter:hover .cost-counter-icon {
  transform: scale(1.1);
}

.cost-counter-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.cost-counter-progress {
  height: 4px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin-top: 4px;
  overflow: hidden;
}

.cost-counter-progress-bar {
  height: 100%;
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
}

.unit-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Other custom styles for the army detail view */
.tc-card {
  border-radius: 8px;
}

.tc-heading {
  color: #8b0000;
}

.tc-divider {
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  margin: 1rem 0;
}

.tc-highlight-bg {
  background-color: #f9f9f9;
}

/* Mobile styles for buttons */
@media (max-width: 600px) {
  .d-flex.flex-wrap.gap-2 .v-btn:nth-child(2) {
    margin-top: 8px;
  }
}

/* Mobile styles for cost counter */
@media (max-width: 600px) {
  .cost-counter {
    top: 70px; /* Keep at top, consistent with desktop position */
    bottom: unset;
    right: 16px;
    padding: 6px 10px;
    max-width: 120px;
    transform: scale(0.9);
    transform-origin: top right;
  }

  .cost-counter-floating {
    top: 70px; /* Maintain position at top when floating */
    bottom: unset;
    transform: translateY(0) scale(0.92);
  }

  .cost-counter-title {
    font-size: 0.65rem;
    margin-bottom: 1px;
  }

  .cost-counter-value {
    font-size: 1rem;
    margin-bottom: 1px;
  }

  .cost-counter-progress {
    height: 3px;
    margin-top: 2px;
  }
}

.cost-counter-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  opacity: 0.8;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
  font-weight: 500;
}

.cost-counter-value {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

/* Print styles for Quick Reference Mode */
@media print {
  /* Hide various UI elements when printing */
  .v-app-bar,
  .v-footer,
  .cost-counter,
  .v-btn:not(.print-btn) {
    display: none !important;
  }

  /* Remove backgrounds and optimize for print */
  .bg-background,
  .v-card,
  .tc-card,
  body {
    background-color: white !important;
    color: black !important;
    box-shadow: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Ensure each unit card starts on a new page if needed */
  .unit-quick-card {
    page-break-inside: avoid;
  }

  /* Optimize fonts for print */
  * {
    font-family: 'Times New Roman', Times, serif !important;
  }

  /* Hide scrollbars */
  ::-webkit-scrollbar {
    display: none;
  }
}

.rules-list ul {
  padding-left: 1rem;
  list-style-type: none;
}
</style>
