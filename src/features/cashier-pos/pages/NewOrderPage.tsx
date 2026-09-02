import { useState } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLocationStore } from '@/shared/stores/locationStore'
import { useLocations } from '@/shared/hooks/useLocations'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { StaffHeader } from '@/shared/components/StaffHeader'
import { CashierSidebar } from '@/shared/components/CashierSidebar'
import type { OrderItem, Product } from '../types'
import { ProductCatalog } from '../components/ProductCatalog'
import { SelectedItemsPanel } from '../components/SelectedItemsPanel'
import { TouchSelect } from '../components/TouchSelect'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useCreateOrder } from '../hooks/useCreateOrder'
import { useMenus } from '../hooks/useMenus'

const FORM_INPUT_CLASSNAME = 'h-14 rounded-none border-zinc-200 bg-white text-base text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-400 focus-visible:ring-zinc-200'

export function NewOrderPage() {
  const locationId = useLocationStore((state) => state.selectedLocationId) ?? undefined
  const { data: locations = [] } = useLocations()
  const locationName = locations.find((location) => location.id === locationId)?.name ?? '—'

  const [categoryId, setCategoryId] = useState('')
  const [menuId, setMenuId] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 400)

  const { data: categories = [] } = useCategories(locationId)
  const { data: menus = [] } = useMenus(locationId)
  const activeMenu = menus.find((menu) => menu.id === menuId)

  const [pageNumber, setPageNumber] = useState(1)
  const [collectedItems, setCollectedItems] = useState<Product[]>([])

  const filterKey = `${locationId ?? ''}|${categoryId}|${menuId}|${debouncedSearch}`
  const [lastFilterKey, setLastFilterKey] = useState(filterKey)
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey)
    setPageNumber(1)
    setCollectedItems([])
  }

  const {data: productsPage,isLoading,isError,isFetching} = useProducts({locationId,categoryId: menuId ? undefined : categoryId || undefined,searchTerm: menuId ? undefined : debouncedSearch,pageNumber,pageSize: menuId ? 100 : undefined,includeUncategorized: Boolean(menuId),})

  const [lastMergedPage, setLastMergedPage] = useState<typeof productsPage>(undefined)
  if (productsPage && productsPage !== lastMergedPage && filterKey === lastFilterKey) {
    setLastMergedPage(productsPage)
    setCollectedItems((current) =>
      productsPage.pageNumber === 1 ? productsPage.items : [...current, ...productsPage.items],
    )
  }

  const hasMore = !menuId && Boolean(productsPage) && productsPage!.pageNumber < productsPage!.totalPages

  const displayProducts = activeMenu ? collectedItems.filter((product) => activeMenu.products.some((menuProduct) => menuProduct.productId === product.id)) : collectedItems
  const createOrder = useCreateOrder()

  function handleCategoryChange(value: string) {
    setCategoryId(value)
    setMenuId('')
  }

  function handleMenuChange(value: string) {
    setMenuId(value)
    setCategoryId('')
  }

  const [customerName, setCustomerName] = useState('')
  const [items, setItems] = useState<OrderItem[]>([])

  const isValid = customerName.trim().length > 0 && items.length > 0

  function handleAddItem(product: Product) {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...current, { ...product, quantity: 1 }]
    })
  }

  function handleRemoveItem(productId: string) {
    setItems((current) => current.filter((item) => item.id !== productId))
  }

  function handleIncreaseItem(productId: string) {
    setItems((current) =>
      current.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item)),
    )
  }

  function handleDecreaseItem(productId: string) {
    setItems((current) =>
      current
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  function handleSubmit() {
    if (!customerName.trim()) {
      toast.error('Müşteri adını giriniz.')
      return
    }
    if (items.length === 0) {
      toast.error('En az bir ürün ekleyin.')
      return
    }
    if (!locationId) {
      toast.error('Şube bilgisi bulunamadı.')
      return
    }

    createOrder.mutate(
      {
        locationId,
        customerName: customerName.trim(),
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        requestedAs: 'CASHIER',
      },
      {
        onSuccess: () => {
          toast.success(`${customerName} için sipariş oluşturuldu.`)
          setCustomerName('')
          setItems([])
        },
        onError: () => {
          toast.error('Sipariş oluşturulamadı. Lütfen tekrar deneyin.')
        },
      },
    )
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <CashierSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <StaffHeader title="Yeni Sipariş" locationName={locationName} />

        <main className="flex min-h-0 flex-1 flex-col gap-4 p-4">
          <div className="flex items-end gap-3">
            <div className="max-w-sm flex-1 space-y-1.5">
              <Label htmlFor="customerName" className="text-base text-zinc-700">
                Müşteri
              </Label>
              <Input
                id="customerName"
                placeholder="İsim Soyisim Giriniz"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                className={FORM_INPUT_CLASSNAME}
              />
            </div>

            <div className="w-56 space-y-1.5">
              <Label htmlFor="categoryFilter" className="text-base text-zinc-700">
                Kategori
              </Label>
              <TouchSelect
                id="categoryFilter"
                value={categoryId}
                onChange={handleCategoryChange}
                placeholder="Tümü"
                options={categories.map((category) => ({ value: category.id, label: category.name }))}
              />
            </div>

            {menus.length > 0 && (
              <div className="w-56 space-y-1.5">
                <Label htmlFor="menuFilter" className="text-base text-zinc-700">
                  Menü
                </Label>
                <TouchSelect
                  id="menuFilter"
                  value={menuId}
                  onChange={handleMenuChange}
                  placeholder="Menü Seçilmedi"
                  options={menus.map((menu) => ({ value: menu.id, label: menu.name }))}
                />
              </div>
            )}
          </div>

          <div className="flex min-h-0 flex-1 gap-4">
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center text-sm text-zinc-400">
                Ürünler yükleniyor...
              </div>
            ) : isError ? (
              <div className="flex flex-1 items-center justify-center text-sm text-red-500">
                Ürünler yüklenemedi.
              </div>
            ) : (
              <ProductCatalog
                products={displayProducts}
                onAdd={handleAddItem}
                size="large"
                searchValue={searchInput}
                onSearchChange={setSearchInput}
                hasMore={hasMore}
                isFetchingNextPage={isFetching && pageNumber > 1}
                onLoadMore={() => setPageNumber((current) => current + 1)}
              />
            )}

            <SelectedItemsPanel
              items={items}
              onIncrease={handleIncreaseItem}
              onDecrease={handleDecreaseItem}
              onRemove={handleRemoveItem}
              onSubmit={handleSubmit}
              isSubmitDisabled={!isValid}
              isSubmitting={createOrder.isPending}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
