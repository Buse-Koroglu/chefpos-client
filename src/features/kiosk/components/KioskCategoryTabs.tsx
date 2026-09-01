import { cn } from '@/lib/utils'
import type { CategoryResponseDto } from '@/shared/types/category'

interface KioskCategoryTabsProps {
  categories: CategoryResponseDto[]
  selectedCategoryId: string
  onSelect: (categoryId: string) => void
}

export function KioskCategoryTabs({ categories, selectedCategoryId, onSelect }: KioskCategoryTabsProps) {
  const allTab = { id: '', name: 'Tümü' }

  return (
    <div className="scrollbar-hide flex gap-3 overflow-x-auto border-b border-zinc-200 bg-white px-6 py-4">
      {[allTab, ...categories].map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelect(cat.id)}
          className={cn(
            'shrink-0 whitespace-nowrap border-2 px-6 py-4 text-lg font-semibold transition-colors',
            selectedCategoryId === cat.id ? 'border-[#133458] bg-[#133458] text-white' : 'border-zinc-200 bg-white text-zinc-700',
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
