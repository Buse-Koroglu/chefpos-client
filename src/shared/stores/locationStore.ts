import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LocationState { // bir personelin birden fazla lokasyonda çalışabilmesi için gerekli location store yapısı
  selectedLocationId: string | null
  setSelectedLocationId: (locationId: string | null) => void
  reset: () => void
}

export const useLocationStore = create<LocationState>()(
  persist( // persist ile birlikte location state local storage'da şuan
    (set) => ({
      selectedLocationId: null,
      setSelectedLocationId: (locationId) => set({ selectedLocationId: locationId }),
      reset: () => set({ selectedLocationId: null }),
    }),
    { name: 'chefpos-location' }, // local storage key
  ),
)
