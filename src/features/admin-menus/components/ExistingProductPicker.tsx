import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { addProductToMenu } from '@/shared/api/endpoints/menus'
import { useExistingProducts } from '@/features/admin-menus/hooks/useExistingProducts'

const FIELD_CLASSNAME =
  'h-9 flex-1 rounded-none border border-zinc-200 bg-white px-2.5 text-sm text-zinc-900 outline-none transition-colors focus-visible:border-zinc-400'

interface ExistingProductPickerProps {
  menuId: string
  locationId: string
  usedProductIds: Set<string>
}

export function ExistingProductPicker({ menuId, locationId, usedProductIds }: ExistingProductPickerProps) {
  const queryClient = useQueryClient()
  const { data: products = [] } = useExistingProducts(locationId)

  const [selectedProductId, setSelectedProductId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectableProducts = products.filter((product) => !usedProductIds.has(product.id))

  async function handleAdd() {
    if (!selectedProductId) return

    setIsSubmitting(true)
    try {
      await addProductToMenu(menuId, { productId: selectedProductId })
      queryClient.invalidateQueries({ queryKey: ['menus', 'detail', menuId] })
      queryClient.invalidateQueries({ queryKey: ['menus'], exact: false })
      setSelectedProductId('')
      toast.success('Ürün menüye eklendi.')
    } catch {
      toast.error('Ürün menüye eklenemedi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedProductId}
        onChange={(event) => setSelectedProductId(event.target.value)}
        disabled={isSubmitting}
        className={FIELD_CLASSNAME}
      >
        <option value="">Var olan bir ürün seçin</option>
        {selectableProducts.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
      <Button
        type="button"
        variant="outline"
        className="h-9 rounded-none px-3 text-xs"
        onClick={handleAdd}
        disabled={isSubmitting || !selectedProductId}
      >
        Menüye Ekle
      </Button>
    </div>
  )
}
