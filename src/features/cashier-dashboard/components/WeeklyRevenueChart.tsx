import { useState } from 'react'
import type { DailyRevenueDto } from '@/shared/types/cashier-dashboard'

interface WeeklyRevenueChartProps {
  days: DailyRevenueDto[]
  isLoading?: boolean
  isError?: boolean
}

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

function niceMax(value: number) {
  return Math.max(1000, Math.ceil(value / 1000) * 1000)
}

function isSameUtcDate(isoDate: string, reference: Date) {
  const date = new Date(isoDate)
  return (
    date.getUTCFullYear() === reference.getUTCFullYear() &&
    date.getUTCMonth() === reference.getUTCMonth() &&
    date.getUTCDate() === reference.getUTCDate()
  )
}

export function WeeklyRevenueChart({ days, isLoading, isError }: WeeklyRevenueChartProps) {
  const [hoveredDay, setHoveredDay] = useState<string | null>(null)

  const today = new Date()
  const entries = days.map((entry) => ({
    ...entry,
    abbreviation: DAY_ABBREVIATIONS[entry.dayName] ?? entry.dayName.slice(0, 3),
    isToday: isSameUtcDate(entry.date, today),
  }))

  const maxRevenue = niceMax(Math.max(0, ...entries.map((entry) => entry.revenue)))
  const hovered = entries.find((entry) => entry.date === hoveredDay)

  return (
    <div className="flex h-full flex-col border-2 border-zinc-300 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-700">Haftalık Ciro Grafiği</h2>
        <span className="min-w-24 text-right text-sm tabular-nums text-zinc-500">
          {hovered ? currencyFormatter.format(hovered.revenue) : ' '}
        </span>
      </div>

      {isError ? (
        <div className="flex flex-1 items-center justify-center py-10 text-sm text-zinc-500">
          Haftalık ciro verisi alınamadı.
        </div>
      ) : isLoading ? (
        <div className="flex flex-1 items-center justify-center py-10 text-sm text-zinc-500">Yükleniyor…</div>
      ) : (
        <>
          <div className="mt-2 flex flex-1 items-stretch gap-3">
            <div className="flex w-24 shrink-0 flex-col justify-between py-0.5 text-xs text-zinc-400 tabular-nums">
              <span>{currencyFormatter.format(maxRevenue)}</span>
              <span>0 ₺</span>
            </div>

            <div className="relative flex flex-1 items-end justify-between gap-1">
              <div className="absolute inset-x-0 top-0 h-px bg-zinc-100" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-100" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-zinc-200" />

              {entries.map((entry) => {
                const barHeight = Math.max(2, (entry.revenue / maxRevenue) * 100)
                const isHovered = hoveredDay === entry.date

                return (
                  <div key={entry.date} className="relative flex h-full flex-1 flex-col items-center justify-end">
                    {isHovered && (
                      <div className="absolute -top-8 z-10 border border-zinc-200 bg-white px-2 py-1 text-xs whitespace-nowrap text-zinc-700 shadow-sm">
                        {currencyFormatter.format(entry.revenue)}
                      </div>
                    )}
                    <button
                      type="button"
                      aria-label={`${entry.dayName}: ${currencyFormatter.format(entry.revenue)}`}
                      onMouseEnter={() => setHoveredDay(entry.date)}
                      onMouseLeave={() => setHoveredDay(null)}
                      onFocus={() => setHoveredDay(entry.date)}
                      onBlur={() => setHoveredDay(null)}
                      className={`w-full max-w-6 outline-none ${
                        entry.isToday ? 'bg-[#133458]' : 'bg-zinc-200 hover:bg-zinc-300'
                      } ${isHovered ? 'bg-zinc-300' : ''} ${entry.isToday && isHovered ? 'bg-[#0f2843]' : ''}`}
                      style={{ height: `${barHeight}%` }}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-1 flex gap-3">
            <div className="w-24 shrink-0" />
            <div className="flex flex-1 gap-1">
              {entries.map((entry) => (
                <span
                  key={entry.date}
                  className={`flex-1 text-center text-xs ${entry.isToday ? 'font-semibold text-zinc-900' : 'text-zinc-500'}`}
                >
                  {entry.abbreviation}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
