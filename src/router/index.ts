import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import LoginView from '../views/LoginView.vue'

// Create a promise to resolve the initial auth state
let authReady = false
const authReadyPromise = new Promise<void>((resolve) => {
  // Set up auth state change listener
  const unsubscribe = onAuthStateChanged(auth, () => {
    authReady = true
    unsubscribe()
    resolve()
  })
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
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
      path: '/factions',
      name: 'factions',
      component: () => import('@/views/FactionsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/army/:id',
      name: 'army-detail',
      component: () => import('@/views/ArmyDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/army/new',
      name: 'army-new',
      component: () => import('@/views/ArmyFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/army/:id/edit',
      name: 'army-edit',
      component: () => import('@/views/ArmyFormView.vue'),
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
  // Wait for the auth state to be ready
  if (!authReady) {
    await authReadyPromise
  }

  // Check if the route requires authentication
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest)

  // Get current user
  const isLoggedIn = !!auth.currentUser

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
