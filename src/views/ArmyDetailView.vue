<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Get the army ID from the route params
const armyId = computed(() => Number(route.params.id))

// Computed properties
const user = computed(() => authStore.user)
const isLoading = computed(() => authStore.loading)

// Navigate back to dashboard
const goBack = () => {
  router.push('/dashboard')
}
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
      <v-container v-else class="py-8">
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

            <!-- Army placeholder -->
            <div class="text-center py-8">
              <h2 class="text-h4 font-weight-bold mb-4 text-primary">Army Details</h2>
              <p class="text-body-1 mb-6">Viewing army with ID: {{ armyId }}</p>
              <p class="text-medium-emphasis">This is a placeholder for the army detail view.</p>
            </div>
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
