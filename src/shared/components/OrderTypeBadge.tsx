import type { OrderType } from '@/shared/types/order'

const ORDER_TYPE_LABEL: Record<OrderType, string> = {
  CASHIER: 'Kasiyer',
  WAITER: 'Garson',
  SELF_SERVICE: 'Kiosk',
}

export function OrderTypeBadge({ type }: { type: OrderType }) {
  return (
    <span className="inline-flex items-center border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-normal whitespace-nowrap text-zinc-600">
      {ORDER_TYPE_LABEL[type]}
    </span>
  )
}
