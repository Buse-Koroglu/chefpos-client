import { useState } from 'react'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLocationStore } from '@/shared/stores/locationStore'
import { PaymentFilterTabs } from '../components/PaymentFilterTabs'
import { OrderHistoryCard } from '../components/OrderHistoryCard'
import { useOrderHistory } from '../hooks/useOrderHistory'
import type { Order, PaymentFilter } from '../types'

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return 'Oturumunuz sona ermiş veya bu sayfayı görüntüleme yetkiniz yok.'
    }
  }
  return 'Siparişler yüklenemedi. Lütfen tekrar deneyin.'
}

export function OrderHistoryPage() {
  const navigate = useNavigate()
  const locationId = useLocationStore((s) => s.selectedLocationId) ?? undefined

  const [filter, setFilter] = useState<PaymentFilter>('ALL')
  const [pageNumber, setPageNumber] = useState(1)
  const [accumulatedItems, setAccumulatedItems] = useState<Order[]>([])

  const { data, isLoading, isFetching, isError, error } = useOrderHistory(locationId, filter, pageNumber)

  const [lastMergedData, setLastMergedData] = useState<typeof data>(undefined)
  if (data && data !== lastMergedData) {
    setLastMergedData(data)
    setAccumulatedItems((current) => (data.pageNumber === 1 ? data.items : [...current, ...data.items]))
  }

  function handleFilterChange(nextFilter: PaymentFilter) {
    setFilter(nextFilter)
    setPageNumber(1)
    setAccumulatedItems([])
    setLastMergedData(undefined)
  }

  const canLoadMore = Boolean(data) && data!.pageNumber < data!.totalPages

  return (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-zinc-50">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4">
        <button
          type="button"
          onClick={() => navigate('/app/waiter-orders')}
          aria-label="Geri"
          className="text-zinc-900"
        >
          <ArrowLeft className="size-5" />
        </button>
        <span className="text-sm font-semibold tracking-tight text-zinc-900">Geçmiş Siparişlerim</span>
      </header>

      <div className="border-b border-zinc-200 bg-white p-3">
        <PaymentFilterTabs value={filter} onChange={handleFilterChange} />
      </div>

      <main className="flex-1 overflow-y-auto p-3 pb-6">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-zinc-400">Yükleniyor...</p>
        ) : isError ? (
          <p className="py-8 text-center text-sm text-red-500">{getErrorMessage(error)}</p>
        ) : accumulatedItems.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-400">Sipariş bulunamadı.</p>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              {accumulatedItems.map((order) => (
                <OrderHistoryCard
                  key={order.id}
                  order={order}
                  onClick={() => navigate(`/app/waiter-orders/history/${order.id}`)}
                />
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
    </div>
  )
}
