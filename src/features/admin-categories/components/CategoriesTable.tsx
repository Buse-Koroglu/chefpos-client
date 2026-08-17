import type { CategoryAdminResponseDto } from '@/shared/types/category'
import { Skeleton } from '@/shared/components/Skeleton'
import { CategoryIcon } from './CategoryIcon'
import { CategoryLocationChips } from './CategoryLocationChips'
import { CategoryStatusBadge } from './CategoryStatusBadge'

interface CategoriesTableProps {
  categories: CategoryAdminResponseDto[]
  onSelect: (categoryId: string) => void
  isLoading?: boolean
}

const TABLE_HEAD = (
  <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
    <th className="px-4 py-3">Kategori</th>
    <th className="px-4 py-3">Yerleşke</th>
    <th className="px-4 py-3">Ürün Sayısı</th>
    <th className="px-4 py-3">Durum</th>
  </tr>
)

export function CategoriesTable({ categories, onSelect, isLoading }: CategoriesTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>{TABLE_HEAD}</thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index} className="border-b border-zinc-100 last:border-b-0">
                {Array.from({ length: 4 }).map((__, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center border border-zinc-200 bg-white py-16 text-sm text-zinc-500">
        Filtrelere uygun kategori bulunamadı.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>{TABLE_HEAD}</thead>
        <tbody>
          {categories.map((category) => (
            <tr
              key={category.id}
              onClick={() => onSelect(category.id)}
              className="cursor-pointer border-b border-zinc-100 transition-colors last:border-b-0 hover:bg-zinc-100/80"
            >
              <td className="px-4 py-3 font-medium text-zinc-900">
                <span className="flex items-center gap-2">
                  <CategoryIcon icon={category.icon} />
                  {category.name}
                </span>
              </td>
              <td className="px-4 py-3">
                <CategoryLocationChips locationNames={category.locationNames} />
              </td>
              <td className="px-4 py-3 tabular-nums text-zinc-500">{category.productCount}</td>
              <td className="px-4 py-3">
                <CategoryStatusBadge isActive={category.isActive} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
