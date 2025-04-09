<!-- A component that provides UI for generating army rules -->
<template>
  <v-card class="mb-4" elevation="1">
    <v-card-title class="text-h6 font-weight-medium bg-background">
      <v-icon icon="mdi-file-document-multiple" color="primary" class="mr-2"></v-icon>
      Generate Army Rules
    </v-card-title>
    <v-card-text>
      <p class="text-body-2 mb-4">
        This will generate and upload army rules for all factions and their warband variants.
        Generated rules will be stored in Firebase for faster access.
      </p>

      <v-alert
        v-if="result"
        :type="result.success ? 'success' : 'error'"
        class="mb-4"
        variant="outlined"
        density="comfortable"
      >
        {{ result.message }}
        <div v-if="result.success" class="mt-2">
          <strong>Statistics:</strong>
          <ul class="mt-1">
            <li>Factions processed: {{ result.stats.factions }}</li>
            <li>Warband variants processed: {{ result.stats.variants }}</li>
            <li>Total combinations generated: {{ result.stats.totalCombinations }}</li>
          </ul>
        </div>
      </v-alert>

      <v-btn
        block
        color="primary"
        variant="flat"
        :loading="loading"
        :disabled="loading"
        prepend-icon="mdi-database-sync"
        @click="handleGenerate"
        class="mb-4"
      >
        {{ loading ? 'Generating...' : 'Generate Army Rules' }}
      </v-btn>

      <v-divider class="my-4"></v-divider>

      <h3 class="text-subtitle-1 font-weight-medium mb-2">Check Existing Army Rules</h3>
      <v-btn
        block
        color="secondary"
        variant="outlined"
        :loading="checkingRules"
        :disabled="checkingRules || loading"
        prepend-icon="mdi-database-search"
        @click="checkArmyRules"
        class="mb-2"
      >
        Check Pre-compiled Army Rules
      </v-btn>

      <v-expansion-panels v-if="armyRulesStatus.length > 0" class="mt-4">
        <v-expansion-panel>
          <v-expansion-panel-title>
            Army Rules Status
            <template v-slot:actions="{ expanded }">
              <v-icon :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-list>
              <v-list-item v-for="rule in armyRulesStatus" :key="rule.id">
                <v-list-item-title
                  >{{ rule.factionName }}
                  {{ rule.variant ? `- ${rule.variant}` : '(Base)' }}</v-list-item-title
                >
                <v-list-item-subtitle> ID: {{ rule.id }} </v-list-item-subtitle>
                <v-list-item-subtitle>
                  Status:
                  <v-chip :color="rule.exists ? 'success' : 'error'" size="x-small" class="ml-1">{{
                    rule.exists ? 'Generated' : 'Missing'
                  }}</v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import {
  generateAllArmyRules,
  type GenerateArmyRulesResult,
} from '../../scripts/generateAllArmyRules'
import { useFactionStore } from '../../stores/factionStore'
import { useWarbandVariantStore } from '../../stores/warbandVariantStore'

const emit = defineEmits(['addLog'])
const loading = ref(false)
const checkingRules = ref(false)
const result = ref<GenerateArmyRulesResult | null>(null)
const armyRulesStatus = ref<
  Array<{
    id: string
    factionName: string
    variant?: string
    exists: boolean
  }>
>([])

// Load factions and variants
const factionStore = useFactionStore()
const warbandVariantStore = useWarbandVariantStore()

async function handleGenerate() {
  loading.value = true
  result.value = null

  // Log the start of the operation
  emit('addLog', 'Starting generation of army rules...')

  try {
    result.value = await generateAllArmyRules()

    // Log the result
    if (result.value.success) {
      emit(
        'addLog',
        `Successfully generated ${result.value.stats.totalCombinations} army rule combinations`,
      )
    } else {
      emit('addLog', `Failed to generate army rules: ${result.value.message}`)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    result.value = {
      success: false,
      message: errorMessage,
      stats: {
        factions: 0,
        variants: 0,
        totalCombinations: 0,
      },
    }
    emit('addLog', `Error generating army rules: ${errorMessage}`)
  } finally {
    loading.value = false
  }
}

async function checkArmyRules() {
  checkingRules.value = true
  armyRulesStatus.value = []

  emit('addLog', 'Checking existing army rules in Firebase...')

  try {
    // Ensure data is loaded
    await factionStore.syncWithFirestore()
    await warbandVariantStore.fetchWarbandVariants()

    const db = getFirestore()
    const rulesStatus = []

    // Check base faction rules
    for (const faction of factionStore.factions) {
      const docId = `${faction.id}-base`
      const docRef = doc(db, 'armyRules', docId)
      const docSnap = await getDoc(docRef)

      rulesStatus.push({
        id: docId,
        factionName: faction.name,
        exists: docSnap.exists(),
      })
    }

    // Check variant rules
    for (const variant of warbandVariantStore.warbandVariants) {
      const faction = factionStore.factions.find(
        (f) =>
          f.id === variant.factionId ||
          (typeof (variant as any).faction === 'string' && f.id === (variant as any).faction),
      )

      if (faction) {
        const docId = `${faction.id}-${variant.id}`
        const docRef = doc(db, 'armyRules', docId)
        const docSnap = await getDoc(docRef)

        rulesStatus.push({
          id: docId,
          factionName: faction.name,
          variant: variant.name,
          exists: docSnap.exists(),
        })
      }
    }

    armyRulesStatus.value = rulesStatus

    // Count stats
    const totalRules = rulesStatus.length
    const generatedRules = rulesStatus.filter((r) => r.exists).length
    const missingRules = totalRules - generatedRules

    emit(
      'addLog',
      `Army rules check complete: ${generatedRules}/${totalRules} rules generated, ${missingRules} missing`,
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    emit('addLog', `Error checking army rules: ${errorMessage}`)
  } finally {
    checkingRules.value = false
  }
}
</script>
