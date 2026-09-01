import { Minus, Plus, X } from 'lucide-react'
import type { KioskCardItem } from '../types'

const currencyFormatter = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })

interface KioskReviewStepProps {
  items: KioskCardItem[]
  totalAmount: number
  customerName: string
  onCustomerNameChange: (value: string) => void
  onIncrease: (productId: string) => void
  onDecrease: (productId: string) => void
  onRemove: (productId: string) => void
  onBack: () => void
  onContinue: () => void
}

export function KioskReviewStep({
  items,
  totalAmount,
  customerName,
  onCustomerNameChange,
  onIncrease,
  onDecrease,
  onRemove,
  onBack,
  onContinue,
}: KioskReviewStepProps) {
  const isValid = customerName.trim().length > 0 && items.length > 0

  return (
    <div className="flex h-screen flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-8 py-6">
        <h1 className="text-3xl font-semibold text-zinc-900">Siparişinizi Gözden Geçirin</h1>
      </header>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 overflow-y-auto px-8 py-6">
        <div>
          <label htmlFor="kiosk-customer-name" className="mb-2 block text-lg font-medium text-zinc-700">
            İsim Soyisim
          </label>
          <input
            id="kiosk-customer-name"
            value={customerName}
            onChange={(event) => onCustomerNameChange(event.target.value)}
            placeholder="İsminizi giriniz"
            className="h-16 w-full border border-zinc-300 bg-white px-5 text-xl text-zinc-900 outline-none focus-visible:border-[#133458]"
          />
        </div>

        <div className="flex-1 divide-y divide-zinc-200 border border-zinc-200 bg-white">
          {items.length === 0 ? (
            <p className="px-5 py-10 text-center text-lg text-zinc-400">Sepetiniz boş</p>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-medium text-zinc-900">{item.name}</p>
                  <p className="text-sm tabular-nums text-zinc-500">
                    {currencyFormatter.format(item.price)} / adet
                  </p>
                </div>

                <div className="flex shrink-0 items-center border border-zinc-300">
                  <button
                    type="button"
                    onClick={() => onDecrease(item.productId)}
                    aria-label={`${item.name} adedini azalt`}
                    className="flex size-12 items-center justify-center text-zinc-700 hover:bg-zinc-100"
                  >
                    <Minus className="size-5" />
                  </button>
                  <span className="w-12 text-center text-xl font-semibold tabular-nums text-zinc-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onIncrease(item.productId)}
                    aria-label={`${item.name} adedini artır`}
                    className="flex size-12 items-center justify-center text-zinc-700 hover:bg-zinc-100"
                  >
                    <Plus className="size-5" />
                  </button>
                </div>

                <span className="w-24 shrink-0 text-right text-lg font-semibold tabular-nums text-zinc-900">
                  {currencyFormatter.format(item.price * item.quantity)}
                </span>

                <button
                  type="button"
                  onClick={() => onRemove(item.productId)}
                  aria-label={`${item.name} ürününü kaldır`}
                  className="shrink-0 text-zinc-300 transition-colors hover:text-red-500"
                >
                  <X className="size-6" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex items-baseline justify-between border-t border-zinc-200 pt-4">
          <span className="text-xl text-zinc-500">Toplam</span>
          <span className="text-3xl font-semibold tabular-nums text-zinc-900">
            {currencyFormatter.format(totalAmount)}
          </span>
        </div>
      </div>

      <footer className="flex gap-4 border-t border-zinc-200 bg-white px-8 py-6">
        <button
          type="button"
          onClick={onBack}
          className="h-16 flex-1 border border-zinc-300 text-xl font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          Geri Dön
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!isValid}
          className="h-16 flex-[2] bg-[#133458] text-xl font-semibold text-white hover:bg-[#0f2843] disabled:opacity-40"
        >
          Ödemeye Geç
        </button>
      </footer>
    </div>
  )
}
