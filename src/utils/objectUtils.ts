/**
 * Utility functions for working with objects
 * These utilities help with deep cloning and merging objects
 */

/**
 * Creates a deep clone of an object
 * @param obj The object to clone
 * @returns A deep clone of the object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T
  }

  const clone = {} as Record<string, any>

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone((obj as Record<string, any>)[key])
    }
  }

  return clone as T
}

/**
 * Deeply merges two objects
 * @param target The target object
 * @param source The source object to merge into the target
 * @returns The merged object
 */
export function mergeDeep<T extends Record<string, any>, U extends Record<string, any>>(
  target: T,
  source: U
): T & U {
  const result = { ...target } as Record<string, any>

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = target[key]

      if (
        targetValue &&
        sourceValue &&
        typeof targetValue === 'object' &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        !Array.isArray(targetValue)
      ) {
        // Both target and source are objects, recursively merge them
        result[key] = mergeDeep(targetValue, sourceValue)
      } else {
        // For arrays or primitive values, just replace with source value
        result[key] = deepClone(sourceValue)
      }
    }
  }

  return result as T & U
}
