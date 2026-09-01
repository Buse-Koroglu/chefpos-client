import { Eye } from 'lucide-react'
import { STOCK_UNIT_LABELS } from '@/shared/types/ingredient'
import type { AdminStockRequestResponseDto } from '@/shared/types/stockRequest'
import { Skeleton } from '@/shared/components/Skeleton'
import { formatStockRequestDateTime } from '@/features/admin-stock-requests/utils'
import { StockRequestStatusBadge } from './StockRequestStatusBadge'

interface StockRequestsTableProps {
  stockRequests: AdminStockRequestResponseDto[]
  onSelect: (stockRequestId: string) => void
  isLoading?: boolean
}

const TABLE_HEAD = (
  <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
    <th className="px-4 py-3">Ürün / Ham Madde</th>
    <th className="px-4 py-3">Talep Miktarı</th>
    <th className="px-4 py-3">Talep Durum</th>
    <th className="px-4 py-3">Tarih</th>
    <th className="px-4 py-3 text-center">Detay</th>
  </tr>
)

export function StockRequestsTable({ stockRequests, onSelect, isLoading }: StockRequestsTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>{TABLE_HEAD}</thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index} className="border-b border-zinc-100 last:border-b-0">
                {Array.from({ length: 5 }).map((__, cellIndex) => (
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

  if (stockRequests.length === 0) {
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
          {stockRequests.map((stockRequest) => (
            <tr
              key={stockRequest.id}
              onClick={() => onSelect(stockRequest.id)}
              className="cursor-pointer border-b border-zinc-100 transition-colors last:border-b-0 hover:bg-zinc-100/80"
            >
              <td className="px-4 py-3">
                <span className="font-medium text-zinc-900">{stockRequest.ingredientName}</span>
                <span className="ml-1.5 text-xs text-zinc-400">({STOCK_UNIT_LABELS[stockRequest.unit]})</span>
              </td>
              <td className="px-4 py-3 tabular-nums text-zinc-700">
                {stockRequest.requestedQuantity} {STOCK_UNIT_LABELS[stockRequest.unit]}
              </td>
              <td className="px-4 py-3">
                <StockRequestStatusBadge status={stockRequest.status} />
              </td>
              <td className="px-4 py-3 tabular-nums text-zinc-500">{formatStockRequestDateTime(stockRequest.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-center">
                  <button type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onSelect(stockRequest.id)
                    }}
                    className="flex size-7 items-center justify-center border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
                    aria-label="Talep detayını görüntüle"
                  >
                    <Eye className="size-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
