import { defineStore } from 'pinia'
import type { Faction } from '../models/faction'
import { computed, ref } from 'vue'
import { factionSeed } from '../seed/factionSeed'

export const useFactionStore = defineStore('faction', () => {
  const factions = ref<Faction[]>([...factionSeed]);
  
  // Get only factions that can be selected when creating a new army
  const playableFactions = computed(() => {
    return factions.value.filter(faction => faction.isPlayable !== false);
  });
  
  return {
    factions,
    playableFactions
  }
});
