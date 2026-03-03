import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="text-center space-y-6 animate-fade-up max-w-md">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <SearchX className="h-10 w-10 text-primary" />
        </div>

        {/* Error code */}
        <p className="text-7xl font-bold tracking-tighter text-muted-foreground/40 tabular-nums">
          404
        </p>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Sayfa Bulunamadı</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Aradıgınız sayfa mevcut degil veya tasınmıs olabilir.
            Adresin dogru yazıldıgından emin olun.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Geri Don
          </Button>
          <Button onClick={() => navigate('/')}>
            <Home className="h-4 w-4" />
            Ana Sayfaya Don
          </Button>
        </div>
      </div>
    </div>
  )
}
