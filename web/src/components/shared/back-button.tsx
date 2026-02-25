import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  label?: string
  className?: string
}

export function BackButton({ label = 'Geri', className }: BackButtonProps) {
  const navigate = useNavigate()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(-1)}
      className={cn(className)}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  )
}
