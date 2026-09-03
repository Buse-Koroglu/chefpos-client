import { Plus, UtensilsCrossed } from 'lucide-react'
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl'
import { cn } from '@/lib/utils'
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
  const isAvailable = product.isAvailable

  return (
    <button
      type="button"
      onClick={() => onAdd(product)}
      disabled={!isAvailable}
      aria-label={`${product.name} ürününü ekle`}
      className={cn(
        'flex flex-col overflow-hidden border border-zinc-200 bg-white text-left transition-colors',
        isAvailable ? 'cursor-pointer hover:border-[#133458]/50' : 'cursor-not-allowed grayscale opacity-60',
      )}
    >
      <div className="flex h-32 items-center justify-center overflow-hidden bg-zinc-100 text-zinc-300">
        {resolvedImageUrl ? (
          <img src={resolvedImageUrl} alt={product.name} className="size-full object-cover" /> ) : ( <UtensilsCrossed className="size-10" />)}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="line-clamp-2 min-h-14 text-lg font-medium text-zinc-900">{product.name}</p>

        {!isAvailable ? (
          <div className="mt-auto py-1">
            <span className="inline-block bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-zinc-600 uppercase">
              Tükendi
            </span>
          </div>
        ) : (
          <div className="mt-auto flex items-center justify-between gap-1">
            <span className="text-lg font-semibold tabular-nums text-zinc-900">
              {currencyFormatter.format(product.price)}
            </span>
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center text-[#133458]"
            >
              <Plus className="size-6" />
            </span>
          </div>
        )}
      </div>
    </button>
  )
}
