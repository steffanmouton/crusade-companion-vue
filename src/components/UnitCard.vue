<template>
  <v-card class="unit-card ma-2">
    <div v-if="!hasRequiredProperties" class="pa-4 text-center">
      <v-icon icon="mdi-alert" color="warning" class="mb-2"></v-icon>
      <div class="text-body-1">Invalid unit data structure</div>
      <div class="text-caption text-medium-emphasis">
        Unit is missing required properties: {{ JSON.stringify(props.unit) }}
      </div>
    </div>
    <div v-else-if="troopsLoading" class="pa-4 text-center">
      <v-progress-circular
        indeterminate
        color="primary"
        size="32"
        class="mb-2"
      ></v-progress-circular>
      <div class="text-body-1">Loading troop data...</div>
    </div>
    <div v-else>
      <!-- Responsive container that will change from row to column on mobile -->
      <div class="unit-container">
        <!-- Image container with conditional source -->
        <div class="unit-image-container">
          <v-img
            :src="isDesktop ? unitSideImage : unitImage"
            height="100%"
            contain
            @error="handleImageError"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular indeterminate color="grey-lighten-4"></v-progress-circular>
              </div>
            </template>
            <template v-slot:error>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon icon="mdi-image-off" size="48" color="grey-lighten-1"></v-icon>
              </div>
            </template>
          </v-img>
        </div>

        <!-- Right side (desktop) / Bottom (mobile) with unit details -->
        <div class="unit-details-container">
          <v-card-title class="d-flex justify-space-between pa-3">
            <div>
              <div class="text-h6">{{ unit.name }}</div>
              <div class="text-caption">{{ troopName }}</div>
              <div class="text-caption text-medium-emphasis d-md-none mt-1">
                {{
                  formatCost({
                    currencies: [{ type: CurrencyType.DUCATS, amount: unit.costPoints }],
                  })
                }}
              </div>
            </div>
            <div class="text-caption text-medium-emphasis d-none d-md-block">
              {{
                formatCost({ currencies: [{ type: CurrencyType.DUCATS, amount: unit.costPoints }] })
              }}
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-3">
            <!-- Stats table -->
            <TroopStatsTable
              v-if="troop"
              :movement="troop.stats.movement"
              :ranged="troop.stats.ranged"
              :melee="troop.stats.melee"
              :armor="troop.stats.armor"
            />

            <!-- Equipment list -->
            <h3 class="text-subtitle-2 font-weight-medium mt-3 mb-1">Equipment</h3>
            <v-list dense class="equipment-list">
              <v-list-item
                v-for="(item, index) in unit.currentEquipment"
                :key="index"
                class="pa-0 mb-2"
              >
                <v-list-item-title>
                  <div class="d-flex align-center px-0 py-1">
                    <v-icon size="small" class="mr-2">
                      {{ getEquipmentIcon(item.type) }}
                    </v-icon>
                    <span class="text-body-2 font-weight-medium">{{ item.name }}</span>
                    <v-spacer></v-spacer>
                    <!-- Show DEFAULT badge for default equipment -->
                    <v-chip
                      v-if="
                        troop?.defaultEquipment?.some(
                          (name) => name.toLowerCase() === item.name.toLowerCase(),
                        )
                      "
                      size="x-small"
                      color="success"
                      label
                      class="ml-1"
                    >
                      DEFAULT
                    </v-chip>
                  </div>
                </v-list-item-title>

                <!-- Display modifiers if available -->
                <v-list-item-subtitle
                  v-if="item.modifiers && item.modifiers.length > 0"
                  class="mt-1 ml-8"
                >
                  <div class="text-caption font-italic">
                    {{ item.modifiers.join(', ') }}
                  </div>
                </v-list-item-subtitle>

                <!-- Display equipment rules -->
                <v-list-item-subtitle
                  v-if="item.rules && item.rules.length > 0"
                  class="equipment-rules mt-1"
                >
                  <div
                    v-for="(rule, ruleIndex) in item.rules"
                    :key="ruleIndex"
                    class="ml-8 text-caption"
                  >
                    {{ rule }}
                  </div>
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="unit.currentEquipment.length === 0" class="px-0 py-1">
                <v-list-item-title class="text-body-2 text-grey">No equipment</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-3">
            <v-btn variant="text" color="primary" size="small" @click="$emit('edit-unit', unit)">
              Edit
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              color="error"
              size="small"
              @click="deleteUnit"
              :loading="deleting"
            >
              Remove
            </v-btn>
          </v-card-actions>
        </div>
      </div>
      <div v-if="deleting || error" class="px-3 pb-3">
        <LoadingIndicator :loading="deleting" :error="error || ''" text="Deleting unit..." />
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { Unit } from '../models/unit'
import type { Troop } from '../models/troop'
import { formatCost, CurrencyType } from '../models/cost'
import TroopStatsTable from './TroopStatsTable.vue'
import { useTroopStore } from '../stores/troopStore'
import { useUnitStore } from '../stores/unitStore'
import LoadingIndicator from './LoadingIndicator.vue'

const props = defineProps<{
  unit: Unit
  armyId?: string
}>()

const emit = defineEmits(['edit-unit', 'delete-unit'])

const troopStore = useTroopStore()
const unitStore = useUnitStore()
const deleting = ref(false)
const error = ref<string | null>(null)
const troopsLoading = ref(false)

// Initialize troops if needed
onMounted(async () => {
  if (troopStore.troops.length === 0) {
    troopsLoading.value = true
    try {
      await troopStore.initializeTroops()
    } catch (e) {
      console.error('Error loading troops:', e)
    } finally {
      troopsLoading.value = false
    }
  }
})

