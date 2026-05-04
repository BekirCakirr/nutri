# Mobil UI Düzeltme Planı — NativeWind → StyleSheet Dönüşümü

## Kök Sorun

> [!CAUTION]
> **NativeWind v4 çalışmıyor.** `babel.config.js`'den `nativewind/babel` plugin'i kaldırıldı (v4'te desteklenmiyor), NativeWind v4 Metro config üzerinden çalışması gerekiyor ama düzgün yapılandırılmamış. Sonuç: **`className` prop'ları hiç işlenmiyor** — tüm Tailwind class'ları yok sayılıyor.

### Etki
- **~70+ dosya** `className=` kullanıyor (ekranlar + bileşenler)
- Bu dosyalardaki tüm layout, renk, font, spacing, border vs. stilleri **tamamen kaybolmuş**
- Sadece `StyleSheet.create` kullanan ekranlar düzgün görünüyor (Dashboard, MealLog gibi)

### Karışık Stil Yaklaşımı Sorunu
Proje iki farklı stil sistemi kullanıyor:
| Yaklaşım | Dosya Sayısı | Durum |
|-----------|-------------|-------|
| **StyleSheet.create** (RN native) | ~20 dosya | ✅ Düzgün çalışıyor |
| **className (NativeWind)** | ~70+ dosya | ❌ Hiç stil uygulanmıyor |
| **Karışık (ikisi birden)** | ~5 dosya | ⚠️ Kısmen çalışıyor |

---

## Önerilen Çözüm

> [!IMPORTANT]
> **NativeWind'i tamamen kaldırıp tüm `className` kullanımlarını `StyleSheet.create`'e dönüştürmek.**
>
> Neden NativeWind'i düzeltmek yerine kaldırıyoruz:
> 1. NativeWind v4 config karmaşık (Metro bundler plugin + PostCSS + babel preset)
> 2. Expo SDK 54 ile uyumluluk sorunları yaşanıyor
> 3. `react-native-reanimated` v4.2.2 version mismatch'i de sorun çıkarıyor
> 4. StyleSheet zaten projenin ana ekranlarında kullanılıyor — tutarlılık sağlanır
> 5. Sunuma 6 hafta kaldı — güvenilir çözüm gerekli

---

## Dönüşüm Fazları

### Faz 0: NativeWind Kaldırma (5 dk)
- `package.json`'dan `nativewind` ve `tailwindcss` kaldır
- `tailwind.config.js` sil
- `global.css` sil
- `nativewind-env.d.ts` sil
- `App.tsx`'den `import './global.css'` kaldır
- `babel.config.js` zaten temiz

---

### Faz 1: Auth + Onboarding (KRİTİK — İlk İzlenim) — 7 dosya
> Kullanıcının gördüğü ilk ekranlar

| # | Dosya | className Kullanımı | Tahmini |
|---|-------|---------------------|---------|
| 1 | `auth/WelcomeScreen.tsx` | **Tamamen className** (StyleSheet yok) | 15 dk |
| 2 | `auth/LoginScreen.tsx` | **Çoğu className** (View, Text) | 15 dk |
| 3 | `auth/RegisterScreen.tsx` | Benzer yapı | 10 dk |
| 4 | `auth/ForgotPasswordScreen.tsx` | Basit form | 10 dk |
| 5 | `auth/EmailVerificationScreen.tsx` | Basit layout | 10 dk |
| 6 | `onboarding/BasicInfoScreen.tsx` | Form + grid | 15 dk |
| 7 | `onboarding/*.tsx` (kalan 6) | Her biri basit | 30 dk |

**Tahmini: ~1.5 saat**

---

### Faz 2: Ana Tab Ekranları — 14 dosya
> Tab bar'dan doğrudan erişilen ekranlar

| # | Dosya | Mevcut Stil | Tahmini |
|---|-------|-------------|---------|
| 1 | `home/DashboardScreen.tsx` | ✅ StyleSheet (zaten çalışıyor) | — |
| 2 | `home/NotificationsScreen.tsx` | className var mı kontrol | 10 dk |
| 3 | `home/WeeklyReportScreen.tsx` | className var mı kontrol | 10 dk |
| 4 | `home/MonthlyReportScreen.tsx` | className var mı kontrol | 10 dk |
| 5 | `meals/MealLogScreen.tsx` | ✅ StyleSheet (zaten çalışıyor) | — |
| 6 | `meals/AddMealScreen.tsx` | Kontrol gerekli | 15 dk |
| 7 | `meals/FoodSearchScreen.tsx` | Kontrol gerekli | 15 dk |
| 8 | `meals/MealDetailScreen.tsx` | Kontrol gerekli | 15 dk |
| 9 | `meals/FoodDetailScreen.tsx` | Kontrol gerekli | 15 dk |
| 10 | `meals/MealPlanViewScreen.tsx` | Kontrol gerekli | 10 dk |
| 11 | `camera/CameraCaptureScreen.tsx` | Kontrol gerekli | 10 dk |
| 12 | `camera/PhotoAnalysisScreen.tsx` | Kontrol gerekli | 10 dk |
| 13 | `progress/OverviewScreen.tsx` | **Tamamen className** | 20 dk |
| 14 | `profile/ProfileScreen.tsx` | **Tamamen className** | 20 dk |

**Tahmini: ~1.5 saat**

---

### Faz 3: Profile Alt Ekranları — 20 dosya
> Tümü className ağırlıklı

Dosyalar: EditProfile, Settings, Goals, Achievements, AllergyManagement, DietitianConnection, FamilyMode, ConnectedDevices, DataExport, Reminders, NotificationSettings, PersonalData, Language, Theme, Subscription, HelpSupport, About, PrivacyPolicy, TermsOfService

**Tahmini: ~1 saat** (çoğu benzer pattern — liste/form düzeni)

---

### Faz 4: Progress Ekranları — 18 dosya
> Tümü "(Demo)" etiketli, className ağırlıklı

Dosyalar: Weight, Water, CalorieHistory, MacroTracking, Steps, Sleep, Exercise, HeartRate, Stress, Mood, BloodValues, Vitamins, NutrientBreakdown, Measurements, ProgressPhotos, IntermittentFasting, CustomGoals (+Overview zaten Faz 2'de)

**Tahmini: ~1 saat** (çoğu benzer chart/card pattern)

---

### Faz 5: Modals + Kamera + Bildirimler + Alerji + Raporlar — ~13 dosya
> Modal ekranlar, placeholder'lar

Dosyalar: AIChatScreen, DietitianProfileScreen, BookAppointmentScreen, VideoCallScreen, RecipeDetailScreen, ShoppingListDetailScreen, BadgesScreen, ChallengesScreen, LeaderboardScreen, AllergenScannerScreen, + bildirimler, alerji, raporlar

**Tahmini: ~1 saat**

---

### Faz 6: Component'ler — 2 dosya
> Sadece 2 component'te className var

- `components/onboarding/StepIndicator.tsx`
- `components/onboarding/OnboardingStep.tsx`

**Tahmini: ~15 dk**

---

## Dönüşüm Şablonu

Her dosya için yapılacak:
```
1. className="..." → style={styles.xxx} dönüşümü
2. Tailwind class'larını çöz (flex-1 → flex: 1, bg-[#xxx] → backgroundColor: '#xxx', vb.)
3. StyleSheet.create({ ... }) bloğu ekle/güncelle
4. Mevcut tema dosyalarını kullan (colors, spacing, fontSizes, fontWeights, borderRadius)
5. Premium görünüm koru (borderRadius: 24+, shadow, spacing, icon+text hiyerarşi)
```

---

## Zaman Özeti

| Faz | Dosya Sayısı | Süre |
|-----|-------------|------|
| F0: NativeWind kaldırma | config | 5 dk |
| F1: Auth + Onboarding | 7 + 6 | ~1.5 saat |
| F2: Ana tab ekranlar | ~14 | ~1.5 saat |
| F3: Profile alt ekranlar | ~20 | ~1 saat |
| F4: Progress ekranlar | ~18 | ~1 saat |
| F5: Modal + diğer | ~13 | ~1 saat |
| F6: Component'ler | 2 | 15 dk |
| **TOPLAM** | **~72 dosya** | **~6 saat** |

---

## Doğrulama

Her faz sonrasında:
```bash
# Expo çalıştır ve ekranları kontrol et
npx expo start --clear
# Tüm ekranlar düzgün render ediliyor mu?
```

## Açık Soru

> [!IMPORTANT]
> **NativeWind'i düzeltmek yerine kaldırma yaklaşımını onaylıyor musun?**
> Bu, en güvenilir ve hızlı çözüm — ama ~72 dosya değişecek.
> Alternatif: NativeWind v4 Metro config'ini düzeltmeye çalışmak (riskli, config karmaşık).
