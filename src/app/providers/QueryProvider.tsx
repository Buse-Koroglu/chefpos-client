import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

const queryClient = new QueryClient({ // tanstack query client veri çekme ve cacheleme için
  defaultOptions: {
    queries: {
      retry: 2, // veri çekme işlemi başarısız olursa 2 kez daha denemeli
      staleTime: 45_000, // 45 saniye boyunca veriyi cacheler ve veriyi 45 saniyeden sonra stale sayar
    },
  },
})

export function QueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
