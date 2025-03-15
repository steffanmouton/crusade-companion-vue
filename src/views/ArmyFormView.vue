<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useArmyStore } from '../stores/army'
import type { Army } from '../types/firebase'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const armyStore = useArmyStore()

// Form state
const name = ref('')
const faction = ref('')
const points = ref(0)
const crusadePoints = ref(0)
const requisitionPoints = ref(0)
const description = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Determine if we're editing or creating
const isEditMode = computed(() => route.name === 'army-edit')
const armyId = computed(() => route.params.id as string)
const formTitle = computed(() => (isEditMode.value ? 'Edit Army' : 'Create New Army'))
const submitButtonText = computed(() => (isEditMode.value ? 'Update Army' : 'Create Army'))

// Load army data if in edit mode
onMounted(async () => {
  if (isEditMode.value && armyId.value) {
    isLoading.value = true

    try {
      const army = await armyStore.loadArmy(armyId.value)

      if (army) {
        // Populate form with army data
        name.value = army.name
        faction.value = army.faction
        points.value = army.points
        crusadePoints.value = army.crusadePoints
        requisitionPoints.value = army.requisitionPoints
        description.value = army.description || ''
      } else {
        errorMessage.value = 'Army not found'
        router.push('/dashboard')
      }
    } catch (error: any) {
      errorMessage.value = error.message || 'Failed to load army'
    } finally {
      isLoading.value = false
    }
  }
})

// Form validation
const validateForm = (): boolean => {
  errorMessage.value = ''

  if (!name.value.trim()) {
    errorMessage.value = 'Army name is required'
    return false
  }

  if (!faction.value.trim()) {
    errorMessage.value = 'Faction is required'
    return false
  }

  if (points.value < 0) {
    errorMessage.value = 'Points cannot be negative'
    return false
  }

  return true
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
        points: points.value,
        crusadePoints: crusadePoints.value,
        requisitionPoints: requisitionPoints.value,
        description: description.value,
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
        points: points.value,
        crusadePoints: crusadePoints.value,
        requisitionPoints: requisitionPoints.value,
        description: description.value,
        battles: 0,
        wins: 0,
        losses: 0,
      })

      if (army) {
        successMessage.value = 'Army created successfully'
        // Navigate to the new army detail after a short delay
        setTimeout(() => router.push(`/army/${army.id}`), 1500)
      } else {
        throw new Error('Failed to create army')
      }
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred'
    console.error('Army form error:', error)
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
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" density="default">
      <v-app-bar-title class="text-h6 font-weight-bold"> Trench Crusade Companion </v-app-bar-title>
      <v-spacer></v-spacer>
      <div v-if="!isLoading && authStore.user" class="text-body-2 mr-4">
        {{ authStore.user.email }}
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
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
        <v-card class="mx-auto" max-width="800">
          <v-card-title class="text-h4 font-weight-bold text-primary pt-4 px-4">
            {{ formTitle }}
          </v-card-title>

          <v-card-text>
            <!-- Back button -->
            <v-btn
              @click="goBack"
              color="primary"
              variant="text"
              prepend-icon="mdi-arrow-left"
              class="mb-4"
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

            <!-- Army Form -->
            <v-form @submit.prevent="handleSubmit">
              <!-- Name Field -->
              <v-text-field
                v-model="name"
                label="Army Name"
                required
                variant="outlined"
                density="comfortable"
                class="mb-2"
              ></v-text-field>

              <!-- Faction Field -->
              <v-text-field
                v-model="faction"
                label="Faction"
                required
                variant="outlined"
                density="comfortable"
                class="mb-2"
              ></v-text-field>

              <!-- Points Field -->
              <v-text-field
                v-model.number="points"
                label="Points"
                type="number"
                variant="outlined"
                density="comfortable"
                class="mb-2"
              ></v-text-field>

              <v-row>
                <v-col cols="12" md="6">
                  <!-- Crusade Points Field -->
                  <v-text-field
                    v-model.number="crusadePoints"
                    label="Crusade Points"
                    type="number"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <!-- Requisition Points Field -->
                  <v-text-field
                    v-model.number="requisitionPoints"
                    label="Requisition Points"
                    type="number"
                    variant="outlined"
                    density="comfortable"
                    class="mb-2"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Description Field -->
              <v-textarea
                v-model="description"
                label="Description"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                rows="4"
              ></v-textarea>

              <!-- Submit Button -->
              <v-btn
                type="submit"
                color="primary"
                block
                :loading="isLoading"
                :disabled="isLoading"
                class="mb-4"
              >
                {{ submitButtonText }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app class="bg-surface-variant text-center d-flex justify-center">
      <span class="text-caption text-medium-emphasis">
        &copy; {{ new Date().getFullYear() }} Crusade Companion | RocketSheep LLC
      </span>
    </v-footer>
  </v-app>
</template>
