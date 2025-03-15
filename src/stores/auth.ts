import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth } from '../services/firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)

  // Computed properties
  const isAuthenticated = computed(() => !!user.value)

  // Initialize the store
  async function initialize() {
    loading.value = true

    try {
      // Set up auth state change listener
      onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser
        loading.value = false
      })
    } catch (error) {
      console.error('Failed to initialize auth store:', error)
      user.value = null
      loading.value = false
    }
  }

  // Sign in with email and password
  async function signIn(email: string, password: string) {
    try {
      loading.value = true
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user

      return { success: true, data: userCredential.user, error: null }
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: {
          message: error.message || 'Failed to sign in',
        },
      }
    } finally {
      loading.value = false
    }
  }

  // Sign up with email and password
  async function signUp(email: string, password: string) {
    try {
      loading.value = true
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      return { success: true, data: userCredential.user, error: null }
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: {
          message: error.message || 'Failed to sign up',
        },
      }
    } finally {
      loading.value = false
    }
  }

  // Sign out
  async function signOut() {
    try {
      loading.value = true
      await firebaseSignOut(auth)
      user.value = null

      return { success: true, error: null }
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to sign out',
        },
      }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    initialize,
    signIn,
    signUp,
    signOut,
  }
})
