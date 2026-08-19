import type { OrderResponse } from '@/shared/types/order'

import { PreparingOrderRow } from './PreparingOrderRow'

interface PreparingOrdersTableProps {
  orders: OrderResponse[]
  onSelectOrder: (
    order: OrderResponse,
  ) => void
}

export function PreparingOrdersTable({
  orders,
  onSelectOrder,
}: PreparingOrdersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-zinc-300 bg-zinc-100">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
              Sipariş Numarası
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
              Müşteri
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
              Sipariş Detayları
            </th>

            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-600">
              Toplam Tutar
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
              Sipariş Durumu
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <PreparingOrderRow
              key={order.id}
              order={order}
              onClick={() =>
                onSelectOrder(order)
              }
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}