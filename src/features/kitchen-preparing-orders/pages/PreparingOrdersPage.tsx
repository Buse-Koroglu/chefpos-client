import { useState } from 'react'
import axios from 'axios'
import { Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { CashierHeader } from '@/shared/components/CashierHeader'
import { Pagination } from '@/shared/components/Pagination'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { useLocations } from '@/shared/hooks/useLocations'
import { useLocationStore } from '@/shared/stores/locationStore'

import type { OrderResponse } from '@/shared/types/order'

import { KitchenSidebar } from '../components/KitchenSidebar'
import { OrderDetailModal } from '../components/OrderDetailModal'
import { PreparingOrdersTable } from '../components/PreparingOrdersTable'
import { useKitchenOrdersCount } from '../hooks/useKitchenOrdersCount'
import { usePreparingOrders, type KitchenOrdersTab } from '../hooks/usePreparingOrders'

const TABS: Array<{ value: KitchenOrdersTab; label: string }> = [
  { value: 'WAITER', label: 'Garson Siparişleri' },
  { value: 'KIOSK_CASHIER', label: 'Kiosk / Kasiyer Siparişleri' },
]

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status

    if (status === 401 || status === 403) {
      return 'Bu sayfayı görüntüleme yetkiniz yok.'
    }
  }

  return 'Siparişler yüklenemedi. Lütfen tekrar deneyin.'
}

export function PreparingOrdersPage() {
  const locationId =
    useLocationStore(
      (state) => state.selectedLocationId,
    ) ?? undefined

  const { data: locations = [] } = useLocations()

  const locationName =
    locations.find(
      (location) => location.id === locationId,
    )?.name ?? '—'

  const [tab, setTab] = useState<KitchenOrdersTab>('WAITER')
  const [searchTerm, setSearchTerm] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedOrder, setSelectedOrder] =
    useState<OrderResponse | null>(null)

  const debouncedSearchTerm = useDebouncedValue(
    searchTerm,
    350,
  )

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = usePreparingOrders({
    locationId,
    tab,
    pageNumber,
    searchTerm: debouncedSearchTerm.trim(),
  })

  const { waiterCount, kioskCashierCount } =
    useKitchenOrdersCount(locationId)

  const tabOrderCount =
    tab === 'WAITER' ? waiterCount : kioskCashierCount

  const orders = (data?.items ?? []).filter(
    (order) =>
      tab === 'WAITER' || order.type !== 'WAITER',
  )

  function handleTabChange(nextTab: KitchenOrdersTab) {
    setTab(nextTab)
    setPageNumber(1)
  }

  function handleSearchChange(
    value: string,
  ) {
    setSearchTerm(value)
    setPageNumber(1)
  }

  function handlePageChange(page: number) {
    setPageNumber(page)
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <KitchenSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <CashierHeader
          title="Bekleyen Siparişler"
          locationName={locationName}
        />

        <main className="flex min-h-0 flex-1 flex-col gap-4 p-4">

          <div className="flex border border-zinc-200 bg-white">
            {TABS.map((tabItem) => (
              <button
                key={tabItem.value}
                type="button"
                onClick={() => handleTabChange(tabItem.value)}
                className={cn(
                  'flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
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

          <div className="relative w-full">
            <Search
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                size-4
                -translate-y-1/2
                text-zinc-400
              "
            />

            <input
              value={searchTerm}
              onChange={(event) =>
                handleSearchChange(
                  event.target.value,
                )
              }
              placeholder="Müşteri ismi, sipariş numarasına göre arayın"
              className="
                h-11
                w-full
                rounded-none
                border
                border-zinc-300
                bg-white
                pl-10
                pr-4
                text-sm
                text-zinc-900
                outline-none
                transition-colors
                placeholder:text-zinc-400
                focus:border-zinc-500
              "
            />
          </div>

          <section
            className="
              flex
              min-h-0
              flex-1
              flex-col
              border
              border-zinc-200
              bg-white
            "
          >
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center text-sm text-zinc-400">
                Siparişler yükleniyor...
              </div>
            ) : isError ? (
              <div className="flex flex-1 items-center justify-center text-sm text-red-500">
                {getErrorMessage(error)}
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-700">
                    {tab === 'WAITER'
                      ? 'Hazırlanan garson siparişi bulunamadı'
                      : 'Hazırlanan kiosk/kasiyer siparişi bulunamadı'}
                  </p>

                  {debouncedSearchTerm && (
                    <p className="mt-1 text-xs text-zinc-400">
                      Arama kriterinizi değiştirmeyi
                      deneyin.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="min-h-0 flex-1 overflow-auto">
                  <PreparingOrdersTable
                    orders={orders}
                    onSelectOrder={
                      setSelectedOrder
                    }
                  />
                </div>

                <Pagination
                  pageNumber={pageNumber}
                  totalPages={data?.totalPages ?? 1}
                  totalCount={tabOrderCount}
                  onPageChange={
                    handlePageChange
                  }
                />
              </>
            )}

            {isFetching && !isLoading && (
              <div
                className="
                  border-t
                  border-zinc-100
                  bg-zinc-50
                  px-4
                  py-1.5
                  text-right
                  text-xs
                  text-zinc-400
                "
              >
                Güncelleniyor...
              </div>
            )}
          </section>
        </main>
      </div>

      <OrderDetailModal
        order={selectedOrder}
        onClose={() =>
          setSelectedOrder(null)
        }
      />
    </div>
  )
}