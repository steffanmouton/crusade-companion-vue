<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8">
    <header class="mb-8">
      <h1 class="text-4xl font-bold text-emerald-400 mb-2">Trench Crusade Companion</h1>
      <p class="text-slate-300 italic">Your ultimate army builder and reference</p>
    </header>

    <div class="bg-slate-700 rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
      <h2 class="text-2xl font-semibold mb-4 text-emerald-300">Faction Selection</h2>

      <!-- Tab Group -->
      <TabGroup>
        <TabList class="flex space-x-1 rounded-xl bg-slate-800 p-1">
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
              Factions
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
              Units
            </button>
          </Tab>
        </TabList>

        <TabPanels class="mt-2">
          <TabPanel class="rounded-xl bg-slate-800 p-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Faction Cards -->
              <div class="bg-slate-700 border-l-4 border-red-500 rounded-lg p-4">
                <h3 class="font-bold text-lg text-red-400">Heretic Legion</h3>
                <p class="text-sm mb-4">
                  The main military force of Satan on Earth, raised from amongst citizens of the
                  damned.
                </p>
                <button class="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded">
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
            </div>
          </TabPanel>

          <TabPanel class="rounded-xl bg-slate-800 p-3">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-700">
                  <th class="text-left py-2 px-3">Unit</th>
                  <th class="text-left py-2 px-3">Cost</th>
                  <th class="text-left py-2 px-3">Type</th>
                  <th class="text-left py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t border-slate-600">
                  <td class="py-2 px-3">Heretic Priest</td>
                  <td class="py-2 px-3 font-mono">80 ducats</td>
                  <td class="py-2 px-3">
                    <span class="px-2 py-1 bg-red-600 text-white text-xs rounded-full">Elite</span>
                  </td>
                  <td class="py-2 px-3">
                    <button class="bg-slate-600 hover:bg-slate-500 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
                <!-- More rows would go here -->
              </tbody>
            </table>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      <!-- Notification demo with Disclosure component -->
      <div class="mt-6">
        <Disclosure v-slot="{ open }">
          <DisclosureButton
            class="flex w-full justify-between rounded-lg bg-emerald-600 px-4 py-2 text-left text-sm font-medium text-white hover:bg-emerald-500 focus:outline-none focus-visible:ring focus-visible:ring-emerald-500/75"
          >
            <span>Show Notification</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              :class="open ? 'rotate-180 transform' : ''"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </DisclosureButton>
          <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-white bg-emerald-700 rounded-b-lg">
            Headless UI and Tailwind CSS are working together successfully!
          </DisclosurePanel>
        </Disclosure>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
</script>
