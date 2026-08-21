import { useState } from 'react'
import { toast } from 'sonner'
import { Search } from 'lucide-react'
import { useLocationStore } from '@/shared/stores/locationStore'
import { useLocations } from '@/shared/hooks/useLocations'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { WaiterHeader } from '../components/WaiterHeader'
import { TableSelector } from '../components/TableSelector'
import { CategoryTabs } from '../components/CategoryTabs'
import { ProductCard } from '../components/ProductCard'
import { CartBar } from '../components/CartBar'
import { useActiveTables } from '../hooks/useActiveTables'
import { useCategories } from '../hooks/useCategories'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import { useCreateOrder } from '../hooks/useCreateOrder'
import { MobileUserMenu } from '@/shared/components/MobileUserMenu'
import { CartItemsSheet } from '../components/CartItemsSheet'

export function WaiterOrderPage() {
  const locationId = useLocationStore((s) => s.selectedLocationId) ?? undefined
  const { data: locations = [] } = useLocations()
  const locationName = locations.find((l) => l.id === locationId)?.name ?? '—'
  const [cartOpen, setCartOpen] = useState(false)
  const [tableId, setTableId] = useState<string | null>(null)
  const [categoryId, setCategoryId] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 400)
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: tables = [] } = useActiveTables(locationId)
  const { data: categories = [] } = useCategories(locationId)
  const { data: productsPage, isLoading } = useProducts({
    locationId,
    categoryId: categoryId || undefined,
    searchTerm: debouncedSearch,
    pageNumber: 1,
  })

  const { items, addItem, totalCount, increaseQuantity, decreaseQuantity, removeItem,totalAmount, clear } = useCart()
  const createOrder = useCreateOrder()

  const [lastSyncedLocationId, setLastSyncedLocationId] = useState(locationId)
  if (locationId !== lastSyncedLocationId) {
    setLastSyncedLocationId(locationId)
    setTableId(null)
    setCategoryId('')
    setCustomerName('')
    clear()
  }


  function handleSubmit() {
    if (!tableId || !locationId) {
      toast.error('Lütfen masa seçin.')
      return
    }
    createOrder.mutate(
      {
        locationId,
        tableId,
        customerName: customerName.trim() || null,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        requestedAs: 'WAITER',
      },
      {
        onSuccess: () => {
          toast.success('Sipariş oluşturuldu.')
          clear()
          setCartOpen(false)
          setCustomerName('')
        },
        onError: () => toast.error('Sipariş oluşturulamadı.'),
      },
    )
  }

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-zinc-50">
 <WaiterHeader locationName={locationName} onMenuClick={() => setMenuOpen(true)} />
      <div className="border-b border-zinc-200 bg-white p-3">
        <TableSelector
          tables={tables}
          selectedTableId={tableId}
          onSelect={setTableId}
        />

        <div className="mt-3">
          <label
            htmlFor="customer-name"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500"
          >
            Müşteri Adı
          </label>

          <input
            id="customer-name"
            type="text"
            value={customerName}
            onChange={(event) =>
              setCustomerName(event.target.value)
            }
            placeholder="Örn. Buse Köroğlu"
            maxLength={100}
            className="h-11 w-full border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900"
          />
        </div>
      </div>

      <div className="border-b border-zinc-200 bg-white px-3 pb-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Ürün Ara..."
            className="h-10 w-full border border-zinc-300 bg-white pl-9 pr-3 text-sm outline-none focus-visible:border-zinc-900"
          />
        </div>
      </div>

      <CategoryTabs categories={categories} selectedCategoryId={categoryId} onSelect={setCategoryId} />

      <main className="flex-1 overflow-y-auto p-3 pb-24">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-zinc-400">Yükleniyor...</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {productsPage?.items.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={() => addItem(product)} />
            ))}
          </div>
        )}
      </main>

       <CartBar
        totalCount={totalCount}
        totalAmount={totalAmount}
        onSubmit={handleSubmit}
        onExpand={() => setCartOpen(true)}
        isSubmitting={createOrder.isPending}
      />

      <CartItemsSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onRemove={removeItem}
      />

      <MobileUserMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

    </div>
  )
}