import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/shared/stores/authStore'
import { CashierHeader } from '@/shared/components/CashierHeader'
import { CashierSidebar } from '@/shared/components/CashierSidebar'
import type { OrderItem, Product } from '../types'
import { OrderItemsTable } from '../components/OrderItemsTable'
import { ProductDropdown } from '../components/ProductDropdown'
import { MOCK_PRODUCTS } from '../data/mockProducts'


const FORM_INPUT_CLASSNAME =
  'h-11 rounded-none border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus-visible:border-zinc-400 focus-visible:ring-zinc-200'

export function NewOrderPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const locationName = user?.locationIds[0] ?? '—'

  const [customerName, setCustomerName] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [items, setItems] = useState<OrderItem[]>([])

  const isValid = customerName.trim().length > 0 && items.length > 0

  function handleAddItem() {
    if (!selectedProduct || quantity < 1) return

    setItems((current) => {
      const existing = current.find((item) => item.id === selectedProduct.id)
      if (existing) {
        return current.map((item) =>
          item.id === selectedProduct.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...current, { ...selectedProduct, quantity }]
    })

    setSelectedProduct(null)
    setQuantity(1)
  }

  function handleRemoveItem(productId: string) {
    setItems((current) => current.filter((item) => item.id !== productId))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!customerName.trim()) {
      toast.error('Müşteri adını giriniz.')
      return
    }
    if (items.length === 0) {
      toast.error('En az bir ürün ekleyin.')
      return
    }

    toast.success(`${customerName} için sipariş oluşturuldu.`)
    setCustomerName('')
    setItems([])
    setSelectedProduct(null)
    setQuantity(1)
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

        <main className="flex flex-1 justify-center p-6">
          <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
            <div className="space-y-1.5">
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

            <div className="space-y-1.5">
              <Label className="text-zinc-700">Ürünler</Label>
              <div className="flex items-center gap-2">
                <ProductDropdown
                  products={MOCK_PRODUCTS}
                  selectedProduct={selectedProduct}
                  onSelect={setSelectedProduct}
                />

                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
                  className={`${FORM_INPUT_CLASSNAME} w-20 text-center`}
                />

                <button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!selectedProduct}
                  aria-label="Ürünü sipariş listesine ekle"
                  className="flex size-11 shrink-0 items-center justify-center bg-[#133458] text-white transition-colors hover:bg-[#0f2843] disabled:pointer-events-none disabled:opacity-40"
                >
                  <Plus className="size-5" />
                </button>
              </div>
            </div>

            <OrderItemsTable items={items} onRemove={handleRemoveItem} />

            <Button
              type="submit"
              disabled={!isValid}
              className="h-12 w-full rounded-none bg-[#133458] text-base text-white hover:bg-[#0f2843]"
            >
              Sipariş Oluştur
            </Button>
          </form>
        </main>
      </div>
    </div>
  )
}
