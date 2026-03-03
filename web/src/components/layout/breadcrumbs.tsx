import { useLocation, Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const routeLabels: Record<string, string> = {
  '': 'Dashboard',
  'patients': 'Hastalar',
  'meal-review': 'Öğün İnceleme',
  'plans': 'Planlar',
  'create': 'Oluştur',
  'live-tracking': 'Canlı Takip',
  'messages': 'Mesajlar',
  'appointments': 'Randevular',
  'invite-code': 'Davet Kodu',
  'recipes': 'Tarifler',
  'shopping-lists': 'Alışveriş Listeleri',
  'reports': 'Raporlar',
  'reviews': 'Değerlendirmeler',
  'ai-assistant': 'AI Asistan',
  'notifications': 'Bildirimler',
  'settings': 'Ayarlar',
  'admin': 'Admin',
  'food-db': 'Besin Veritabanı',
  'allergens': 'Alerjenler',
  'dietitians': 'Diyetisyenler',
  'users': 'Kullanıcılar',
  'video-call': 'Video Görüşme',
  'patient': 'Hasta Raporu',
}

export function Breadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return (
      <nav className="flex items-center text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Dashboard</span>
      </nav>
    )
  }

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link
        to="/"
        className="flex items-center hover:text-foreground transition-colors duration-[var(--duration-fast)]"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1
        const label = routeLabels[segment] || decodeURIComponent(segment)

        return (
          <span key={path} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
            {isLast ? (
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {label}
              </span>
            ) : (
              <Link
                to={path}
                className="hover:text-foreground transition-colors duration-[var(--duration-fast)] truncate max-w-[150px]"
              >
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
