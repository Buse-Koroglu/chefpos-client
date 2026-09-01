import { Clock3, Flame, ListOrdered, ReceiptTurkishLira, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLocationStore } from '@/shared/stores/locationStore'
import { useLocations } from '@/shared/hooks/useLocations'
import { StaffHeader } from '@/shared/components/StaffHeader'
import { CashierSidebar } from '@/shared/components/CashierSidebar'
import { usePendingOrdersCount } from '@/shared/hooks/usePendingOrdersCount'
import { DashInfoCard } from '@/features/cashier-dashboard/components/DashInfoCard'
import { DashNavigationCard } from '@/features/cashier-dashboard/components/DashNavigationCard'
import { WeeklyRevenueChart } from '@/features/cashier-dashboard/components/WeeklyRevenueChart'
import { useCashierDashboard } from '@/features/cashier-dashboard/hooks/useCashierDashboard'
import { useWeeklyRevenue } from '@/features/cashier-dashboard/hooks/useWeeklyRevenue'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
})

export function CashierHomePage() {
  const navigate = useNavigate()

  const locationId = useLocationStore((state) => state.selectedLocationId) ?? undefined
  const { data: locations = [] } = useLocations()
  const locationName = locations.find((location) => location.id === locationId)?.name ?? '—'

  const { data: dashboard, isLoading, isError } = useCashierDashboard(locationId)
  const {
    data: weeklyRevenue,
    isLoading: isWeeklyRevenueLoading,
    isError: isWeeklyRevenueError,
  } = useWeeklyRevenue(locationId)
  const { total: pendingOrdersCount, isLoading: isPendingOrdersCountLoading } = usePendingOrdersCount(
    locationId,
    'PREPARING',
  )

  const pendingOrdersValue = isPendingOrdersCountLoading ? '…' : String(pendingOrdersCount)
  const todayRevenueValue = isLoading
    ? '…'
    : isError ? '—'  : currencyFormatter.format(dashboard?.todayRevenue ?? 0)
  const bestSellingValue = isLoading
    ? '…'
    : isError ? '—' : (dashboard?.bestSellingProduct?.productName ?? 'Henüz satış verisi yok')

  return (
    <div className="flex h-screen bg-zinc-50">
      <CashierSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <StaffHeader title="Genel Bakış" locationName={locationName} />

        <main className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <DashNavigationCard
              title="Siparişler"
              description="Bekleyen ve geçmiş siparişleri incele"
              actionLabel="Siparişleri Gör"
              icon={ListOrdered}
              onClick={() => navigate('/app/pending-orders')}
            />
            <DashNavigationCard
              title="Yeni Sipariş"
              description="Masaya veya paket için sipariş oluştur"
              actionLabel="Yeni Sipariş Al"
              icon={ShoppingCart}
              onClick={() => navigate('/app/pos')}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="flex flex-col gap-4">
              <DashInfoCard label="Bekleyen Sipariş" value={pendingOrdersValue} icon={Clock3} />
              <DashInfoCard label="Bugünkü Ciro" value={todayRevenueValue} icon={ReceiptTurkishLira} />
              <DashInfoCard label="En Çok Satan" value={bestSellingValue} icon={Flame} />
            </div>

            <div className="lg:col-span-2">
              <WeeklyRevenueChart
                days={weeklyRevenue?.days ?? []}
                isLoading={isWeeklyRevenueLoading}
                isError={isWeeklyRevenueError}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
