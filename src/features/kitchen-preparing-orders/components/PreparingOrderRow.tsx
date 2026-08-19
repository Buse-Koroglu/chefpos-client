import type { OrderResponse } from '@/shared/types/order'

interface PreparingOrderRowProps {
  order: OrderResponse
  onClick: () => void
}

const currencyFormatter =
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 2,
  })

export function PreparingOrderRow({
  order,
  onClick,
}: PreparingOrderRowProps) {
  return (
    <tr
      onClick={onClick}
      className="cursor-pointer border-b border-zinc-200 transition-colors hover:bg-zinc-100"
    >
      <td className="px-4 py-4">
        <span className="font-semibold tabular-nums text-zinc-900">
          #{order.orderNumber}
        </span>
      </td>

      <td className="px-4 py-4">
        <div>
          <p className="font-medium text-zinc-900">
            {order.customerName ||
              'Müşteri belirtilmedi'}
          </p>

          <p className="text-xs text-zinc-400">
            {order.type}
          </p>
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