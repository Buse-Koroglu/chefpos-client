import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { STOCK_UNIT_LABELS } from '@/shared/types/ingredient'
import type { ProductItemResponse } from '@/shared/types/product'
import { addProductIngredient, removeProductIngredient } from '@/shared/api/endpoints/products'
import { useLocationIngredients } from '@/features/admin-products/hooks/useLocationIngredients'

const FIELD_CLASSNAME =
  'h-9 rounded-none border border-zinc-200 bg-white px-2.5 text-sm text-zinc-900 outline-none transition-colors focus-visible:border-zinc-400'

interface ProductRecipeSectionProps {
  productId: string
  locationId: string
  locationName: string
  ingredients: ProductItemResponse[]
}

export function ProductRecipeSection({ productId, locationId, locationName, ingredients }: ProductRecipeSectionProps) {
  const queryClient = useQueryClient()
  const { data: availableIngredients = [] } = useLocationIngredients(locationId)

  const [selectedIngredientId, setSelectedIngredientId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const usedIngredientIds = new Set(ingredients.map((item) => item.ingredientId))
  const selectableIngredients = availableIngredients.filter((ingredient) => !usedIngredientIds.has(ingredient.id))

  function invalidateProduct() {
    queryClient.invalidateQueries({ queryKey: ['products', 'detail', productId] })
    queryClient.invalidateQueries({ queryKey: ['products', 'admin'], exact: false })
  }

  async function handleAdd() {
    if (!selectedIngredientId || !quantity || Number(quantity) <= 0) return

    setIsSubmitting(true)
    try {
      await addProductIngredient(productId, {
        locationId,
        ingredientId: selectedIngredientId,
        quantityPerServing: Number(quantity),
      })
      invalidateProduct()
      setSelectedIngredientId('')
      setQuantity('')
      toast.success('Ham madde reçeteye eklendi.')
    } catch {
      toast.error('Ham madde reçeteye eklenemedi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleRemove(productItemId: string) {
    setRemovingId(productItemId)
    try {
      await removeProductIngredient(productId, productItemId, locationId)
      invalidateProduct()
      toast.success('Ham madde reçeteden kaldırıldı.')
    } catch {
      toast.error('Ham madde reçeteden kaldırılamadı.')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="border border-zinc-200">
      <div className="border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold tracking-wide text-zinc-600 uppercase">
        {locationName}
      </div>

      {ingredients.length > 0 && (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-100 text-xs font-medium text-zinc-400">
              <th className="px-3 py-2 font-medium">Ham Madde</th>
              <th className="px-3 py-2 font-medium">Miktar</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {ingredients.map((item) => (
              <tr key={item.id} className="border-b border-zinc-100 last:border-b-0">
                <td className="px-3 py-2 text-zinc-800">{item.ingredientName}</td>
                <td className="px-3 py-2 tabular-nums text-zinc-600">
                  {item.quantityPerServing} {STOCK_UNIT_LABELS[item.unit]}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    disabled={removingId === item.id}
                    className="text-zinc-400 transition-colors hover:text-destructive disabled:opacity-40"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex items-center gap-2 p-3">
        <select
          value={selectedIngredientId}
          onChange={(event) => setSelectedIngredientId(event.target.value)}
          disabled={isSubmitting}
          className={`${FIELD_CLASSNAME} flex-1`}
        >
          <option value="">Ham madde seçin</option>
          {selectableIngredients.map((ingredient) => (
            <option key={ingredient.id} value={ingredient.id}>
              {ingredient.name}
            </option>
          ))}
        </select>
        <input
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          type="number"
          min="0"
          step="0.01"
          placeholder="Miktar"
          disabled={isSubmitting}
          className={`${FIELD_CLASSNAME} w-24`}
        />
        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-none px-3 text-xs"
          onClick={handleAdd}
          disabled={isSubmitting || !selectedIngredientId || !quantity}
        >
          Reçeteye Ekle
        </Button>
      </div>
    </div>
  )
}
