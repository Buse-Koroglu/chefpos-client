import { Check, X } from 'lucide-react'

import type { OrderResponse } from '@/shared/types/order'

import { useCompleteOrder } from '../hooks/useCompleteOrder'

interface OrderDetailModalProps {
  order: OrderResponse | null
  onClose: () => void
}

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
})

export function OrderDetailModal({
  order,
  onClose,
}: OrderDetailModalProps) {
  const completeOrderMutation = useCompleteOrder()

  if (!order) {
    return null
  }

  const currentOrder = order

  function handleCompleteOrder() {
    completeOrderMutation.mutate(currentOrder.id, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl border border-zinc-300 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Sipariş
            </p>

            <h2 className="mt-0.5 text-lg font-bold text-zinc-900">
              #{order.orderNumber}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={completeOrderMutation.isPending}
            aria-label="Kapat"
            className="
              border
              border-transparent
              p-2
              text-zinc-400
              transition-colors
              hover:border-zinc-200
              hover:bg-zinc-100
              hover:text-zinc-900
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X className="size-5" />
          </button>
        </div>

        {/* ORDER INFORMATION */}
        <div className="grid grid-cols-2 border-b border-zinc-200">
          <div className="border-r border-zinc-200 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Müşteri
            </p>

            <p className="mt-1 text-sm font-semibold text-zinc-900">
              {order.customerName ||
                'Müşteri belirtilmedi'}
            </p>
          </div>

          <div className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Sipariş Durumu
            </p>

            <span className="mt-1 inline-flex border border-yellow-300 bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">
              Hazırlanıyor
            </span>
          </div>
        </div>

        {/* ORDER ITEMS */}
        <div className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-800">
              Sipariş İçeriği
            </h3>

            <span className="text-xs text-zinc-400">
              {order.items.length} ürün
            </span>
          </div>

          <div className="border border-zinc-200">
            {/* TABLE HEADER */}
            <div className="grid grid-cols-[70px_1fr_120px] border-b border-zinc-200 bg-zinc-100 px-4 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Adet
              </span>

              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Ürün
              </span>

              <span className="text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Tutar
              </span>
            </div>

            {/* ITEMS */}
            {order.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[70px_1fr_120px] items-center border-b border-zinc-200 px-4 py-3 last:border-b-0"
              >
                <span className="text-sm font-bold tabular-nums text-zinc-700">
                  {item.quantity}x
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {item.name}
                  </p>
                </div>

                <span className="text-right text-sm font-medium tabular-nums text-zinc-700">
                  {currencyFormatter.format(
                    item.price * item.quantity,
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TOTAL */}
        <div className="mx-5 border-t border-zinc-300 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Toplam Tutar
            </span>

            <span className="text-xl font-bold tabular-nums text-zinc-900">
              {currencyFormatter.format(
                order.totalPrice,
              )}
            </span>
          </div>
        </div>

        {/* ERROR */}
        {completeOrderMutation.isError && (
          <div className="mx-5 mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Sipariş tamamlanamadı. Lütfen tekrar deneyin.
          </div>
        )}

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-5 py-4">
          <p className="text-xs text-zinc-400">
            Sipariş hazır olduğunda tamamlandı olarak
            işaretleyin.
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={completeOrderMutation.isPending}
              className="
                border
                border-zinc-300
                bg-white
                px-5
                py-2.5
                text-sm
                font-semibold
                text-zinc-700
                transition-colors
                hover:bg-zinc-100
                hover:text-zinc-900
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Kapat
            </button>

            <button
              type="button"
              onClick={handleCompleteOrder}
              disabled={completeOrderMutation.isPending}
              className="
                inline-flex
                items-center
                gap-2
                border
                border-zinc-700
                bg-[#133458]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition-colors
                hover:bg-zinc-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Check className="size-4" />

              {completeOrderMutation.isPending
                ? 'Tamamlanıyor...'
                : 'Siparişi Tamamla'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}