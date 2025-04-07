// seedEquipment.ts
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { equipmentSeed } from './equipmentSeed'

/**
 * Seed the Firestore database with initial equipment data
 * @param force If true, will delete and recreate all equipment in Firestore
 */
export async function seedEquipment(force = false) {
  try {
    // Check if collection is empty first, unless force is true
    if (!force) {
      const snapshot = await getDocs(collection(db, 'equipment'))
      if (!snapshot.empty) {
        console.log('Equipment collection is not empty, skipping seed')
        return
      }
    } else {
      console.log('Force reseeding equipment...')
      // If force is true, delete all existing documents
      if (force) {
        const snapshot = await getDocs(collection(db, 'equipment'))
        const deletePromises: Promise<void>[] = []
        snapshot.forEach((doc) => {
          console.log(`Deleting equipment: ${doc.id}`)
          deletePromises.push(deleteDoc(doc.ref))
        })
        await Promise.all(deletePromises)
      }
    }

    const seedPromises = equipmentSeed.map(async (equipment) => {
      const equipmentRef = doc(db, 'equipment', equipment.id)
      await setDoc(equipmentRef, equipment)
      console.log(`Seeded equipment: ${equipment.name}`)
    })

    await Promise.all(seedPromises)
    console.log('Equipment collection seeded successfully')
  } catch (err) {
    console.error('Error seeding equipment:', err)
    throw err
  }
}
