import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

export function RootLayout() {
  return (
    <TooltipProvider>
      <Outlet />
      <Toaster position="top-right" richColors />
    </TooltipProvider>
  )
}
