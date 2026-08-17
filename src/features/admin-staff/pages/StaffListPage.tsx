import { useMemo, useState } from 'react'
import axios from 'axios'
import { Plus } from 'lucide-react'
import { useAuthStore } from '@/shared/stores/authStore'
import { useLocations } from '@/shared/hooks/useLocations'
import { AdminSidebar } from '@/shared/components/AdminSidebar'
import { AdminHeader } from '@/shared/components/AdminHeader'
import { StaffFiltersBar } from '@/features/admin-staff/components/StaffFiltersBar'
import { StaffTable } from '@/features/admin-staff/components/StaffTable'
import { StaffPagination } from '@/features/admin-staff/components/StaffPagination'
import { StaffEditPopup } from '@/features/admin-staff/components/StaffEditPopup'
import { AddStaffPopup } from '@/features/admin-staff/components/AddStaffPopup'
import { useAllUsers } from '@/features/admin-staff/hooks/useAllUsers'
import { useFilteredStaff } from '@/features/admin-staff/hooks/useFilteredStaff'
import type { RoleFilter, StaffFilters, StatusFilter } from '@/features/admin-staff/types'

const INITIAL_FILTERS: StaffFilters = { role: 'ALL', status: 'ALL', locationId: 'ALL' }

function getUsersErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return 'Bu verileri görüntülemek için yönetici yetkisine sahip olmalısınız.'
    }
  }
  return 'Personel listesi yüklenemedi. Lütfen tekrar deneyin.'
}

export function StaffListPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const [filters, setFilters] = useState<StaffFilters>(INITIAL_FILTERS)
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const { data: locations = [] } = useLocations()
  const locationsById = useMemo(() => new Map(locations.map((location) => [location.id, location.name])), [locations])

  const { data: allUsers, isLoading, isError, error } = useAllUsers()
  const { items, totalCount, totalPages, pageNumber: currentPage } = useFilteredStaff(
    allUsers ?? [],
    filters,
    pageNumber,
  )

  function updateFilters(patch: Partial<StaffFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }))
    setPageNumber(1)
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <AdminSidebar
        userName={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()}
        userRole="Yönetici"
        onLogout={logout}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <AdminHeader
          title="Personeller"
          actions={
            <div className="flex items-center gap-3">
              <StaffFiltersBar
                role={filters.role}
                status={filters.status}
                locationId={filters.locationId}
                locations={locations}
                onRoleChange={(role: RoleFilter) => updateFilters({ role })}
                onStatusChange={(status: StatusFilter) => updateFilters({ status })}
                onLocationChange={(locationId) => updateFilters({ locationId })}
              />
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                <Plus className="size-4" />
                Yeni Personel Ekle
              </button>
            </div>
          }
        />

        <main className="flex flex-1 flex-col gap-4 p-6">
          {isError && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getUsersErrorMessage(error)}
            </div>
          )}

          <div className="flex flex-1 flex-col">
            <StaffTable staff={items} locationsById={locationsById} onSelect={setSelectedUserId} isLoading={isLoading} />
            <StaffPagination
              pageNumber={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={setPageNumber}
            />
          </div>
        </main>
      </div>

      <StaffEditPopup userId={selectedUserId} locations={locations} onClose={() => setSelectedUserId(null)} />
      <AddStaffPopup open={isAddModalOpen} locations={locations} onClose={() => setIsAddModalOpen(false)} />
    </div>
  )
}
