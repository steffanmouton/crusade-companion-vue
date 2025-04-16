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
 * Will return a default version if there's an error (like permissions)
 */
export async function getRulebookVersions(
  newestFirst = true,
  limitCount?: number,
): Promise<RulebookVersion[]> {
  try {
    const constraints: QueryConstraint[] = [orderBy('releaseDate', newestFirst ? 'desc' : 'asc')]

    if (limitCount) {
      constraints.push(firestoreLimit(limitCount))
    }

    return await getDocuments<RulebookVersion>(COLLECTION, constraints)
  } catch (error) {
    console.warn('Error fetching rulebook versions, using fallback:', error)
    // Return a default version to avoid breaking the app
    return [
      {
        id: CURRENT_RULEBOOK_VERSION,
        displayName: `Trench Crusade v${CURRENT_RULEBOOK_VERSION}`,
        releaseDate: Date.now(),
        isActive: true,
        notes: 'Default fallback version',
      },
    ]
  }
}

/**
 * Gets the currently active rulebook version
 * Will return the default version if there's an error
 */
export async function getActiveRulebookVersion(): Promise<RulebookVersion | null> {
  try {
    const versions = await getDocuments<RulebookVersion>(COLLECTION, [
      where('isActive', '==', true),
      firestoreLimit(1),
    ])

    return versions.length > 0 ? versions[0] : null
  } catch (error) {
    console.warn('Error getting active rulebook version, using default:', error)
    // Return default version
    return {
      id: CURRENT_RULEBOOK_VERSION,
      displayName: `Trench Crusade v${CURRENT_RULEBOOK_VERSION}`,
      releaseDate: Date.now(),
      isActive: true,
      notes: 'Default fallback version',
    }
  }
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
 * Gracefully handles permission errors by using a client-side fallback
 */
export async function initializeRulebookVersions(): Promise<void> {
  try {
    // First check if the current version document exists directly
    // This avoids a potentially expensive query if we just need the current version
    try {
      const docRef = doc(db, COLLECTION, CURRENT_RULEBOOK_VERSION)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        console.log(`Rulebook version ${CURRENT_RULEBOOK_VERSION} already exists`)
        return // Version exists, nothing to do
      }
    } catch (error) {
      console.warn(
        `Error checking for version ${CURRENT_RULEBOOK_VERSION}, assuming it doesn't exist:`,
        error,
      )
      // Continue to try creating the version
    }

    // Try to create the version
    try {
      const id = CURRENT_RULEBOOK_VERSION
      await setDoc(doc(db, COLLECTION, id), {
        id,
        displayName: `Trench Crusade v${CURRENT_RULEBOOK_VERSION}`,
        releaseDate: Date.now(),
        isActive: true,
        ...getTimestamp(),
      })
      console.log(`Initialized rulebook version ${CURRENT_RULEBOOK_VERSION}`)
    } catch (error) {
      console.warn('Error creating rulebook version - likely permissions issue:', error)
      // Just continue with the default version in memory
    }
  } catch (error) {
    console.warn('Error initializing rulebook versions, using default version:', error)
    // Don't throw the error, just continue with default values
  }
}
