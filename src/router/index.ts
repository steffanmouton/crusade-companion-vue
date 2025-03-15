import { createRouter, createWebHistory } from 'vue-router'
import { createClient } from '@supabase/supabase-js'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

// Create Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

// Navigation guard to check auth status
router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)

  // Get current user
  const { data } = await supabase.auth.getSession()
  const isLoggedIn = !!data.session

  if (requiresAuth && !isLoggedIn) {
    // If route requires auth and user is not logged in, redirect to login
    next('/login')
  } else if (requiresGuest && isLoggedIn) {
    // If route requires guest and user is logged in, redirect to dashboard
    next('/dashboard')
  } else {
    // Otherwise, proceed as normal
    next()
  }
})

export default router
