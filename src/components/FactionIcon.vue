<template>
  <img
    :src="iconSrc"
    :alt="`${faction.name} icon`"
    class="faction-icon"
    :width="size"
    :height="size"
    @error="handleImageError"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Faction } from '../models/faction'

// Import the icons we know exist directly
import trenchPilgrimsIcon from '@/assets/icons/icon_trench_pilgrims.png'
import hereticLegionIcon from '@/assets/icons/icon_heretic_legion.png'

const props = defineProps<{
  faction: Faction
  size?: number
}>()

// Default size if not provided
const size = computed(() => props.size || 48)

// Track if the main image failed to load
const useDefaultIcon = ref(false)

// Map of faction names to their imported icons
const iconMap: Record<string, string> = {
  'Trench Pilgrims': trenchPilgrimsIcon,
  'Heretic Legion': hereticLegionIcon,
}

// Determine the icon source
const iconSrc = computed(() => {
  // If the image previously failed to load, use the default
  if (useDefaultIcon.value) {
    return trenchPilgrimsIcon
  }

  // If there's no iconUrl, use the default
  if (!props.faction.iconUrl) {
    return trenchPilgrimsIcon
  }

  // If the URL uses the @ alias, use our icon map
  if (props.faction.iconUrl.startsWith('@/')) {
    // Check if we have a pre-imported icon for this faction
    if (props.faction.name in iconMap) {
      return iconMap[props.faction.name]
    }
    // If not found in our map, use default
    return trenchPilgrimsIcon
  }

  // For regular URLs, use them directly
  return props.faction.iconUrl
})

// Handle image load error
function handleImageError() {
  useDefaultIcon.value = true
}
</script>

<style scoped>
.faction-icon {
  object-fit: contain;
}
</style>
