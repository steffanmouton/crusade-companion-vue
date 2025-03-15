import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'
import type { User, Session } from '@supabase/supabase-js'

// Create Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)

  // Computed properties
  const isAuthenticated = computed(() => !!user.value)

  // Initialize the store
  async function initialize() {
    loading.value = true

    try {
      // Get initial session
      const { data: sessionData } = await supabase.auth.getSession()
      session.value = sessionData.session

      if (sessionData.session) {
        // If we have a session, get the user
        const { data } = await supabase.auth.getUser()
        user.value = data.user
      } else {
        user.value = null
      }

      // Set up auth state change listener
      supabase.auth.onAuthStateChange((event, newSession) => {
        session.value = newSession
        user.value = newSession?.user || null
      })
    } catch (error) {
      console.error('Failed to initialize auth store:', error)
      user.value = null
      session.value = null
    } finally {
      loading.value = false
    }
  }

  // Sign in with email and password
  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      user.value = data.user
      session.value = data.session

      return { success: true, data, error: null }
    } catch (error: any) {
      return { success: false, data: null, error }
    }
  }

  // Sign up with email and password
  async function signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      return { success: true, data, error: null }
    } catch (error: any) {
      return { success: false, data: null, error }
    }
  }

  // Sign out
  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      user.value = null
      session.value = null

      return { success: true, error: null }
    } catch (error: any) {
      return { success: false, error }
    }
  }

  return {
    user,
    session,
    loading,
    isAuthenticated,
    initialize,
    signIn,
    signUp,
    signOut,
  }
})
