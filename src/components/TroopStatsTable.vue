<template>
  <div class="troop-stats-table">
    <div class="stat-container" v-for="(stat, index) in stats" :key="stat.name">
      <div class="stat-name">{{ stat.name }}</div>
      <div class="stat-value">{{ stat.value }}</div>
      <div class="stat-divider" v-if="index < stats.length - 1"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  movement: number
  ranged: number
  melee: number
  armor: number
}>()

// Create an array of stats to display
const stats = computed(() => [
  { name: 'Movement', value: props.movement },
  { name: 'Ranged', value: props.ranged > 0 ? `+${props.ranged}` : props.ranged },
  { name: 'Melee', value: props.melee > 0 ? `+${props.melee}` : props.melee },
  { name: 'Armor', value: props.armor > 0 ? `+${props.armor}` : props.armor },
])
</script>

<style scoped>
.troop-stats-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px;
  background-color: #fafafa;
  border-radius: 8px;
  margin: 8px 0;
  border: 1px solid rgba(139, 0, 0, 0.1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 0 12px;
}

.stat-name {
  font-size: 12px;
  color: #8b0000; /* Dark red to match your theme */
  font-weight: 500;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #212121; /* Almost black */
}

.stat-divider {
  position: absolute;
  right: 0;
  top: 12%;
  height: 76%;
  width: 1px;
  background-color: rgba(139, 0, 0, 0.2); /* Transparent dark red */
}

/* Mobile styles */
@media (max-width: 600px) {
  .troop-stats-table {
    flex-wrap: wrap;
    padding: 8px;
  }

  .stat-container {
    flex: 0 0 50%;
    padding: 8px;
    margin-bottom: 0;
  }

  .stat-container:nth-child(odd) {
    border-right: 1px solid rgba(139, 0, 0, 0.2);
  }

  .stat-container:nth-child(-n + 2) {
    border-bottom: 1px solid rgba(139, 0, 0, 0.2);
  }

  .stat-divider {
    display: none;
  }

  .stat-name {
    font-size: 11px;
    margin-bottom: 4px;
  }

  .stat-value {
    font-size: 18px;
  }
}
</style>
