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
import { AdminHomePage } from '@/features/admin-dashboard/pages/AdminHomePage'
import { StaffListPage } from '@/features/admin-staff/pages/StaffListPage'
import { LocationsListPage } from '@/features/admin-locations/pages/LocationsListPage'
import { CategoriesListPage } from '@/features/admin-categories/pages/CategoriesListPage'
import { IngredientsListPage } from '@/features/admin-ingredients/pages/IngredientsListPage'
import { ProductsListPage } from '@/features/admin-products/pages/ProductsListPage'
import { TablesListPage } from '@/features/admin-tables/pages/TablesListPage'
import { StockRequestsListPage } from '@/features/admin-stock-requests/pages/StockRequestsListPage'
import type { Role } from '@/shared/types/auth'
import { NewOrderPage } from '@/features/cashier-pos/pages/NewOrderPage'
import { PendingOrdersPage } from '@/features/cashier-pending-orders/pages/PendingOrdersPage'
import { PastOrdersPage } from '@/features/cashier-past-orders/pages/PastOrdersPage'
import { WaiterOrderPage } from '@/features/waiter-pos/pages/WaiterOrderPage'

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
          path="/app/dashboard"
          element={
            <RequireAuth>
              <RequireRole path="/app/dashboard">
                <AdminHomePage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/app/users"
          element={
            <RequireAuth>
              <RequireRole path="/app/users">
                <StaffListPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/app/locations"
          element={
            <RequireAuth>
              <RequireRole path="/app/locations">
                <LocationsListPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/app/categories"
          element={
            <RequireAuth>
              <RequireRole path="/app/categories">
                <CategoriesListPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/app/ingredients"
          element={
            <RequireAuth>
              <RequireRole path="/app/ingredients">
                <IngredientsListPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/app/products"
          element={
            <RequireAuth>
              <RequireRole path="/app/products">
                <ProductsListPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/app/tables"
          element={
            <RequireAuth>
              <RequireRole path="/app/tables">
                <TablesListPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/app/stock-requests"
          element={
            <RequireAuth>
              <RequireRole path="/app/stock-requests">
                <StockRequestsListPage />
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
        <Route
          path="/app/pending-orders"
          element={
            <RequireAuth>
              <RequireRole path="/app/pending-orders">
                <PendingOrdersPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/app/order-history"
          element={
            <RequireAuth>
              <RequireRole path="/app/past-orders">
                <PastOrdersPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/app/waiter-orders"
          element={
            <RequireAuth>
              <RequireRole path="/app/waiter-orders">
                <WaiterOrderPage />
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
            path="orders/:id"
            element={
              <RequireRole path="/app/orders/:id">
                <Placeholder label="Sipariş Detay — Faz 1" />
              </RequireRole>
            }
          />
          <Route
            path="kitchen-orders"
            element={
              <RequireRole path="/app/kitchen-orders">
                <Placeholder label="Mutfak Siparişleri — Faz 1" />
              </RequireRole>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
