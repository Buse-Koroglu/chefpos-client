import { useState } from 'react'
import axios from 'axios'
import { RefreshCw, Search } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useLocationStore } from '@/shared/stores/locationStore'
import { useLocations } from '@/shared/hooks/useLocations'
import { CashierHeader } from '@/shared/components/CashierHeader'
import { CashierSidebar } from '@/shared/components/CashierSidebar'
import { Pagination } from '@/shared/components/Pagination'
import { OrderCard } from '../components/OrderCard'
import { PaymentModal } from '../components/PaymentModal'
import { usePendingOrdersCount } from '@/shared/hooks/usePendingOrdersCount'
import { usePendingOrders, type PendingOrdersTab } from '../hooks/usePendingOrders'
import { useCompleteOrder } from '../hooks/useCompleteOrder'
import { useCancelOrder } from '../hooks/useCancelOrder'
import { useMakePaidOrder } from '../hooks/useMakePaidOrder'
import type { Order } from '../types'

const FORM_INPUT_CLASSNAME =
  'h-10 w-full rounded-none border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

const TABS: Array<{ value: PendingOrdersTab; label: string }> = [
  { value: 'PREPARING', label: 'Bekleyen Siparişler' },
  { value: 'AWAITING_PAYMENT', label: 'Ödeme Bekleyen Siparişler' },
]

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return 'Oturumunuz sona ermiş veya bu sayfayı görüntüleme yetkiniz yok.'
    }
  }
  return 'Siparişler yüklenemedi. Lütfen tekrar deneyin.'
}

export function PendingOrdersPage() {
  const locationId = useLocationStore((state) => state.selectedLocationId) ?? undefined
  const { data: locations = [] } = useLocations()
  const locationName = locations.find((location) => location.id === locationId)?.name ?? '—'

  const [tab, setTab] = useState<PendingOrdersTab>('PREPARING')
  const [pageNumber, setPageNumber] = useState(1)
  const [query, setQuery] = useState('')
  const [completingOrderId, setCompletingOrderId] = useState<string | null>(null)
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)
  const [paymentOrder, setPaymentOrder] = useState<Order | null>(null)

  const { data, isLoading, isFetching, isError, error, refetch } = usePendingOrders(locationId, tab, pageNumber)
  const { total: tabOrderCount } = usePendingOrdersCount(locationId, tab)
  const completeOrder = useCompleteOrder()
  const cancelOrder = useCancelOrder()
  const makePaidOrder = useMakePaidOrder()

  const orders = data?.items ?? []
  const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR')
  const filteredOrders = normalizedQuery
    ? orders.filter(
        (order) =>
          String(order.orderNumber).includes(normalizedQuery) ||
          order.customerName.toLocaleLowerCase('tr-TR').includes(normalizedQuery),
      )
    : orders

  function handleTabChange(nextTab: PendingOrdersTab) {
    setTab(nextTab)
    setPageNumber(1)
  }

  function handleComplete(orderId: string) {
    setCompletingOrderId(orderId)
    completeOrder.mutate(orderId, {
      onSuccess: () => {
        toast.success('Sipariş tamamlandı.')
      },
      onError: () => {
        toast.error('Sipariş tamamlanamadı. Lütfen tekrar deneyin.')
      },
      onSettled: () => {
        setCompletingOrderId(null)
      },
    })
  }

  function handleCancel(orderId: string) {
    setCancellingOrderId(orderId)
    cancelOrder.mutate(orderId, {
      onSuccess: () => {
        toast.success('Sipariş iptal edildi.')
      },
      onError: () => {
        toast.error('Sipariş iptal edilemedi. Lütfen tekrar deneyin.')
      },
      onSettled: () => {
        setCancellingOrderId(null)
      },
    })
  }

  function handleOpenPayment(order: Order) {
    setPaymentOrder(order)
  }

  function handleClosePayment() {
    setPaymentOrder(null)
  }

  function handleConfirmPayment(orderId: string) {
    makePaidOrder.mutate(orderId, {
      onSuccess: () => {
        toast.success('Ödeme alındı.')
        setPaymentOrder(null)
      },
      onError: () => {
        toast.error('Ödeme alınamadı. Lütfen tekrar deneyin.')
      },
    })
  }

  function handlePageChange(page: number) {
    setPageNumber(page)
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <CashierSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <CashierHeader title="Bekleyen Siparişler" locationName={locationName} />

        <main className="flex min-h-0 flex-1 flex-col gap-4 p-4">
          <div className="flex border border-zinc-200 bg-white">
            {TABS.map((tabItem) => (
              <button
                key={tabItem.value}
                type="button"
                onClick={() => handleTabChange(tabItem.value)}
                className={cn(
                  'flex-1 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                  tab === tabItem.value
                    ? 'border-[#133458] bg-zinc-50 text-zinc-900'
                    : 'border-transparent text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900',
                )}
              >
                {tabItem.label}
                {tab === tabItem.value && (
                  <span className="ml-1.5 inline-flex items-center border border-zinc-300 bg-white px-1.5 py-0.5 text-xs font-semibold text-zinc-700">
                    {tabOrderCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Sipariş Numarası veya Müşteri Ara..."
                className={FORM_INPUT_CLASSNAME}
              />
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex h-10 shrink-0 items-center gap-2 border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
            >
              <RefreshCw className={cn('size-4', isFetching && 'animate-spin')} />
              Yenile
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col border border-zinc-200 bg-white">
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center text-sm text-zinc-400">
                Siparişler yükleniyor...
              </div>
            ) : isError ? (
              <div className="flex flex-1 items-center justify-center text-sm text-red-500">
                {getErrorMessage(error)}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
                {tab === 'PREPARING' ? 'Hazırlanan sipariş yok' : 'Ödeme bekleyen sipariş yok'}
              </div>
            ) : (
              <div className="grid flex-1 auto-rows-min grid-cols-[repeat(auto-fill,minmax(330px,1fr))] gap-4 overflow-y-auto p-4">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    isReadyForPayment={tab === 'AWAITING_PAYMENT'}
                    onComplete={handleComplete}
                    onCancel={handleCancel}
                    onOpenPayment={handleOpenPayment}
                    isCompleting={completingOrderId === order.id && completeOrder.isPending}
                    isCancelling={cancellingOrderId === order.id && cancelOrder.isPending}
                  />
                ))}
              </div>
            )}

            {data && !isError && (
              <Pagination
                pageNumber={pageNumber}
                totalPages={data.totalPages}
                totalCount={tabOrderCount}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </main>
      </div>

      <PaymentModal
        order={paymentOrder}
        onClose={handleClosePayment}
        onConfirm={handleConfirmPayment}
        isSubmitting={makePaidOrder.isPending}
      />
    </div>
  )
}
