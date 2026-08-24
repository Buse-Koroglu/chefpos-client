import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DailyRevenueEntry } from '@/shared/types/admin-dashboard'
import { Skeleton } from '@/shared/components/Skeleton'

interface WeeklyRevenueBarChartProps {
  data: DailyRevenueEntry[]
  isLoading?: boolean
  isError?: boolean
}

const DAY_NAMES = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']

const DAY_ABBREVIATIONS: Record<string, string> = {
  Pazartesi: 'Pzt',
  Salı: 'Sal',
  Çarşamba: 'Çar',
  Perşembe: 'Per',
  Cuma: 'Cum',
  Cumartesi: 'Cmt',
  Pazar: 'Paz',
}

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short' })

function getDayName(isoDate: string) {
  return DAY_NAMES[new Date(isoDate).getDay()]
}

function isToday(isoDate: string) {
  const date = new Date(isoDate)
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

interface ChartEntry extends DailyRevenueEntry {
  dayName: string
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartEntry }> }) {
  if (!active || !payload?.length) return null
  const entry = payload[0].payload

  return (
    <div className="border border-zinc-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-zinc-700">
        {entry.dayName} · {dateFormatter.format(new Date(entry.date))}
      </p>
      <p className="mt-0.5 tabular-nums text-zinc-500">{currencyFormatter.format(entry.profit)}</p>
    </div>
  )
}

export function WeeklyRevenueBarChart({ data, isLoading, isError }: WeeklyRevenueBarChartProps) {
  const entries: ChartEntry[] = data.map((entry) => ({ ...entry, dayName: getDayName(entry.date) }))

  return (
    <div className="flex h-full min-h-88 flex-col border-2 border-zinc-300 bg-white p-5">
      <h2 className="text-sm font-semibold text-zinc-700">Haftalık Kâr Grafiği</h2>

      {isError ? (
        <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
          Haftalık kâr verisi alınamadı.
        </div>
      ) : isLoading ? (
        <div className="mt-1.5 flex flex-1 items-end gap-2 pb-4">
          {[45, 65, 35, 80, 55].map((height, index) => (
            <Skeleton key={index} className="flex-1" style={{ height: `${height}%` }} />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
          Bu hafta için kâr verisi yok.
        </div>
      ) : (
        <div className="mt-1.5 flex flex-1 items-center">
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={entries} margin={{ top: 4, right: 0, left: 0, bottom: 0 }} barCategoryGap="24%">
              <CartesianGrid vertical={false} stroke="#e4e4e7" strokeDasharray="0" />
              <YAxis hide domain={[0, 'dataMax']} />
              <XAxis
                dataKey="dayName"
                tickFormatter={(value: string) => DAY_ABBREVIATIONS[value] ?? value.slice(0, 3)}
                tickLine={false}
                axisLine={{ stroke: '#d4d4d8' }}
                tick={{ fontSize: 11, fill: '#71717a' }}
              />
              <Tooltip cursor={{ fill: '#fafafa' }} content={<ChartTooltip />} />
              <Bar dataKey="profit" radius={[0, 0, 0, 0]} maxBarSize={36}>
                {entries.map((entry) => (
                  <Cell key={entry.date} fill={isToday(entry.date) ? '#133458' : '#d4d4d8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
