import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useExistingProducts } from '@/features/admin-menus/hooks/useExistingProducts'
import { useAddProductToMenu } from '@/features/admin-menus/hooks/useAddProductToMenu'

const FIELD_CLASSNAME = 'h-9 flex-1 rounded-none border border-zinc-200 bg-white px-2.5 text-sm text-zinc-900 outline-none transition-colors focus-visible:border-zinc-400'

interface ExistingProductPickerProps {
  menuId: string
  locationId: string
  usedProductIds: Set<string>
}

export function ExistingProductPicker({ menuId, locationId, usedProductIds }: ExistingProductPickerProps) {
  const { data: products = [] } = useExistingProducts(locationId)
  const addProductToMenu = useAddProductToMenu()

  const [selectedProductId, setSelectedProductId] = useState('')

  const selectableProducts = products.filter((product) => !usedProductIds.has(product.id))

  function handleAdd() {
    if (!selectedProductId) return

    addProductToMenu.mutate(
      { menuId, productId: selectedProductId },
      {
        onSuccess: () => {
          setSelectedProductId('')
        },
      },
    )
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedProductId}
        onChange={(event) => setSelectedProductId(event.target.value)}
        disabled={addProductToMenu.isPending}
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
        disabled={addProductToMenu.isPending || !selectedProductId}
      >
        Menüye Ekle
      </Button>
    </div>
  )
}
