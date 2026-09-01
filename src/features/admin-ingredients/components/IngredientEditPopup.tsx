import { useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { STOCK_UNIT_LABELS } from '@/shared/types/ingredient'
import type { IngredientWithLocation } from '@/features/admin-ingredients/types'
import { useUpdateIngredient } from '@/features/admin-ingredients/hooks/useUpdateIngredient'
import { FIELD_CLASSNAME } from './MultiSelectDropdown'

interface IngredientEditFormProps {
  ingredient: IngredientWithLocation
  onClose: () => void
}

function IngredientEditForm({ ingredient, onClose }: IngredientEditFormProps) {
  const updateIngredientMutation = useUpdateIngredient()

  const [name, setName] = useState(ingredient.name)
  const [latestUnitPrice, setLatestUnitPrice] = useState(
    ingredient.latestUnitPrice !== null ? String(ingredient.latestUnitPrice) : '',
  )
  const [minStockThreshold, setMinStockThreshold] = useState(String(ingredient.minStockThreshold))
  const [isActive, setIsActive] = useState(ingredient.isActive)
  const [error, setError] = useState<string | null>(null)
  const isSubmitting = updateIngredientMutation.isPending

  const canEditPrice = ingredient.latestUnitPrice !== null

  const hasChanges =
    name.trim() !== ingredient.name ||
    (canEditPrice && Number(latestUnitPrice) !== ingredient.latestUnitPrice) ||
    Number(minStockThreshold) !== ingredient.minStockThreshold ||
    isActive !== ingredient.isActive

  const isFormValid =
    name.trim() !== '' &&
    Number(minStockThreshold) >= 0 &&
    (!canEditPrice || (latestUnitPrice.trim() !== '' && Number(latestUnitPrice) >= 0))

  function handleSave() {
    if (!isFormValid) {
      setError('Lütfen tüm alanları geçerli değerlerle doldurun.')
      return
    }

    setError(null)

    updateIngredientMutation.mutate(
      {
        ingredientId: ingredient.id,
        name: name.trim() !== ingredient.name ? name.trim() : undefined,
        unitPrice: canEditPrice && Number(latestUnitPrice) !== ingredient.latestUnitPrice ? Number(latestUnitPrice) : undefined,
        minStockThreshold:
          Number(minStockThreshold) !== ingredient.minStockThreshold ? Number(minStockThreshold) : undefined,
        isActive: isActive !== ingredient.isActive ? isActive : undefined,
      },
      {
        onSuccess: () => {
          onClose()
        },
        onError: () => {
          setError('Değişiklikler kaydedilemedi. Lütfen tekrar deneyin.')
        },
      },
    )
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
          Ham Madde Bilgileri &amp; Düzenle
        </Dialog.Title>
        <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
          <X className="size-4" />
        </Dialog.Close>
      </div>

      <div className="space-y-4 px-5 py-4">
        {error && <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Ham Madde Adı</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSubmitting}
            className={FIELD_CLASSNAME}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Yerleşke</label>
            <input value={ingredient.locationName} readOnly className={cn(FIELD_CLASSNAME, 'bg-zinc-50 text-zinc-500')} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Birim</label>
            <input
              value={STOCK_UNIT_LABELS[ingredient.unit]}
              readOnly
              className={cn(FIELD_CLASSNAME, 'bg-zinc-50 text-zinc-500')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Son Alış Fiyatı</label>
            {canEditPrice ? (
              <input
                value={latestUnitPrice}
                onChange={(event) => setLatestUnitPrice(event.target.value)}
                type="number"
                min="0"
                step="0.01"
                disabled={isSubmitting}
                className={FIELD_CLASSNAME}
              />
            ) : (
              <input value="—" readOnly className={cn(FIELD_CLASSNAME, 'bg-zinc-50 text-zinc-500')} />
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Ağırlıklı Ortalama Fiyat</label>
            <input
              value={ingredient.weightedAverageUnitPrice}
              readOnly
              className={cn(FIELD_CLASSNAME, 'bg-zinc-50 text-zinc-500')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Min. Stok Eşiği</label>
            <input
              value={minStockThreshold}
              onChange={(event) => setMinStockThreshold(event.target.value)}
              type="number"
              min="0"
              step="0.01"
              disabled={isSubmitting}
              className={FIELD_CLASSNAME}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-600">Mevcut Stok</label>
            <input
              value={`${ingredient.currentStock} ${STOCK_UNIT_LABELS[ingredient.unit]}`}
              readOnly
              className={cn(FIELD_CLASSNAME, 'bg-zinc-50 text-zinc-500')}
            />
          </div>
        </div>
        <p className="text-xs text-zinc-400">Stok yöneticisi tarafından stok talebi yapılabilir.</p>

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

interface IngredientEditPopupProps {
  ingredient: IngredientWithLocation | null
  onClose: () => void
}

export function IngredientEditPopup({ ingredient, onClose }: IngredientEditPopupProps) {
  return (
    <Dialog.Root open={Boolean(ingredient)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          {ingredient && <IngredientEditForm key={ingredient.id} ingredient={ingredient} onClose={onClose} />}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
