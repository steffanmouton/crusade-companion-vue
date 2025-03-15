import type { Equipment } from './equipment'

export enum FactionNames {
  HERETIC_LEGION = 'Heretic Legion',
  TRENCH_PILGRIMS = 'Trench Pilgrims',
  IRON_SULTANATE = 'Iron Sultanate',
  NEW_ANTIOCH = 'New Antioch',
  BLACK_GRAIL = 'Black Grail',
  COURT_OF_THE_SEVEN_HEADED_SERPENT = 'Court of the Seven Headed Serpent',
}

export interface Faction {
  id: string
  name: string
  description: string
  iconUrl?: string
  troopTypes: string[]
  specialRules: string[]
  armory: Equipment[]
}
