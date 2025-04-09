/**
 * Represents a version of the rulebook
 */
export interface RulebookVersion {
  id: string // Typically uses semver format (e.g., "1.6.3")
  displayName: string // Human-readable version name (e.g., "Crusade Companion 1.6.3")
  releaseDate: number // Timestamp of when this version was released
  isActive: boolean // Whether this is the currently active rulebook version
  notes?: string // Optional release notes
}
