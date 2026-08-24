import type { ProductAdminResponseDto } from '@/shared/types/product'
import { Skeleton } from '@/shared/components/Skeleton'
import { ProductImagePreview } from './ProductImagePreview'
import { ProductLocationChips } from './ProductLocationChips'
import { ProductStatusBadge } from './ProductStatusBadge'

interface ProductsTableProps {
  products: ProductAdminResponseDto[]
  onSelect: (productId: string) => void
  isLoading?: boolean
}

const TABLE_HEAD = (
  <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
    <th className="px-4 py-3">Ürün</th>
    <th className="px-4 py-3">Kategori</th>
    <th className="px-4 py-3">Yerleşke</th>
    <th className="px-4 py-3">Fiyat</th>
    <th className="px-4 py-3">Durum</th>
  </tr>
)

export function ProductsTable({ products, onSelect, isLoading }: ProductsTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>{TABLE_HEAD}</thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index} className="border-b border-zinc-100 last:border-b-0">
                {Array.from({ length: 5 }).map((__, cellIndex) => (
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

  if (products.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center border border-zinc-200 bg-white py-16 text-sm text-zinc-500">
        Aradığınız kriterlere uygun sonuç bulunamadı.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>{TABLE_HEAD}</thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              onClick={() => onSelect(product.id)}
              className="cursor-pointer border-b border-zinc-100 transition-colors last:border-b-0 hover:bg-zinc-100/80"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <ProductImagePreview imageUrl={product.imageUrl} />
                  <span className="font-medium text-zinc-900">{product.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-zinc-600">{product.categoryName ?? '—'}</td>
              <td className="px-4 py-3">
                <ProductLocationChips locationNames={product.locationNames} />
              </td>
              <td className="px-4 py-3 tabular-nums text-zinc-700">{product.price.toFixed(2)} ₺</td>
              <td className="px-4 py-3">
                <ProductStatusBadge isActive={product.isActive} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