// Find the troop that this unit is based on
const troop = computed<Troop | undefined>(() => {
  return troopStore.troops.find((t) => t.id === props.unit.troopId)
})

// Get the troop name for display
const troopName = computed(() => {
  return troop.value ? troop.value.name : 'Unknown Troop'
})

// Get the image for mobile view (will also be fallback for desktop if side image fails)
const unitImage = computed(() => {
  if (troop.value?.cardHeaderImageURI) {
    // Remove any leading slash and ensure we're using the correct path
    const path = troop.value.cardHeaderImageURI.replace(/^\/+/, '')
    return `/${path}`
  }
  // Default placeholder image
  return '/img/placeholder-unit.jpg'
})

// Get the side image for desktop view
const unitSideImage = computed(() => {
  if (troop.value?.cardHeroSideImageURI) {
    // Remove any leading slash and ensure we're using the correct path
    const path = troop.value.cardHeroSideImageURI.replace(/^\/+/, '')
    return `/${path}`
  } else if (troop.value?.cardHeaderImageURI) {
    // Fall back to header image if no side image
    return unitImage.value
  }
  // Default placeholder image
  return '/img/placeholder-unit.jpg'
})

// Function to get an appropriate icon for the equipment type
function getEquipmentIcon(type: string): string {
  const typeMap: Record<string, string> = {
    Weapon: 'mdi-sword',
    'Ranged Weapon': 'mdi-pistol',
    'Melee Weapon': 'mdi-sword',
    Armour: 'mdi-shield',
    Gear: 'mdi-toolbox',
    Upgrade: 'mdi-arrow-up-bold',
    Consumable: 'mdi-potion',
  }

  return typeMap[type] || 'mdi-circle-small'
}

// Define a reactive reference for window width
const windowWidth = ref(window.innerWidth)

// Update window width on resize
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

// Add and remove event listeners
onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

// Determine if the current device is a desktop (above 600px width)
const isDesktop = computed(() => {
  return windowWidth.value > 600
})

// Function to handle deleting the unit from Firestore
async function deleteUnit() {
  if (!confirm('Are you sure you want to delete this unit?')) {
    return
  }

  deleting.value = true
  error.value = null

  try {
    // Delete the unit using unitStore
    const success = await unitStore.deleteUnit(props.unit.id, props.armyId)

    if (success) {
      // Emit the event
      emit('delete-unit', props.unit.id)
    } else {
      throw new Error('Failed to delete unit')
    }
  } catch (err: any) {
    console.error('Error deleting unit:', err)
    error.value = err.message || 'Failed to delete unit'
  } finally {
    deleting.value = false
  }
}

// Add a computed property to ensure we can detect any issues with the unit data
const hasRequiredProperties = computed(() => {
  return (
    props.unit &&
    props.unit.id &&
    props.unit.name &&
    props.unit.troopId !== undefined &&
    props.unit.costPoints !== undefined
  )
})

// Function to handle image loading errors
function handleImageError(value: string | undefined) {
  if (value) {
    console.error('Failed to load image:', value)
    // Try to load the placeholder image
    const img = document.querySelector(`img[src="${value}"]`) as HTMLImageElement
    if (img) {
      img.src = '/img/placeholder-unit.jpg'
    }
  }
}
</script>

<style scoped>
.unit-card {
  width: 100%;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.unit-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.unit-container {
  display: flex;
  flex-direction: row;
}

.unit-image-container {
  width: 220px;
  min-width: 220px;
  min-height: 250px;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at center, rgba(60, 60, 60, 0.4) 0%, rgba(30, 30, 30, 0.6) 100%),
    linear-gradient(135deg, rgba(140, 0, 0, 0.5) 0%, rgba(50, 0, 0, 0.7) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border-right: 1px solid rgba(80, 0, 0, 0.3);
}

.unit-card:hover .unit-image-container {
  background:
    radial-gradient(circle at center, rgba(70, 70, 70, 0.4) 0%, rgba(35, 35, 35, 0.6) 100%),
    linear-gradient(135deg, rgba(160, 0, 0, 0.5) 0%, rgba(60, 0, 0, 0.7) 100%);
}

.unit-image-container .v-img {
  width: 100%;
  height: 100%;
  object-fit: contain !important;
  object-position: center !important;
  transition: transform 0.3s ease;
  z-index: 1;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
}

.unit-image-container :deep(.v-img__img) {
  object-fit: contain !important;
  max-height: 100%;
  mix-blend-mode: normal;
}

.unit-card:hover .unit-image-container .v-img {
  transform: scale(1.05);
}

.unit-details-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.equipment-list {
  max-height: 300px; /* Significantly increased height for mobile view */
  overflow-y: auto;
}

.equipment-rules {
  color: rgba(0, 0, 0, 0.6);
  white-space: normal;
  display: block;
  line-height: 1.3;
  padding: 4px 8px 6px 0;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  margin-top: 4px;
}

/* Mobile responsive layout */
@media (max-width: 600px) {
  .unit-container {
    flex-direction: column;
  }

  .unit-image-container {
    width: 100%;
    min-width: 100%;
    height: 200px;
    min-height: 200px;
    border-right: none;
    border-bottom: 1px solid rgba(80, 0, 0, 0.3);
  }

  .unit-details-container {
    width: 100%;
  }

  .unit-details-container .v-card-title {
    padding-top: 16px;
  }

  .equipment-list {
    max-height: 300px;
  }
}
</style>
