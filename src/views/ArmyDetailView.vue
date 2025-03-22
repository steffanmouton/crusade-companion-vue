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
                <p class="text-subtitle-1">
                  {{ army.faction }} | {{ army.currentPoints }}/{{ army.targetPoints }} pts
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

            <!-- Units section placeholder -->
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
                >
                  Add Unit
                </v-btn>
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
  </v-app>
</template>
