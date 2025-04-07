/**
 * Utility to check if a URL is a valid Firebase Storage URL
 * @param url The URL to check
 * @returns boolean
 */
export function isFirebaseStorageUrl(url: string): boolean {
  return url?.includes('firebasestorage.googleapis.com') ||
         url?.includes('.firebasestorage.app');
}

/**
 * Ensure an image URL is valid for direct display
 * @param url The image URL to validate/process
 * @returns A valid URL for image display
 */
export function getValidImageUrl(url: string | undefined): string {
  if (!url) {
    return '/img/placeholder-unit.jpg';
  }

  // If it's already a Firebase Storage URL, it should be fine
  if (isFirebaseStorageUrl(url)) {
    try {
      // Firebase Storage URLs should always have alt=media parameter to be displayed
      if (!url.includes('alt=media')) {
        const newUrl = url + (url.includes('?') ? '&alt=media' : '?alt=media');
        return newUrl;
      } else {
        // Try to force the browser to reload the image by adding a cache buster
        const cacheBuster = `&t=${Date.now()}`;
        const newUrl = url.includes('#')
          ? url.replace('#', `${cacheBuster}#`)
          : url + cacheBuster;

        return newUrl;
      }
    } catch {
      return url; // Return original URL if any error occurs
    }
  }

  // If it starts with a slash, make sure we don't double it
  if (url.startsWith('/')) {
    return url;
  }

  // If it's a relative path, add leading slash
  return `/${url}`;
}
