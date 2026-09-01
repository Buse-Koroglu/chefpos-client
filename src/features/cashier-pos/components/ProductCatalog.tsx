import { useState } from 'react'
import { Search } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { Product } from '../types'
import { ProductCard } from './ProductCard'

const FORM_INPUT_CLASSNAME = 'h-10 w-full rounded-none border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

interface ProductCatalogProps {
  products: Product[]
  onAdd: (product: Product) => void
  size?: 'default' | 'large'
}

export function ProductCatalog({ products, onAdd, size = 'default' }: ProductCatalogProps) {
  const [query, setQuery] = useState('')

  const filteredProducts = products.filter((product) =>
    product.name.toLocaleLowerCase('tr-TR').includes(query.toLocaleLowerCase('tr-TR')),
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Label className="mb-1.5 text-zinc-700">Ürün Listesi</Label>
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ürün Ara..."
          className={FORM_INPUT_CLASSNAME}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="border border-dashed border-zinc-300 bg-white px-4 py-8 text-center text-sm text-zinc-500">
          Ürün bulunamadı
        </div>
      ) : (
        <div
          className={cn(
            'grid flex-1 auto-rows-min gap-3 overflow-y-auto pr-1',
            size === 'large' ? 'grid-cols-[repeat(auto-fill,minmax(190px,1fr))]' : 'grid-cols-[repeat(auto-fill,minmax(112px,1fr))]',
          )}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} size={size} />
          ))}
        </div>
      )}
    </div>
  )
}
