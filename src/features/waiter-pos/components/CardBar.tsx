import { ChevronUp } from 'lucide-react'

const currencyFormatter = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })

interface CardBarProps {
  totalCount: number
  totalAmount: number
  onSubmit: () => void
  onExpand: () => void
  isSubmitting: boolean
}

// Sipariş Özeti için Cart

export function CardBar({ totalCount, totalAmount, onSubmit, onExpand, isSubmitting }: CardBarProps) {
  if (totalCount === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex h-16 w-full max-w-md items-center justify-between border-t border-zinc-300 bg-white px-4">
      <button type="button" onClick={onExpand} className="flex items-center gap-1.5 text-sm text-zinc-900">
        <ChevronUp className="size-4 text-zinc-400" />
        <span className="font-semibold">{totalCount} ürün</span>
        <span className="tabular-nums text-zinc-500">{currencyFormatter.format(totalAmount)}</span>
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="h-11 bg-[#133458]  px-5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {isSubmitting ? 'GÖNDERİLİYOR...' : 'SİPARİŞ OLUŞTUR'}
      </button>
    </div>
  )
}