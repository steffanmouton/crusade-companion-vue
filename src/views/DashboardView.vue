<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Computed properties based on the auth store
const user = computed(() => authStore.user)
const isLoading = computed(() => authStore.loading)

// Handle logout
const handleLogout = async () => {
  try {
    const { success, error } = await authStore.signOut()
    if (!success) throw error
    router.push('/login')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" density="default">
      <v-app-bar-title class="text-h6 font-weight-bold"> Trench Crusade Companion </v-app-bar-title>
      <v-spacer></v-spacer>
      <div v-if="!isLoading && user" class="text-body-2 mr-4">
        {{ user.email }}
      </div>
      <v-btn @click="handleLogout" variant="text" prepend-icon="mdi-logout"> Sign Out </v-btn>
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

      <!-- Dashboard content when loaded -->
      <v-container v-else class="py-8">
        <v-card class="mx-auto" max-width="800">
          <v-card-text class="text-center py-8">
            <v-icon icon="mdi-check-circle" color="success" size="x-large" class="mb-4"></v-icon>
            <h2 class="text-h4 font-weight-bold mb-2 text-primary">You are logged in!</h2>
            <p class="text-body-1 mb-6">Welcome to the Trench Crusade Companion app.</p>

            <v-card class="mx-auto" max-width="500" variant="outlined">
              <v-card-title class="text-primary">Your Account</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon icon="mdi-email"></v-icon>
                    </template>
                    <v-list-item-title>Email</v-list-item-title>
                    <v-list-item-subtitle>{{ user?.email }}</v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon icon="mdi-account"></v-icon>
                    </template>
                    <v-list-item-title>User ID</v-list-item-title>
                    <v-list-item-subtitle>{{ user?.id }}</v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon icon="mdi-clock"></v-icon>
                    </template>
                    <v-list-item-title>Last Sign In</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ new Date(user?.last_sign_in_at || '').toLocaleString() }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
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
