import { useMemo, useState } from 'react'
import axios from 'axios'
import { useAuthStore } from '@/shared/stores/authStore'
import { useLocations } from '@/shared/hooks/useLocations'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { AdminSidebar } from '@/shared/components/AdminSidebar'
import { AdminHeader } from '@/shared/components/AdminHeader'
import { ROLE_LABELS } from '@/features/admin-staff/constants'
import { StockRequestsSearchInput } from '@/features/admin-stock-requests/components/StockRequestsSearchInput'
import { StockRequestsFiltersBar } from '@/features/admin-stock-requests/components/StockRequestsFiltersBar'
import { StockRequestsTable } from '@/features/admin-stock-requests/components/StockRequestsTable'
import { StockRequestsPagination } from '@/features/admin-stock-requests/components/StockRequestsPagination'
import { StockRequestDetailPopup } from '@/features/admin-stock-requests/components/StockRequestDetailPopup'
import { usePagedStockRequestsAdmin } from '@/features/admin-stock-requests/hooks/usePagedStockRequestsAdmin'
import { STOCK_REQUESTS_SEARCH_DEBOUNCE_MS } from '@/features/admin-stock-requests/constants'
import type { StockRequestStatusFilter } from '@/features/admin-stock-requests/types'

function getStockRequestsErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return 'Bu verileri görüntülemek için yetkiniz bulunmuyor.'
    }
  }
  return 'Stok talepleri yüklenemedi. Lütfen tekrar deneyin.'
}

export function StockRequestsListPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const [searchInput, setSearchInput] = useState('')
  const [locationId, setLocationId] = useState('ALL')
  const [status, setStatus] = useState<StockRequestStatusFilter>('ALL')
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedStockRequestId, setSelectedStockRequestId] = useState<string | null>(null)

  const { data: locations = [] } = useLocations()
  const searchTerm = useDebouncedValue(searchInput, STOCK_REQUESTS_SEARCH_DEBOUNCE_MS)

  const { data, isLoading, isFetching, isError, error } = usePagedStockRequestsAdmin(
    searchTerm,
    locationId,
    status,
    pageNumber,
  )
  const items = useMemo(() => data?.items ?? [], [data])
  const selectedStockRequest = useMemo(
    () => items.find((stockRequest) => stockRequest.id === selectedStockRequestId) ?? null,
    [items, selectedStockRequestId],
  )

  function handleSearchChange(value: string) {
    setSearchInput(value)
    setPageNumber(1)
  }

  function handleLocationChange(value: string) {
    setLocationId(value)
    setPageNumber(1)
  }

  function handleStatusChange(value: StockRequestStatusFilter) {
    setStatus(value)
    setPageNumber(1)
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <AdminSidebar
        userName={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()}
        userRole={user?.roles[0] ? ROLE_LABELS[user.roles[0]] : 'Kullanıcı'}
        onLogout={logout}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <AdminHeader
          title="Stok Talepleri"
          actions={
            <StockRequestsFiltersBar
              locationId={locationId}
              status={status}
              locations={locations}
              onLocationChange={handleLocationChange}
              onStatusChange={handleStatusChange}
            />
          }
        />

        <main className="flex flex-1 flex-col gap-4 p-6">
          {isError && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getStockRequestsErrorMessage(error)}
            </div>
          )}

          <StockRequestsSearchInput value={searchInput} onChange={handleSearchChange} />

          <div className="flex flex-1 flex-col">
            <StockRequestsTable
              stockRequests={items}
              onSelect={setSelectedStockRequestId}
              isLoading={isLoading || (isFetching && items.length === 0)}
            />
            <StockRequestsPagination
              pageNumber={data?.pageNumber ?? pageNumber}
              totalPages={data?.totalPages ?? 1}
              totalCount={data?.totalCount ?? 0}
              onPageChange={setPageNumber}
            />
          </div>
        </main>
      </div>

      <StockRequestDetailPopup stockRequest={selectedStockRequest} onClose={() => setSelectedStockRequestId(null)} />
    </div>
  )
}
