import { STOCK_UNIT_LABELS } from '@/shared/types/ingredient'
import type { StockMovementResponseDto } from '@/shared/types/stockMovement'
import { Skeleton } from '@/shared/components/Skeleton'
import { formatStockRequestDateTime } from '@/features/admin-stock-requests/utils'
import { StockMovementTypeBadge } from './StockMovementTypeBadge'

interface StockMovementsTableProps {
  movements: StockMovementResponseDto[]
  isLoading?: boolean
}

const TABLE_HEAD = (
  <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
    <th className="px-4 py-3">Ham Madde</th>
    <th className="px-4 py-3">Tür</th>
    <th className="px-4 py-3">Miktar</th>
    <th className="px-4 py-3">Birim Fiyat</th>
    <th className="px-4 py-3">Yapan Kullanıcı</th>
    <th className="px-4 py-3">Not</th>
    <th className="px-4 py-3">Tarih</th>
  </tr>
)

export function StockMovementsTable({ movements, isLoading }: StockMovementsTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>{TABLE_HEAD}</thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index} className="border-b border-zinc-100 last:border-b-0">
                {Array.from({ length: 7 }).map((__, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (movements.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center border border-zinc-200 bg-white py-16 text-sm text-zinc-500">
        Aradığınız kriterlere uygun sonuç bulunamadı.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>{TABLE_HEAD}</thead>
        <tbody>
          {movements.map((movement) => (
            <tr key={movement.id} className="border-b border-zinc-100 last:border-b-0">
              <td className="px-4 py-3">
                <span className="font-medium text-zinc-900">{movement.ingredientName}</span>
                <span className="ml-1.5 text-xs text-zinc-400">({STOCK_UNIT_LABELS[movement.unit]})</span>
              </td>
              <td className="px-4 py-3">
                <StockMovementTypeBadge type={movement.type} />
              </td>
              <td className="px-4 py-3 tabular-nums text-zinc-700">
                {movement.quantity} {STOCK_UNIT_LABELS[movement.unit]}
              </td>
              <td className="px-4 py-3 tabular-nums text-zinc-500">
                {movement.weightedUnitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="px-4 py-3 text-zinc-600">{movement.performedByUserName}</td>
              <td className="max-w-xs truncate px-4 py-3 text-zinc-500">
                {movement.note?.startsWith('Stok talebi onayı:') ? '—' : (movement.note ?? '—')}
              </td>
              <td className="px-4 py-3 tabular-nums text-zinc-500">{formatStockRequestDateTime(movement.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
