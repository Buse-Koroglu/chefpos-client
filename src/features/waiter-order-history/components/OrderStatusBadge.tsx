import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/shared/types/order'

const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Hazırlanıyor',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal Edildi',
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-2 py-0.5 text-xs font-normal whitespace-nowrap',
        status === 'PENDING' && 'border-yellow-300 bg-yellow-50 text-yellow-700',
        status === 'COMPLETED' && 'border-zinc-300 bg-zinc-100 text-zinc-700',
        status === 'CANCELLED' && 'border-zinc-300 bg-zinc-100 text-zinc-500',
      )}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  )
}
