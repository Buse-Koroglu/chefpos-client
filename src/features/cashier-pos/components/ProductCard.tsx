import { Plus, UtensilsCrossed } from 'lucide-react'
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl'
import { cn } from '@/lib/utils'
import type { Product } from '../types'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
})

interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => void
  size?: 'default' | 'large'
}

export function ProductCard({ product, onAdd, size = 'default' }: ProductCardProps) {
  const resolvedImageUrl = resolveImageUrl(product.imageUrl)
  const isLarge = size === 'large'
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
      <div
        className={cn(
          'flex items-center justify-center overflow-hidden bg-zinc-100 text-zinc-300',
          isLarge ? 'h-40' : 'h-20',
        )}
      >
        {resolvedImageUrl ? (
          <img src={resolvedImageUrl} alt={product.name} className="size-full object-cover" />
        ) : (
          <UtensilsCrossed className={isLarge ? 'size-14' : 'size-6'} />
        )}
      </div>

      <div className={cn('flex flex-1 flex-col gap-1.5', isLarge ? 'p-4' : 'p-2.5')}>
        <p
          className={cn(
            'line-clamp-2 font-medium text-zinc-900',
            isLarge ? 'min-h-14 text-xl' : 'min-h-8 text-xs',
          )}
        >
          {product.name}
        </p>

        {!isAvailable ? (
          <div className={cn('mt-auto', isLarge ? 'py-2' : 'py-1')}>
            <span
              className={cn(
                'inline-block bg-zinc-200 font-semibold tracking-wide text-zinc-600 uppercase',
                isLarge ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-[10px]',
              )}
            >
              Tükendi
            </span>
          </div>
        ) : (
          <div className="mt-auto flex items-center justify-between gap-1">
            <span
              className={cn('font-semibold tabular-nums text-zinc-900', isLarge ? 'text-2xl' : 'text-xs')}
            >
              {currencyFormatter.format(product.price)}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                'flex shrink-0 items-center justify-center text-[#133458]',
                isLarge ? 'size-14' : 'size-6',
              )}
            >
              <Plus className={isLarge ? 'size-7' : 'size-3.5'} />
            </span>
          </div>
        )}
      </div>
    </button>
  )
}
