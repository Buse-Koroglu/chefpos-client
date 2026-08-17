import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { LocationOrderCount } from '@/shared/types/admin-dashboard'
import { Skeleton } from '@/shared/components/Skeleton'

interface LocationOrdersPieChartProps {
  data: LocationOrderCount[]
  isLoading?: boolean
  isError?: boolean
}

const SLICE_COLORS = ['#133458', '#71717a', '#d4d4d8', '#a1a1aa', '#3f3f46', '#e4e4e7']

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: LocationOrderCount }> }) {
  if (!active || !payload?.length) return null
  const entry = payload[0].payload

  return (
    <div className="border border-zinc-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-zinc-700">{entry.locationName}</p>
      <p className="mt-0.5 tabular-nums text-zinc-500">{entry.orderCount} sipariş</p>
    </div>
  )
}

export function LocationOrdersPieChart({ data, isLoading, isError }: LocationOrdersPieChartProps) {
  const total = data.reduce((sum, entry) => sum + entry.orderCount, 0)
  const sliceData = data.filter((entry) => entry.orderCount > 0)
  const colorByLocationId = new Map(data.map((entry, index) => [entry.locationId, SLICE_COLORS[index % SLICE_COLORS.length]]))

  return (
    <div className="flex h-full min-h-88 flex-col border-2 border-zinc-300 bg-white p-5">
      <h2 className="text-sm font-semibold text-zinc-700">Yerleşke Günlük Sipariş Sayısı</h2>

      {isError ? (
        <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
          Sipariş dağılımı alınamadı.
        </div>
      ) : isLoading ? (
        <div className="mt-1.5 flex flex-1 items-center justify-center">
          <Skeleton className="size-36 rounded-full" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
          Yerleşke verisi yok.
        </div>
      ) : (
        <>
          <div className="relative mt-1.5 flex flex-1 items-center">
            {sliceData.length === 0 ? (
              <div className="flex w-full items-center justify-center text-sm text-zinc-500">
                Bugün henüz sipariş yok.
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={sliceData}
                      dataKey="orderCount"
                      nameKey="locationName"
                      innerRadius="60%"
                      outerRadius="90%"
                      paddingAngle={2}
                      cornerRadius={0}
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      {sliceData.map((entry) => (
                        <Cell key={entry.locationId} fill={colorByLocationId.get(entry.locationId)} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-semibold tabular-nums text-zinc-900">{total}</span>
                  <span className="text-xs text-zinc-500">Toplam Sipariş</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
            {data.map((entry) => (
              <span key={entry.locationId} className="flex items-center gap-2 text-xs text-zinc-600">
                <span className="size-2.5 shrink-0" style={{ backgroundColor: colorByLocationId.get(entry.locationId) }} />
                {entry.locationName}
                <span className="tabular-nums text-zinc-400">({entry.orderCount} sipariş)</span>
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
