import { useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { STOCK_UNIT_LABELS } from '@/shared/types/ingredient'
import type { AdminStockRequestResponseDto } from '@/shared/types/stockRequest'
import { useRole } from '@/shared/hooks/useRole'
import { formatStockRequestDateTime } from '@/features/admin-stock-requests/utils'
import { useApproveStockRequest } from '@/features/admin-stock-requests/hooks/useApproveStockRequest'
import { useRejectStockRequest } from '@/features/admin-stock-requests/hooks/useRejectStockRequest'
import { StockRequestStatusBadge } from './StockRequestStatusBadge'

const FIELD_CLASSNAME = 'h-10 w-full rounded-none border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-700 outline-none'

const TEXTAREA_CLASSNAME ='w-full rounded-none border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

function formatUnitPrice(value: number): string {
  return value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-zinc-600">{label}</label>
      <input value={value} readOnly className={FIELD_CLASSNAME} />
    </div>
  )
}

interface StockRequestDetailFormProps {
  stockRequest: AdminStockRequestResponseDto
  onClose: () => void
}

function StockRequestDetailForm({ stockRequest, onClose }: StockRequestDetailFormProps) {
  const { hasRole } = useRole()
  const canDecide = hasRole('STOCK_MANAGER') && stockRequest.status === 'PENDING'

  const [isRejecting, setIsRejecting] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isApproving, setIsApproving] = useState(false)
  const [unitPrice, setUnitPrice] = useState('')

  const approveMutation = useApproveStockRequest(() => onClose())
  const rejectMutation = useRejectStockRequest(() => onClose())

  const isSubmitting = approveMutation.isPending || rejectMutation.isPending

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
          Stok Talebi Detayı
        </Dialog.Title>
        <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
          <X className="size-4" />
        </Dialog.Close>
      </div>

      <div className="max-h-[75vh] space-y-4 overflow-y-auto px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-zinc-900">{stockRequest.ingredientName}</p>
            <p className="text-sm text-zinc-500">
              {stockRequest.requestedQuantity} {STOCK_UNIT_LABELS[stockRequest.unit]}
            </p>
          </div>
          <StockRequestStatusBadge status={stockRequest.status} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoField label="Talep Eden Personel" value={stockRequest.requestedByUserName} />
          <InfoField label="Rolü" value="Depo Görevlisi" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoField label="Yerleşke / Lokasyon" value={stockRequest.locationName} />
          <InfoField label="Talep Tarihi" value={formatStockRequestDateTime(stockRequest.createdAt)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoField
            label={stockRequest.status === 'APPROVED' ? 'Onay Anındaki Birim Fiyat' : 'Güncel Ham Madde Fiyatı'}
            value={formatUnitPrice(
              stockRequest.status === 'APPROVED' && stockRequest.approvedUnitPrice != null
                ? stockRequest.approvedUnitPrice
                : stockRequest.ingredientWeightedAverageUnitPrice,
            )}
          />
        </div>

        {stockRequest.status !== 'PENDING' && (
          <div className="space-y-3 border border-zinc-200 bg-zinc-50 p-3">
            <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">İşlem Bilgisi</p>
            <div className="grid grid-cols-2 gap-3">
              <InfoField label={stockRequest.status === 'APPROVED' ? 'Onaylayan Kullanıcı' : 'Reddeden Kullanıcı'} value={stockRequest.decidedByUserName ?? '—'} />
              <InfoField label="İşlem Tarihi" value={stockRequest.decidedAt ? formatStockRequestDateTime(stockRequest.decidedAt) : '—'} />
            </div>
            {stockRequest.status === 'REJECTED' && stockRequest.rejectionReason && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-600">Red Gerekçesi</label>
                <p className="border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700">{stockRequest.rejectionReason}</p>
              </div>
            )}
          </div>
        )}

        {canDecide && isRejecting && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Red Gerekçesi</label>
            <textarea
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              rows={3}
              placeholder="Reddetme sebebini yazın..."
              disabled={isSubmitting}
              className={TEXTAREA_CLASSNAME}
            />
          </div>
        )}

        {canDecide && isApproving && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Birim Fiyat</label>
            <input
              value={unitPrice}
              onChange={(event) => setUnitPrice(event.target.value)}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              disabled={isSubmitting}
              className="h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400"
            />
          </div>
        )}
      </div>

      {canDecide && (
        <div className="flex gap-2 border-t border-zinc-200 p-4">
          {isRejecting ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-11 flex-1 rounded-none text-sm"
                onClick={() => {
                  setIsRejecting(false)
                  setRejectionReason('')
                }}
                disabled={isSubmitting}
              >
                Vazgeç
              </Button>
              <Button
                type="button"
                className="h-11 flex-1 rounded-none bg-destructive text-sm text-white hover:bg-destructive/90"
                onClick={() => rejectMutation.mutate({ id: stockRequest.id, reason: rejectionReason.trim() })}
                disabled={isSubmitting || rejectionReason.trim() === ''}
              >
                {rejectMutation.isPending ? 'Reddediliyor...' : 'Reddi Onayla'}
              </Button>
            </>
          ) : isApproving ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-11 flex-1 rounded-none text-sm"
                onClick={() => {
                  setIsApproving(false)
                  setUnitPrice('')
                }}
                disabled={isSubmitting}
              >
                Vazgeç
              </Button>
              <Button
                type="button"
                className={cn('h-11 flex-1 rounded-none bg-[#133458] text-sm text-white hover:bg-[#0f2843]')}
                onClick={() => approveMutation.mutate({ id: stockRequest.id, unitPrice: Number(unitPrice) })}
                disabled={isSubmitting || unitPrice.trim() === '' || Number(unitPrice) < 0}
              >
                {approveMutation.isPending ? 'Onaylanıyor...' : 'Onayı Tamamla'}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                className="h-11 flex-1 rounded-none bg-destructive text-sm text-white hover:bg-destructive/90"
                onClick={() => setIsRejecting(true)}
                disabled={isSubmitting}
              >
                Talebi Reddet
              </Button>
              <Button
                type="button"
                className={cn('h-11 flex-1 rounded-none bg-[#133458] text-sm text-white hover:bg-[#0f2843]')}
                onClick={() => setIsApproving(true)}
                disabled={isSubmitting}
              >
                Talebi Onayla
              </Button>
            </>
          )}
        </div>
      )}

      {!canDecide && (
        <div className="flex gap-2 border-t border-zinc-200 p-4">
          <Button type="button" variant="outline" className="h-11 flex-1 rounded-none text-sm" onClick={onClose}>
            Kapat
          </Button>
        </div>
      )}
    </>
  )
}

interface StockRequestDetailPopupProps {
  stockRequest: AdminStockRequestResponseDto | null
  onClose: () => void
}

export function StockRequestDetailPopup({ stockRequest, onClose }: StockRequestDetailPopupProps) {
  return (
    <Dialog.Root open={Boolean(stockRequest)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          {stockRequest && <StockRequestDetailForm key={stockRequest.id} stockRequest={stockRequest} onClose={onClose} />}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
