import { useRole } from '@/shared/hooks/useRole'
import { APP_ROUTES, type RouteConfiguration } from '@/routes-config/permissions'

export function useSidebarRoutes(): RouteConfiguration[] {
  const { hasAnyRole } = useRole()

  return APP_ROUTES.filter(
    (route) => route.showInSidebar && (route.allowedRoles === 'ANY' || hasAnyRole(route.allowedRoles)),
  )
}