import { cn } from '@/lib/utils'
import { STOCK_MOVEMENT_TYPE_LABELS } from '@/shared/types/stockMovement'
import type { StockMovementType } from '@/shared/types/stockMovement'

const TYPE_CLASSNAME: Record<StockMovementType, string> = {
  PURCHASE: 'border-[#84994F]/30 bg-[#84994F]/10 text-[#708243]',
  ORDER_SALE: 'border-zinc-300/60 bg-zinc-100 text-zinc-600',
  MANUAL_DEDUCTION: 'border-amber-300/60 bg-amber-50 text-amber-700',
  PRODUCTION_DEDUCTION: 'border-[#133458]/30 bg-[#133458]/10 text-[#133458]',
}

const TYPE_DOT_CLASSNAME: Record<StockMovementType, string> = {
  PURCHASE: 'bg-[#84994F]',
  ORDER_SALE: 'bg-zinc-400',
  MANUAL_DEDUCTION: 'bg-amber-500',
  PRODUCTION_DEDUCTION: 'bg-[#133458]',
}

export function StockMovementTypeBadge({ type }: { type: StockMovementType }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 border px-2 py-0.5 text-xs font-normal', TYPE_CLASSNAME[type])}>
      <span className={cn('size-1.5 shrink-0 rounded-full', TYPE_DOT_CLASSNAME[type])} />
      {STOCK_MOVEMENT_TYPE_LABELS[type]}
    </span>
  )
}
