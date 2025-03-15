<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createClient } from '@supabase/supabase-js'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

// Create Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const router = useRouter()
const user = ref<any>(null)
const isLoading = ref(true)

// Get user data
onMounted(async () => {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    user.value = data.user
  } catch (error) {
    console.error('Error fetching user:', error)
  } finally {
    isLoading.value = false
  }
})

// Handle logout
const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push('/login')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
    <!-- Header with navigation -->
    <header class="bg-slate-800 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-emerald-400">Trench Crusade Companion</h1>
        </div>
        <div class="flex items-center space-x-4">
          <div v-if="!isLoading && user" class="text-sm text-slate-300">
            {{ user.email }}
          </div>
          <button
            @click="handleLogout"
            class="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-md text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"
      ></div>
    </div>

    <!-- Dashboard content when loaded -->
    <main v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-slate-700 rounded-lg shadow-xl p-6">
        <h2 class="text-2xl font-semibold mb-4 text-emerald-300">Your Army Lists</h2>

        <!-- Tab navigation -->
        <TabGroup>
          <TabList class="flex space-x-1 rounded-xl bg-slate-800 p-1 mb-6">
            <Tab v-slot="{ selected }" as="template">
              <button
                :class="[
                  'w-full py-2 text-sm font-medium leading-5 rounded-lg',
                  'ring-white/60 ring-offset-2 ring-offset-slate-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white',
                ]"
              >
                My Armies
              </button>
            </Tab>
            <Tab v-slot="{ selected }" as="template">
              <button
                :class="[
                  'w-full py-2 text-sm font-medium leading-5 rounded-lg',
                  'ring-white/60 ring-offset-2 ring-offset-slate-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white',
                ]"
              >
                Create New
              </button>
            </Tab>
            <Tab v-slot="{ selected }" as="template">
              <button
                :class="[
                  'w-full py-2 text-sm font-medium leading-5 rounded-lg',
                  'ring-white/60 ring-offset-2 ring-offset-slate-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white',
                ]"
              >
                Rules Reference
              </button>
            </Tab>
          </TabList>

          <TabPanels>
            <!-- My Armies Panel -->
            <TabPanel>
              <div class="bg-slate-800 rounded-lg p-6">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-medium text-emerald-300">Saved Army Lists</h3>
                  <button class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-md text-sm">
                    Import List
                  </button>
                </div>

                <!-- Empty state -->
                <div class="text-center py-16 border-2 border-dashed border-slate-600 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-12 w-12 mx-auto text-slate-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <p class="text-slate-400 mb-2">You haven't created any army lists yet</p>
                  <button
                    class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-md text-sm font-medium"
                  >
                    Create Your First Army
                  </button>
                </div>
              </div>
            </TabPanel>

            <!-- Create New Panel -->
            <TabPanel>
              <div class="bg-slate-800 rounded-lg p-6">
                <h3 class="text-lg font-medium text-emerald-300 mb-4">Create New Army List</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Faction selection cards (simplified version) -->
                  <div class="bg-slate-700 border-l-4 border-red-500 rounded-lg p-4">
                    <h3 class="font-bold text-lg text-red-400">Heretic Legion</h3>
                    <p class="text-sm mb-4">
                      The main military force of Satan on Earth, raised from amongst citizens of the
                      damned.
                    </p>
                    <button
                      class="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
                    >
                      Select
                    </button>
                  </div>

                  <div class="bg-slate-700 border-l-4 border-blue-500 rounded-lg p-4">
                    <h3 class="font-bold text-lg text-blue-400">Trench Pilgrims</h3>
                    <p class="text-sm mb-4">
                      Men and women touched by Heaven are granted visions and Revelations.
                    </p>
                    <button
                      class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                    >
                      Select
                    </button>
                  </div>

                  <!-- More faction cards would go here -->
                </div>
              </div>
            </TabPanel>

            <!-- Rules Reference Panel -->
            <TabPanel>
              <div class="bg-slate-800 rounded-lg p-6">
                <h3 class="text-lg font-medium text-emerald-300 mb-4">Rules Reference</h3>

                <div class="text-slate-300">
                  <p class="mb-4">
                    This section will provide quick reference to the rules for Trench Crusade,
                    including:
                  </p>
                  <ul class="list-disc pl-6 space-y-2">
                    <li>Warband creation rules</li>
                    <li>Unit stats and abilities</li>
                    <li>Weapon profiles</li>
                    <li>Keywords and game mechanics</li>
                    <li>Custom scenarios</li>
                  </ul>

                  <div class="mt-6 p-4 bg-slate-700 rounded-lg">
                    <p class="text-sm text-slate-400 italic">
                      Coming soon: Full integration with official game rules and data.
                    </p>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </main>
  </div>
</template>
