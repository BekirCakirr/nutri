import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Leaf, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthStore } from '@/stores/auth-store'

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
    lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
    email: z.string().email('Geçerli bir e-posta adresi girin'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
    confirmPassword: z.string(),
    specialization: z.string().min(1, 'Uzmanlık alanı seçin'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

const steps = [
  { title: 'Kişisel Bilgiler', fields: ['firstName', 'lastName'] as const },
  { title: 'Hesap Bilgileri', fields: ['email', 'specialization'] as const },
  { title: 'Şifre Oluştur', fields: ['password', 'confirmPassword'] as const },
]

const specializations = [
  { value: 'klinik', label: 'Klinik Beslenme' },
  { value: 'sporcu', label: 'Sporcu Beslenmesi' },
  { value: 'pediatrik', label: 'Pediatrik Beslenme' },
  { value: 'diyabet', label: 'Diyabet Beslenmesi' },
  { value: 'obezite', label: 'Obezite ve Kilo Yönetimi' },
  { value: 'gebelik', label: 'Gebelik ve Emzirme' },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const storeRegister = useAuthStore((s) => s.register)
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  })

  const nextStep = async () => {
    const currentFields = steps[step].fields
    const valid = await trigger(currentFields as unknown as (keyof RegisterForm)[])
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1))
  }

  const prevStep = () => setStep((s) => Math.max(s - 1, 0))

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      await storeRegister({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'nutritionist',
      })
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* Mobile logo */}
      <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Leaf className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold tracking-tight">NutriAI</span>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Kayıt Ol</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Diyetisyen hesabınızı oluşturun
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.title} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-[var(--duration-normal)] ${
                  i < step
                    ? 'bg-primary text-primary-foreground'
                    : i === step
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 w-8 rounded-full transition-colors duration-[var(--duration-normal)] ${
                    i < step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Personal info */}
          <div className={step === 0 ? 'space-y-4 animate-fade-up' : 'hidden'}>
            <div className="space-y-2">
              <Label htmlFor="firstName">Ad</Label>
              <Input id="firstName" placeholder="Ayşe" {...register('firstName')} />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Soyad</Label>
              <Input id="lastName" placeholder="Yılmaz" {...register('lastName')} />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Step 2: Account info */}
          <div className={step === 1 ? 'space-y-4 animate-fade-up' : 'hidden'}>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@nutriai.com"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Uzmanlık Alanı</Label>
              <Select onValueChange={(val) => setValue('specialization', val, { shouldValidate: true })}>
                <SelectTrigger id="specialization">
                  <SelectValue placeholder="Uzmanlık alanı seçin" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialization && (
                <p className="text-xs text-destructive">{errors.specialization.message}</p>
              )}
            </div>
          </div>

          {/* Step 3: Password */}
          <div className={step === 2 ? 'space-y-4 animate-fade-up' : 'hidden'}>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="En az 6 karakter"
                  autoComplete="new-password"
                  className="pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
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
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifre Tekrarı</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Şifrenizi tekrar girin"
                autoComplete="new-password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-3 mt-6">
            {step > 0 && (
              <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                <ArrowLeft className="h-4 w-4" />
                Geri
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button type="button" onClick={nextStep} className="flex-1">
                İleri
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Kayıt yapılıyor...
                  </>
                ) : (
                  'Kayıt Ol'
                )}
              </Button>
            )}
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Zaten hesabınız var mı?{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline underline-offset-2"
          >
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  )
}
