import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

export function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding with gradient */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-center justify-center p-12"
        style={{
          background: 'linear-gradient(135deg, #1A5C37 0%, #2D8C4E 50%, #1A5C37 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #4ECDC4, transparent)' }}
        />
        <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #4ECDC4, transparent)' }}
        />

        <div className="relative z-10 max-w-lg text-center text-white">
          <div className="flex items-center justify-center mb-10">
            <img
              src="/logo-full.png"
              alt="NutriAI"
              className="h-20 brightness-0 invert drop-shadow-lg"
            />
          </div>
          <h2 className="text-2xl font-semibold mb-4 opacity-95">
            Akıllı Beslenme Yönetim Platformu
          </h2>
          <p className="text-base leading-relaxed opacity-80 max-w-md mx-auto">
            AI destekli araçlarla hastalarınızı takip edin, kişiselleştirilmiş beslenme planları oluşturun ve sağlık hedeflerine birlikte ulaşın.
          </p>

          {/* Feature highlights */}
          <div className="mt-10 grid grid-cols-3 gap-6 text-sm">
            <div className="flex flex-col items-center gap-2 opacity-80">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <span>AI Analiz</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-80">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <span>Canlı Takip</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-80">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <span className="text-lg">🍽️</span>
              </div>
              <span>Diyet Planı</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - auth form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
