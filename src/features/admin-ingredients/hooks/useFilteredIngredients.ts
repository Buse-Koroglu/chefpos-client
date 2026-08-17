import { useMemo } from 'react'
import { INGREDIENTS_PAGE_SIZE } from '@/features/admin-ingredients/constants'
import type { IngredientStatusFilter, IngredientWithLocation } from '@/features/admin-ingredients/types'

export interface FilteredIngredientsResult {
  items: IngredientWithLocation[]
  totalCount: number
  totalPages: number
  pageNumber: number
}

export function useFilteredIngredients(
  source: IngredientWithLocation[],
  searchTerm: string,
  status: IngredientStatusFilter,
  pageNumber: number,
): FilteredIngredientsResult {
  return useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase('tr')

    const filtered = source.filter((ingredient) => {
      if (status === 'ACTIVE' && !ingredient.isActive) return false
      if (status === 'INACTIVE' && ingredient.isActive) return false
      if (normalizedSearch && !ingredient.name.toLocaleLowerCase('tr').includes(normalizedSearch)) return false
      return true
    })

    const totalCount = filtered.length
    const totalPages = Math.max(1, Math.ceil(totalCount / INGREDIENTS_PAGE_SIZE))
    const safePageNumber = Math.min(Math.max(pageNumber, 1), totalPages)
    const start = (safePageNumber - 1) * INGREDIENTS_PAGE_SIZE
    const items = filtered.slice(start, start + INGREDIENTS_PAGE_SIZE)

    return { items, totalCount, totalPages, pageNumber: safePageNumber }
  }, [source, searchTerm, status, pageNumber])
}
