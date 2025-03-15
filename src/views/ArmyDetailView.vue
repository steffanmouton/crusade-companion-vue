<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useArmyStore } from '../stores/army'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const armyStore = useArmyStore()

// Get the army ID from the route params
const armyId = computed(() => route.params.id as string)

// Computed properties
const user = computed(() => authStore.user)
const army = computed(() => armyStore.currentArmy)
const isLoading = computed(() => authStore.loading || armyStore.loading)

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

// Load army on component mount
onMounted(async () => {
  if (armyId.value) {
    await armyStore.loadArmy(armyId.value)
  }
})
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" density="default">
      <v-app-bar-title class="text-h6 font-weight-bold"> Trench Crusade Companion </v-app-bar-title>
      <v-spacer></v-spacer>
      <div v-if="!isLoading && user" class="text-body-2">
        {{ user.email }}
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
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
        <v-card class="mx-auto" max-width="800">
          <v-card-text>
            <!-- Back button -->
            <v-btn
              @click="goBack"
              color="primary"
              variant="text"
              prepend-icon="mdi-arrow-left"
              class="mb-4"
            >
              Back to Dashboard
            </v-btn>

            <!-- Army header -->
            <div class="d-flex align-center mb-6">
              <div>
                <h2 class="text-h4 font-weight-bold text-primary mb-1">{{ army.name }}</h2>
                <p class="text-subtitle-1">{{ army.faction }} | {{ army.points }} pts</p>
              </div>
              <v-spacer></v-spacer>
              <div>
                <v-btn
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-pencil"
                  class="mr-2"
                  @click="editArmy"
                >
                  Edit
                </v-btn>
                <v-btn
                  color="error"
                  variant="outlined"
                  prepend-icon="mdi-delete"
                  @click="deleteArmy"
                >
                  Delete
                </v-btn>
              </div>
            </div>

            <!-- Army stats -->
            <v-row class="mb-6">
              <v-col cols="12" sm="4">
                <v-card variant="outlined" class="text-center pa-4">
                  <v-icon icon="mdi-star" color="warning" size="large" class="mb-2"></v-icon>
                  <h3 class="text-h6 font-weight-bold mb-1">Crusade Points</h3>
                  <p class="text-h4 font-weight-bold">{{ army.crusadePoints }}</p>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4">
                <v-card variant="outlined" class="text-center pa-4">
                  <v-icon
                    icon="mdi-currency-usd"
                    color="success"
                    size="large"
                    class="mb-2"
                  ></v-icon>
                  <h3 class="text-h6 font-weight-bold mb-1">Requisition</h3>
                  <p class="text-h4 font-weight-bold">{{ army.requisitionPoints }}</p>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4">
                <v-card variant="outlined" class="text-center pa-4">
                  <v-icon icon="mdi-sword-cross" color="info" size="large" class="mb-2"></v-icon>
                  <h3 class="text-h6 font-weight-bold mb-1">Battles</h3>
                  <p class="text-h4 font-weight-bold">{{ army.battles }}</p>
                  <div class="d-flex justify-center mt-2">
                    <v-chip size="small" color="success" variant="outlined" class="mr-2">
                      W: {{ army.wins }}
                    </v-chip>
                    <v-chip size="small" color="error" variant="outlined">
                      L: {{ army.losses }}
                    </v-chip>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- Army description -->
            <v-card variant="outlined" class="mb-6 pa-4">
              <h3 class="text-h6 font-weight-bold mb-2">Description</h3>
              <p v-if="army.description" class="text-body-1">{{ army.description }}</p>
              <p v-else class="text-body-1 text-medium-emphasis">No description provided.</p>
            </v-card>

            <!-- Units section placeholder -->
            <v-card variant="outlined" class="pa-4">
              <div class="d-flex align-center mb-4">
                <h3 class="text-h6 font-weight-bold mb-0">Units</h3>
                <v-spacer></v-spacer>
                <v-btn color="primary" size="small" prepend-icon="mdi-plus"> Add Unit </v-btn>
              </div>
              <p class="text-medium-emphasis text-center py-4">
                No units added yet. Click "Add Unit" to add your first unit.
              </p>
            </v-card>
          </v-card-text>
        </v-card>
      </v-container>

      <!-- Not found message -->
      <v-container v-else class="py-8">
        <v-card class="mx-auto text-center pa-6" max-width="500">
          <v-icon icon="mdi-alert" color="warning" size="x-large" class="mb-4"></v-icon>
          <h2 class="text-h4 font-weight-bold mb-2">Army Not Found</h2>
          <p class="text-body-1 mb-4">
            The army you're looking for doesn't exist or has been deleted.
          </p>
          <v-btn color="primary" prepend-icon="mdi-arrow-left" @click="goBack">
            Back to Dashboard
          </v-btn>
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
