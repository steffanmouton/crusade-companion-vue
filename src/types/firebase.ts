// User profile type
export interface UserProfile {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: number
  updatedAt: number
}

// Army type
export interface Army {
  id: string
  userId: string
  name: string
  faction: string
  currentPoints: number
  targetPoints: number
  currency: number
  battles: number
  wins: number
  losses: number
  description?: string
  warbandVariantId?: string | null
  createdAt: number
  updatedAt: number
}

// Unit type
export interface Unit {
  id: string
  userId: string
  armyId: string
  name: string
  troopId: string
  costPoints: number
  costCurrency: number
  currentEquipment: {
    name: string
    type: string
    modifiers?: string[]
    rules?: string[]
  }[]
  purchasedAbilities: string[]
  imageUrl?: string
  createdAt: number
  updatedAt: number
}

// Battle type
export interface Battle {
  id: string
  userId: string
  armyId: string
  opponentName: string
  opponentFaction: string
  result: 'win' | 'loss' | 'draw'
  points: number
  date: number
  notes?: string
  createdAt: number
  updatedAt: number
}

// Equipment type
export interface Equipment {
  id: string
  name: string
  description: string
  type: string
  costPoints: number
  costCurrency: number
  modifiers: string[]
  keywords: string[]
  equipmentIndicator: object
  rules: string[]
  limit: number
  onlyFor: object
}

// Warband Variant type
export interface WarbandVariant {
  id: string
  name: string
  faction: string
  description: string
  rules: string[]
  equipmentRestrictions?: {
    bannedKeywords?: string[];
    bannedCategories?: string[];
    bannedEquipmentIds?: string[];
  }
  equipmentOverrides?: {
    costOverrides?: Record<string, any>;
    limitOverrides?: Record<string, number>;
  }
  troopOverrides?: {
    costOverrides?: Record<string, any>;
    availabilityOverrides?: Record<string, boolean>;
  }
  createdAt: number
  updatedAt: number
}
