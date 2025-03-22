<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useArmyStore } from '../stores/army'
import TroopSelectionDialog from '../components/TroopSelectionDialog.vue'
import UnitCard from '../components/UnitCard.vue'
import UnitForm from '../components/UnitForm.vue'
import type { Unit } from '../models/unit'
import type { Troop } from '../models/troop'
import { useTroopStore } from '../stores/troopStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const armyStore = useArmyStore()
const troopStore = useTroopStore()

// Get the army ID from the route params
const armyId = computed(() => route.params.id as string)

// Computed properties
const user = computed(() => authStore.user)
const army = computed(() => armyStore.currentArmy)
const isLoading = computed(() => authStore.loading || armyStore.loading)

// Add state for dialogs and unit operations
const showTroopSelectionDialog = ref(false)
const showUnitFormDialog = ref(false)
const selectedUnit = ref<Unit | null>(null)
const selectedTroop = ref<Troop | null>(null)

// Add a computed property to get the faction ID
const factionId = computed(() => {
  if (!army.value) return 1
  const faction = army.value.faction
  if (typeof faction === 'object' && faction !== null && 'id' in faction) {
    // @ts-expect-error - We've already checked that 'id' exists in faction
    return faction.id
  }
  // Default to faction ID 1 if not found
  return 1
})

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
  if (armyId.value) {
    await armyStore.loadArmy(armyId.value)
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

// Delete army
const deleteArmy = async () => {
  if (confirm('Are you sure you want to delete this army? This action cannot be undone.')) {
    const success = await armyStore.deleteArmy(armyId.value)
    if (success) {
      router.push('/dashboard')
    }
  }
}

// Function to open the troop selection dialog
function openAddUnitDialog() {
  showTroopSelectionDialog.value = true
}

// Function to handle adding a new unit
function handleAddUnit(unit: Unit) {
  if (!army.value) return

  // Clone the current army units to avoid reference issues
  const currentArmy = army.value as unknown as ArmyWithUnits
  const updatedUnits = [...(currentArmy.units || []), unit]

  // Calculate new total points
  const newTotalPoints = updatedUnits.reduce(
    (total: number, unit: Unit) => total + unit.costPoints,
    0,
  )

  // Update the army - using type assertion for TypeScript
  armyStore.updateArmy(armyId.value, {
    // @ts-expect-error - units property might not be in the type but exists in the implementation
    units: updatedUnits,
    currentPoints: newTotalPoints,
  })
}

// Function to handle editing a unit
function handleEditUnit(unit: Unit) {
  selectedUnit.value = unit

  // Find the troop that this unit is based on
  selectedTroop.value = troopStore.troops.find((t) => t.id === unit.troopId) || null

  if (selectedTroop.value) {
    showUnitFormDialog.value = true
  }
}

// Function to save changes to an edited unit
function handleSaveEditedUnit(updatedUnit: Unit) {
  if (!army.value) return

  // Update the unit in the army
  const currentArmy = army.value as unknown as ArmyWithUnits
  const updatedUnits = currentArmy.units.map((unit: Unit) =>
    unit.id === updatedUnit.id ? updatedUnit : unit,
  )

  // Calculate new total points
  const newTotalPoints = updatedUnits.reduce(
    (total: number, unit: Unit) => total + unit.costPoints,
    0,
  )

  // Update the army
  armyStore.updateArmy(armyId.value, {
    // @ts-expect-error - units property might not be in the type but exists in the implementation
    units: updatedUnits,
    currentPoints: newTotalPoints,
  })

  // Reset selection
  selectedUnit.value = null
  selectedTroop.value = null
  showUnitFormDialog.value = false
}

// Function to delete a unit
function handleDeleteUnit(unitId: string) {
  if (!army.value) return

  if (confirm('Are you sure you want to remove this unit from your army?')) {
    // Remove the unit from the army
    const currentArmy = army.value as unknown as ArmyWithUnits
    const updatedUnits = currentArmy.units.filter((unit: Unit) => unit.id !== unitId)

    // Calculate new total points
    const newTotalPoints = updatedUnits.reduce(
      (total: number, unit: Unit) => total + unit.costPoints,
      0,
    )

    // Update the army
    armyStore.updateArmy(armyId.value, {
      // @ts-expect-error - units property might not be in the type but exists in the implementation
      units: updatedUnits,
      currentPoints: newTotalPoints,
    })
  }
}

// For TypeScript, assuming the Army model might not have units property in types
interface ArmyWithUnits {
  id: string
  name: string
  faction: any // Using any to handle both string and object with id
  currentPoints: number
  targetPoints: number
  currency: number
  battles: number
  wins: number
  losses: number
  description?: string
  createdAt: number
  updatedAt: number
  units: Unit[]
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
            <div class="d-flex align-center mb-6">
              <div>
                <h2 class="text-h4 font-weight-medium tc-heading mb-1">{{ army.name }}</h2>
                <p class="text-subtitle-1 mb-1">{{ army.faction }}</p>
                <p class="text-body-2 text-medium-emphasis">
                  <v-icon icon="mdi-target" size="small" class="mr-1"></v-icon>
                  Target Points: {{ targetPoints }}
                </p>
              </div>
              <v-spacer></v-spacer>
              <div>
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
                  color="error"
                  variant="flat"
                  prepend-icon="mdi-delete"
                  class="tc-btn"
                  elevation="0"
                  @click="deleteArmy"
                >
                  Delete
                </v-btn>
              </div>
            </div>

            <hr class="tc-divider" />

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
            <v-card variant="outlined" class="pa-4 tc-card" elevation="0">
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
              <div
                v-if="
                  (army as unknown as ArmyWithUnits).units &&
                  (army as unknown as ArmyWithUnits).units.length > 0
                "
              >
                <div class="unit-list">
                  <UnitCard
                    v-for="unit in (army as unknown as ArmyWithUnits).units"
                    :key="unit.id"
                    :unit="unit"
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
          </v-card-text>
        </v-card>
      </v-container>

      <!-- Not found message -->
      <v-container v-else class="py-8">
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
      :faction-id="factionId"
      @unit-added="handleAddUnit"
    />

    <!-- Unit Form Dialog -->
    <v-dialog v-model="showUnitFormDialog" max-width="800" persistent>
      <UnitForm
        v-if="selectedTroop && selectedUnit"
        :troop="selectedTroop"
        :unit="selectedUnit"
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
</style>
