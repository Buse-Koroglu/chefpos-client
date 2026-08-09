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
    authApi
      .refresh()
      .then(({ accessToken, user }) => setSession(accessToken, user))
      .catch(() => {
        // Geçerli bir refresh cookie yok — kullanıcı /login'e düşecek.
      })
      .finally(() => setIsBootstrapping(false))
  }, [setSession])

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Yükleniyor...
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
