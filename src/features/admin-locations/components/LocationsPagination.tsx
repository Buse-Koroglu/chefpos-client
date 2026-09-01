import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LocationsPaginationProps {
  pageNumber: number
  totalPages: number
  totalCount: number
  onPageChange: (page: number) => void
}

const NAV_BUTTON_CLASSNAME = 'flex size-8 items-center justify-center border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40'

function getPageNumbers(current: number, total: number): number[] {
  const maxButtons = 5
  const end = Math.min(total, Math.max(maxButtons, current + Math.floor(maxButtons / 2)))
  const start = Math.max(1, end - maxButtons + 1)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

export function LocationsPagination({ pageNumber, totalPages, totalCount, onPageChange }: LocationsPaginationProps) {
  const pages = getPageNumbers(pageNumber, totalPages)

  return (
    <div className="flex items-center justify-between border-t border-zinc-200 bg-white px-4 py-3">
      <p className="text-sm text-zinc-500">Toplam {totalCount} yerleşke</p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          className={NAV_BUTTON_CLASSNAME}
          disabled={pageNumber <= 1}
          onClick={() => onPageChange(1)}
        >
          <ChevronFirst className="size-4" />
        </button>
        <button
          type="button"
          className={NAV_BUTTON_CLASSNAME}
          disabled={pageNumber <= 1}
          onClick={() => onPageChange(pageNumber - 1)}
        >
          <ChevronLeft className="size-4" />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              'flex size-8 items-center justify-center border text-sm font-medium tabular-nums transition-colors',
              page === pageNumber ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50',
            )}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          className={NAV_BUTTON_CLASSNAME}
          disabled={pageNumber >= totalPages}
          onClick={() => onPageChange(pageNumber + 1)}
        >
          <ChevronRight className="size-4" />
        </button>
        <button
          type="button"
          className={NAV_BUTTON_CLASSNAME}
          disabled={pageNumber >= totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          <ChevronLast className="size-4" />
        </button>
      </div>
    </div>
  )
}
