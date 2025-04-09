<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useArmyStore } from '../stores/army'
import { useWarbandVariantStore } from '../stores/warbandVariantStore'
import { useFactionStore } from '../stores/factionStore'
import RulebookVersionSelector from '../components/RulebookVersionSelector.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const armyStore = useArmyStore()
const warbandVariantStore = useWarbandVariantStore()
const factionStore = useFactionStore()

// Create a list of faction options for the dropdown using playableFactions
const factionOptions = computed(() => {
  return factionStore.playableFactions.map((faction) => ({
    title: faction.name,
    value: faction.name,
  }))
})

// Form state
const name = ref('')
const faction = ref<string>('') // Will set a default after loading factions
const targetPoints = ref(0)
const currency = ref(0) // For Starting Glory Points
const description = ref('')
const warbandVariantId = ref<string | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Determine if we're editing or creating
const isEditMode = computed(() => route.name === 'army-edit')
const armyId = computed(() => route.params.id as string)
const formTitle = computed(() => (isEditMode.value ? 'Edit Army' : 'Create New Army'))
const submitButtonText = computed(() => (isEditMode.value ? 'Update Army' : 'Create Army'))

// Computed property for available warband variants
const availableWarbandVariants = computed(() => {
  const factionId = factionStore.factions.find((f) => f.name === faction.value)?.id
  const variants = warbandVariantStore.warbandVariants.filter(
    (variant) => variant.factionId === factionId,
  )
  console.log(
    `Found ${variants.length} warband variants for faction ${faction.value} (ID: ${factionId})`,
  )
  return variants
})

// Watch for faction changes and reset warband variant if needed
watch(faction, (newFaction) => {
  const factionId = factionStore.factions.find((f) => f.name === newFaction)?.id
  const currentVariant = warbandVariantStore.warbandVariants.find(
    (v) => v.id === warbandVariantId.value,
  )

  // If the selected variant doesn't belong to the new faction, reset it
  if (currentVariant && currentVariant.factionId !== factionId) {
    console.log(
      `Resetting warband variant because faction changed from ${currentVariant.factionId} to ${factionId}`,
    )
    warbandVariantId.value = null
  }
})

// Get the selected rulebook version
const selectedRulebookVersion = computed(() => armyStore.selectedRulebookVersion)

// Load warband variants and factions on mount
onMounted(async () => {
  isLoading.value = true
  try {
    // Make sure factions are loaded
    if (factionStore.factions.length === 0) {
      await factionStore.syncWithFirestore()
    }

    // Load warband variants
    await warbandVariantStore.fetchWarbandVariants()

    console.log('Loaded warband variants:', warbandVariantStore.warbandVariants.length)

    // Set default faction if none is set
    if (!faction.value && factionStore.playableFactions.length > 0) {
      faction.value = factionStore.playableFactions[0].name
    }

    if (isEditMode.value && armyId.value) {
      try {
        const army = await armyStore.loadArmy(armyId.value)

        if (army) {
          // Populate form with army data
          name.value = army.name
          faction.value = army.faction
          targetPoints.value = army.targetPoints
          currency.value = army.currency || 0
          description.value = army.description || ''
          warbandVariantId.value = army.warbandVariantId || null

          console.log('Editing army with warband variant:', warbandVariantId.value)
          console.log(
            'Available warband variants:',
            availableWarbandVariants.value.map((v) => ({ id: v.id, name: v.name })),
          )
        } else {
          errorMessage.value = 'Army not found'
          router.push('/dashboard')
        }
      } catch (error: any) {
        errorMessage.value = error.message || 'Failed to load army'
      }
    }
  } finally {
    isLoading.value = false
  }
})

// Form validation
const validateForm = (): boolean => {
  errorMessage.value = ''

  if (!name.value.trim()) {
    errorMessage.value = 'Army name is required'
    return false
  }

  if (!faction.value) {
    errorMessage.value = 'Faction is required'
    return false
  }

  if (targetPoints.value < 0) {
    errorMessage.value = 'Target Points cannot be negative'
    return false
  }

  return true
}

// Set preset game type values
const setCampaignPreset = () => {
  targetPoints.value = 700
  currency.value = 0
}

const setSkirmishPreset = () => {
  targetPoints.value = 900
  currency.value = 8
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (isEditMode.value) {
      // Update existing army
      const success = await armyStore.updateArmy(armyId.value, {
        name: name.value,
        faction: faction.value,
        targetPoints: targetPoints.value,
        currency: currency.value,
        description: description.value,
        warbandVariantId: warbandVariantId.value || undefined,
      })

      if (success) {
        successMessage.value = 'Army updated successfully'
        // Navigate back to army detail after a short delay
        setTimeout(() => router.push(`/army/${armyId.value}`), 1500)
      } else {
        throw new Error('Failed to update army')
      }
    } else {
      // Create new army
      const army = await armyStore.createArmy({
        name: name.value,
        faction: faction.value,
        currentPoints: 0, // Set to 0 by default, will be calculated from units
        targetPoints: targetPoints.value,
        currency: currency.value,
        description: description.value,
        warbandVariantId: warbandVariantId.value || undefined,
        battles: 0,
        wins: 0,
        losses: 0,
      })

      if (army) {
        successMessage.value = 'Army created successfully'
        // Navigate to the dashboard after a short delay
        setTimeout(() => router.push('/dashboard'), 1500)
      } else {
        throw new Error('Failed to create army')
      }
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to save army'
  } finally {
    isLoading.value = false
  }
}

