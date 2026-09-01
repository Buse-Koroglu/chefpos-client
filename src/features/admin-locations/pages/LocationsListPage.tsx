import { useMemo, useState } from 'react'
import axios from 'axios'
import { Plus } from 'lucide-react'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { SuperAdminSidebar } from '@/shared/components/SuperAdminSidebar'
import { AdminHeader } from '@/shared/components/AdminHeader'
import { LocationsSearchInput } from '@/features/admin-locations/components/LocationsSearchInput'
import { LocationsStatusFilter } from '@/features/admin-locations/components/LocationsStatusFilter'
import { LocationsTable } from '@/features/admin-locations/components/LocationsTable'
import { LocationsPagination } from '@/features/admin-locations/components/LocationsPagination'
import { LocationEditPopup } from '@/features/admin-locations/components/LocationEditPopup'
import { AddLocationPopup } from '@/features/admin-locations/components/AddLocationPopup'
import { usePagedLocations } from '@/features/admin-locations/hooks/usePagedLocations'
import { LOCATIONS_SEARCH_DEBOUNCE_TIME } from '@/features/admin-locations/constants'
import type { LocationStatusFilter } from '@/features/admin-locations/types'

function getLocationsErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return 'Bu verileri görüntülemek için yönetici yetkisine sahip olmalısınız.'
    }
  }
  return 'Yerleşke listesi yüklenemedi. Lütfen tekrar deneyin.'
}

export function LocationsListPage() {
  const [searchInput, setSearchInput] = useState('')
  const [status, setStatus] = useState<LocationStatusFilter>('ALL')
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const searchTerm = useDebouncedValue(searchInput, LOCATIONS_SEARCH_DEBOUNCE_TIME)

  const { data, isLoading, isFetching, isError, error } = usePagedLocations(searchTerm, status, pageNumber)
  const items = useMemo(() => data?.items ?? [], [data])
  const selectedLocation = useMemo(
    () => items.find((location) => location.id === selectedLocationId) ?? null,
    [items, selectedLocationId],
  )

  function handleSearchChange(value: string) {
    setSearchInput(value)
    setPageNumber(1)
  }

  function handleStatusChange(value: LocationStatusFilter) {
    setStatus(value)
    setPageNumber(1)
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <SuperAdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <AdminHeader
          title="Yerleşkeler"
          actions={
            <div className="flex items-center gap-3">
              <LocationsStatusFilter value={status} onChange={handleStatusChange} />
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 bg-[#133458] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0f2843]"
              >
                <Plus className="size-4" />
                Yeni Yerleşke Ekle
              </button>
            </div>
          }
        />

        <main className="flex flex-1 flex-col gap-4 p-6">
          {isError && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getLocationsErrorMessage(error)}
            </div>
          )}

          <LocationsSearchInput value={searchInput} onChange={handleSearchChange} />

          <div className="flex flex-1 flex-col">
            <LocationsTable
              locations={items}
              onSelect={setSelectedLocationId}
              isLoading={isLoading || (isFetching && items.length === 0)}
            />
            <LocationsPagination
              pageNumber={data?.pageNumber ?? pageNumber}
              totalPages={data?.totalPages ?? 1}
              totalCount={data?.totalCount ?? 0}
              onPageChange={setPageNumber}
            />
          </div>
        </main>
      </div>

      <LocationEditPopup location={selectedLocation} onClose={() => setSelectedLocationId(null)} />
      <AddLocationPopup open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}
