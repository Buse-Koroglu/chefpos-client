import { Button } from '@/components/ui/button'

interface PaginationProps {
  pageNumber: number
  totalPages: number
  totalCount: number
  onPageChange: (page: number) => void
}
// Pagination componenti, toplam sayfa sayısı mavcut sayfa ve önceki sonraki sayfa butonları içerir

export function Pagination({ pageNumber, totalPages, totalCount, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-zinc-200 bg-white px-4 py-3">
      <p className="text-sm text-zinc-500">Toplam {totalCount} sipariş</p>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-none"
          disabled={pageNumber <= 1}
          onClick={() => onPageChange(pageNumber - 1)}
        >
          Önceki
        </Button>
        <span className="text-sm tabular-nums text-zinc-600">
          {pageNumber} / {Math.max(totalPages, 1)}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-none"
          disabled={pageNumber >= totalPages}
          onClick={() => onPageChange(pageNumber + 1)}
        >
          Sonraki
        </Button>
      </div>
    </div>
  )
}
