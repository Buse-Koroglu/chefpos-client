import { cn } from '@/lib/utils'
import { STOCK_REQUEST_STATUS_LABELS } from '@/shared/types/stockRequest'
import type { StockRequestStatus } from '@/shared/types/stockRequest'

const STATUS_CLASSNAME: Record<StockRequestStatus, string> = {
  PENDING: 'border-amber-300/60 bg-amber-50 text-amber-700',
  APPROVED: 'border-[#84994F]/30 bg-[#84994F]/10 text-[#708243]',
  REJECTED: 'border-destructive/30 bg-destructive/10 text-destructive',
}

const STATUS_DOT_CLASSNAME: Record<StockRequestStatus, string> = {
  PENDING: 'bg-amber-500',
  APPROVED: 'bg-[#84994F]',
  REJECTED: 'bg-destructive',
}

export function StockRequestStatusBadge({ status }: { status: StockRequestStatus }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 border px-2 py-0.5 text-xs font-normal', STATUS_CLASSNAME[status])}>
      <span className={cn('size-1.5 shrink-0 rounded-full', STATUS_DOT_CLASSNAME[status])} />
      {STOCK_REQUEST_STATUS_LABELS[status]}
    </span>
  )
}
