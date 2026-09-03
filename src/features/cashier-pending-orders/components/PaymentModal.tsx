import { useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { ArrowLeftRight, CreditCard, Wallet, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Order } from '../types'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
})

const VAT_RATE = 0
const SERVICE_FEE = 0

const FIELD_CLASSNAME = 'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

type PaymentMethod = 'CARD' | 'CASH' | 'TRANSFER'

const PAYMENT_METHOD_TABS: Array<{ value: PaymentMethod; label: string; icon: LucideIcon }> = [
  { value: 'CARD', label: 'Kredi Kartı', icon: CreditCard },
  { value: 'CASH', label: 'Nakit', icon: Wallet },
  { value: 'TRANSFER', label: 'Adisyon Aktar', icon: ArrowLeftRight },
]

interface PaymentModalContentProps {
  order: Order
  onClose: () => void
  onConfirm: (orderId: string) => void
  isSubmitting: boolean
}

function PaymentModalContent({ order, onClose, onConfirm, isSubmitting }: PaymentModalContentProps) {
  const [method, setMethod] = useState<PaymentMethod>('CARD')
  const [adisyonAmount, setAdisyonAmount] = useState('')

  const subtotal = order.totalPrice ?? 0
  const vat = subtotal * VAT_RATE
  const adisyonTutari = method === 'TRANSFER' ? Number(adisyonAmount) || 0 : 0
  const total = subtotal + vat + SERVICE_FEE + adisyonTutari

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
          Ödeme Al
        </Dialog.Title>
        <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
          <X className="size-4" />
        </Dialog.Close>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">
            Sipariş: <span className="font-medium text-zinc-900">#{order.orderNumber}</span>
          </span>
          <span className="text-zinc-500">
            Müşteri: <span className="font-medium text-zinc-900">{order.customerName || '—'}</span>
          </span>
        </div>

        <div className="flex items-center justify-between border border-zinc-200 bg-zinc-50 px-3 py-2.5">
          <span className="text-sm text-zinc-600">Ödenmesi Gereken Tutar</span>
          <span className="text-base font-semibold tabular-nums text-zinc-900">
            {currencyFormatter.format(subtotal)}
          </span>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
            Ödeme Türü Seçiniz
          </p>
          <div className="flex border border-zinc-200">
            {PAYMENT_METHOD_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setMethod(tab.value)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 border-r border-zinc-200 py-2 text-xs font-medium transition-colors last:border-r-0',
                  method === tab.value ? 'bg-[#133458] text-white' : 'bg-white text-zinc-600 hover:bg-zinc-50',
                )}
              >
                <tab.icon className="size-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {method === 'CARD' && (
          <div className="grid grid-cols-2 gap-2.5">
            <input placeholder="Kart Üzerindeki İsim" className={cn(FIELD_CLASSNAME, 'col-span-2')} />
            <input placeholder="Kart Numarası" className={cn(FIELD_CLASSNAME, 'col-span-2')} />
            <input placeholder="Son Kullanma Tarihi" className={FIELD_CLASSNAME} />
            <input placeholder="Güvenlik Kodu (CVV)" className={FIELD_CLASSNAME} />
          </div>
        )}

        {method === 'CASH' && (
          <p className="border border-dashed border-zinc-300 px-3 py-4 text-center text-xs text-zinc-500">
            Nakit ödeme kasiyer tarafından tahsil edilecektir.
          </p>
        )}

        {method === 'TRANSFER' && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-600">Adisyon Tutarı</label>
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={adisyonAmount}
              onChange={(event) => setAdisyonAmount(event.target.value)}
              placeholder="Adisyon Tutarını Giriniz"
              className={FIELD_CLASSNAME}
            />
          </div>
        )}

        <div className="space-y-1.5 border-t border-zinc-200 pt-3 text-sm">
          <p className="mb-1 text-xs font-semibold tracking-wide text-zinc-500 uppercase">Ödeme Özeti</p>
          <div className="flex items-center justify-between text-zinc-600">
            <span>Sub-total</span>
            <span className="tabular-nums">{currencyFormatter.format(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-zinc-600">
            <span>KDV (%{VAT_RATE * 100})</span>
            <span className="tabular-nums">{currencyFormatter.format(vat)}</span>
          </div>
          <div className="flex items-center justify-between text-zinc-600">
            <span>Servis Ücreti</span>
            <span className="tabular-nums">{currencyFormatter.format(SERVICE_FEE)}</span>
          </div>
          {adisyonTutari > 0 && (
            <div className="flex items-center justify-between text-zinc-600">
              <span>Adisyon Tutarı</span>
              <span className="tabular-nums">{currencyFormatter.format(adisyonTutari)}</span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-zinc-200 pt-1.5 text-base font-semibold text-zinc-900">
            <span>TOPLAM</span>
            <span className="tabular-nums">{currencyFormatter.format(total)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-t border-zinc-200 p-4">
        <Button
          type="button"
          variant="secondary"
          className="h-11 flex-1 rounded-none text-sm"
          onClick={onClose}
          disabled={isSubmitting}
        >
          İptal Et
        </Button>
        <Button
          type="button"
          className="h-11 flex-1 rounded-none bg-[#133458] text-sm text-white hover:bg-[#0f2843]"
          onClick={() => onConfirm(order.id)}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'İşleniyor...' : 'Ödeme Al'}
        </Button>
      </div>
    </>
  )
}

interface PaymentModalProps {
  order: Order | null
  onClose: () => void
  onConfirm: (orderId: string) => void
  isSubmitting: boolean
}

export function PaymentModal({ order, onClose, onConfirm, isSubmitting }: PaymentModalProps) {
  return (
    <Dialog.Root open={Boolean(order)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-zinc-900/40" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          {order && (
            <PaymentModalContent
              key={order.id}
              order={order}
              onClose={onClose}
              onConfirm={onConfirm}
              isSubmitting={isSubmitting}
            />
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}