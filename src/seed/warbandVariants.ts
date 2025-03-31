import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'
import { warbandVariants } from '../models/warbandVariants'

export async function seedWarbandVariants() {
  const db = getFirestore()
  const collectionRef = collection(db, 'warbandVariants')

  // Clear existing data
  // Note: We'll need to implement a way to clear existing data if needed

  // Add each warband variant
  for (const variant of warbandVariants) {
    try {
      await addDoc(collectionRef, {
        ...variant,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      console.log(`Added warband variant: ${variant.name}`)
    } catch (error) {
      console.error(`Error adding warband variant ${variant.name}:`, error)
      throw error // Re-throw to handle in the admin view
    }
  }
}
