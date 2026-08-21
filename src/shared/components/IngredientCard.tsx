import { AlertTriangle, Clock3 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { STOCK_UNIT_LABELS } from '@/shared/types/ingredient'
import type { IngredientResponseDto } from '@/shared/types/ingredient'

type StockHealth = 'CRITICAL' | 'WARNING' | 'NORMAL'

function getStockHealth(ingredient: IngredientResponseDto): StockHealth {
  if (ingredient.isBelowThreshold) return 'CRITICAL'
  if (ingredient.minStockThreshold > 0 && ingredient.currentStock < ingredient.minStockThreshold * 1.5) {
    return 'WARNING'
  }
  return 'NORMAL'
}

const HEALTH_CARD_CLASSNAME: Record<StockHealth, string> = {
  CRITICAL: 'border-red-300 bg-red-50 hover:border-red-400',
  WARNING: 'border-amber-300 bg-[#f5f0e6] hover:border-amber-400',
  NORMAL: 'border-zinc-200 bg-white hover:border-zinc-300',
}

interface IngredientCardProps {
  ingredient: IngredientResponseDto
  hasPendingRequest?: boolean
  onClick?: () => void
}

export function IngredientCard({ ingredient, hasPendingRequest, onClick }: IngredientCardProps) {
  const health = getStockHealth(ingredient)

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col gap-3 border-2 p-4 text-left transition-colors',
        HEALTH_CARD_CLASSNAME[health],
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{ingredient.name}</p>
        {health === 'CRITICAL' && <AlertTriangle className="size-4 shrink-0 text-red-600" />}
        {hasPendingRequest && (
          <span className="flex shrink-0 items-center gap-1 border border-amber-400 bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 uppercase">
            <Clock3 className="size-3" />
            Talep Var
          </span>
        )}
      </div>

      <div>
        <p className="text-2xl font-semibold tabular-nums text-zinc-800">
          {ingredient.currentStock} <span className="text-sm font-normal text-zinc-500">{STOCK_UNIT_LABELS[ingredient.unit]}</span>
        </p>
        <p className="text-xs text-zinc-500">
          Min. eşik: {ingredient.minStockThreshold} {STOCK_UNIT_LABELS[ingredient.unit]}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-200/70 pt-2 text-xs text-zinc-500">
        <span>Ağırlıklı Ort. Fiyat</span>
        <span className="font-medium text-zinc-700 tabular-nums">
          {ingredient.weightedAverageUnitPrice.toLocaleString('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </button>
  )
}
