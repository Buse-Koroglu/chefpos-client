import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LocationState {
  selectedLocationId: string | null
  setSelectedLocationId: (locationId: string | null) => void
  reset: () => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      selectedLocationId: null,
      setSelectedLocationId: (locationId) => set({ selectedLocationId: locationId }),
      reset: () => set({ selectedLocationId: null }),
    }),
    { name: 'chefpos-location' },
  ),
)
