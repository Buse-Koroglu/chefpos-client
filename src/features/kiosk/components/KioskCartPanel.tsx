import { Minus, Plus, X } from 'lucide-react'
import type { KioskCartItem } from '../types'

const currencyFormatter = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })

interface KioskCartPanelProps {
  items: KioskCartItem[]
  totalAmount: number
  onIncrease: (productId: string) => void
  onDecrease: (productId: string) => void
  onRemove: (productId: string) => void
  onCheckout: () => void
}

export function KioskCartPanel({
  items,
  totalAmount,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}: KioskCartPanelProps) {
  return (
    <div className="flex w-[380px] shrink-0 flex-col border-l border-zinc-200 bg-white">
      <p className="border-b border-zinc-200 px-5 py-4 text-lg font-semibold text-zinc-900">Sepetiniz</p>

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <p className="px-5 py-10 text-center text-base text-zinc-400">Sepetiniz boş</p>
        ) : (
          items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3 border-b border-zinc-100 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-medium text-zinc-900">{item.name}</p>
                <p className="text-sm tabular-nums text-zinc-500">{currencyFormatter.format(item.price)}</p>
              </div>

              <div className="flex shrink-0 items-center border border-zinc-300">
                <button
                  type="button"
                  onClick={() => onDecrease(item.productId)}
                  aria-label={`${item.name} adedini azalt`}
                  className="flex size-11 items-center justify-center text-zinc-700 hover:bg-zinc-100"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center text-lg font-semibold tabular-nums text-zinc-900">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onIncrease(item.productId)}
                  aria-label={`${item.name} adedini artır`}
                  className="flex size-11 items-center justify-center text-zinc-700 hover:bg-zinc-100"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onRemove(item.productId)}
                aria-label={`${item.name} ürününü kaldır`}
                className="shrink-0 text-zinc-300 transition-colors hover:text-red-500"
              >
                <X className="size-5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-zinc-200 p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <span className="text-base text-zinc-500">Toplam</span>
          <span className="text-2xl font-semibold tabular-nums text-zinc-900">
            {currencyFormatter.format(totalAmount)}
          </span>
        </div>
        <button
          type="button"
          onClick={onCheckout}
          disabled={items.length === 0}
          className="h-16 w-full bg-[#133458] text-xl font-semibold text-white transition-colors hover:bg-[#0f2843] disabled:opacity-40"
        >
          Siparişi Onayla
        </button>
      </div>
    </div>
  )
}
