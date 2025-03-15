<template>
  <v-app class="bg-background">
    <!-- Loading indicator while auth is initializing -->
    <div v-if="authStore.loading" class="d-flex align-center justify-center" style="height: 100vh">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <span class="ml-4 text-primary font-weight-medium">Loading...</span>
    </div>

    <!-- Main app layout with router view when auth is ready -->
    <router-view v-else />
  </v-app>
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
