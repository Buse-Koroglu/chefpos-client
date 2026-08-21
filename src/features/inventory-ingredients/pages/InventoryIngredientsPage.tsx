import { useState } from 'react'

import { CashierHeader } from '@/shared/components/CashierHeader'
import { InventorySidebar } from '@/shared/components/InventorySidebar'
import { IngredientCard } from '@/shared/components/IngredientCard'
import { Skeleton } from '@/shared/components/Skeleton'
import { useLocations } from '@/shared/hooks/useLocations'
import { useLocationStore } from '@/shared/stores/locationStore'
import { useIngredients } from '@/features/inventory-dashboard/hooks/useIngredients'
import { CreateStockRequestPopup } from '@/features/inventory-dashboard/components/CreateStockRequestPopup'

export function InventoryIngredientsPage() {
  const locationId = useLocationStore((state) => state.selectedLocationId) ?? undefined
  const { data: locations = [] } = useLocations()
  const locationName = locations.find((location) => location.id === locationId)?.name ?? '—'

  const { data: ingredients = [], isLoading } = useIngredients(locationId)

  const [requestIngredientId, setRequestIngredientId] = useState<string | null>(null)

  return (
    <div className="flex h-screen bg-zinc-50">
      <InventorySidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <CashierHeader title="Ham Maddeler" locationName={locationName} />

        <main className="flex flex-1 flex-col gap-4 p-6">
          <p className="text-xs text-zinc-500">
            Bir ham maddeye tıklayarak o ham madde için stok talebi oluşturabilirsiniz.
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-36 w-full" />
              ))}
            </div>
          ) : ingredients.length === 0 ? (
            <div className="flex flex-1 items-center justify-center border border-zinc-200 bg-white py-16 text-sm text-zinc-500">
              Bu yerleşkede kayıtlı ham madde bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {ingredients.map((ingredient) => (
                <IngredientCard
                  key={ingredient.id}
                  ingredient={ingredient}
                  onClick={() => setRequestIngredientId(ingredient.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <CreateStockRequestPopup
        open={Boolean(requestIngredientId)}
        initialIngredientId={requestIngredientId ?? undefined}
        onClose={() => setRequestIngredientId(null)}
      />
    </div>
  )
}
