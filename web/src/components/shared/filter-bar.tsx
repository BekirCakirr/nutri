import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface FilterOption {
  label: string
  value: string
}

interface FilterDefinition {
  key: string
  label: string
  options: FilterOption[]
  value?: string
}

interface FilterBarProps {
  filters: FilterDefinition[]
  onFilterChange: (key: string, value: string) => void
  className?: string
}

export function FilterBar({ filters, onFilterChange, className }: FilterBarProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {filters.map((filter) => (
        <Select
          key={filter.key}
          value={filter.value}
          onValueChange={(val) => onFilterChange(filter.key, val)}
        >
          <SelectTrigger className="w-[160px]" size="sm">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  )
}
