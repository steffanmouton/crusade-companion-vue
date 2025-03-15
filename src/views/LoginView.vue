<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Form state
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

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
      // Handle login using auth store
      const { success, error } = await authStore.signIn(email.value, password.value)

      if (!success) throw error

      // Successful login - redirect to dashboard
      router.push('/dashboard')
    } else {
      // Handle registration using auth store
      const { success, error } = await authStore.signUp(email.value, password.value)

      if (!success) throw error

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
  <v-container fluid class="fill-height pa-0">
    <v-row no-gutters justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3">
        <v-card class="mx-auto pa-4" elevation="8" max-width="500">
          <!-- Logo/Header -->
          <div class="text-center mb-6">
            <h1 class="text-h4 font-weight-bold text-primary mb-2">Trench Crusade</h1>
            <p class="text-subtitle-1 text-medium-emphasis font-italic">Companion App</p>
          </div>

          <!-- Form Header -->
          <v-card-title class="text-h5 font-weight-bold text-primary pb-2 pt-0">
            {{ formTitle }}
          </v-card-title>

          <!-- Error Message -->
          <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" density="compact">
            {{ errorMessage }}
          </v-alert>

          <!-- Success Message -->
          <v-alert
            v-if="successMessage"
            type="success"
            variant="tonal"
            class="mb-4"
            density="compact"
          >
            {{ successMessage }}
          </v-alert>

          <!-- Auth Form -->
          <v-form @submit.prevent="handleSubmit">
            <!-- Email Field -->
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              :disabled="isLoading"
              variant="outlined"
              density="comfortable"
              autocomplete="email"
              prepend-inner-icon="mdi-email-outline"
              class="mb-2"
            ></v-text-field>

            <!-- Password Field -->
            <v-text-field
              v-model="password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              :disabled="isLoading"
              variant="outlined"
              density="comfortable"
              autocomplete="current-password"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              class="mb-2"
            ></v-text-field>

            <!-- Confirm Password Field (Register only) -->
            <v-text-field
              v-if="!isLogin"
              v-model="confirmPassword"
              label="Confirm Password"
              :type="showConfirmPassword ? 'text' : 'password'"
              :disabled="isLoading"
              variant="outlined"
              density="comfortable"
              autocomplete="new-password"
              prepend-inner-icon="mdi-lock-check-outline"
              :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showConfirmPassword = !showConfirmPassword"
              class="mb-4"
            ></v-text-field>

            <!-- Submit Button -->
            <v-btn
              type="submit"
              color="primary"
              block
              :loading="isLoading"
              :disabled="isLoading"
              class="mb-4"
            >
              {{ submitButtonText }}
            </v-btn>

            <!-- Toggle Mode Link -->
            <div class="text-center">
              <v-btn
                variant="text"
                color="primary"
                @click="toggleMode"
                :disabled="isLoading"
                density="comfortable"
                size="small"
              >
                {{ toggleModeText }}
              </v-btn>
            </div>
          </v-form>
        </v-card>

        <!-- Footer -->
        <div class="text-center mt-6 text-caption text-medium-emphasis">
          <p>&copy; 2025 Crusade Companion | RocketSheep LLC</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
