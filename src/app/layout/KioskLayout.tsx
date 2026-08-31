import { Outlet } from 'react-router-dom'

export function KioskLayout() { // kiosk layout
  return (
    <div className="h-screen w-full touch-manipulation overflow-hidden bg-background select-none">
      <Outlet />
    </div>
  )
}
