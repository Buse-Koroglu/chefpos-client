import { STOCK_UNIT_LABELS } from '@/shared/types/ingredient'
import type { StockUnit } from '@/shared/types/ingredient'

interface IngredientStockCellProps {
  currentStock: number
  unit: StockUnit
  isBelowThreshold: boolean
}

export function IngredientStockCell({ currentStock, unit, isBelowThreshold }: IngredientStockCellProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="tabular-nums text-zinc-700">
        {currentStock} {STOCK_UNIT_LABELS[unit]}
      </span>
      {isBelowThreshold && (
        <span className="inline-flex items-center border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-normal text-red-700">
          Yetersiz Stok
        </span>
      )}
    </div>
  )
}
