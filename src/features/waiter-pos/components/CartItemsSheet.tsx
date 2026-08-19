import { Minus, Plus, X } from 'lucide-react'
import type { CartItem } from '../types'

const currencyFormatter = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })

interface CartItemsSheetProps {
  open: boolean
  onClose: () => void
  items: CartItem[]
  onIncrease: (productId: string) => void
  onDecrease: (productId: string) => void
  onRemove: (productId: string) => void
}

export function CartItemsSheet({ open, onClose, items, onIncrease, onDecrease, onRemove }: CartItemsSheetProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative mx-auto max-h-[65vh] w-full max-w-md overflow-y-auto border-t border-zinc-300 bg-white pb-20"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="border-b border-zinc-200 px-4 py-3 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
          Sipariş Detayı
        </p>

        {items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-zinc-400">Sepet boş</p>
        ) : (
          items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">{item.name}</p>
                <p className="text-xs tabular-nums text-zinc-500">
                  {currencyFormatter.format(item.price)} / adet
                </p>
              </div>

              <div className="flex shrink-0 items-center border border-zinc-300">
                <button
                  type="button"
                  onClick={() => onDecrease(item.productId)}
                  aria-label={`${item.name} adedini azalt`}
                  className="flex size-8 items-center justify-center text-zinc-700 hover:bg-zinc-100"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-7 text-center text-sm font-semibold tabular-nums text-zinc-900">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onIncrease(item.productId)}
                  aria-label={`${item.name} adedini artır`}
                  className="flex size-8 items-center justify-center text-zinc-700 hover:bg-zinc-100"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>

              <span className="w-16 shrink-0 text-right text-sm font-semibold tabular-nums text-zinc-900">
                {currencyFormatter.format(item.price * item.quantity)}
              </span>

              <button
                type="button"
                onClick={() => onRemove(item.productId)}
                aria-label={`${item.name} ürününü kaldır`}
                className="shrink-0 text-zinc-300 transition-colors hover:text-red-500"
              >
                <X className="size-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}