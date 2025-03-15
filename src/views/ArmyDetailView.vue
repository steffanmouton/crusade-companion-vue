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
        </div>
      </div>
    </header>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"
      ></div>
    </div>

    <!-- Army detail content when loaded -->
    <main v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-slate-700 rounded-lg shadow-xl p-6">
        <!-- Back button -->
        <button
          @click="goBack"
          class="mb-4 flex items-center text-emerald-400 hover:text-emerald-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
          Back to Dashboard
        </button>

        <!-- Army placeholder -->
        <div class="text-center py-12">
          <h2 class="text-2xl font-semibold mb-4 text-emerald-300">Army Details</h2>
          <p class="text-slate-300 mb-6">Viewing army with ID: {{ armyId }}</p>
          <p class="text-slate-400">This is a placeholder for the army detail view.</p>
        </div>
      </div>
    </main>
  </div>
</template>
