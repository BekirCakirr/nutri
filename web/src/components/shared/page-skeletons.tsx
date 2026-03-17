import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

/* ------------------------------------------------------------------ */
/*  ListPageSkeleton                                                    */
/* ------------------------------------------------------------------ */

export function ListPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      {/* Search bar */}
      <Card className="py-0 gap-0">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-40" />
          </div>
        </CardContent>
      </Card>
      {/* Table rows */}
      <Card className="py-0 gap-0 overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-20 hidden md:block" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  DetailPageSkeleton                                                  */
/* ------------------------------------------------------------------ */

export function DetailPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Back button */}
      <Skeleton className="h-8 w-32" />
      {/* Hero card */}
      <Card className="py-0 gap-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-3 w-56" />
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <div className="space-y-1.5 text-center">
                <Skeleton className="h-3 w-8 mx-auto" />
                <Skeleton className="h-6 w-12 mx-auto" />
              </div>
              <div className="space-y-1.5 text-center">
                <Skeleton className="h-3 w-8 mx-auto" />
                <Skeleton className="h-6 w-12 mx-auto" />
              </div>
              <div className="space-y-1.5 text-center">
                <Skeleton className="h-3 w-8 mx-auto" />
                <Skeleton className="h-6 w-12 mx-auto" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Tab skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24" />
        ))}
      </div>
      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><Skeleton className="h-5 w-32" /></CardHeader><CardContent className="space-y-3">{Array.from({ length: 4 }).map((_, i) => (<Skeleton key={i} className="h-4 w-full" />))}</CardContent></Card>
        <Card><CardHeader><Skeleton className="h-5 w-32" /></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  DashboardSkeleton                                                   */
/* ------------------------------------------------------------------ */

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="py-0 gap-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><Skeleton className="h-5 w-40" /></CardHeader><CardContent><Skeleton className="h-56 w-full" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-5 w-40" /></CardHeader><CardContent><Skeleton className="h-56 w-full" /></CardContent></Card>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  ChatSkeleton                                                        */
/* ------------------------------------------------------------------ */

export function ChatSkeleton() {
  return (
    <div className="h-[calc(100vh-120px)]">
      <Card className="flex h-full overflow-hidden p-0">
        {/* Left sidebar */}
        <div className="w-80 shrink-0 border-r flex flex-col">
          <div className="px-4 pt-5 pb-3 space-y-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex-1 p-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Right chat area */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 px-5 py-3 border-b">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="flex-1 p-5 space-y-4">
            <div className="flex justify-start"><Skeleton className="h-16 w-60 rounded-2xl" /></div>
            <div className="flex justify-end"><Skeleton className="h-12 w-48 rounded-2xl" /></div>
            <div className="flex justify-start"><Skeleton className="h-20 w-64 rounded-2xl" /></div>
          </div>
          <div className="border-t px-4 py-3">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  CalendarSkeleton                                                    */
/* ------------------------------------------------------------------ */

export function CalendarSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      {/* Calendar grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-8 w-48" />
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div />
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-7 w-7 rounded-full" />
              </div>
            ))}
          </div>
          {/* Time grid rows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid grid-cols-8 gap-1 h-[52px] border-t">
              <Skeleton className="h-3 w-10 mt-1 ml-auto" />
              {Array.from({ length: 7 }).map((_, j) => (
                <Skeleton key={j} className={`h-10 w-full rounded-md ${i % 3 === 0 && j % 3 === 1 ? '' : 'opacity-0'}`} />
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  PlanCreatorSkeleton                                                 */
/* ------------------------------------------------------------------ */

export function PlanCreatorSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      {/* Meta bar */}
      <Card className="py-4 gap-0">
        <CardContent className="px-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <Skeleton className="h-9 md:col-span-4" />
            <Skeleton className="h-9 md:col-span-3" />
            <Skeleton className="h-9 md:col-span-2" />
            <Skeleton className="h-9 md:col-span-3" />
          </div>
        </CardContent>
      </Card>
      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        <div className="space-y-4">
          {/* Tab bar */}
          <Skeleton className="h-10 w-full" />
          {/* 2x2 meal grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="py-0 gap-0">
                <div className="px-4 py-3 border-b">
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="p-3 space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-7 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
        {/* Sidebar */}
        <Card className="py-4 gap-3">
          <CardHeader className="px-4 pb-0 pt-0"><Skeleton className="h-4 w-24" /></CardHeader>
          <CardContent className="px-4 space-y-4">
            <Skeleton className="h-28 w-full rounded-xl" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between"><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-20" /></div>
                  <Skeleton className="h-1.5 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  FormPageSkeleton                                                    */
/* ------------------------------------------------------------------ */

export function FormPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-56" />
      </div>
      {/* Form sections */}
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i}>
          <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
