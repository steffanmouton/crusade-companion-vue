/**
 * Enum representing the available currency types in the game.
 * This can be expanded for additional games in the future.
 */
export enum CurrencyType {
  // Trench Crusade currencies
  DUCATS = 'ducats',
  GLORY_POINTS = 'gloryPoints',

  // Reserve for future game systems
  // CUSTOM_CURRENCY_1 = 'customCurrency1',
  // CUSTOM_CURRENCY_2 = 'customCurrency2',
}

/**
 * Interface for a single currency cost
 */
export interface CurrencyCost {
  type: CurrencyType
  amount: number
}

/**
 * Interface for the cost of an item, which may include multiple currencies
 */
export interface Cost {
  /**
   * Array of currency costs. If empty, the item is free.
   */
  currencies: CurrencyCost[]
}

/**
 * Convenience function to get the cost of a specific currency type
 */
export function getCostForCurrency(cost: Cost, currencyType: CurrencyType): number {
  const currencyCost = cost.currencies.find((c) => c.type === currencyType)
  return currencyCost ? currencyCost.amount : 0
}

/**
 * Convenience function to create a Ducats cost
 */
export function createDucatsCost(amount: number): Cost {
  return {
    currencies: [{ type: CurrencyType.DUCATS, amount }],
  }
}

/**
 * Convenience function to create a Glory Points cost
 */
export function createGloryPointsCost(amount: number): Cost {
  return {
    currencies: [{ type: CurrencyType.GLORY_POINTS, amount }],
  }
}

/**
 * Convenience function to create a cost with both Ducats and Glory Points
 */
export function createMixedCost(ducatsAmount: number, gloryPointsAmount: number): Cost {
  return {
    currencies: [
      { type: CurrencyType.DUCATS, amount: ducatsAmount },
      { type: CurrencyType.GLORY_POINTS, amount: gloryPointsAmount },
    ],
  }
}

/**
 * Display the cost in a formatted way
 */
export function formatCost(cost: Cost): string {
  if (!cost.currencies.length) {
    return 'Free'
  }

  return cost.currencies
    .filter((c) => c.amount !== 0)
    .map((c) => {
      switch (c.type) {
        case CurrencyType.DUCATS:
          return `${c.amount} Ducats`
        case CurrencyType.GLORY_POINTS:
          return `${c.amount} Glory Points`
        default:
          return `${c.amount} ${c.type}`
      }
    })
    .join(', ')
}
