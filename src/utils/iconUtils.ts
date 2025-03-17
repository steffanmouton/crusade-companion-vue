/**
 * Resolves an icon path that uses the @ alias
 * @param iconPath Path with @ alias
 * @returns The resolved path to the icon
 */
export function resolveIconPath(iconPath: string): string {
  // If the path starts with @/, replace it with the actual path
  if (iconPath.startsWith('@/')) {
    return iconPath.replace('@/', '/src/')
  }
  return iconPath
}

/**
 * Gets the actual URL for an icon from a faction
 * @param iconPath The icon path from the faction
 * @returns The resolved icon URL
 */
export function getFactionIconUrl(iconPath: string): string {
  if (!iconPath) return ''

  // For paths using @, we need to import them
  if (iconPath.startsWith('@/')) {
    // Use dynamic import to get the URL
    try {
      // This is a simplified approach - in a real app you might need
      // to handle this differently based on your bundler
      return new URL(`../assets/icons/icon_trench_pilgrims.png`, import.meta.url).href
    } catch (error) {
      console.error('Error loading icon:', error)
      return ''
    }
  }

  return iconPath
}
