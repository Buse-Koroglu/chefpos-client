import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Plus } from 'lucide-react'
import { useAuthStore } from '@/shared/stores/authStore'
import { useLocationStore } from '@/shared/stores/locationStore'
import { useLocations } from '@/shared/hooks/useLocations'
import { AdminSidebar } from '@/shared/components/AdminSidebar'
import { SuperAdminSidebar } from '@/shared/components/SuperAdminSidebar'
import { AdminHeader } from '@/shared/components/AdminHeader'
import { Skeleton } from '@/shared/components/Skeleton'
import { LocationSelect } from '@/features/admin-dashboard/components/LocationSelect'
import { MenuCard } from '@/features/admin-menus/components/MenuCard'
import { AddMenuPopup } from '@/features/admin-menus/components/AddMenuPopup'
import { MenuEditPopup } from '@/features/admin-menus/components/MenuEditPopup'
import { useMenus } from '@/features/admin-menus/hooks/useMenus'

function getMenusErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return 'Bu verileri görüntülemek için yönetici yetkisine sahip olmalısınız.'
    }
  }
  return 'Menü listesi yüklenemedi. Lütfen tekrar deneyin.'
}

interface MenusListPageProps {
  variant?: 'admin' | 'super-admin'
}

export function MenusListPage({ variant = 'admin' }: MenusListPageProps) {
  const isSuperAdmin = variant === 'super-admin'

  const selectedLocationId = useLocationStore((state) => state.selectedLocationId)
  const setSelectedLocationId = useLocationStore((state) => state.setSelectedLocationId)
  const user = useAuthStore((state) => state.user)

  const { data: allLocations = [], isLoading: isLocationsLoading } = useLocations()
  const locations = useMemo(
    () => (isSuperAdmin ? allLocations : allLocations.filter((location) => user?.locationIds.includes(location.id))),
    [allLocations, isSuperAdmin, user],
  )

  useEffect(() => {
    if ((!selectedLocationId || !locations.some((location) => location.id === selectedLocationId)) && locations.length > 0) {
      setSelectedLocationId(locations[0].id)
    }
  }, [selectedLocationId, locations, setSelectedLocationId])

  const [includeInactive, setIncludeInactive] = useState(false)
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const { data: menus = [], isLoading, isError, error } = useMenus(selectedLocationId ?? undefined, includeInactive)

  return (
    <div className="flex h-screen bg-zinc-50">
      {isSuperAdmin ? <SuperAdminSidebar /> : <AdminSidebar />}

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <AdminHeader
          title="Menüler"
          actions={
            <div className="flex items-center gap-3">
              <LocationSelect
                locations={locations}
                value={selectedLocationId ?? undefined}
                onChange={setSelectedLocationId}
                disabled={isLocationsLoading}
              />
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                disabled={!selectedLocationId}
                className="flex items-center gap-1.5 bg-[#133458] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0f2843] disabled:opacity-50"
              >
                <Plus className="size-4" />
                Menü Ekle
              </button>
            </div>
          }
        />

        <main className="flex flex-1 flex-col gap-4 p-6">
          {isError && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getMenusErrorMessage(error)}
            </div>
          )}

          <label className="flex w-fit items-center gap-2 text-xs font-medium text-zinc-600">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(event) => setIncludeInactive(event.target.checked)}
            />
            Satışta olmayanları da göster
          </label>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-28 w-full" />
              ))}
            </div>
          ) : isError ? null : menus.length === 0 ? (
            <div className="flex flex-1 items-center justify-center border border-zinc-200 bg-white py-16 text-sm text-zinc-500">
              Bu yerleşkede kayıtlı menü bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {menus.map((menu) => (
                <MenuCard key={menu.id} menu={menu} onClick={() => setSelectedMenuId(menu.id)} />
              ))}
            </div>
          )}
        </main>
      </div>

      <MenuEditPopup menuId={selectedMenuId} onClose={() => setSelectedMenuId(null)} />
      <AddMenuPopup
        open={isAddModalOpen}
        locationId={selectedLocationId ?? undefined}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  )
}
