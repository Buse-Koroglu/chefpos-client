import { Button } from '@/components/ui/button'
import { OrderTypeBadge } from '@/shared/components/OrderTypeBadge'
import { PaymentStatusBadge } from '@/shared/components/PaymentStatusBadge'
import type { Order } from '../types'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
})

const MAX_VISIBLE_ITEMS = 3

interface OrderCardProps {
  order: Order
  isReadyForPayment: boolean
  onComplete: (orderId: string) => void
  onCancel: (orderId: string) => void
  onOpenPayment: (order: Order) => void
  isCompleting: boolean
  isCancelling: boolean
}

export function OrderCard({
  order,
  isReadyForPayment,
  onComplete,
  onCancel,
  onOpenPayment,
  isCompleting,
  isCancelling,
}: OrderCardProps) {
  const isBusy = isCompleting || isCancelling

  return (
    <div className="flex flex-col border-2 border-zinc-300 bg-white">
      <div className="flex items-start justify-between gap-2 border-b border-zinc-100 p-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900">#{order.orderNumber}</p>
          <p className="truncate text-xs text-zinc-500">{order.customerName || 'Müşteri belirtilmedi'}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <OrderTypeBadge type={order.type} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="flex-1 p-3">
        {order.items.length === 0 ? (
          <p className="text-xs text-zinc-400">Ürün bilgisi yok</p>
        ) : (
          <ul className="space-y-1 text-xs text-zinc-600">
            {order.items.slice(0, MAX_VISIBLE_ITEMS).map((item) => (
              <li key={item.id} className="flex items-center gap-1.5">
                <span className="shrink-0 tabular-nums text-zinc-400">{item.quantity}x</span>
                <span className="flex-1 truncate">{item.name}</span>
              </li>
            ))}
            {order.items.length > MAX_VISIBLE_ITEMS && (
              <li className="text-zinc-400">... (diğer {order.items.length - MAX_VISIBLE_ITEMS} ürün)</li>
            )}
          </ul>
        )}
      </div>

      <div className="border-t border-zinc-200 p-3">
        <span className="mb-2 block text-sm font-semibold tabular-nums text-zinc-900">
          {currencyFormatter.format(order.totalPrice)}
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={() => onCancel(order.id)}
            disabled={isBusy}
            className="h-9 flex-1 rounded-none text-sm"
          >
            {isCancelling ? 'İptal ediliyor...' : 'İptal Et'}
          </Button>
          {isReadyForPayment ? (
            <Button
              type="button"
              onClick={() => onOpenPayment(order)}
              disabled={isBusy}
              className="h-9 flex-1 rounded-none bg-[#84994F] text-sm text-white hover:bg-[#708243]"
            >
              Ödeme Al
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => onComplete(order.id)}
              disabled={isBusy}
              className="h-9 flex-1 rounded-none bg-[#133458] text-sm text-white hover:bg-[#0f2843]"
            >
              {isCompleting ? 'Tamamlanıyor...' : 'Tamamla'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
