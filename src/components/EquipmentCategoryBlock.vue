<template>
  <div class="mb-2">
    <div class="d-flex align-center mb-2">
      <v-icon class="mr-2">{{ icon }}</v-icon>
      <span class="text-subtitle-2 font-weight-medium">{{ title }}</span>
    </div>
    <div class="equipment-list">
      <!-- Equipment loading state -->
      <v-card
        v-if="isLoading"
        class="equipment-slot equipment-slot-loading mb-2"
      >
        <v-card-text class="d-flex align-center justify-center pa-4">
          <v-progress-circular
            indeterminate
            color="primary"
            size="24"
            width="2"
            class="mr-2"
          ></v-progress-circular>
          <div class="text-caption">Loading...</div>
        </v-card-text>
      </v-card>

      <!-- Normal equipment list -->
      <v-card
        v-else
        v-for="item in equipment"
        :key="item.id"
        class="equipment-slot equipment-slot-filled mb-2"
        :class="{
          'has-warning': hasWarning(item),
          'has-error': hasError(item),
          'non-removable': isDefaultEquipment(item) && !isDefaultEquipmentRemovable,
          'equipment-locked': isEquipmentLocked
        }"
        @click="!isEquipmentLocked && (!isDefaultEquipment(item) || isDefaultEquipmentRemovable) ? emit('edit', item) : null"
      >
        <v-card-text class="d-flex align-center justify-space-between pa-4">
          <div>
            <div class="text-subtitle-2">{{ item.name }}</div>
            <div class="d-flex align-center">
              <div class="text-caption text-medium-emphasis mr-2">
                {{ formatEquipmentCost(item) }}
              </div>
              <v-chip
                v-if="item.handedness && item.handedness !== HandednessType.NO_HANDS &&
                      (item.category === EquipmentCategory.SHIELD && !hasShieldComboEquipped)"
                size="x-small"
                color="info"
                :class="['mr-1', item.handedness === HandednessType.ONE_HAND_REQUIRED ? 'font-weight-bold' : '']"
              >
                {{ formatHandedness(item.handedness) }}
              </v-chip>
              <v-chip
                v-else-if="item.handedness && item.handedness !== HandednessType.NO_HANDS &&
                          item.name.toLowerCase().includes('bayonet') && !hasBayonetLugEquipped"
                size="x-small"
                color="info"
                :class="['mr-1', item.handedness === HandednessType.ONE_HANDED ? 'font-weight-bold' : '']"
              >
                {{ formatHandedness(item.handedness) }}
              </v-chip>
              <v-chip
                v-else-if="item.handedness && item.handedness !== HandednessType.NO_HANDS &&
                          (item.category === EquipmentCategory.MELEE_WEAPON || item.category === EquipmentCategory.RANGED_WEAPON)"
                size="x-small"
                color="info"
                :class="['mr-1', item.handedness === HandednessType.TWO_HANDED ? 'font-weight-bold' : '']"
              >
                {{ formatHandedness(item.handedness) }}
              </v-chip>
              <v-chip
                v-else-if="item.handedness && item.handedness !== HandednessType.NO_HANDS"
                size="x-small"
                color="info"
                class="mr-1"
              >
                {{ formatHandedness(item.handedness) }}
              </v-chip>
              <v-tooltip v-if="isDefaultEquipment(item) && !isDefaultEquipmentRemovable" text="This item cannot be removed or modified" location="top">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" size="small" color="grey" class="ml-1">mdi-lock</v-icon>
                </template>
              </v-tooltip>
            </div>
          </div>
          <div>
            <!-- delete button with tooltip -->
            <v-tooltip
              v-if="isEquipmentLocked || (isDefaultEquipment(item) && !isDefaultEquipmentRemovable)"
              :text="isEquipmentLocked ? 'This troop\'s equipment cannot be modified' : 'This item cannot be removed or modified'"
              location="top"
            >
              <template v-slot:activator="{ props: tooltipProps }">
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  color="error"
                  disabled
                  v-bind="tooltipProps"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-tooltip>

            <!-- Normal delete button when not disabled -->
            <v-btn
              v-else
              icon
              size="small"
              variant="text"
              color="error"
              @click.stop="emit('remove', item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
      <v-card
        v-if="!isEquipmentLocked"
        class="equipment-slot"
        @click="emit('add')"
      >
        <v-card-text class="text-center pa-4">
          <v-icon size="large" color="grey-lighten-1">mdi-plus</v-icon>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Equipment } from '../models/equipment'
import { HandednessType, EquipmentCategory } from '../models/equipment'
import type { ValidationResult } from '../utils/equipmentValidator'
import { computed } from 'vue'

const props = defineProps<{
  title: string
  icon: string
  equipment: Equipment[]
  isEquipmentLocked: boolean
  isDefaultEquipmentRemovable: boolean
  defaultEquipment: string[] | undefined
  validationResult: ValidationResult | null
  formatEquipmentCost: (equipment: Equipment) => string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'edit', item: Equipment): void
  (e: 'remove', item: Equipment): void
}>()

// Computed property to check if any item has shield combo
const hasShieldComboEquipped = computed(() => {
  return props.equipment.some(e => e.equipmentIndicator?.shieldCombo === true);
});

// Computed property to check if any item has bayonet lug
const hasBayonetLugEquipped = computed(() => {
  return props.equipment.some(e => e.equipmentIndicator?.hasBayonetLug === true);
});

function isDefaultEquipment(item: Equipment): boolean {
  if (!props.defaultEquipment) return false
  return props.defaultEquipment.includes(item.id)
}

function hasWarning(item: Equipment): boolean {
  if (!props.validationResult) return false
  return props.validationResult.warnings.some(w =>
    w.details?.includes(item.name) || w.message.includes(item.name)
  )
}

function hasError(item: Equipment): boolean {
  if (!props.validationResult) return false
  return props.validationResult.errors.some(e =>
    e.details?.includes(item.name) || e.message.includes(item.name)
  )
}

function formatHandedness(handedness: HandednessType): string {
  switch (handedness) {
    case HandednessType.ONE_HANDED:
      return '1-Hand'
    case HandednessType.TWO_HANDED:
      return '2-Hand'
    case HandednessType.NO_HANDS:
      return 'No Hands'
    case HandednessType.ONE_HAND_REQUIRED:
      return 'Requires Hand'
    default:
      return ''
  }
}
</script>

<style scoped>
.equipment-slot {
  height: 100%;
  min-height: 80px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: rgba(0, 0, 0, 0.02);
  border: 2px dashed rgba(0, 0, 0, 0.12);
}

.equipment-slot:hover {
  background-color: rgba(0, 0, 0, 0.05);
  border-color: rgba(var(--v-theme-primary), 0.5);
}

.equipment-slot-filled {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.equipment-slot-filled:hover {
  border-color: rgba(var(--v-theme-primary), 0.5);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.equipment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.has-warning {
  border: 1px solid orange !important;
}

.has-error {
  border: 1px solid red !important;
}

.equipment-slot-loading {
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px dashed rgba(0, 0, 0, 0.12);
}
</style>
