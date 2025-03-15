<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const router = useRouter()

// Form state
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Computed properties
const formTitle = computed(() => (isLogin.value ? 'Sign In' : 'Create Account'))
const submitButtonText = computed(() => (isLogin.value ? 'Sign In' : 'Register'))
const toggleModeText = computed(() =>
  isLogin.value ? "Don't have an account? Register" : 'Already have an account? Sign In',
)

// Toggle between login and register modes
const toggleMode = () => {
  isLogin.value = !isLogin.value
  errorMessage.value = ''
  successMessage.value = ''
}

// Form validation
const validateForm = (): boolean => {
  errorMessage.value = ''

  if (!email.value.trim()) {
    errorMessage.value = 'Email is required'
    return false
  }

  if (!password.value) {
    errorMessage.value = 'Password is required'
    return false
  }

  if (!isLogin.value && password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return false
  }

  if (!isLogin.value && password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return false
  }

  return true
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (isLogin.value) {
      // Handle login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })

      if (error) throw error

      // Successful login - redirect to dashboard
      router.push('/dashboard')
    } else {
      // Handle registration
      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })

      if (error) throw error

      successMessage.value = 'Registration successful! Check your email for confirmation.'
      // Optionally switch to login mode after successful registration
      isLogin.value = true
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred'
    console.error('Auth error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4"
  >
    <div class="max-w-md w-full">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-emerald-400 mb-2">Trench Crusade</h1>
        <p class="text-slate-300 italic">Companion App</p>
      </div>

      <!-- Auth Form Card -->
      <div
        class="bg-slate-700 rounded-lg shadow-2xl p-8 border border-slate-600 relative overflow-hidden"
      >
        <!-- Decorative elements to match theme -->
        <div
          class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-emerald-500 to-blue-500"
        ></div>

        <!-- Form Header -->
        <h2 class="text-2xl font-semibold text-emerald-300 mb-6">{{ formTitle }}</h2>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="mb-4 p-3 bg-red-900/50 border border-red-600 rounded text-white text-sm"
        >
          {{ errorMessage }}
        </div>

        <!-- Success Message -->
        <div
          v-if="successMessage"
          class="mb-4 p-3 bg-emerald-900/50 border border-emerald-600 rounded text-white text-sm"
        >
          {{ successMessage }}
        </div>

        <!-- Auth Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-white"
              :disabled="isLoading"
              autocomplete="email"
            />
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-slate-300 mb-1"
              >Password</label
            >
            <input
              id="password"
              v-model="password"
              type="password"
              class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-white"
              :disabled="isLoading"
              autocomplete="current-password"
            />
          </div>

          <!-- Confirm Password Field (Register only) -->
          <div v-if="!isLogin">
            <label for="confirmPassword" class="block text-sm font-medium text-slate-300 mb-1"
              >Confirm Password</label
            >
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 text-white"
              :disabled="isLoading"
              autocomplete="new-password"
            />
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="inline-block animate-spin mr-2">
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              {{ submitButtonText }}
            </button>
          </div>

          <!-- Toggle Mode Link -->
          <div class="text-center mt-4">
            <button
              type="button"
              @click="toggleMode"
              class="text-sm text-emerald-400 hover:text-emerald-300 focus:outline-none"
              :disabled="isLoading"
            >
              {{ toggleModeText }}
            </button>
          </div>
        </form>

        <!-- Thematic decorative element -->
        <div class="absolute bottom-0 right-0 w-32 h-32 opacity-5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z"
            />
            <path
              fillRule="evenodd"
              d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z"
              clipRule="evenodd"
            />
            <path d="M12 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
          </svg>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-6 text-center text-xs text-slate-400">
        <p>&copy; 2025 Trench Crusade Companion | Factory Fortress Inc.</p>
      </div>
    </div>
  </div>
</template>