// Navigate back
const goBack = () => {
  if (isEditMode.value && armyId.value) {
    router.push(`/army/${armyId.value}`)
  } else {
    router.push('/dashboard')
  }
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
</script>

<template>
  <v-app class="bg-background">
    <!-- App Bar -->
    <v-app-bar color="primary" density="default" class="tc-app-bar" elevation="1">
      <v-app-bar-title class="text-h6 font-weight-medium tc-logo-text">
        Crusade Companion
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <div v-if="!isLoading && authStore.user" class="text-body-2 mr-4">
        {{ authStore.user.email }}
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-background">
      <!-- Loading state -->
      <v-container v-if="armyStore.loading || isLoading" class="fill-height" fluid>
        <v-row justify="center" align="center">
          <v-col cols="auto">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          </v-col>
        </v-row>
      </v-container>

      <!-- Form content when loaded -->
      <v-container v-else class="py-8">
        <v-card class="mx-auto tc-card" max-width="800" elevation="1">
          <v-card-title class="text-h4 font-weight-medium tc-heading pt-4 px-4 d-flex align-center">
            {{ formTitle }}
            <v-spacer></v-spacer>
            <v-btn
              v-if="isEditMode"
              color="error"
              variant="flat"
              prepend-icon="mdi-delete"
              class="tc-btn"
              elevation="0"
              @click="deleteArmy"
            >
              Delete Army
            </v-btn>
          </v-card-title>

          <v-card-text>
            <!-- Back button -->
            <v-btn
              @click="goBack"
              color="primary"
              variant="text"
              prepend-icon="mdi-arrow-left"
              class="mb-4 tc-btn"
            >
              Back
            </v-btn>

            <!-- Error Message -->
            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mb-4"
              density="compact"
            >
              {{ errorMessage }}
            </v-alert>

            <!-- Success Message -->
            <v-alert
              v-if="successMessage"
              type="success"
              variant="tonal"
              class="mb-4"
              density="compact"
            >
              {{ successMessage }}
            </v-alert>

            <hr class="tc-divider" />

            <!-- Army Form -->
            <v-form @submit.prevent="handleSubmit">
              <!-- Name Field -->
              <h3 class="text-subtitle-1 font-weight-medium mb-2">Basic Information</h3>
              <v-text-field
                v-model="name"
                label="Army Name"
                required
                variant="outlined"
                density="comfortable"
                class="mb-2 tc-field"
                bg-color="background"
              ></v-text-field>

              <!-- Faction Field -->
              <v-select
                v-model="faction"
                label="Faction"
                :items="factionOptions"
                item-title="title"
                item-value="value"
                variant="outlined"
                density="comfortable"
                class="mb-2 tc-field"
                bg-color="background"
                required
              ></v-select>

              <!-- Rulebook Version -->
              <div class="mb-4">
                <h3 class="text-subtitle-1 font-weight-medium mb-2">Rulebook Version</h3>
                <p class="text-body-2 mb-2">
                  This army will use rules from version
                  <strong>{{ selectedRulebookVersion }}</strong>
                </p>
                <RulebookVersionSelector />
              </div>

              <!-- Warband Variant Field -->
              <v-select
                v-if="availableWarbandVariants.length > 0"
                v-model="warbandVariantId"
                label="Warband Variant (Optional)"
                :items="[{ id: null, name: 'None' }, ...availableWarbandVariants]"
                item-title="name"
                item-value="id"
                variant="outlined"
                density="comfortable"
                class="mb-2 tc-field"
                bg-color="background"
                :hint="
                  warbandVariantId
                    ? availableWarbandVariants.find((v) => v.id === warbandVariantId)?.description
                    : 'Select a warband variant to apply special rules to your army'
                "
                persistent-hint
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :title="undefined">
                    <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                    <v-list-item-subtitle v-if="item.raw.id">{{
                      item.raw.description
                    }}</v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-select>

              <!-- Description Field -->
              <v-textarea
                v-model="description"
                label="Description"
                variant="outlined"
                density="comfortable"
                class="mb-4 tc-field"
                rows="4"
                bg-color="background"
              ></v-textarea>

              <!-- Game Type Settings Section -->
              <h3 class="text-subtitle-1 font-weight-medium mb-2">Game Type Settings</h3>

              <!-- Game Type Presets -->
              <div class="mb-4">
                <p class="text-caption mb-2">Quick Presets:</p>
                <div class="d-flex ga-2">
                  <v-btn
                    @click="setCampaignPreset"
                    color="primary"
                    variant="outlined"
                    size="small"
                    prepend-icon="mdi-castle"
                  >
                    Campaign
                  </v-btn>
                  <v-btn
                    @click="setSkirmishPreset"
                    color="secondary"
                    variant="outlined"
                    size="small"
                    prepend-icon="mdi-sword-cross"
                  >
                    Skirmish
                  </v-btn>
                </div>
              </div>
              <v-text-field
                v-model.number="targetPoints"
                label="Target Points (Ducats)"
                type="number"
                variant="outlined"
                density="comfortable"
                class="mb-2 tc-field"
                bg-color="background"
              ></v-text-field>

              <!-- Currency Field -->
              <v-text-field
                v-model.number="currency"
                label="Starting Glory Points"
                type="number"
                variant="outlined"
                density="comfortable"
                class="mb-2 tc-field"
                bg-color="background"
              ></v-text-field>

              <!-- Submit Button -->
              <v-btn
                type="submit"
                color="primary"
                block
                :loading="isLoading"
                :disabled="isLoading"
                class="mb-4 tc-btn"
                elevation="0"
                variant="flat"
              >
                {{ submitButtonText }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app class="tc-footer text-center d-flex justify-center">
      <span class="text-caption">
        &copy; {{ new Date().getFullYear() }} Crusade Companion | RocketSheep LLC
      </span>
    </v-footer>
  </v-app>
</template>
