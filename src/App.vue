<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
    <!-- Loading indicator while auth is initializing -->
    <div v-if="authStore.loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"
        ></div>
        <p class="mt-4">Loading...</p>
      </div>
    </div>

    <!-- Main app layout with router view when auth is ready -->
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

// Get the auth store
const authStore = useAuthStore()
const router = useRouter()

// On component mount, ensure auth is initialized and redirect based on auth state
onMounted(async () => {
  // Wait for auth to be initialized
  if (!authStore.isAuthenticated && !authStore.loading) {
    // If not authenticated, redirect to login
    router.push('/login')
  } else if (authStore.isAuthenticated) {
    // If authenticated, redirect to dashboard
    router.push('/dashboard')
  }
})
</script>
