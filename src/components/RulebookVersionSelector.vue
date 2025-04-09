<template>
  <div class="rulebook-version-selector">
    <v-select
      v-model="selectedVersion"
      :items="availableVersions"
      label="Rulebook Version"
      item-title="displayName"
      item-value="id"
      variant="outlined"
      density="compact"
      :loading="loading"
      @update:model-value="onVersionChange"
    ></v-select>

    <!-- Version mismatch warning -->
    <v-alert
      v-if="hasVersionMismatch && !loading"
      type="warning"
      variant="tonal"
      class="mt-2"
      icon="mdi-alert-circle"
      density="compact"
    >
      Some of your armies are using different rulebook versions. Only armies matching the selected
      version will be displayed.
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getRulebookVersions } from '../services/rulebookVersionService'
import { useArmyStore } from '../stores/army'
import type { RulebookVersion } from '../models/rulebookVersion'
import { CURRENT_RULEBOOK_VERSION } from '../config/appConstants'

// Get the army store
const armyStore = useArmyStore()
const loading = ref(true)
const availableVersions = ref<RulebookVersion[]>([])
const selectedVersion = computed({
  get: () => armyStore.selectedRulebookVersion,
  set: (value: string) => armyStore.setSelectedRulebookVersion(value),
})

// Check if there's a version mismatch
const hasVersionMismatch = computed(() => armyStore.hasArmiesWithVersionMismatch)

// Load available versions
async function loadVersions() {
  loading.value = true
  try {
    // Initialize the selected version in the store
    await armyStore.initializeSelectedVersion()

    // Get all available versions
    const versions = await getRulebookVersions()

    // If no versions are available, add the current version
    if (!versions.length) {
      availableVersions.value = [
        {
          id: CURRENT_RULEBOOK_VERSION,
          displayName: `Trench Crusade v${CURRENT_RULEBOOK_VERSION}`,
          releaseDate: Date.now(),
          isActive: true,
          notes: 'Current version',
        },
      ]
    } else {
      availableVersions.value = versions
    }
  } catch (error) {
    console.error('Error loading rulebook versions:', error)
    // Add default version as fallback
    availableVersions.value = [
      {
        id: CURRENT_RULEBOOK_VERSION,
        displayName: `Trench Crusade v${CURRENT_RULEBOOK_VERSION}`,
        releaseDate: Date.now(),
        isActive: true,
        notes: 'Current version',
      },
    ]
  } finally {
    loading.value = false
  }
}

// Handle version change
function onVersionChange(version: string) {
  console.log(`Rulebook version changed to: ${version}`)
  armyStore.setSelectedRulebookVersion(version)
}

// Initialize
onMounted(() => {
  loadVersions()
})
</script>

<style scoped>
.rulebook-version-selector {
  max-width: 300px;
}
</style>
