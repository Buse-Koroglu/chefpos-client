import { Plus, UtensilsCrossed } from 'lucide-react'
import type { Product } from '../types'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
})

interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => void
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <div className="flex flex-col overflow-hidden border border-zinc-200 bg-white">
      <div className="flex h-20 items-center justify-center overflow-hidden bg-zinc-100 text-zinc-300">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="size-full object-cover" />
        ) : (
          <UtensilsCrossed className="size-6" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        <p className="line-clamp-2 min-h-8 text-xs font-medium text-zinc-900">{product.name}</p>

        <div className="mt-auto flex items-center justify-between gap-1">
          <span className="text-xs font-semibold tabular-nums text-zinc-900">
            {currencyFormatter.format(product.price)}
          </span>
          <button
            type="button"
            onClick={() => onAdd(product)}
            aria-label={`${product.name} ürününü ekle`}
            className="flex size-6 shrink-0 items-center justify-center bg-[#133458] text-white transition-colors hover:bg-[#0f2843]"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
