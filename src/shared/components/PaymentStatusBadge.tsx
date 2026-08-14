import { cn } from '@/lib/utils'
import type { PaymentStatus } from '@/shared/types/order'

const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  UNPAID: 'Ödenmedi',
  PAID: 'Ödendi',
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const isUnpaid = status === 'UNPAID'

  return (
    <span
      className={cn(
        'inline-flex items-center border px-2 py-0.5 text-xs font-normal whitespace-nowrap',
        isUnpaid ? 'border-red-200 bg-red-50 text-red-600' : 'border-green-200 bg-green-50 text-green-700',
      )}
    >
      {PAYMENT_STATUS_LABEL[status]}
    </span>
  )
}
