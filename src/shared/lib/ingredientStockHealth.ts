import type { IngredientResponseDto } from '@/shared/types/ingredient'

export type StockHealth = 'CRITICAL' | 'WARNING' | 'NORMAL'

export function getStockHealth(ingredient: IngredientResponseDto): StockHealth {
  if (ingredient.isBelowThreshold) return 'CRITICAL'
  if (ingredient.minStockThreshold > 0 && ingredient.currentStock < ingredient.minStockThreshold * 1.5) {
    return 'WARNING'
  }
  return 'NORMAL'
}
