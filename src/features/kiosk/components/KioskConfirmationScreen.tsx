import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

interface KioskConfirmationScreenProps {
  orderNumber: number
  autoResetSeconds?: number
  onNewOrder: () => void
}

export function KioskConfirmationScreen({ orderNumber,autoResetSeconds = 10,onNewOrder,}: KioskConfirmationScreenProps) {
  const [secondsLeft, setSecondsLeft] = useState(autoResetSeconds)

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          onNewOrder()
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoResetSeconds])

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-8 text-center">
      <CheckCircle2 className="size-24 text-emerald-500" />
      <h1 className="text-4xl font-semibold text-zinc-900">Siparişiniz Alındı!</h1>
      <p className="text-2xl text-zinc-600">Sipariş Numaranız</p>
      <p className="text-6xl font-bold tabular-nums text-[#133458]">#{orderNumber}</p>
      <p className="text-xl text-zinc-500">Siparişiniz hazırlanıyor, lütfen bekleyiniz.</p>

      <button
        type="button"
        onClick={onNewOrder}
        className="mt-6 h-16 w-full max-w-md bg-[#133458] text-xl font-semibold text-white hover:bg-[#0f2843]"
      >
        Yeni Sipariş ({secondsLeft}s)
      </button>
    </div>
  )
}
