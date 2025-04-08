import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { GAME_VERSION } from '../config/gameVersion'

export const useVersionStore = defineStore('version', () => {
  const activeVersion = ref(GAME_VERSION)
  const selectedVersion = ref(GAME_VERSION) // For UI purposes, when user wants to view different version
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed property to check if selected version matches active version
  const isViewingActiveVersion = computed(() => selectedVersion.value === activeVersion.value)

  // Fetch the active version from Firestore
  async function fetchActiveVersion() {
    loading.value = true
    error.value = null
    try {
      const db = getFirestore()
      const configRef = doc(db, 'gameConfig', 'version')
      const configDoc = await getDoc(configRef)

      if (configDoc.exists()) {
        activeVersion.value = configDoc.data().activeVersion
        selectedVersion.value = activeVersion.value // Default to active version
      }
    } catch (err) {
      console.error('Error fetching active version:', err)
      error.value = 'Failed to fetch game version'
    } finally {
      loading.value = false
    }
  }

  // Change which version the user is viewing
  function setSelectedVersion(version: string) {
    selectedVersion.value = version
  }

  // Reset selected version to active version
  function resetToActiveVersion() {
    selectedVersion.value = activeVersion.value
  }

  return {
    activeVersion,
    selectedVersion,
    loading,
    error,
    isViewingActiveVersion,
    fetchActiveVersion,
    setSelectedVersion,
    resetToActiveVersion
  }
})
