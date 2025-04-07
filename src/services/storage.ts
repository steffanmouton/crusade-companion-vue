import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'
import { auth } from './firebase'

/**
 * Maximum image size in bytes (2MB)
 */
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024

/**
 * Supported image types
 */
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

/**
 * Uploads an image file to Firebase Storage with compression
 * @param file The file to upload
 * @param path The storage path (without userId)
 * @returns Promise resolving to the download URL
 */
export async function uploadImage(
  file: File,
  path: string
): Promise<string> {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to upload images')
  }

  // Validate file size
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`File size exceeds the maximum limit of ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`)
  }

  // Validate file type
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type. Please upload JPEG, PNG, or WebP images')
  }

  // Optimize the image before uploading
  const optimizedFile = await compressImage(file)

  // Create a storage reference
  const userId = auth.currentUser.uid
  const timestamp = Date.now()
  const fileName = `${timestamp}_${file.name.replace(/\s+/g, '_')}`
  const fullPath = `users/${userId}/${path}/${fileName}`
  const storageRef = ref(storage, fullPath)

  // Upload the optimized file
  const uploadTask = uploadBytesResumable(storageRef, optimizedFile)

  // Return a promise that resolves with the download URL when upload completes
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      () => {
        // Progress updates are not used here but could be added
      },
      (error) => {
        // Handle upload errors
        reject(error)
      },
      async () => {
        // Upload complete, get download URL
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          resolve(downloadURL)
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}

/**
 * Deletes an image from Firebase Storage
 * @param url The full download URL of the image to delete
 */
export async function deleteImage(url: string): Promise<void> {
  if (!url) return

  try {
    // For Firebase Storage URLs, convert to storage reference
    let storageRef;

    if (url.includes('firebasestorage')) {
      // This is a Firebase Storage URL, need to extract the path
      // Example: https://firebasestorage.googleapis.com/v0/b/crusade-companion.appspot.com/o/users%2FvDbp8m5GQXdVoaAPMWETplziKAu2%2Farmies%2FtuwJApGjJ5K9OYvhHzlf%2Funits%2F1744063305660_ff14before.png?alt=media&token=...

      // Create a reference directly from the URL
      storageRef = ref(storage, url);
    } else {
      // Directly use the path or URL
      storageRef = ref(storage, url);
    }

    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

/**
 * Compresses an image to reduce file size before uploading
 * @param file The original image file
 * @returns Promise resolving to a compressed Blob
 */
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        // Create a canvas element to resize and compress the image
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // Calculate dimensions while maintaining aspect ratio
        let width = img.width
        let height = img.height

        // Maximum dimensions (limit large images)
        const MAX_WIDTH = 1200
        const MAX_HEIGHT = 1200

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        // Set canvas dimensions
        canvas.width = width
        canvas.height = height

        // Draw the image on the canvas
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to blob with quality setting
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('Failed to compress image'))
              }
            },
            file.type,
            0.8 // 80% quality - adjust as needed
          )
        } else {
          reject(new Error('Failed to get canvas context'))
        }
      }
      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
    }
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
  })
}
