import { cn } from '@/lib/utils'
import type { OrderHistoryFilter } from '../types'

const STATUS_FILTER_TABS: Array<{ value: OrderHistoryFilter; label: string }> = [
  { value: 'PENDING', label: 'Hazırlanan Siparişler' },
  { value: 'COMPLETED', label: 'Tamamlanan Siparişler' },
]

interface OrderStatusFilterTabsProps {
  value: OrderHistoryFilter
  onChange: (value: OrderHistoryFilter) => void
}

export function OrderStatusFilterTabs({ value, onChange }: OrderStatusFilterTabsProps) {
  return (
    <div className="flex border border-zinc-200 bg-white">
      {STATUS_FILTER_TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex-1 border-b-2 px-3 py-2.5 text-base font-medium transition-colors',
            value === tab.value ? 'border-[#133458] bg-zinc-50 text-zinc-900' : 'border-transparent text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
