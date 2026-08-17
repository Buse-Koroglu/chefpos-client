import type { IngredientResponseDto } from '@/shared/types/ingredient'

export type IngredientStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE'

export interface IngredientWithLocation extends IngredientResponseDto {
  locationName: string
}
