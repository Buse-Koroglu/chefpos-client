import { Trash2 } from 'lucide-react'
import type { OrderItem } from '../types'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
})

interface OrderItemsTableProps {
  items: OrderItem[]
  onRemove: (productId: string) => void
}

export function OrderItemsTable({ items, onRemove }: OrderItemsTableProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="border border-dashed border-zinc-300 bg-white px-4 py-8 text-center text-sm text-zinc-500">
        Henüz ürün eklenmedi
      </div>
    )
  }

  return (
    <div className="border border-zinc-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-left text-xs text-zinc-500 uppercase">
            <th className="px-3 py-2 font-medium">Ürün</th>
            <th className="px-3 py-2 font-medium">Birim Fiyat</th>
            <th className="px-3 py-2 font-medium">Adet</th>
            <th className="px-3 py-2 text-right font-medium">Toplam</th>
            <th className="w-10 px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-zinc-100 text-zinc-900 last:border-b-0">
              <td className="px-3 py-2.5">{item.name}</td>
              <td className="px-3 py-2.5 tabular-nums text-zinc-500">{currencyFormatter.format(item.price)}</td>
              <td className="px-3 py-2.5 tabular-nums text-zinc-500">{item.quantity}</td>
              <td className="px-3 py-2.5 text-right tabular-nums">
                {currencyFormatter.format(item.price * item.quantity)}
              </td>
              <td className="px-3 py-2.5 text-right">
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  aria-label={`${item.name} ürününü kaldır`}
                  className="text-zinc-400 transition-colors hover:text-red-500"
                >
                  <Trash2 className="size-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-zinc-200">
            <td colSpan={3} className="px-3 py-2.5 text-sm font-medium text-zinc-500">
              Genel Toplam
            </td>
            <td className="px-3 py-2.5 text-right text-sm font-semibold tabular-nums text-zinc-900">
              {currencyFormatter.format(total)}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
