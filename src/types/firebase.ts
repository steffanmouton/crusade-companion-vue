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
  warbandVariant?: {
    name: string
    description: string
    rules: string[]
  }
  createdAt: number
  updatedAt: number
}

// Unit type
export interface Unit {
  id: string
  userId: string
  armyId: string
  name: string
  type: string
  power: number
  points: number
  experience: number
  rank: string
  battles: number
  kills: number
  notes?: string
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
