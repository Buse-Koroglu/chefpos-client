import { cn } from '@/lib/utils'
import type { PaymentFilter } from '../types'

const PAYMENT_FILTER_TABS: Array<{ value: PaymentFilter; label: string }> = [
  { value: 'ALL', label: 'Tümü' },
  { value: 'UNPAID', label: 'Ödenmedi' },
  { value: 'PAID', label: 'Ödendi' },
]

interface PaymentFilterTabsProps {
  value: PaymentFilter
  onChange: (value: PaymentFilter) => void
}

export function PaymentFilterTabs({ value, onChange }: PaymentFilterTabsProps) {
  return (
    <div className="flex border border-zinc-200 bg-white">
      {PAYMENT_FILTER_TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex-1 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
            value === tab.value ? 'border-[#133458] bg-zinc-50 text-zinc-900' : 'border-transparent text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
