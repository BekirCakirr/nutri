import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth-store'
import { mockAdminUser, mockToken } from '@/mock'

const adminLoginSchema = z.object({
  email: z.string().email('Gecerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Sifre en az 6 karakter olmalidir'),
})

type AdminLoginForm = z.infer<typeof adminLoginSchema>

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // If already authenticated as admin, redirect
  if (isAuthenticated && user?.role === 'admin') {
    navigate('/admin', { replace: true })
    return null
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: 'admin@nutriai.com',
      password: '123456',
    },
  })

  const onSubmit = async (data: AdminLoginForm) => {
    setIsLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Check if the email belongs to an admin user
      if (data.email !== mockAdminUser.email) {
        setError('Bu hesap yonetici yetkisine sahip degil.')
        setIsLoading(false)
        return
      }

      // Set admin user in auth store
      useAuthStore.setState({
        user: mockAdminUser as import('@/stores/auth-store').User,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      })

      navigate('/admin')
    } catch {
      setError('Giris basarisiz. Lutfen bilgilerinizi kontrol edin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            NutriAI Yonetim Paneli
          </h1>
          <p className="mt-1.5 text-sm text-neutral-400">
            Yonetici hesabinizla giris yapin
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-red-400">
                <p className="font-medium">Giris yapilamadi</p>
                <p className="mt-0.5 text-xs opacity-80">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-neutral-300">
                E-posta
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@nutriai.com"
                autoComplete="email"
                className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-primary"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-neutral-300">
                Sifre
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sifrenizi girin"
                  autoComplete="current-password"
                  className="border-neutral-700 bg-neutral-800 pr-10 text-white placeholder:text-neutral-500 focus-visible:ring-primary"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-neutral-400 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full h-10 mt-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Giris yapiliyor...
                </>
              ) : (
                'Giris Yap'
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Bu alan sadece yetkili yoneticiler icindir.
        </p>
      </div>
    </div>
  )
}
