import { Outlet, Navigate } from 'react-router-dom'
import { Leaf, BarChart3, Calendar, Activity } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'

const features = [
  {
    icon: Activity,
    title: 'AI Destekli Analiz',
    desc: 'Yapay zeka ile öğün değerlendirme',
  },
  {
    icon: BarChart3,
    title: 'Canlı Takip',
    desc: 'Hasta ilerlemesini gerçek zamanlı izleyin',
  },
  {
    icon: Calendar,
    title: 'Akıllı Planlama',
    desc: 'Kişiselleştirilmiş beslenme planları',
  },
]

export function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand showcase */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden items-center justify-center p-12 bg-primary">
        {/* Decorative shapes */}
        <div className="absolute top-[-8%] right-[-4%] w-[360px] h-[360px] rounded-full bg-white/[0.04]" />
        <div className="absolute bottom-[-12%] left-[-8%] w-[440px] h-[440px] rounded-full bg-white/[0.03]" />
        <div className="absolute top-[40%] right-[15%] w-[120px] h-[120px] rounded-full bg-[var(--color-nutriai-mint)]/[0.08]" />

        <div className="relative z-10 max-w-md text-center text-primary-foreground">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">NutriAI</span>
          </div>

          <h2 className="text-xl font-semibold mb-3 opacity-95 leading-snug">
            Akıllı Beslenme Yönetim Platformu
          </h2>
          <p className="text-sm leading-relaxed opacity-70 max-w-sm mx-auto">
            AI destekli araçlarla hastalarınızı takip edin, kişiselleştirilmiş beslenme planları oluşturun ve sağlık hedeflerine birlikte ulaşın.
          </p>

          {/* Feature highlights */}
          <div className="mt-12 space-y-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-4 text-left rounded-xl bg-white/[0.06] px-5 py-3.5 backdrop-blur-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{f.title}</p>
                  <p className="text-xs opacity-60">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-background">
        <div className="w-full max-w-[420px] animate-fade-up">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
