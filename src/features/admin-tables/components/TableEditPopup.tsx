import { useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getApiErrorMessage } from '@/shared/api/apiError'
import type { TableResponseDto } from '@/shared/types/table'
import { useUpdateTable } from '@/features/admin-tables/hooks/useUpdateTable'

const FIELD_CLASSNAME = 'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

interface TableEditFormProps {
  table: TableResponseDto
  locationName: string
  onClose: () => void
}

function TableEditForm({ table, locationName, onClose }: TableEditFormProps) {
  const updateTableMutation = useUpdateTable()

  const [tableNumber, setTableNumber] = useState(String(table.tableNumber))
  const [isActive, setIsActive] = useState(table.isActive)
  const [error, setError] = useState<string | null>(null)

  const isSubmitting = updateTableMutation.isPending
  const hasChanges = Number(tableNumber) !== table.tableNumber || isActive !== table.isActive
  const isFormValid = tableNumber.trim() !== '' && Number(tableNumber) > 0

  async function handleSave() {
    if (!isFormValid) {
      setError('Lütfen geçerli bir masa numarası girin.')
      return
    }

    setError(null)

    try {
      await updateTableMutation.mutateAsync({
        id: table.id,
        currentTableNumber: table.tableNumber,
        nextTableNumber: Number(tableNumber),
        currentIsActive: table.isActive,
        nextIsActive: isActive,
      })
      onClose()
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, 'Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.'))
    }
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
          Masa Bilgileri &amp; Düzenle
        </Dialog.Title>
        <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
          <X className="size-4" />
        </Dialog.Close>
      </div>

      <div className="space-y-4 px-5 py-4">
        {error && <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Yerleşke</label>
          <input value={locationName} readOnly className={cn(FIELD_CLASSNAME, 'bg-zinc-50 text-zinc-500')} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Masa Numarası</label>
          <input
            value={tableNumber}
            onChange={(event) => setTableNumber(event.target.value)}
            type="number"
            min="1"
            step="1"
            disabled={isSubmitting}
            className={FIELD_CLASSNAME}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Durum</label>
          <div className="flex border border-zinc-200">
            <button
              type="button"
              onClick={() => setIsActive(true)}
              disabled={isSubmitting}
              className={cn(
                'flex-1 border-r border-zinc-200 py-2 text-xs font-medium transition-colors',
                isActive ? 'bg-[#84994F] text-white hover:bg-[#708243]' : 'bg-white text-zinc-600 hover:bg-zinc-50',
              )}
            >
              Aktif
            </button>
            <button
              type="button"
              onClick={() => setIsActive(false)}
              disabled={isSubmitting}
              className={cn(
                'flex-1 py-2 text-xs font-medium transition-colors',
                !isActive ? 'bg-destructive text-white hover:bg-destructive/90' : 'bg-white text-zinc-600 hover:bg-zinc-50',
              )}
            >
              Pasif
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-t border-zinc-200 p-4">
        <Button type="button" variant="outline" className="h-11 flex-1 rounded-none text-sm" onClick={onClose}>
          İptal
        </Button>
        <Button
          type="button"
          className="h-11 flex-1 rounded-none bg-[#133458] text-sm text-white hover:bg-[#0f2843]"
          onClick={handleSave}
          disabled={isSubmitting || !hasChanges}
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </Button>
      </div>
    </>
  )
}

interface TableEditPopupProps {
  table: TableResponseDto | null
  locationName: string
  onClose: () => void
}

export function TableEditPopup({ table, locationName, onClose }: TableEditPopupProps) {
  return (
    <Dialog.Root open={Boolean(table)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          {table && <TableEditForm key={table.id} table={table} locationName={locationName} onClose={onClose} />}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
