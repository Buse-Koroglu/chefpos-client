import { useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLocationStore } from '@/shared/stores/locationStore'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { getApiErrorMessage } from '@/shared/api/apiError'
import { PaymentStatusBadge } from '@/shared/components/PaymentStatusBadge'
import { CategoryTabs } from '@/features/waiter-pos/components/CategoryTabs'
import { ProductCard } from '@/features/waiter-pos/components/ProductCard'
import { useCategories } from '@/features/waiter-pos/hooks/useCategories'
import { useProducts } from '@/features/waiter-pos/hooks/useProducts'
import { OrderStatusBadge } from '../components/OrderStatusBadge'
import { useOrderDetail } from '../hooks/useOrderDetail'
import { useOrderItemMutations } from '../hooks/useOrderItemMutations'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

export function OrderHistoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const locationId = useLocationStore((s) => s.selectedLocationId) ?? undefined

  const [editMode, setEditMode] = useState(false)
  const [categoryId, setCategoryId] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 400)

  const { data: order, isLoading, isError } = useOrderDetail(id)
  const { addItem, removeItem, decreaseItem } = useOrderItemMutations(id!)

  const { data: categories = [] } = useCategories(editMode ? locationId : undefined)
  const { data: productsPage } = useProducts({
    locationId: editMode ? locationId : undefined,
    categoryId: categoryId || undefined,
    searchTerm: debouncedSearch,
    pageNumber: 1,
    pageSize: 40,
  })
  const products = productsPage?.items ?? []

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 text-sm text-zinc-400">
        Yükleniyor...
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-zinc-50 text-sm text-red-500">
        Sipariş yüklenemedi.
        <button
          type="button"
          onClick={() => navigate('/app/waiter-orders/history')}
          className="text-sm font-medium text-zinc-700 underline"
        >
          Listeye dön
        </button>
      </div>
    )
  }

  const canEdit = order.status === 'PENDING' && order.paymentStatus === 'UNPAID'

  function handleAdd(productId: string) {
    addItem.mutate(
      { productId, quantity: 1 },
      { onError: (error) => toast.error(getApiErrorMessage(error, 'Ürün eklenemedi.')) },
    )
  }

  function handleIncrease(productId: string | null) {
    if (!productId) {
      toast.error('Bu ürün artık mevcut olmadığı için adedi artırılamıyor.')
      return
    }
    addItem.mutate(
      { productId, quantity: 1 },
      { onError: (error) => toast.error(getApiErrorMessage(error, 'Adet artırılamadı.')) },
    )
  }

  function handleDecrease(orderItemId: string) {
    decreaseItem.mutate(
      { orderItemId, quantity: 1 },
      { onError: (error) => toast.error(getApiErrorMessage(error, 'Adet azaltılamadı.')) },
    )
  }

  function handleRemove(orderItemId: string) {
    removeItem.mutate(orderItemId, {
      onError: (error) => toast.error(getApiErrorMessage(error, 'Ürün kaldırılamadı.')),
    })
  }

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-zinc-50">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4">
        <button
          type="button"
          onClick={() => (editMode ? setEditMode(false) : navigate('/app/waiter-orders/history'))}
          aria-label="Geri"
          className="text-zinc-900"
        >
          <ArrowLeft className="size-5" />
        </button>
        <span className="text-sm font-semibold tracking-tight text-zinc-900">
          {editMode ? 'Sipariş Düzenle' : `Sipariş #${order.orderNumber}`}
        </span>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="border-b border-zinc-200 bg-white p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                {order.tableNumber ? `Masa ${order.tableNumber}` : 'Masa belirtilmedi'}
              </p>
              <p className="text-xs text-zinc-500">{order.customerName || 'Müşteri belirtilmedi'}</p>
              <p className="mt-1 text-xs text-zinc-400">{dateFormatter.format(new Date(order.createdAt))}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Sipariş İçeriği</h3>
            <span className="text-xs text-zinc-400">{order.items.length} ürün</span>
          </div>

          {order.items.length === 0 ? (
            <p className="border border-zinc-200 bg-white p-4 text-center text-sm text-zinc-400">Ürün yok</p>
          ) : (
            <div className="border border-zinc-200 bg-white">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 border-b border-zinc-100 px-3 py-2.5 last:border-b-0">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900">{item.name}</p>
                    <p className="text-xs tabular-nums text-zinc-500">
                      {currencyFormatter.format(item.price)} / adet
                    </p>
                  </div>

                  {editMode ? (
                    <>
                      <div className="flex shrink-0 items-center border border-zinc-300">
                        <button
                          type="button"
                          onClick={() => handleDecrease(item.id)}
                          disabled={decreaseItem.isPending}
                          aria-label={`${item.name} adedini azalt`}
                          className="flex size-7 items-center justify-center text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleIncrease(item.productId)}
                          disabled={addItem.isPending}
                          aria-label={`${item.name} adedini artır`}
                          className="flex size-7 items-center justify-center text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        disabled={removeItem.isPending}
                        aria-label={`${item.name} ürününü kaldır`}
                        className="shrink-0 text-zinc-300 transition-colors hover:text-red-500 disabled:opacity-50"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </>
                  ) : (
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-zinc-700">
                      {item.quantity}x
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {editMode && (
          <>
            <div className="border-y border-zinc-200 bg-white px-3 py-3">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ürün Ara..."
                className="h-10 w-full border border-zinc-300 bg-white px-3 text-sm outline-none focus-visible:border-zinc-900"
              />
            </div>
            <CategoryTabs categories={categories} selectedCategoryId={categoryId} onSelect={setCategoryId} />
            <div className="grid grid-cols-2 gap-3 p-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={() => handleAdd(product.id)} />
              ))}
            </div>
          </>
        )}
      </main>

      <div className="border-t border-zinc-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-500 uppercase">Toplam</span>
          <span className="text-lg font-bold tabular-nums text-zinc-900">
            {currencyFormatter.format(order.totalPrice)}
          </span>
        </div>

        {editMode ? (
          <button
            type="button"
            onClick={() => navigate('/app/waiter-orders/history')}
            className="h-11 w-full bg-[#133458] text-sm font-semibold text-white transition-colors hover:bg-[#0f2843]"
          >
            Bitti
          </button>
        ) : canEdit ? (
          <button
            type="button"
            onClick={() => setEditMode(true)}
            className="h-11 w-full bg-[#133458] text-sm font-semibold text-white transition-colors hover:bg-[#0f2843]"
          >
            Düzenle
          </button>
        ) : null}
      </div>
    </div>
  )
}
