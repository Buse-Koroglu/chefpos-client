import { STOCK_UNIT_LABELS } from '@/shared/types/ingredient'
import { Skeleton } from '@/shared/components/Skeleton'
import type { IngredientWithLocation } from '@/features/admin-ingredients/types'
import { IngredientStatusBadge } from './IngredientStatusBadge'
import { IngredientStockCell } from './IngredientStockCell'

interface IngredientsTableProps {
  ingredients: IngredientWithLocation[]
  onSelect: (ingredientId: string) => void
  isLoading?: boolean
}

const TABLE_HEAD = (
  <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
    <th className="px-4 py-3">Ham Madde</th>
    <th className="px-4 py-3">Yerleşke</th>
    <th className="px-4 py-3">Mevcut Stok</th>
    <th className="px-4 py-3">Minimum Stok</th>
    <th className="px-4 py-3">Durum</th>
  </tr>
)

export function IngredientsTable({ ingredients, onSelect, isLoading }: IngredientsTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>{TABLE_HEAD}</thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index} className="border-b border-zinc-100 last:border-b-0">
                {Array.from({ length: 5 }).map((__, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (ingredients.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center border border-zinc-200 bg-white py-16 text-sm text-zinc-500">
        Filtrelere uygun ham madde bulunamadı.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>{TABLE_HEAD}</thead>
        <tbody>
          {ingredients.map((ingredient) => (
            <tr
              key={ingredient.id}
              onClick={() => onSelect(ingredient.id)}
              className="cursor-pointer border-b border-zinc-100 transition-colors last:border-b-0 hover:bg-zinc-100/80"
            >
              <td className="px-4 py-3 font-medium text-zinc-900">{ingredient.name}</td>
              <td className="px-4 py-3 text-zinc-600">{ingredient.locationName}</td>
              <td className="px-4 py-3">
                <IngredientStockCell
                  currentStock={ingredient.currentStock}
                  unit={ingredient.unit}
                  isBelowThreshold={ingredient.isBelowThreshold}
                />
              </td>
              <td className="px-4 py-3 tabular-nums text-zinc-500">
                {ingredient.minStockThreshold} {STOCK_UNIT_LABELS[ingredient.unit]}
              </td>
              <td className="px-4 py-3">
                <IngredientStatusBadge isActive={ingredient.isActive} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
