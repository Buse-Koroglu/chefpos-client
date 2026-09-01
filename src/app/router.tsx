import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/shared/stores/authStore'
import { useRole } from '@/shared/hooks/useRole'
import { findRouteConfiguration, getDefaultRouteForRoles } from '@/routes-config/permissions'
import { AppLayout } from '@/app/layout/AppLayout'
import { KioskLayout } from '@/app/layout/KioskLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { ChangePasswordPage } from '@/features/auth/pages/ChangePasswordPage'
import { CashierHomePage } from '@/features/cashier-dashboard/pages/CashierHomePage'
import { AdminHomePage } from '@/features/admin-dashboard/pages/AdminHomePage'
import { StaffListPage } from '@/features/admin-staff/pages/StaffListPage'
import { LocationsListPage } from '@/features/admin-locations/pages/LocationsListPage'
import { SuperAdminUsersPage } from '@/features/super-admin-users/pages/SuperAdminUsersPage'
import { CategoriesListPage } from '@/features/admin-categories/pages/CategoriesListPage'
import { IngredientsListPage } from '@/features/admin-ingredients/pages/IngredientsListPage'
import { ProductsListPage } from '@/features/admin-products/pages/ProductsListPage'
import { MenusListPage } from '@/features/admin-menus/pages/MenusListPage'
import { TablesListPage } from '@/features/admin-tables/pages/TablesListPage'
import { StockRequestsListPage } from '@/features/admin-stock-requests/pages/StockRequestsListPage'
import type { Role } from '@/shared/types/auth'
import { NewOrderPage } from '@/features/cashier-pos/pages/NewOrderPage'
import { PendingOrdersPage } from '@/features/cashier-pending-orders/pages/PendingOrdersPage'
import { PastOrdersPage } from '@/features/cashier-past-orders/pages/PastOrdersPage'
import { WaiterOrderPage } from '@/features/waiter-pos/pages/WaiterOrderPage'
import { OrderHistoryPage } from '@/features/waiter-order-history/pages/OrderHistoryPage'
import { OrderHistoryDetailPage } from '@/features/waiter-order-history/pages/OrderHistoryDetailPage'
import { PreparingOrdersPage } from '@/features/kitchen-preparing-orders/pages/PreparingOrdersPage'
import { InventoryDashboardPage } from '@/features/inventory-dashboard/pages/InventoryDashboardPage'
import { MyStockRequestsPage } from '@/features/inventory-my-stock-requests/pages/MyStockRequestsPage'
import { StockMovementsPage } from '@/features/inventory-stock-movements/pages/StockMovementsPage'
import { InventoryIngredientsPage } from '@/features/inventory-ingredients/pages/InventoryIngredientsPage'
import { StockManagerDashboardPage } from '@/features/stock-manager-dashboard/pages/StockManagerDashboardPage'
import { StockManagerPendingRequestsPage } from '@/features/stock-manager-requests/pages/StockManagerPendingRequestsPage'
import { StockManagerPastRequestsPage } from '@/features/stock-manager-requests/pages/StockManagerPastRequestsPage'
import { StockManagerIngredientsPage } from '@/features/stock-manager-ingredients/pages/StockManagerIngredientsPage'
import { KioskPage } from '@/features/kiosk/pages/KioskPage'

const DEFAULT_EMPTY_ROLES: Role[] = []

