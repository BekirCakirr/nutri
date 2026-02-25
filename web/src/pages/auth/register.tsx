import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Apple } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuthStore } from '@/stores/auth-store'

const registerSchema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  confirmPassword: z.string(),
  specialization: z.string().min(1, 'Uzmanlık alanı seçin'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      login({
        id: '2',
        name: data.name,
        email: data.email,
        role: 'dietitian',
        avatar: null,
      }, 'mock-jwt-token')
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2 lg:hidden">
          <Apple className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">NutriAI</span>
        </div>
        <CardTitle className="text-2xl">Kayıt Ol</CardTitle>
        <CardDescription>
          Diyetisyen hesabınızı oluşturun
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ad Soyad</Label>
            <Input id="name" placeholder="Dr. Ad Soyad" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" placeholder="ornek@nutriai.com" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">Uzmanlık Alanı</Label>
            <Select onValueChange={(val) => setValue('specialization', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Uzmanlık alanı seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="klinik">Klinik Beslenme</SelectItem>
                <SelectItem value="sporcu">Sporcu Beslenmesi</SelectItem>
                <SelectItem value="pediatrik">Pediatrik Beslenme</SelectItem>
                <SelectItem value="diyabet">Diyabet Beslenmesi</SelectItem>
                <SelectItem value="obezite">Obezite ve Kilo Yönetimi</SelectItem>
                <SelectItem value="gebelik">Gebelik ve Emzirme</SelectItem>
              </SelectContent>
            </Select>
            {errors.specialization && <p className="text-sm text-destructive">{errors.specialization.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••"
                {...register('password')}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Şifre Tekrarı</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Kayıt Ol
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Giriş Yap
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
