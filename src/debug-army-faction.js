// Debug script to check army faction IDs
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, getDoc, doc } from 'firebase/firestore'

// Your web app's Firebase configuration (use environment variables in production)
const firebaseConfig = {
  // Your Firebase config here
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function debugArmyFactions() {
  try {
    console.log('Debugging army factions...')

    // Get all armies
    const armySnapshot = await getDocs(collection(db, 'armies'))

    console.log(`Found ${armySnapshot.size} armies`)

    // Get all factions for reference
    const factionSnapshot = await getDocs(collection(db, 'factions'))
    const factions = factionSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    console.log(`Found ${factions.length} factions:`)
    factions.forEach((f) => console.log(`- ${f.name} (${f.id})`))

    // Check each army's faction
    armySnapshot.docs.forEach((docSnapshot) => {
      const army = {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }

      console.log(`\nArmy: ${army.name} (${army.id})`)
      console.log(`Faction data type: ${typeof army.faction}`)
      console.log(`Faction value: ${JSON.stringify(army.faction)}`)

      // Try to match faction
      let matchedFaction = null

      // Direct ID match
      matchedFaction = factions.find((f) => f.id === army.faction)
      if (matchedFaction) {
        console.log(`Found faction match by ID: ${matchedFaction.name} (${matchedFaction.id})`)
        return
      }

      // Name match
      matchedFaction = factions.find((f) => f.name === army.faction)
      if (matchedFaction) {
        console.log(`Found faction match by name: ${matchedFaction.name} (${matchedFaction.id})`)
        return
      }

      // Partial match
      for (const faction of factions) {
        if (
          (typeof army.faction === 'string' &&
            faction.id.includes(army.faction.toLowerCase().replace(/\s+/g, '-'))) ||
          (typeof army.faction === 'string' &&
            faction.name.toLowerCase() === army.faction.toLowerCase())
        ) {
          console.log(`Found faction match by partial match: ${faction.name} (${faction.id})`)
          matchedFaction = faction
          break
        }
      }

      if (!matchedFaction) {
        console.log(`⚠️ No faction match found for "${army.faction}"`)
      }
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the function
debugArmyFactions()
