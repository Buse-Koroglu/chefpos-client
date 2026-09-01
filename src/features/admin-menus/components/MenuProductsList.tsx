import { useState } from 'react'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import type { MenuProductDto } from '@/shared/types/menu'
import { ProductImagePreview } from '@/features/admin-products/components/ProductImagePreview'
import { ProductRecipeSection } from '@/features/admin-products/components/ProductRecipeSection'
import { useProductDetail } from '@/features/admin-products/hooks/useProductDetail'
import { useRemoveProductFromMenu } from '@/features/admin-menus/hooks/useRemoveProductFromMenu'

interface MenuProductRowProps {
  menuId: string
  locationId: string
  product: MenuProductDto
}

function MenuProductRow({ menuId, locationId, product }: MenuProductRowProps) {
  const removeProductFromMenu = useRemoveProductFromMenu()
  const [isExpanded, setIsExpanded] = useState(false)

  const { data: productDetail } = useProductDetail(isExpanded ? product.productId : undefined)
  const locationRecipe = productDetail?.locations.find((location) => location.locationId === locationId)

  function handleRemove() {
    removeProductFromMenu.mutate({ menuId, productId: product.productId })
  }

  return (
    <div className="border border-zinc-200">
      <div className="flex items-center gap-2.5 p-2.5">
        <ProductImagePreview imageUrl={product.imageUrl} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-900">{product.productName}</p>
          <p className="text-xs tabular-nums text-zinc-500">{product.price.toFixed(2)} ₺</p>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900"
        >
          Reçete
          {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
        <button
          type="button"
          onClick={handleRemove}
          disabled={removeProductFromMenu.isPending}
          className="text-zinc-400 transition-colors hover:text-destructive disabled:opacity-40"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-zinc-100 p-2.5">
          {locationRecipe ? (
            <ProductRecipeSection
              productId={product.productId}
              locationId={locationId}
              locationName="Reçete"
              ingredients={locationRecipe.ingredients}
            />
          ) : (
            <p className="text-xs text-zinc-400">Yükleniyor...</p>
          )}
        </div>
      )}
    </div>
  )
}

interface MenuProductsListProps {
  menuId: string
  locationId: string
  products: MenuProductDto[]
}

export function MenuProductsList({ menuId, locationId, products }: MenuProductsListProps) {
  if (products.length === 0) {
    return (
      <div className="border border-zinc-200 bg-zinc-50 px-3 py-4 text-center text-xs text-zinc-500">
        Bu menüde henüz ürün yok.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {products.map((product) => (
        <MenuProductRow key={product.productId} menuId={menuId} locationId={locationId} product={product} />
      ))}
    </div>
  )
}
