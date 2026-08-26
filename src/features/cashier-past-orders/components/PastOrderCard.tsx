import { OrderTypeBadge } from '@/shared/components/OrderTypeBadge'
import { PaymentStatusBadge } from '@/shared/components/PaymentStatusBadge'
import type { Order } from '../types'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
})

const completedAtFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

const MAX_VISIBLE_ITEMS = 3

interface PastOrderCardProps {
  order: Order
}

export function PastOrderCard({ order }: PastOrderCardProps) {
  return (
    <div className="flex flex-col border-2 border-zinc-300 bg-white">
      <div className="flex items-start justify-between gap-2 border-b border-zinc-100 p-4">
        <div className="min-w-0">
          <p className="text-base font-semibold text-zinc-900">#{order.orderNumber}</p>
          <p className="truncate text-sm text-zinc-500">{order.customerName || 'Müşteri belirtilmedi'}</p>
          {order.completedAt && (
            <p className="mt-0.5 text-sm text-zinc-400">{completedAtFormatter.format(new Date(order.completedAt))}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <OrderTypeBadge type={order.type} />
          {order.status === 'CANCELLED' ? (
            <span className="inline-flex items-center border border-zinc-300 bg-zinc-100 px-2 py-0.5 text-sm font-normal whitespace-nowrap text-zinc-600">
              İptal edildi
            </span>
          ) : (
            <PaymentStatusBadge status={order.paymentStatus} />
          )}
        </div>
      </div>

      <div className="flex-1 p-4">
        {order.items.length === 0 ? (
          <p className="text-sm text-zinc-400">Ürün bilgisi yok</p>
        ) : (
          <ul className="space-y-1.5 text-sm text-zinc-600">
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

      <div className="border-t border-zinc-200 p-4">
        <span className="block text-lg font-semibold tabular-nums text-zinc-900">
          {currencyFormatter.format(order.totalPrice)}
        </span>
      </div>
    </div>
  )
}
