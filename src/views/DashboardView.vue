<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useArmyStore } from '../stores/army'

const router = useRouter()
const authStore = useAuthStore()
const armyStore = useArmyStore()

// Computed properties based on the auth store
const user = computed(() => authStore.user)
const isLoading = computed(() => authStore.loading || armyStore.loading)
const hasArmies = computed(() => armyStore.hasArmies)

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

// Navigate to army detail
const viewArmy = (id: string) => {
  router.push(`/army/${id}`)
}

// Create a new army
const createArmy = () => {
  router.push('/army/new')
}

// Load armies on component mount
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await armyStore.loadArmies()
  }
})
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
          <v-card-title class="text-h4 font-weight-bold text-primary pt-4 px-4">
            Dashboard
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-card variant="outlined" class="mb-4">
                  <v-card-text class="text-center py-4">
                    <v-icon icon="mdi-account" color="primary" size="x-large" class="mb-2"></v-icon>
                    <h3 class="text-h6 font-weight-bold mb-2">Your Account</h3>
                    <p class="text-body-2 mb-0">{{ user?.email }}</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Armies Section -->
            <v-row>
              <v-col cols="12">
                <div class="d-flex align-center mb-4">
                  <h3 class="text-h5 font-weight-bold mb-0">Your Armies</h3>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" prepend-icon="mdi-plus" @click="createArmy" size="small">
                    New Army
                  </v-btn>
                </div>

                <!-- No armies message -->
                <v-card v-if="!hasArmies" variant="outlined" class="text-center pa-4">
                  <v-icon icon="mdi-sword-cross" size="large" color="grey" class="mb-2"></v-icon>
                  <p class="text-medium-emphasis mb-2">You don't have any armies yet.</p>
                  <v-btn color="primary" prepend-icon="mdi-plus" @click="createArmy">
                    Create Your First Army
                  </v-btn>
                </v-card>

                <!-- Army list -->
                <v-list v-else lines="two">
                  <v-list-item
                    v-for="army in armyStore.armies"
                    :key="army.id"
                    @click="viewArmy(army.id)"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="primary" class="mr-3">
                        <v-icon icon="mdi-shield-outline"></v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="text-h6 font-weight-bold">
                      {{ army.name }}
                    </v-list-item-title>

                    <v-list-item-subtitle>
                      {{ army.faction }} | {{ army.points }} pts
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <v-chip size="small" color="primary" variant="outlined" class="mr-2">
                        CP: {{ army.crusadePoints }}
                      </v-chip>
                      <v-chip size="small" color="info" variant="outlined">
                        {{ army.battles }} Battles
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
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
