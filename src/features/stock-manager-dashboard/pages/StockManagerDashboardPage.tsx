import { useState } from 'react'
import { Archive, Clock3, PackagePlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { StaffHeader } from '@/shared/components/StaffHeader'
import { StockManagerSidebar } from '@/shared/components/StockManagerSidebar'
import { useLocations } from '@/shared/hooks/useLocations'
import { useLocationStore } from '@/shared/stores/locationStore'

import { DashInfoCard } from '@/features/cashier-dashboard/components/DashInfoCard'
import { DashNavigationCard } from '@/features/cashier-dashboard/components/DashNavigationCard'

import { RecordPurchasePopup } from '../components/RecordPurchasePopup'
import { useStockManagerDashboardStats } from '../hooks/useStockManagerDashboardStats'

export function StockManagerDashboardPage() {
  const navigate = useNavigate()

  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false)

  const locationId = useLocationStore((state) => state.selectedLocationId) ?? undefined

  const { data: locations = [] } = useLocations()

  const locationName = locations.find((location) => location.id === locationId)?.name ?? '—'

  const { data: dashboard, isLoading, isError } = useStockManagerDashboardStats(locationId)

  const pendingRequestsValue = isLoading ? '…' : isError ? '—' : String(dashboard?.pendingRequestsCount ?? 0)
  const pastRequestsValue = isLoading ? '…' : isError ? '—' : String(dashboard?.pastRequestsCount ?? 0)
  const totalRequestsValue = isLoading ? '…' : isError ? '—' : String(dashboard?.totalStockRequestsCount ?? 0)

  return (
    <div className="flex h-screen bg-zinc-50">
      <StockManagerSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <StaffHeader title="Genel Bakış" locationName={locationName} />

        <main className="flex flex-1 flex-col gap-6 p-6">
          <section>
            <div className="mb-3">
              <h2 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Hızlı İşlemler</h2>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <DashNavigationCard
                title="Bekleyen Stok Talepleri"
                description="Onay bekleyen stok taleplerini görüntüle"
                actionLabel="Talepleri Gör"
                icon={Clock3}
                onClick={() => navigate('/app/stock-manager/pending-requests')}
              />

              <DashNavigationCard
                title="Parti Alışı Ekle"
                description="Doğrudan yeni bir alış partisi kaydet"
                actionLabel="Parti Ekle"
                icon={PackagePlus}
                onClick={() => setIsPurchaseOpen(true)}
              />
            </div>
          </section>

          <section>
            <div className="mb-3">
              <h2 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Stok Talepleri</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <DashInfoCard label="Bekleyen Stok Talepleri" value={pendingRequestsValue} icon={Clock3} />
              <DashInfoCard label="Geçmiş Stok Talepleri" value={pastRequestsValue} icon={Archive} />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between border-2 border-zinc-300 bg-white p-5">
              <div className="min-w-0">
                <p className="text-sm text-zinc-500">Toplam Stok Talebi</p>
                <p className="mt-1 text-xs text-zinc-400">Bu yerleşkedeki toplam stok talebi</p>
              </div>

              <p className="text-2xl font-semibold text-zinc-700">{totalRequestsValue}</p>
            </div>
          </section>
        </main>
      </div>

      <RecordPurchasePopup open={isPurchaseOpen} onClose={() => setIsPurchaseOpen(false)} />
    </div>
  )
}
