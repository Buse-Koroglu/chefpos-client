import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import type { Product } from '../types'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
})

interface ProductDropdownProps {
  products: Product[]
  selectedProduct: Product | null
  onSelect: (product: Product) => void
}

export function ProductDropdown({ products, selectedProduct, onSelect }: ProductDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredProducts = products.filter((product) =>
    product.name.toLocaleLowerCase('tr-TR').includes(query.toLocaleLowerCase('tr-TR')),
  )

  return (
    <div ref={containerRef} className="relative flex-1">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-11 w-full items-center justify-between gap-2 rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors focus-visible:border-zinc-400"
      >
        <span className={selectedProduct ? 'text-zinc-900' : 'text-zinc-400'}>
          {selectedProduct ? selectedProduct.name : 'Ürün Seçiniz'}
        </span>
        <ChevronDown className="size-4 shrink-0 text-zinc-400" />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-full rounded-none border border-zinc-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-zinc-100 px-3 py-2">
            <Search className="size-4 shrink-0 text-zinc-400" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ürün ara..."
              className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <li className="px-3 py-2 text-sm text-zinc-500">Ürün bulunamadı</li>
            ) : (
              filteredProducts.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(product)
                      setIsOpen(false)
                      setQuery('')
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    <span>{product.name}</span>
                    <span className="tabular-nums text-zinc-400">{currencyFormatter.format(product.price)}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