function RequireAuth({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isFirstLogin = useAuthStore((state) => state.isFirstLogin)
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to="/login" replace /> // giriş yapmmaışsa login navigation
  if (isFirstLogin && location.pathname !== '/app/change-password') {
    return <Navigate to="/app/change-password" replace /> // eğer ilk girişiyse ve o anki route'u change password değilse chane password için zorlanacak
  }
  return <>{children}</>
}

function RequireGuest({ children }: { children: ReactNode }) { // eğer giriş  yapmış kullanıcı ise route'lar arasında rolüne uygun olarak default route'una yönlendirme alıyor.
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const roles = useAuthStore((state) => state.user?.roles ?? DEFAULT_EMPTY_ROLES)
  if (isAuthenticated) return <Navigate to={getDefaultRouteForRoles(roles)} replace />
  return <>{children}</>
}

function RequireRole({ path, children }: { path: string; children: ReactNode }) { // eğer kullanıcı yetkisi olmayan bir route'a erişmeye çalışırsa 403 sayfasına yönelndirilir
  const { hasAnyRole } = useRole()
  const allowedRoles = findRouteConfiguration(path)?.allowedRoles ?? 'ANY'
  if (allowedRoles !== 'ANY' && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/403" replace />
  }
  return <>{children}</>
}

function Placeholder({ label }: { label: string }) {
  return <div className="text-sm text-muted-foreground">{label}</div>
}

function DefaultAppRoute() {
  const roles = useAuthStore((state) => state.user?.roles ?? DEFAULT_EMPTY_ROLES)
  return <Navigate to={getDefaultRouteForRoles(roles)} replace />
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
          path="/app/super-admin/users"
          element={
            <RequireAuth>
              <RequireRole path="/app/super-admin/users">
                <SuperAdminUsersPage />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/app/categories"
          element={
            <RequireAuth>
              <RequireRole path="/app/categories">
                <CategoriesListPage variant="admin" />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/app/super-admin/categories"
          element={
            <RequireAuth>
              <RequireRole path="/app/super-admin/categories">
                <CategoriesListPage variant="super-admin" />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/app/ingredients"
          element={
            <RequireAuth>
              <RequireRole path="/app/ingredients">
                <IngredientsListPage variant="admin" />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/app/super-admin/ingredients"
          element={
            <RequireAuth>
              <RequireRole path="/app/super-admin/ingredients">
                <IngredientsListPage variant="super-admin" />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/app/products"
          element={
            <RequireAuth>
              <RequireRole path="/app/products">
                <ProductsListPage variant="admin" />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/app/super-admin/products"
          element={
            <RequireAuth>
              <RequireRole path="/app/super-admin/products">
                <ProductsListPage variant="super-admin" />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/app/menus"
          element={
            <RequireAuth>
              <RequireRole path="/app/menus">
                <MenusListPage variant="admin" />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/app/super-admin/menus"
          element={
            <RequireAuth>
              <RequireRole path="/app/super-admin/menus">
                <MenusListPage variant="super-admin" />
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
            path="/app/kitchen-orders"
            element={
              <RequireAuth>
                <RequireRole path="/app/kitchen-orders">
                  <PreparingOrdersPage />
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

        <Route
          path="/app/waiter-orders/history"
          element={
            <RequireAuth>
              <RequireRole path="/app/waiter-orders/history">
                <OrderHistoryPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/app/waiter-orders/history/:id"
          element={
            <RequireAuth>
              <RequireRole path="/app/waiter-orders/history/:id">
                <OrderHistoryDetailPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/app/inventory"
          element={
            <RequireAuth>
              <RequireRole path="/app/inventory">
                <InventoryDashboardPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/app/inventory/stock-requests"
          element={
            <RequireAuth>
              <RequireRole path="/app/inventory/stock-requests">
                <MyStockRequestsPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/app/inventory/stock-movements"
          element={
            <RequireAuth>
              <RequireRole path="/app/inventory/stock-movements">
                <StockMovementsPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/app/stock-manager"
          element={
            <RequireAuth>
              <RequireRole path="/app/stock-manager">
                <StockManagerDashboardPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/app/stock-manager/pending-requests"
          element={
            <RequireAuth>
              <RequireRole path="/app/stock-manager/pending-requests">
                <StockManagerPendingRequestsPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/app/stock-manager/past-requests"
          element={
            <RequireAuth>
              <RequireRole path="/app/stock-manager/past-requests">
                <StockManagerPastRequestsPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/app/stock-manager/ingredients"
          element={
            <RequireAuth>
              <RequireRole path="/app/stock-manager/ingredients">
                <StockManagerIngredientsPage />
              </RequireRole>
            </RequireAuth>
          }
        />

        <Route
          path="/app/inventory/ingredients"
          element={
            <RequireAuth>
              <RequireRole path="/app/inventory/ingredients">
                <InventoryIngredientsPage />
              </RequireRole>
            </RequireAuth>
          }
        />
       
       <Route path="/kiosk/:locationId" element={<KioskLayout />}>
          <Route index element={<KioskPage />} />
        </Route>

        <Route path="/403" element={<Placeholder label="403 — Bu sayfaya erişim yetkiniz yok" />} />
        <Route path="*" element={<Placeholder label="404 — Sayfa bulunamadı" />} />


      {/* app yoluna gidilirse her rol kendi default sayfasına yönlendirilecel */}
      <Route path="/app" element={ <RequireAuth> <AppLayout /> </RequireAuth> }>
      <Route index element={<DefaultAppRoute />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}
