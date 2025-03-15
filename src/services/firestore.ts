import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from './firebase'
import { auth } from './firebase'

/**
 * Generic function to get a document by ID
 */
export async function getDocument<T>(collectionName: string, id: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T
    } else {
      return null
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error)
    throw error
  }
}

/**
 * Generic function to get documents with optional query constraints
 */
export async function getDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
): Promise<T[]> {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, ...constraints)
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T)
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error)
    throw error
  }
}

/**
 * Generic function to add a document
 */
export async function addDocument<T extends DocumentData>(
  collectionName: string,
  data: T,
): Promise<string> {
  try {
    // Add user ID to the document if authenticated
    const userId = auth.currentUser?.uid
    const dataWithUser = userId ? { ...data, userId } : data

    const docRef = await addDoc(collection(db, collectionName), dataWithUser)
    return docRef.id
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error)
    throw error
  }
}

/**
 * Generic function to update a document
 */
export async function updateDocument(
  collectionName: string,
  id: string,
  data: Partial<DocumentData>,
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, data)
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error)
    throw error
  }
}

/**
 * Generic function to delete a document
 */
export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error)
    throw error
  }
}

/**
 * Helper function to get documents for the current user
 */
export async function getUserDocuments<T>(collectionName: string): Promise<T[]> {
  const userId = auth.currentUser?.uid

  if (!userId) {
    return []
  }

  return getDocuments<T>(collectionName, [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  ])
}

/**
 * Helper to create a timestamp for document creation
 */
export function getTimestamp(): { createdAt: number; updatedAt: number } {
  const now = Date.now()
  return {
    createdAt: now,
    updatedAt: now,
  }
}
