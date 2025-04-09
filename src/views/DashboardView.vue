<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useArmyStore } from '../stores/army'
import { useWarbandVariantStore } from '../stores/warbandVariantStore'
import { getFirestore, getDoc, doc } from 'firebase/firestore'
import { auth } from '../services/firebase'
import RulebookVersionSelector from '../components/RulebookVersionSelector.vue'

const router = useRouter()
const authStore = useAuthStore()
const armyStore = useArmyStore()
const warbandVariantStore = useWarbandVariantStore()

// Admin state
const isAdmin = ref(false)
const checkingAdmin = ref(false)

// Computed properties based on the auth store
const user = computed(() => authStore.user)
const isLoading = computed(() => authStore.loading || armyStore.loading)
const hasArmies = computed(() => armyStore.versionMatchingArmies.length > 0)

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

// Navigate to admin dashboard
const goToAdmin = () => {
  router.push('/admin')
}

// Check if user is admin
const checkAdminStatus = async () => {
  if (!authStore.isAuthenticated || !auth.currentUser) return

  checkingAdmin.value = true
  try {
    const db = getFirestore()
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
    isAdmin.value = userDoc.exists() && userDoc.data()?.admin === true
  } catch (error) {
    console.error('Error checking admin status:', error)
    isAdmin.value = false
  } finally {
    checkingAdmin.value = false
  }
}

// Load armies on component mount
onMounted(async () => {
  if (authStore.user) {
    await armyStore.loadArmies()
    await checkAdminStatus()

    // Load warband variants for display
    await warbandVariantStore.fetchWarbandVariants()
  }
})

// Function to get the warband variant name for an army
function getWarbandVariantName(army: any) {
  if (!army.warbandVariantId) return null
  return (
    warbandVariantStore.warbandVariants.find((v) => v.id === army.warbandVariantId)?.name || null
  )
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
      <v-btn @click="handleLogout" variant="text" prepend-icon="mdi-logout" class="tc-btn">
        Sign Out
      </v-btn>
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

      <!-- Dashboard content when loaded -->
      <v-container v-else class="py-8">
        <v-card class="mx-auto tc-card" max-width="800" elevation="1">
          <v-card-title class="text-h4 font-weight-medium tc-heading pt-4 px-4">
            Dashboard
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-card variant="outlined" class="mb-4 tc-card tc-highlight-bg" elevation="0">
                  <v-card-text class="text-center py-4">
                    <v-icon icon="mdi-account" color="primary" size="x-large" class="mb-2"></v-icon>
                    <h3 class="text-h6 font-weight-medium mb-2 tc-heading">Your Account</h3>
                    <p class="text-body-2 mb-0">{{ user?.email }}</p>

                    <!-- Admin Button -->
                    <v-btn
                      v-if="isAdmin"
                      color="error"
                      prepend-icon="mdi-shield-crown"
                      @click="goToAdmin"
                      class="mt-3"
                      size="small"
                      variant="flat"
                    >
                      Admin Panel
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Armies Section -->
            <v-row>
              <v-col cols="12">
                <div class="d-flex align-center mb-4">
                  <h3 class="text-h5 font-weight-medium mb-0 tc-heading">Your Armies</h3>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-plus"
                    @click="createArmy"
                    size="small"
                    class="tc-btn"
                    elevation="0"
                    variant="flat"
                  >
                    New Army
                  </v-btn>
                </div>

                <!-- Rulebook Version Selector -->
                <RulebookVersionSelector class="mb-4" />

                <hr class="tc-divider" />

                <!-- No armies message -->
                <v-card
                  v-if="!hasArmies"
                  variant="outlined"
                  class="text-center pa-4 tc-card"
                  elevation="0"
                >
                  <v-icon
                    icon="mdi-sword-cross"
                    size="large"
                    color="secondary"
                    class="mb-2"
                  ></v-icon>
                  <p class="text-medium-emphasis mb-2">
                    You don't have any armies for the selected rulebook version.
                  </p>
                  <v-btn
                    color="primary"
                    prepend-icon="mdi-plus"
                    @click="createArmy"
                    class="tc-btn"
                    elevation="0"
                    variant="flat"
                  >
                    Create An Army
                  </v-btn>
                </v-card>

                <!-- Army list -->
                <v-list v-else lines="two" class="tc-card pa-0" rounded="lg" elevation="0">
                  <v-list-item
                    v-for="army in armyStore.versionMatchingArmies"
                    :key="army.id"
                    @click="viewArmy(army.id)"
                    class="tc-btn"
                    rounded="0"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="primary" class="mr-3" variant="flat">
                        <v-icon icon="mdi-shield-outline"></v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="text-h6 font-weight-medium tc-heading">
                      {{ army.name }}
                    </v-list-item-title>

                    <v-list-item-subtitle>
                      {{ army.faction }}
                      <template v-if="getWarbandVariantName(army)">
                        |
                        <span class="text-primary font-weight-medium">{{
                          getWarbandVariantName(army)
                        }}</span>
                      </template>
                      | {{ army.currentPoints }}/{{ army.targetPoints }} pts
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <v-chip size="small" color="success" variant="flat" class="mr-2">
                        Glory: {{ army.currency }}
                      </v-chip>
                      <v-chip size="small" color="info" variant="flat">
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
    <v-footer app class="tc-footer text-center d-flex justify-center">
      <span class="text-caption">
        &copy; {{ new Date().getFullYear() }} Crusade Companion | RocketSheep LLC
      </span>
    </v-footer>
  </v-app>
</template>
