import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { OrderItem } from '../types'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
})

interface SelectedItemsPanelProps {
  items: OrderItem[]
  onRemove: (productId: string) => void
  onSubmit: () => void
  isSubmitDisabled: boolean
  isSubmitting: boolean
}

export function SelectedItemsPanel({
  items,
  onRemove,
  onSubmit,
  isSubmitDisabled,
  isSubmitting,
}: SelectedItemsPanelProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="flex w-64 shrink-0 flex-col border border-zinc-200 bg-white">
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
              className="flex items-center gap-2 border-b border-zinc-100 px-3 py-2.5 text-sm last:border-b-0"
            >
              <span className="shrink-0 tabular-nums text-zinc-400">{item.quantity}x</span>
              <span className="flex-1 truncate text-zinc-900">{item.name}</span>
              <span className="shrink-0 tabular-nums text-zinc-900">
                {currencyFormatter.format(item.price * item.quantity)}
              </span>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                aria-label={`${item.name} ürününü kaldır`}
                className="shrink-0 text-zinc-300 transition-colors hover:text-red-500"
              >
                <X className="size-3.5" />
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
