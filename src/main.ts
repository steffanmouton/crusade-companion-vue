import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

// Import Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#4CAF50',
          secondary: '#03A9F4',
          accent: '#FF5722',
          error: '#F44336',
          warning: '#FFC107',
          info: '#2196F3',
          success: '#8BC34A',
          background: '#121212',
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
  // Initialize auth store
  const authStore = useAuthStore()
  await authStore.initialize()

  // Mount the app
  app.mount('#app')
}

init()
