import type { CategoryResponseDto } from '@/shared/types/category'

interface CategoryTabsProps {
  categories: CategoryResponseDto[]
  selectedCategoryId: string
  onSelect: (categoryId: string) => void
}

// Sipariş verme ekranında bulunan kategori tab'ları

export function CategoryTabs({ categories, selectedCategoryId, onSelect }: CategoryTabsProps) {
  const allTab = { id: '', name: 'Tümü' }

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto border-b border-zinc-200 bg-white px-3 py-2">
      {[allTab, ...categories].map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelect(cat.id)}
          className={`shrink-0 whitespace-nowrap border px-4 py-2 text-sm font-medium ${
            selectedCategoryId === cat.id ? 'border-zinc-700 bg-[#133458] text-white'  : 'border-zinc-200 bg-white text-zinc-600' }`}>
          {cat.name}
        </button>
      ))}
    </div>
  )
}