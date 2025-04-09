import { generateAndUploadArmyRules } from './generateArmyRules'
import { useFactionStore } from '../stores/factionStore'
import { useWarbandVariantStore } from '../stores/warbandVariantStore'

export interface GenerateArmyRulesResult {
  success: boolean
  message: string
  stats: {
    factions: number
    variants: number
    totalCombinations: number
  }
}

/**
 * Generates all army rules combinations and uploads them to Firebase
 * Can be run from the admin panel
 */
export async function generateAllArmyRules(): Promise<GenerateArmyRulesResult> {
  // Get the stores
  const factionStore = useFactionStore()
  const warbandVariantStore = useWarbandVariantStore()

  try {
    // Ensure factions and variants are loaded
    await factionStore.syncWithFirestore()
    await warbandVariantStore.fetchWarbandVariants()

    // Generate and upload rules
    await generateAndUploadArmyRules(factionStore.factions, warbandVariantStore.warbandVariants)

    console.log('Successfully generated and uploaded all army rules')
    return {
      success: true,
      message: 'Successfully generated and uploaded all army rules',
      stats: {
        factions: factionStore.factions.length,
        variants: warbandVariantStore.warbandVariants.length,
        totalCombinations:
          factionStore.factions.length + warbandVariantStore.warbandVariants.length,
      },
    }
  } catch (error) {
    console.error('Error generating army rules:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      stats: {
        factions: 0,
        variants: 0,
        totalCombinations: 0,
      },
    }
  }
}
