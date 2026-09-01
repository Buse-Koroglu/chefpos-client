import { Plus, UtensilsCrossed } from 'lucide-react'
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl'
import type { Product } from '../types'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
})

// Sipariş verme ekranında bulunan product cartları

interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => void
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const resolvedImageUrl = resolveImageUrl(product.imageUrl)
  return (
    <button
      type="button"
      onClick={() => onAdd(product)}
      aria-label={`${product.name} ürününü ekle`}
      className="flex flex-col overflow-hidden border border-zinc-200 bg-white text-left transition-colors hover:border-[#133458]/50"
    >
      <div className="flex h-28 items-center justify-center overflow-hidden bg-zinc-100 text-zinc-300">
        {resolvedImageUrl ? (
          <img src={resolvedImageUrl} alt={product.name} className="size-full object-cover" /> ) : ( <UtensilsCrossed className="size-9" />)}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="line-clamp-2 min-h-10 text-sm font-medium text-zinc-900">{product.name}</p>

        <div className="mt-auto flex items-center justify-between gap-1">
          <span className="text-sm font-semibold tabular-nums text-zinc-900">
            {currencyFormatter.format(product.price)}
          </span>
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center bg-[#133458] text-white"
          >
            <Plus className="size-5" />
          </span>
        </div>
      </div>
    </button>
  )
}
