import { useEffect, useMemo } from 'react'
import axios from 'axios'
import { Award, RefreshCw, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/shared/stores/authStore'
import { useLocationStore } from '@/shared/stores/locationStore'
import { AdminSidebar } from '@/shared/components/AdminSidebar'
import { AdminHeader } from '@/shared/components/AdminHeader'
import { AdminInfoCard } from '@/features/admin-dashboard/components/AdminInfoCard'
import { LocationSelect } from '@/features/admin-dashboard/components/LocationSelect'
import { WeeklyRevenueBarChart } from '@/features/admin-dashboard/components/WeeklyRevenueBarChart'
import { LocationOrdersPieChart } from '@/features/admin-dashboard/components/LocationOrdersPieChart'
import { useLocations } from '@/shared/hooks/useLocations'
import { useDashboardSummary } from '@/features/admin-dashboard/hooks/useDashboardSummary'

function getSummaryErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      return 'Bu verileri görüntülemek için yönetici yetkisine sahip olmalısınız.'
    }
  }
  return 'Panel verileri yüklenemedi. Lütfen tekrar deneyin.'
}

export function AdminHomePage() {
  const selectedLocationId = useLocationStore((state) => state.selectedLocationId)
  const setSelectedLocationId = useLocationStore((state) => state.setSelectedLocationId)
  const user = useAuthStore((state) => state.user)

  const { data: allLocations = [], isLoading: isLocationsLoading } = useLocations()
  const locations = useMemo(
    () => allLocations.filter((location) => user?.locationIds.includes(location.id)),
    [allLocations, user],
  )

  useEffect(() => {
    if (!selectedLocationId && locations.length > 0) {
      setSelectedLocationId(locations[0].id)
    }
  }, [selectedLocationId, locations, setSelectedLocationId])

  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    error: summaryError,
    isFetching: isSummaryFetching,
    refetch: refetchSummary,
  } = useDashboardSummary(selectedLocationId ?? undefined)

  const staffCountValue = summary ? String(summary.totalStaffCount) : ''
  const bestSellingValue = summary ? (summary.topSellingProductName ?? 'Henüz veri yok') : ''

  return (
    <div className="flex h-screen bg-zinc-50">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <AdminHeader
          title="Genel Bakış"
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
                onClick={() => refetchSummary()}
                disabled={isSummaryFetching}
                className="flex items-center gap-1.5 border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-white disabled:opacity-50"
              >
                <RefreshCw className={cn('size-4', isSummaryFetching && 'animate-spin')} />
                Yenile
              </button>
            </div>
          }
        />

        <main className="flex flex-1 flex-col gap-4 p-6">
          {isSummaryError && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getSummaryErrorMessage(summaryError)}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminInfoCard
              label="Toplam Personel Sayısı"
              value={staffCountValue}
              icon={Users}
              isLoading={isSummaryLoading}
            />
            <AdminInfoCard
              label="En Çok Satan Ürün"
              value={bestSellingValue}
              icon={Award}
              isLoading={isSummaryLoading}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <WeeklyRevenueBarChart
              data={summary?.weeklyRevenue ?? []}
              isLoading={isSummaryLoading}
              isError={isSummaryError}
            />
            <LocationOrdersPieChart
              data={summary?.todayOrdersByLocation ?? []}
              isLoading={isSummaryLoading}
              isError={isSummaryError}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
