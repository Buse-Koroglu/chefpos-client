import { useEffect, useState } from 'react'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { ToastProvider } from '@/app/providers/ToastProvider'
import { AppRouter } from '@/app/router'
import { useAuthStore } from '@/shared/stores/authStore'
import * as authApi from '@/shared/api/endpoints/auth'

function App() {
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const setSession = useAuthStore((state) => state.setSession)

  useEffect(() => {
    authApi.refresh().then(({ token, user }) => setSession(token, user))
      .catch(() => {})
      .finally(() => setIsBootstrapping(false))
  }, [setSession])

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50">
        <img src="/logo.png" alt="ChefPos" className="size-14 object-contain" />
        <div className="flex items-center gap-1.5">
          <span className="size-2 animate-pulse bg-[#133458]" style={{ animationDelay: '0ms' }} />
          <span className="size-2 animate-pulse bg-[#133458]" style={{ animationDelay: '200ms' }} />
          <span className="size-2 animate-pulse bg-[#133458]" style={{ animationDelay: '400ms' }} />
        </div>
        <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">Yükleniyor</p>
      </div>
    )
  }

  return (
    <QueryProvider>
      <AppRouter />
      <ToastProvider />
    </QueryProvider>
  )
}

export default App
