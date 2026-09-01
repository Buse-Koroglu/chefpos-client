import { ChevronRight } from 'lucide-react'
import { PaymentStatusBadge } from '@/shared/components/PaymentStatusBadge'
import { OrderStatusBadge } from './OrderStatusBadge'
import type { Order } from '../types'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

interface OrderHistoryCardProps {
  order: Order
  onClick: () => void
}

export function OrderHistoryCard({ order, onClick }: OrderHistoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border border-zinc-200 bg-white p-3 text-left transition-colors active:bg-zinc-50"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-zinc-900">
            {order.tableNumber ? `Masa ${order.tableNumber}` : `#${order.orderNumber}`}
          </p>
          <span className="text-sm text-zinc-400">#{order.orderNumber}</span>
        </div>
        <p className="mt-0.5 text-sm text-zinc-500">{dateFormatter.format(new Date(order.createdAt))}</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="text-base font-semibold tabular-nums text-zinc-900">
          {currencyFormatter.format(order.totalPrice)}
        </span>
        <ChevronRight className="size-5 text-zinc-300" />
      </div>
    </button>
  )
}
