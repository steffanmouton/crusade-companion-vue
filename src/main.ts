import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

// Import Tailwind styles
import './assets/main.css'

// Create app
const app = createApp(App)

// Set up Pinia
const pinia = createPinia()
app.use(pinia)

// Set up router
app.use(router)

// Initialize the app
const init = async () => {
  // Initialize auth store
  const authStore = useAuthStore()
  await authStore.initialize()

  // Mount the app
  app.mount('#app')
}

init()
