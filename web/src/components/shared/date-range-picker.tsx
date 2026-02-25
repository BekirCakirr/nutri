import { useState } from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { CalendarDays } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DateRangePickerProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  className?: string
  placeholder?: string
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
  placeholder = 'Tarih aralığı seçin',
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[260px] justify-start text-left font-normal',
            !dateRange?.from && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, 'd MMM yyyy', { locale: tr })}
                {' - '}
                {format(dateRange.to, 'd MMM yyyy', { locale: tr })}
              </>
            ) : (
              format(dateRange.from, 'd MMM yyyy', { locale: tr })
            )
          ) : (
            placeholder
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={onDateRangeChange}
          numberOfMonths={2}
          locale={tr}
        />
      </PopoverContent>
    </Popover>
  )
}
