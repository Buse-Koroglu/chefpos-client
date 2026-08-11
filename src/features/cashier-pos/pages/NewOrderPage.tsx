import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/shared/stores/authStore'
import { CashierHeader } from '@/shared/components/CashierHeader'
import { CashierSidebar } from '@/shared/components/CashierSidebar'
import type { OrderItem, Product } from '../types'
import { ProductCatalog } from '../components/ProductCatalog'
import { SelectedItemsPanel } from '../components/SelectedItemsPanel'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useCreateOrder } from '../hooks/useCreateOrder'

const FORM_INPUT_CLASSNAME =
  'h-11 rounded-none border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-400 focus-visible:ring-zinc-200'

export function NewOrderPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const locationId = user?.locationIds[0]
  const locationName = locationId ?? '—'

  const [categoryId, setCategoryId] = useState('')

  const { data: categories = [] } = useCategories(locationId)
  const { data: products = [], isLoading, isError } = useProducts(locationId, categoryId || undefined)
  const createOrder = useCreateOrder()

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
      <CashierSidebar
        locationName={locationName}
        userName={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()}
        userRole="Kasiyer"
        onLogout={logout}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <CashierHeader title="Yeni Sipariş" locationName={locationName} />

        <main className="flex min-h-0 flex-1 flex-col gap-4 p-4">
          <div className="flex items-end gap-3">
            <div className="max-w-sm flex-1 space-y-1.5">
              <Label htmlFor="customerName" className="text-zinc-700">
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

            <div className="w-48 space-y-1.5">
              <Label htmlFor="categoryFilter" className="text-zinc-700">
                Kategori
              </Label>
              <div className="relative">
                <select
                  id="categoryFilter"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className={`${FORM_INPUT_CLASSNAME} w-full appearance-none border pr-9 pl-3 text-sm outline-none`}
                >
                  <option value="">Tümü</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-400" />
              </div>
            </div>
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
              <ProductCatalog products={products} onAdd={handleAddItem} />
            )}

            <SelectedItemsPanel
              items={items}
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
