const currencyFormatter = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })

interface KioskPaymentStepProps {
  totalAmount: number
  status: 'idle' | 'processing' | 'error'
  errorMessage?: string
  onPay: () => void
  onBack: () => void
}

export function KioskPaymentStep({ totalAmount, status, errorMessage, onPay, onBack }: KioskPaymentStepProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-8 bg-zinc-50 px-8 text-center">
      <h1 className="text-3xl font-semibold text-zinc-900">Ödeme Yapın</h1>
      <p className="text-xl text-zinc-600">Sadece kredi/banka kartı ile ödeme kabul edilmektedir.</p>
      <p className="text-5xl font-semibold tabular-nums text-zinc-900">{currencyFormatter.format(totalAmount)}</p>

      {status === 'error' && (
        <p className="max-w-md text-lg font-medium text-red-600">
          {errorMessage ?? 'Ödeme alınamadı. Lütfen tekrar deneyin.'}
        </p>
      )}

      <div className="flex w-full max-w-xl gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={status === 'processing'}
          className="h-16 flex-1 border border-zinc-300 text-xl font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
        >
          Geri Dön
        </button>
        <button
          type="button"
          onClick={onPay}
          disabled={status === 'processing'}
          className="h-16 flex-[2] bg-[#133458] text-xl font-semibold text-white hover:bg-[#0f2843] disabled:opacity-40"
        >
          {status === 'processing' ? 'İşleniyor...' : status === 'error' ? 'Tekrar Dene' : 'Kartla Öde'}
        </button>
      </div>
    </div>
  )
}
