<template>
  <v-container fluid class="loading-container">
    <div class="text-center">
      <v-progress-circular
        v-if="loading"
        :size="size"
        :width="width"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <div v-if="text && loading" class="mt-3 text-body-1">{{ text }}</div>
      <v-alert v-if="error" type="error" class="mt-3" :text="errorMessage"></v-alert>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: [String, Object],
    default: '',
  },
  text: {
    type: String,
    default: 'Loading...',
  },
  size: {
    type: Number,
    default: 50,
  },
  width: {
    type: Number,
    default: 5,
  },
})

// Convert error object to string if needed
const errorMessage = computed(() => {
  if (!props.error) return ''
  if (typeof props.error === 'string') return props.error
  if (props.error.message) return props.error.message
  return JSON.stringify(props.error)
})
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}
</style>
