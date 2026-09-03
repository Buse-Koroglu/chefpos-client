import { useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { MenuResponseDto } from '@/shared/types/menu'
import { Skeleton } from '@/shared/components/Skeleton'
import { useMenuDetail } from '@/features/admin-menus/hooks/useMenuDetail'
import { useUpdateMenu } from '@/features/admin-menus/hooks/useUpdateMenu'
import { MenuProductsList } from './MenuProductsList'
import { ExistingProductPicker } from './ExistingProductPicker'
import { NewProductForMenuForm } from './NewProductForMenuForm'

const FIELD_CLASSNAME = 'h-10 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus-visible:border-zinc-400'

function getDetailErrorMessage(): string {
  return 'Menü bilgileri yüklenemedi.'
}

interface MenuEditFormProps {
  menu: MenuResponseDto
  onClose: () => void
}

function MenuEditForm({ menu, onClose }: MenuEditFormProps) {
  const updateMenuMutation = useUpdateMenu()

  const [name, setName] = useState(menu.name)
  const [description, setDescription] = useState(menu.description ?? '')
  const [isActive, setIsActive] = useState(menu.isActive)
  const [addTab, setAddTab] = useState<'existing' | 'new'>('existing')
  const [saveError, setSaveError] = useState<string | null>(null)

  const hasChanges =
    name.trim() !== menu.name || description.trim() !== (menu.description ?? '') || isActive !== menu.isActive
  const isFormValid = name.trim() !== ''

  function handleSave() {
    if (!isFormValid) {
      setSaveError('Menü adı zorunludur.')
      return
    }

    setSaveError(null)

    const detailsChanged = name.trim() !== menu.name || description.trim() !== (menu.description ?? '')
    const activeChanged = isActive !== menu.isActive

    updateMenuMutation.mutate(
      {
        menuId: menu.id,
        details: detailsChanged ? { name: name.trim(), description: description.trim() || null } : null,
        isActive: activeChanged ? isActive : null,
      },
      {
        onSuccess: () => {
          onClose()
        },
        onError: () => {
          setSaveError('Menü bilgileri güncellenemedi.')
        },
      },
    )
  }

  const usedProductIds = new Set(menu.products.map((product) => product.productId))

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
        <Dialog.Title className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">
          Menü Bilgileri &amp; Düzenle
        </Dialog.Title>
        <Dialog.Close className="text-zinc-400 transition-colors hover:text-zinc-700">
          <X className="size-4" />
        </Dialog.Close>
      </div>

      <div className="max-h-[75vh] space-y-4 overflow-y-auto px-5 py-4">
        {saveError && <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{saveError}</div>}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Menü Adı</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={updateMenuMutation.isPending}
            className={FIELD_CLASSNAME}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Açıklama</label>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={updateMenuMutation.isPending}
            className={FIELD_CLASSNAME}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Satış Durumu</label>
          <div className="flex border border-zinc-200">
            <button
              type="button"
              onClick={() => setIsActive(true)}
              disabled={updateMenuMutation.isPending}
              className={cn(
                'flex-1 border-r border-zinc-200 py-2 text-xs font-medium transition-colors',
                isActive ? 'bg-[#84994F] text-white hover:bg-[#708243]' : 'bg-white text-zinc-600 hover:bg-zinc-50',
              )}
            >
              Satışa Koy
            </button>
            <button
              type="button"
              onClick={() => setIsActive(false)}
              disabled={updateMenuMutation.isPending}
              className={cn(
                'flex-1 py-2 text-xs font-medium transition-colors',
                !isActive ? 'bg-destructive text-white hover:bg-destructive/90' : 'bg-white text-zinc-600 hover:bg-zinc-50',
              )}
            >
              Satıştan Kaldır
            </button>
          </div>
          <p className="mt-1.5 text-xs text-zinc-400">
            Satışa koyulan menüler kasiyer ve garson sipariş ekranlarında görünür.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Menüdeki Ürünler</label>
          <MenuProductsList menuId={menu.id} locationId={menu.locationId} products={menu.products} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-600">Ürün Ekle</label>
          <div className="mb-2 flex border border-zinc-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => setAddTab('existing')}
              className={cn(
                'flex-1 border-r border-zinc-200 py-2 transition-colors',
                addTab === 'existing' ? 'bg-[#133458] text-white' : 'bg-white text-zinc-600 hover:bg-zinc-50',
              )}
            >
              Var Olan Üründen Ekle
            </button>
            <button
              type="button"
              onClick={() => setAddTab('new')}
              className={cn(
                'flex-1 py-2 transition-colors',
                addTab === 'new' ? 'bg-[#133458] text-white' : 'bg-white text-zinc-600 hover:bg-zinc-50',
              )}
            >
              Yeni Ürün Oluştur
            </button>
          </div>
          {addTab === 'existing' ? (
            <ExistingProductPicker menuId={menu.id} locationId={menu.locationId} usedProductIds={usedProductIds} />
          ) : (
            <NewProductForMenuForm menuId={menu.id} />
          )}
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
          disabled={updateMenuMutation.isPending || !hasChanges}
        >
          {updateMenuMutation.isPending ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </Button>
      </div>
    </>
  )
}

interface MenuEditPopupProps {
  menuId: string | null
  onClose: () => void
}

export function MenuEditPopup({ menuId, onClose }: MenuEditPopupProps) {
  const { data: menu, isLoading, isError } = useMenuDetail(menuId ?? undefined)

  return (
    <Dialog.Root open={Boolean(menuId)} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 border border-zinc-200 bg-white">
          {isError ? (
            <div className="p-5">
              <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {getDetailErrorMessage()}
              </div>
            </div>
          ) : isLoading || !menu ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <MenuEditForm key={menu.id} menu={menu} onClose={onClose} />
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
