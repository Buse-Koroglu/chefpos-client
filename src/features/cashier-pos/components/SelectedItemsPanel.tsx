import { Minus, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { OrderItem } from '../types'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
})

interface SelectedItemsPanelProps {
  items: OrderItem[]
  onIncrease: (productId: string) => void
  onDecrease: (productId: string) => void
  onRemove: (productId: string) => void
  onSubmit: () => void
  isSubmitDisabled: boolean
  isSubmitting: boolean
}

export function SelectedItemsPanel({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  onSubmit,
  isSubmitDisabled,
  isSubmitting,
}: SelectedItemsPanelProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="flex w-96 shrink-0 flex-col border border-zinc-200 bg-white">
      <p className="border-b border-zinc-200 px-3 py-2.5 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
        Seçilen Ürünler
      </p>

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-zinc-400">Henüz ürün eklenmedi</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 border-b border-zinc-100 px-3 py-3 text-sm last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-medium text-zinc-900">{item.name}</p>
                <p className="text-sm tabular-nums text-zinc-500">
                  {currencyFormatter.format(item.price * item.quantity)}
                </p>
              </div>

              <div className="flex shrink-0 items-center border border-zinc-300">
                <button
                  type="button"
                  onClick={() => onDecrease(item.id)}
                  aria-label={`${item.name} adedini azalt`}
                  className="flex size-11 items-center justify-center text-zinc-700 hover:bg-zinc-100"
                >
                  <Minus className="size-6" />
                </button>
                <span className="w-8 text-center text-sm font-semibold tabular-nums text-zinc-900">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onIncrease(item.id)}
                  aria-label={`${item.name} adedini artır`}
                  className="flex size-11 items-center justify-center text-zinc-700 hover:bg-zinc-100"
                >
                  <Plus className="size-6" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onRemove(item.id)}
                aria-label={`${item.name} ürününü kaldır`}
                className="shrink-0 text-zinc-300 transition-colors hover:text-red-500"
              >
                <X className="size-6" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-zinc-200 p-3">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm text-zinc-500">Total</span>
          <span className="text-lg font-semibold tabular-nums text-zinc-900">
            {currencyFormatter.format(total)}
          </span>
        </div>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitDisabled || isSubmitting}
          className="h-11 w-full rounded-none bg-[#133458] text-sm text-white hover:bg-[#0f2843]"
        >
          {isSubmitting ? 'Gönderiliyor...' : 'Sipariş Oluştur'}
        </Button>
      </div>
    </div>
  )
}
