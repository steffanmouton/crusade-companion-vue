import type { Keyword } from './keyword'

export interface Equipment {
  id: string
  name: string
  description: string
  type: string
  costPoints: number
  costCurrency: number
  modifiers: string[]
  keywords: Keyword[]
  hasBayonetLug: boolean
  rules: string[]
  limit: number
  onlyFor: string[]
}
