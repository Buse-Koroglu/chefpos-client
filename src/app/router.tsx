import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/shared/stores/authStore'
import { useRole } from '@/shared/hooks/useRole'
import { findRouteConfig, getDefaultRouteForRoles } from '@/routes-config/permissions'
import { AppLayout } from '@/app/layout/AppLayout'
import { KioskLayout } from '@/app/layout/KioskLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { ChangePasswordPage } from '@/features/auth/pages/ChangePasswordPage'
import { CashierHomePage } from '@/features/cashier-dashboard/pages/CashierHomePage'
import { NewOrderPage } from '@/features/pos/pages/NewOrderPage'
import type { Role } from '@/shared/types/auth'

const EMPTY_ROLES: Role[] = []

function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isFirstLogin = useAuthStore((state) => state.isFirstLogin)
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (isFirstLogin && location.pathname !== '/app/change-password') {
    return <Navigate to="/app/change-password" replace />
  }
  return <>{children}</>
}

function RequireGuest({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const roles = useAuthStore((state) => state.user?.roles ?? EMPTY_ROLES)
  if (isAuthenticated) return <Navigate to={getDefaultRouteForRoles(roles)} replace />
  return <>{children}</>
}

function RequireRole({ path, children }: { path: string; children: ReactNode }) {
  const { hasAnyRole } = useRole()
  const allowedRoles = findRouteConfig(path)?.allowedRoles ?? 'ANY'
  if (allowedRoles !== 'ANY' && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/403" replace />
  }
  return <>{children}</>
}

function Placeholder({ label }: { label: string }) {
  return <div className="text-sm text-muted-foreground">{label}</div>
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <RequireGuest>
              <LoginPage />
            </RequireGuest>
          }
        />
        <Route
          path="/app/change-password"
          element={
            <RequireAuth>
              <ChangePasswordPage />
            </RequireAuth>
          }
        />
        <Route
          path="/app/home"
          element={
            <RequireAuth>
              <RequireRole path="/app/home">
                <CashierHomePage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/app/pos"
          element={
            <RequireAuth>
              <RequireRole path="/app/pos">
                <NewOrderPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route path="/403" element={<Placeholder label="403 — Bu sayfaya erişim yetkiniz yok" />} />
        <Route path="*" element={<Placeholder label="404 — Sayfa bulunamadı" />} />

        <Route path="/kiosk" element={<KioskLayout />}>
          <Route index element={<Placeholder label="Kiosk — Faz 5" />} />
        </Route>

        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route
            path="dashboard"
            element={
              <RequireRole path="/app/dashboard">
                <Placeholder label="Dashboard — Faz 6" />
              </RequireRole>
            }
          />
          <Route
            path="orders/:id"
            element={
              <RequireRole path="/app/orders/:id">
                <Placeholder label="Sipariş Detay — Faz 1" />
              </RequireRole>
            }
          />
          <Route
            path="products"
            element={
              <RequireRole path="/app/products">
                <Placeholder label="Ürünler — Faz 2" />
              </RequireRole>
            }
          />
          <Route
            path="categories"
            element={
              <RequireRole path="/app/categories">
                <Placeholder label="Kategoriler — Faz 2" />
              </RequireRole>
            }
          />
          <Route
            path="ingredients"
            element={
              <RequireRole path="/app/ingredients">
                <Placeholder label="Hammaddeler — Faz 3" />
              </RequireRole>
            }
          />
          <Route
            path="stock-requests"
            element={
              <RequireRole path="/app/stock-requests">
                <Placeholder label="Stok Talepleri — Faz 3" />
              </RequireRole>
            }
          />
          <Route
            path="users"
            element={
              <RequireRole path="/app/users">
                <Placeholder label="Kullanıcılar — Faz 4" />
              </RequireRole>
            }
          />
          <Route
            path="locations"
            element={
              <RequireRole path="/app/locations">
                <Placeholder label="Şubeler — Faz 4" />
              </RequireRole>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
