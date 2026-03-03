import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
  narrow?: boolean
}

export function PageContainer({
  title,
  description,
  actions,
  children,
  className,
  narrow = false,
}: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full', narrow ? 'max-w-4xl' : 'max-w-7xl', className)}>
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2 mt-3 sm:mt-0">{actions}</div>
        )}
      </div>

      {/* Page content */}
      <div className="animate-in-stagger">{children}</div>
    </div>
  )
}
