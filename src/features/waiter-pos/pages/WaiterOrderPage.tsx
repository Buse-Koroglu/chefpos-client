import { useState } from 'react'
import { toast } from 'sonner'
import { Search } from 'lucide-react'
import { useLocationStore } from '@/shared/stores/locationStore'
import { useLocations } from '@/shared/hooks/useLocations'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { WaiterHeader } from '../components/WaiterHeader'
import { TableSelector } from '../components/TableSelector'
import { CategoryTabs } from '../components/CategoryTabs'
import { MenuTabs } from '../components/MenuTabs'
import { ProductCard } from '../components/ProductCard'
import { CartBar } from '../components/CartBar'
import { useActiveTables } from '../hooks/useActiveTables'
import { useCategories } from '../hooks/useCategories'
import { useMenus } from '../hooks/useMenus'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import { useCreateOrder } from '../hooks/useCreateOrder'
import { MobileUserMenu } from '@/shared/components/MobileUserMenu'
import { CartItemsSheet } from '../components/CartItemsSheet'
import { getApiErrorMessage } from '@/shared/api/apiError'
import { isTableOccupiedConflict } from '../utils'
import type { Product } from '../types'

export function WaiterOrderPage() {
  const locationId = useLocationStore((s) => s.selectedLocationId) ?? undefined
  const { data: locations = [] } = useLocations()
  const locationName = locations.find((l) => l.id === locationId)?.name ?? '—'
  const [cartOpen, setCartOpen] = useState(false)
  const [tableId, setTableId] = useState<string | null>(null)
  const [isPackage, setIsPackage] = useState(false)
  const [categoryId, setCategoryId] = useState('')
  const [selectedMenuId, setSelectedMenuId] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 400)
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: tables = [] } = useActiveTables(locationId)
  const { data: categories = [] } = useCategories(locationId)
  const { data: menus = [] } = useMenus(locationId)
  const activeMenu = menus.find((menu) => menu.id === selectedMenuId)

  const [pageNumber, setPageNumber] = useState(1)
  const [accumulatedItems, setAccumulatedItems] = useState<Product[]>([])

  const filterKey = `${locationId ?? ''}|${categoryId}|${selectedMenuId}|${debouncedSearch}`
  const [lastFilterKey, setLastFilterKey] = useState(filterKey)
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey)
    setPageNumber(1)
    setAccumulatedItems([])
  }

  const { data: productsPage, isLoading, isFetching } = useProducts({
    locationId,
    categoryId: selectedMenuId ? undefined : categoryId || undefined,
    searchTerm: selectedMenuId ? undefined : debouncedSearch,
    pageNumber,
    pageSize: selectedMenuId ? 100 : undefined,
    includeUncategorized: Boolean(selectedMenuId),
  })

  const [lastMergedPage, setLastMergedPage] = useState<typeof productsPage>(undefined)
  if (productsPage && productsPage !== lastMergedPage && filterKey === lastFilterKey) {
    setLastMergedPage(productsPage)
    setAccumulatedItems((current) =>
      productsPage.pageNumber === 1 ? productsPage.items : [...current, ...productsPage.items],
    )
  }

  const canLoadMore = !selectedMenuId && Boolean(productsPage) && productsPage!.pageNumber < productsPage!.totalPages

  const displayProducts = activeMenu
    ? accumulatedItems.filter((product) => activeMenu.products.some((menuProduct) => menuProduct.productId === product.id))
    : accumulatedItems

  function handleCategorySelect(value: string) {
    setCategoryId(value)
    setSelectedMenuId('')
  }

  function handleMenuSelect(value: string) {
    setSelectedMenuId(value)
    setCategoryId('')
  }

  const { items, addItem, totalCount, increaseQuantity, decreaseQuantity, removeItem,totalAmount, clear } = useCart()
  const createOrder = useCreateOrder()

  const [lastSyncedLocationId, setLastSyncedLocationId] = useState(locationId)
  if (locationId !== lastSyncedLocationId) {
    setLastSyncedLocationId(locationId)
    setTableId(null)
    setIsPackage(false)
    setCategoryId('')
    setSelectedMenuId('')
    setCustomerName('')
    clear()
  }


  function handleSubmit() {
    if (!locationId || (!isPackage && !tableId)) {
      toast.error('Lütfen masa seçin veya paket seçeneğini işaretleyin.')
      return
    }
    createOrder.mutate(
      {
        locationId,
        tableId: isPackage ? null : tableId,
        isPackage,
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
        onError: (error) => {
          const message = getApiErrorMessage(error, 'Sipariş oluşturulamadı.')
          if (isTableOccupiedConflict(message)) {
            toast.error('Seçtiğiniz masa dolu. Ödeme alınmadan yeni sipariş oluşturulamaz.')
            return
          }
          toast.error(message)
        },
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
          isPackage={isPackage}
          onSelect={(id) => {
            setTableId(id)
            setIsPackage(false)
          }}
          onSelectPackage={() => {
            setIsPackage(true)
            setTableId(null)
          }}
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

      <MenuTabs menus={menus} selectedMenuId={selectedMenuId} onSelect={handleMenuSelect} />
      {!selectedMenuId && (
        <CategoryTabs categories={categories} selectedCategoryId={categoryId} onSelect={handleCategorySelect} />
      )}

      <main className="flex-1 overflow-y-auto p-3 pb-24">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-zinc-400">Yükleniyor...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={() => addItem(product)} />
              ))}
            </div>
            {canLoadMore && (
              <button
                type="button"
                onClick={() => setPageNumber((current) => current + 1)}
                disabled={isFetching}
                className="mt-3 h-10 w-full border border-zinc-300 bg-white text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
              >
                {isFetching ? 'Yükleniyor...' : 'Daha Fazla Yükle'}
              </button>
            )}
          </>
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