import {
  doc,
  getDoc,
  setDoc,
  where,
  orderBy,
  limit as firestoreLimit,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from './firebase'
import type { RulebookVersion } from '../models/rulebookVersion'
import { addDocument, getDocuments, updateDocument } from './firestore'
import { getTimestamp } from './firestore'
import { CURRENT_RULEBOOK_VERSION } from '../config/appConstants'

const COLLECTION = 'rulebookVersions'

/**
 * Gets all rulebook versions, ordered by release date (newest first by default)
 */
export async function getRulebookVersions(
  newestFirst = true,
  limitCount?: number,
): Promise<RulebookVersion[]> {
  const constraints: QueryConstraint[] = [orderBy('releaseDate', newestFirst ? 'desc' : 'asc')]

  if (limitCount) {
    constraints.push(firestoreLimit(limitCount))
  }

  return getDocuments<RulebookVersion>(COLLECTION, constraints)
}

/**
 * Gets the currently active rulebook version
 */
export async function getActiveRulebookVersion(): Promise<RulebookVersion | null> {
  const versions = await getDocuments<RulebookVersion>(COLLECTION, [
    where('isActive', '==', true),
    firestoreLimit(1),
  ])

  return versions.length > 0 ? versions[0] : null
}

/**
 * Gets a specific rulebook version by ID
 */
export async function getRulebookVersion(id: string): Promise<RulebookVersion | null> {
  try {
    const docRef = doc(db, COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as RulebookVersion
    } else {
      return null
    }
  } catch (error) {
    console.error(`Error getting rulebook version:`, error)
    throw error
  }
}

/**
 * Creates a new rulebook version
 */
export async function createRulebookVersion(version: Omit<RulebookVersion, 'id'>): Promise<string> {
  const timestamp = getTimestamp()

  // Convert to proper format
  const versionData = {
    ...version,
    releaseDate: version.releaseDate || timestamp.createdAt,
    ...timestamp,
  }

  return addDocument(COLLECTION, versionData)
}

/**
 * Updates a rulebook version
 */
export async function updateRulebookVersion(
  id: string,
  data: Partial<RulebookVersion>,
): Promise<void> {
  const updateData = {
    ...data,
    updatedAt: Date.now(),
  }

  return updateDocument(COLLECTION, id, updateData)
}

/**
 * Sets a specific version as the active version
 * This will also deactivate any previously active version
 */
export async function setActiveVersion(id: string): Promise<void> {
  try {
    // First deactivate any currently active versions
    const activeVersions = await getDocuments<RulebookVersion>(COLLECTION, [
      where('isActive', '==', true),
    ])

    for (const version of activeVersions) {
      await updateDocument(COLLECTION, version.id, {
        isActive: false,
        updatedAt: Date.now(),
      })
    }

    // Then activate the specified version
    await updateDocument(COLLECTION, id, {
      isActive: true,
      updatedAt: Date.now(),
    })
  } catch (error) {
    console.error(`Error setting active version:`, error)
    throw error
  }
}

/**
 * Creates an initial rulebook version if none exists yet
 */
export async function initializeRulebookVersions(): Promise<void> {
  try {
    const versions = await getRulebookVersions()

    if (versions.length === 0) {
      // No versions exist yet, create the initial version
      const id = CURRENT_RULEBOOK_VERSION
      await setDoc(doc(db, COLLECTION, id), {
        id,
        displayName: `Crusade Companion ${CURRENT_RULEBOOK_VERSION}`,
        releaseDate: Date.now(),
        isActive: true,
        ...getTimestamp(),
      })
      console.log(`Initialized rulebook version ${CURRENT_RULEBOOK_VERSION}`)
    }
  } catch (error) {
    console.error('Error initializing rulebook versions:', error)
    throw error
  }
}
