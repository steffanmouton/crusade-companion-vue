import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { useArmyStore } from './stores/army'
import { initializeRulebookVersions } from './services/rulebookVersionService'

// Import Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import './assets/trench-crusade.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'trenchCrusade',
    themes: {
      trenchCrusade: {
        dark: false,
        colors: {
          primary: '#8B0000', // Dark red for headers and primary elements
          secondary: '#4A4A4A', // Dark gray for secondary elements
          accent: '#D4AF37', // Gold accent color
          error: '#B71C1C', // Dark red for errors
          warning: '#F57F17', // Amber for warnings
          info: '#0D47A1', // Dark blue for info
          success: '#1B5E20', // Dark green for success
          background: '#F5F5F0', // Off-white background
          surface: '#FFFFFF', // White surface
          'on-background': '#121212', // Black text on background
          'on-surface': '#121212', // Black text on surface
          'on-primary': '#FFFFFF', // White text on primary
          'on-secondary': '#FFFFFF', // White text on secondary
          'on-accent': '#000000', // Black text on accent
        },
      },
    },
  },
})

// Create app
const app = createApp(App)

// Set up Pinia
const pinia = createPinia()
app.use(pinia)

// Set up router
app.use(router)

// Set up Vuetify
app.use(vuetify)

// Initialize the app
const init = async () => {
  // Initialize rulebook versions
  await initializeRulebookVersions()

  // Initialize auth store
  const authStore = useAuthStore()
  await authStore.initialize()

  // Initialize data stores after auth is initialized
  // This ensures we have user information if needed
  if (authStore.isAuthenticated) {
    // We no longer automatically initialize troops or equipment
    // That should only happen via the admin panel

    // Just load the user's armies
    const armyStore = useArmyStore()
    await armyStore.loadArmies()
  }

  // Mount the app
  app.mount('#app')
}

init()
