import { useRole } from '@/shared/hooks/useRole'
import { APP_ROUTES, type RouteConfig } from '@/routes-config/permissions'

export function useSidebarRoutes(): RouteConfig[] {
  const { hasAnyRole } = useRole()

  return APP_ROUTES.filter(
    (route) =>
      route.showInSidebar &&
      (route.allowedRoles === 'ANY' || hasAnyRole(route.allowedRoles)),
  )
}