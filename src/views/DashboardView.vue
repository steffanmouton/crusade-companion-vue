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
  <div class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
    <!-- Header with navigation -->
    <header class="bg-slate-800 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-emerald-400">Trench Crusade Companion</h1>
        </div>
        <div class="flex items-center space-x-4">
          <div v-if="!isLoading && user" class="text-sm text-slate-300">
            {{ user.email }}
          </div>
          <button
            @click="handleLogout"
            class="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-md text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"
      ></div>
    </div>

    <!-- Dashboard content when loaded -->
    <main v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-slate-700 rounded-lg shadow-xl p-6 text-center">
        <div class="flex flex-col items-center justify-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 text-emerald-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 class="text-2xl font-semibold mb-2 text-emerald-300">You are logged in!</h2>
          <p class="text-slate-300 mb-6">Welcome to the Trench Crusade Companion app.</p>

          <div class="bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h3 class="text-lg font-medium text-emerald-300 mb-4">Your Account</h3>
            <div class="text-left">
              <p class="mb-2">
                <span class="text-slate-400">Email:</span>
                <span class="text-white">{{ user?.email }}</span>
              </p>
              <p class="mb-2">
                <span class="text-slate-400">User ID:</span>
                <span class="text-white">{{ user?.id }}</span>
              </p>
              <p class="mb-2">
                <span class="text-slate-400">Last Sign In:</span>
                <span class="text-white">{{
                  new Date(user?.last_sign_in_at || '').toLocaleString()
                }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
