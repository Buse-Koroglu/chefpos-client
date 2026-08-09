import { Outlet } from 'react-router-dom'

export function KioskLayout() {
  return (
    <div className="min-h-screen w-full bg-background">
      <Outlet />
    </div>
  )
}
