import { AlertTriangle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { OrderTypeBadge } from '@/shared/components/OrderTypeBadge'
import type { OrderResponse } from '@/shared/types/order'

import { getOrderUrgency } from '../utils/orderUrgency'

interface PreparingOrderRowProps {
  order: OrderResponse
  onClick: () => void
  now: Date
  showUrgency: boolean
}

const currencyFormatter =
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  })

const URGENCY_ROW_CLASSNAME = {
  normal: 'hover:bg-zinc-100',
  warning: 'bg-amber-50 hover:bg-amber-100',
  critical: 'bg-red-50 hover:bg-red-100',
}

export function PreparingOrderRow({
  order,
  onClick,
  now,
  showUrgency,
}: PreparingOrderRowProps) {
  const urgency =
    showUrgency && order.status === 'PENDING'
      ? getOrderUrgency(order.createdAt, now)
      : 'normal'

  return (
    <tr
      onClick={onClick}
      className={cn(
        'cursor-pointer border-b border-zinc-200 transition-colors duration-300',
        URGENCY_ROW_CLASSNAME[urgency],
      )}
    >
      <td className="px-4 py-4">
        <span className="font-semibold tabular-nums text-zinc-900">
          #{order.orderNumber}
        </span>
      </td>

      <td className="px-4 py-4">
        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-medium text-zinc-900">
              {order.customerName ||
                'Müşteri belirtilmedi'}
            </p>

            {urgency === 'critical' && (
              <span
                title="Sipariş kritik derecede gecikti"
                className="inline-flex items-center gap-1 border border-red-300 bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700"
              >
                <AlertTriangle className="size-3" />
                GECİKTİ
              </span>
            )}
          </div>

          <div className="mt-1">
            <OrderTypeBadge type={order.type} />
          </div>
        </div>
      </td>

      <td className="max-w-md px-4 py-4">
        <div className="space-y-1">
          {order.items
            .slice(0, 3)
            .map((item) => (
              <p
                key={item.id}
                className="truncate text-sm text-zinc-600"
              >
                <span className="mr-2 font-semibold text-zinc-400">
                  {item.quantity}x
                </span>

                {item.name}
              </p>
            ))}

          {order.items.length > 3 && (
            <p className="text-xs text-zinc-400">
              +{order.items.length - 3} ürün daha
            </p>
          )}
        </div>
      </td>

      <td className="px-4 py-4 text-right font-semibold tabular-nums text-zinc-900">
        {currencyFormatter.format(
          order.totalPrice,
        )}
      </td>

      <td className="px-4 py-4">
        <span className="inline-flex border border-yellow-300 bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">
          Hazırlanıyor
        </span>
      </td>

    </tr>
  )
}