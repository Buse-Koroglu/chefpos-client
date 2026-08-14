import { useState } from 'react'
import axios from 'axios'
import { RefreshCw, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/shared/stores/authStore'
import { CashierHeader } from '@/shared/components/CashierHeader'
import { CashierSidebar } from '@/shared/components/CashierSidebar'
import { Pagination } from '@/shared/components/Pagination'
import { PastOrderCard } from '../components/PastOrderCard'
import { usePastOrders, type OrderHistoryFilter } from '../hooks/usePastOrders'

const FORM_INPUT_CLASSNAME =
  'h-10 w-full rounded-none border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

const STATUS_TABS: Array<{ value: OrderHistoryFilter; label: string }> = [
  { value: 'PAID', label: 'Ödenen' },
  { value: 'CANCELLED', label: 'İptal Edilen' },
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

export function PastOrdersPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const locationId = user?.locationIds[0]
  const locationName = locationId ?? '—'

  const [filter, setFilter] = useState<OrderHistoryFilter>('PAID')
  const [pageNumber, setPageNumber] = useState(1)
  const [query, setQuery] = useState('')

  const { data, isLoading, isFetching, isError, error, refetch } = usePastOrders(locationId, filter, pageNumber)

  const orders = data?.items ?? []
  const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR')
  const filteredOrders = normalizedQuery
    ? orders.filter(
        (order) =>
          String(order.orderNumber).includes(normalizedQuery) ||
          order.customerName.toLocaleLowerCase('tr-TR').includes(normalizedQuery),
      )
    : orders

  function handleFilterChange(nextFilter: OrderHistoryFilter) {
    setFilter(nextFilter)
    setPageNumber(1)
  }

  function handlePageChange(page: number) {
    setPageNumber(page)
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
        <CashierHeader title="Geçmiş Siparişler" locationName={locationName} />

        <main className="flex min-h-0 flex-1 flex-col gap-4 p-4">
          <div className="flex border border-zinc-200 bg-white">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleFilterChange(tab.value)}
                className={cn(
                  'flex-1 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                  filter === tab.value
                    ? 'border-[#133458] bg-zinc-50 text-zinc-900'
                    : 'border-transparent text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900',
                )}
              >
                {tab.label}
                {filter === tab.value && data && (
                  <span className="ml-1.5 inline-flex items-center border border-zinc-300 bg-white px-1.5 py-0.5 text-xs font-semibold text-zinc-700">
                    {data.totalCount}
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
                {filter === 'PAID' ? 'Ödenen sipariş yok' : 'İptal edilen sipariş yok'}
              </div>
            ) : (
              <div className="grid flex-1 auto-rows-min grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 overflow-y-auto p-4">
                {filteredOrders.map((order) => (
                  <PastOrderCard key={order.id} order={order} />
                ))}
              </div>
            )}

            {data && !isError && (
              <Pagination
                pageNumber={pageNumber}
                totalPages={data.totalPages}
                totalCount={data.totalCount}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
