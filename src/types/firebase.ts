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
  points: number
  crusadePoints: number
  requisitionPoints: number
  battles: number
  wins: number
  losses: number
  description?: string
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
