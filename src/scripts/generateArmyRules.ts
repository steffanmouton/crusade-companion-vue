import { getFirestore, collection, doc, setDoc } from 'firebase/firestore'
import { compileArmyRules, createArmyRulesDocId } from '../services/armyRulesService'
import type { Faction } from '../models/faction'
import type { WarbandVariant } from '../models/warbandVariant'
import { CURRENT_RULEBOOK_VERSION } from '../config/appConstants'

/**
 * Generates all possible army rule combinations and uploads them to Firebase
 * @param factions Array of all factions
 * @param variants Array of all warband variants
 */
export async function generateAndUploadArmyRules(
  factions: Faction[],
  variants: WarbandVariant[],
): Promise<void> {
  const db = getFirestore()
  const armyRulesCollection = collection(db, 'armyRules')

  // Generate base faction rules (no variant)
  for (const faction of factions) {
    const baseRules = compileArmyRules(faction)
    const docId = createArmyRulesDocId(faction.id, undefined, CURRENT_RULEBOOK_VERSION)
    await setDoc(doc(armyRulesCollection, docId), {
      ...baseRules,
      id: docId,
      factionId: faction.id,
      warbandVariantId: null,
      lastUpdated: new Date().toISOString(),
    })
    console.log(`Generated base rules for ${faction.name}`)
  }

  // Generate rules for each faction + variant combination
  for (const variant of variants) {
    const faction = factions.find((f) => f.id === variant.factionId)
    if (!faction) {
      console.warn(`Could not find faction ${variant.factionId} for variant ${variant.name}`)
      continue
    }

    const variantRules = compileArmyRules(faction, variant)
    const docId = createArmyRulesDocId(faction.id, variant.id, CURRENT_RULEBOOK_VERSION)
    await setDoc(doc(armyRulesCollection, docId), {
      ...variantRules,
      id: docId,
      factionId: faction.id,
      warbandVariantId: variant.id,
      lastUpdated: new Date().toISOString(),
    })
    console.log(`Generated rules for ${faction.name} + ${variant.name}`)
  }
}

// Example usage:
// import { factions } from '../seed/factionSeed';
// import { warbandVariantsSeed } from '../seed/warbandVariantSeed';
// generateAndUploadArmyRules(factions, warbandVariantsSeed);
