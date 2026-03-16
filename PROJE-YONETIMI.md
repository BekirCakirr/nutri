# NutriAI - Proje Yönetimi

> Son Güncelleme: 2026-03-17 (Oturum 2)
> Durum: Geliştirme Aşaması - Faz 1 tamamlandı, Faz 2 devam ediyor, Faz 3 başladı

---

## Genel Bakış

NutriAI, AI destekli bir beslenme takip ve yönetim platformu. Üç ana bileşen:

| Bileşen | Teknoloji | Durum |
|---------|-----------|-------|
| **web/** — Diyetisyen Paneli | React + Vite + TailwindCSS + shadcn/ui | ✅ Çalışıyor (grafikler güncellendi) |
| **mobile/** — Hasta Uygulaması | Expo + React Native + NativeWind | ⚠️ Auth + Onboarding tamamlandı, diğer ekranlar placeholder |
| **shared/** — Ortak Tipler | TypeScript | ✅ Tamamlandı |

---

## Faz 1: Altyapı & İskelet ✅ TAMAMLANDI

### Web Paneli (Diyetisyen + Admin)
- [x] Vite + TailwindCSS v4 + shadcn/ui kurulumu
- [x] React Router v6 ile tam routing yapısı (29 route)
- [x] 4 layout: Auth, Dashboard, Admin, Root
- [x] Zustand store'ları (6 adet: auth, patient, message, notification, socket, ui)
- [x] Custom hook'lar (22 adet)
- [x] API servis katmanı (16 servis, mock data ile)
- [x] Mock data (16 dosya, Türkçe içerik)
- [x] TypeScript tipleri (21 dosya)
- [x] Yardımcı kütüphaneler (9 dosya: validators, date-utils, calorie-utils vb.)
- [x] 29 sayfa bileşeni (hepsi gerçek implementasyon, placeholder değil)
- [x] 155 UI bileşeni (shared, chart, feature-specific)
- [x] Logo entegrasyonu (sidebar, login, favicon)
- [x] NutriAI yeşil renk paleti (#1A5C37, #2D8C4E, #4ECDC4)

### Mobil Uygulama (Hasta)
- [x] Expo + React Navigation kurulumu
- [x] Navigasyon ağacı (11 dosya: Root, Auth, Onboarding, 5 tab stack, modals)
- [x] Zustand store'ları (17 adet)
- [x] Custom hook'lar (23 adet)
- [x] API servis katmanı (20 servis)
- [x] Mock data (13 dosya, Türkçe)
- [x] Tema sistemi (colors, typography, spacing - NutriAI paleti)
- [x] i18n (TR + EN)
- [x] 109 gerçek bileşen (ui, nutrition, tracking, gamification, chat, recipes vb.)
- [x] TypeScript hataları düzeltildi, Expo çalışıyor
- [x] Auth ekranları (5 adet) — NativeWind ile yeniden tasarlandı
- [x] Onboarding ekranları (7 adet) — NativeWind ile yeniden tasarlandı
- [x] NativeWind (Tailwind CSS for RN) entegrasyonu tamamlandı
- [x] Meals ekranları (10 adet) — 5 gerçek implementasyon + 5 placeholder kodlandı
- [x] Camera ekranları (8 adet) — Tümü gerçek UI ile kodlandı
- [ ] **Kalan ~55 ekran hâlâ placeholder**

### Ortak
- [x] shared/types/index.ts (691 satır, 8 enum, 30+ interface)

---

## Faz 2: Sayfa/Ekran İmplementasyonu 🔄 DEVAM EDİYOR

### Web — Sayfa Kalitesi Değerlendirmesi

Her sayfa çalışıyor ama profesyonellik seviyesi artırılmalı:

| Sayfa | Satır | Durum | Notlar |
|-------|-------|-------|--------|
| Login | ~110 | ✅ Çalışıyor | Gradient arkaplan, logo, form validation |
| Register | ~100 | ⚠️ Temel | Fonksiyonel ama basit |
| Dashboard | ~339 | ✅ İyi | Stat kartları + AreaChart kalori grafiği + Donut makro + BarChart aktivite |
| Hasta Listesi | ~215 | ✅ İyi | Tablo, arama, filtreleme, pagination |
| Hasta Detay | ~382 | ✅ İyi | 7 tab'lı detay sayfası |
| Öğün İnceleme | ~221 | ⚠️ Temel | Onay/red workflow'u var |
| Plan Oluşturucu | ~228 | ⚠️ Temel | 7 gün grid var ama sürükle-bırak yok |
| Canlı Takip | ~200 | ⚠️ Temel | Hasta kartları var ama gerçek zamanlı değil |
| Mesajlar | ~204 | ✅ İyi | İki panelli mesajlaşma UI |
| Randevular | ~301 | ✅ İyi | Takvim + liste görünümü |
| Video Görüşme | ~100 | ❌ Placeholder | Sadece layout, Jitsi entegrasyonu yok |
| Davet Kodu | ~200 | ⚠️ Temel | Tablo var, QR kod placeholder |
| Tarifler | ~200 | ⚠️ Temel | Grid kartları var |
| Tarif Detay | ~200 | ⚠️ Temel | Malzeme + adımlar |
| Alışveriş Listeleri | ~270 | ✅ İyi | Kategori gruplu liste |
| Raporlar | ~200 | ⚠️ Temel | Filtreler var, grafik placeholder |
| Hasta Raporu | ~200 | ⚠️ Temel | Metrikler var, grafik placeholder |
| Değerlendirmeler | ~200 | ⚠️ Temel | Yıldız rating + yorum kartları |
| AI Asistan | ~196 | ⚠️ Temel | Chat UI, mock AI yanıtları |
| Bildirimler | ~200 | ⚠️ Temel | Tarih gruplu liste |
| Ayarlar | ~200 | ✅ İyi | 5 tab'lı ayar sayfası |
| Admin Dashboard | ~221 | ⚠️ Temel | Stat kartları + sistem durumu |
| Admin Besin DB | ~233 | ⚠️ Temel | CRUD tablo |
| Admin Alerjenler | ~190 | ⚠️ Temel | Tablo + dialog |
| Admin Tarifler | ~190 | ⚠️ Temel | Moderasyon kuyruğu |
| Admin Diyetisyenler | ~195 | ⚠️ Temel | Tablo + onay/askıya alma |
| Admin Kullanıcılar | ~220 | ⚠️ Temel | Filtreli tablo |
| Admin Raporlar | ~212 | ⚠️ Temel | İstatistik tablosu |

### Mobil — 82 Ekranın Durumu

Öncelikli ekranlar (implementasyon sırası):

| Öncelik | Ekran Grubu | Ekran Sayısı | Durum |
|---------|-------------|-------------|-------|
| 🔴 P0 | Auth (Welcome, Login, Register, ForgotPassword, EmailVerification) | 5 | ✅ NativeWind ile tamamlandı |
| 🔴 P0 | Onboarding (7 adım wizard) | 7 | ✅ NativeWind ile tamamlandı |
| 🔴 P0 | Home Dashboard | 1 | ⚠️ StyleSheet ile çalışıyor, Türkçe düzeltildi |
| 🟠 P1 | Meal (MealLog, AddMeal, FoodSearch + 5 alt ekran) | 10 | ✅ Tamamlandı (5 gerçek impl. + 5 yeni kodlandı) |
| 🟠 P1 | Camera (CameraCapture, PhotoAnalysis + 6 alt ekran) | 8 | ✅ Tamamlandı (tümü NativeWind) |
| 🟡 P2 | Progress (Weight, Water, Exercise) | 5 | ❌ Placeholder |
| 🟡 P2 | Profile (Profile, Settings) | 3 | ❌ Placeholder |
| 🟢 P3 | Dietitian (Chat, Appointments) | 4 | ❌ Placeholder |
| 🟢 P3 | Gamification (Badges, Challenges) | 4 | ❌ Placeholder |
| ⚪ P4 | Recipes, Shopping, Reports vb. | Kalan | ❌ Placeholder |

---

## Faz 3: Profesyonelleştirme 🔄 BAŞLADI

### Web İyileştirmeleri
- [x] Dashboard'a Recharts grafikleri eklendi (AreaChart kalori, Donut makro, BarChart aktivite)
- [ ] Dark mode'un tam çalışması
- [ ] Responsive tasarım iyileştirmeleri (mobil/tablet)
- [ ] Loading skeleton'ları her sayfaya
- [ ] Boş durum (empty state) bileşenleri
- [ ] Hata durumu (error state) bileşenleri
- [ ] Plan oluşturucuya sürükle-bırak
- [ ] Mesajlaşmaya real-time simülasyonu
- [ ] Raporlara gerçek grafikler
- [ ] PDF/CSV export fonksiyonelliği

### Mobil İyileştirmeleri
- [x] NativeWind (Tailwind CSS for RN) entegrasyonu tamamlandı
- [x] Auth ekranları (5 adet) NativeWind ile yeniden tasarlandı
- [x] Onboarding ekranları (7 adet) NativeWind ile yeniden tasarlandı
- [x] OnboardingStep + StepIndicator bileşenleri güncellendi
- [x] Dashboard Türkçe karakter düzeltmeleri yapıldı
- [x] Kalan Meals placeholder ekranları kodlandı (RecentFoods, Favorites, CustomFood, MealPlanView, MealPlanDayDetail)
- [x] Tüm Camera ekranları kodlandı (CameraCapture, PhotoAnalysis, AdjustPortions, Barcode, OCR, Voice, TextInput, MenuScan)
- [ ] Kalan ~55 placeholder ekranı gerçek UI ile değiştir
- [ ] Animasyonlar (Reanimated, Lottie)
- [ ] Dark mode desteği
- [ ] Offline desteği (AsyncStorage cache)
- [ ] Push bildirim entegrasyonu

---

## Faz 4: Backend Entegrasyonu 📋 PLANLANMIŞ

- [ ] API sunucu kurulumu (Node.js + Express veya NestJS)
- [ ] PostgreSQL veritabanı şeması
- [ ] JWT auth sistemi
- [ ] Socket.io gerçek zamanlı mesajlaşma
- [ ] AI servisi entegrasyonu (NutriAI)
- [ ] Dosya yükleme (Cloudinary)
- [ ] Video görüşme (Jitsi)
- [ ] Push bildirimler (Firebase)

---

## Faz 5: Test & Deploy 📋 PLANLANMIŞ

- [ ] Unit testler (Vitest web, Jest mobil)
- [ ] E2E testler (Playwright web)
- [ ] CI/CD pipeline
- [ ] Web deploy (Vercel/Netlify)
- [ ] Mobil deploy (EAS Build → App Store, Google Play)

---

## Dosya İstatistikleri

| Metrik | Web | Mobil | Shared |
|--------|-----|-------|--------|
| Toplam TS/TSX dosya | 284 | ~250 | 1 |
| Sayfalar / Ekranlar | 29 (gerçek) | 82 (placeholder) | — |
| Bileşenler | 155 (gerçek) | 109 (gerçek) | — |
| Store'lar | 6 | 17 | — |
| Hook'lar | 22 | 23 | — |
| Servisler | 16 | 20 | — |
| Mock data | 16 | 13 | — |

---

## Renk Paleti (Logo'dan)

```
Primary (Koyu Yeşil):  #1A5C37  — Ana butonlar, başlıklar
Medium (Orta Yeşil):   #2D8C4E  — Hover, aktif durumlar
Mint (Açık Yeşil):     #4ECDC4  — Vurgular, aksanlar
Pale (Soluk Yeşil):    #E8F5E9  — Arka planlar
Dark Green:            #0F3D23  — Dark mode
```

---

## Teknik Borç & Bilinen Sorunlar

1. **Web chunk boyutu** — Tek JS chunk 818KB. Lazy loading / code splitting gerekli
2. **Mobil ekranlar** — 82 ekranın hepsi placeholder, bileşenlerle bağlanmamış
3. **Web sayfaları** — Çalışıyor ama çoğu "temel" seviyede, grafikler eksik
4. **Video görüşme** — Sadece layout var, Jitsi entegrasyonu yok
5. **Sürükle-bırak** — Plan oluşturucuda görsel var ama fonksiyonel değil
6. **Real-time** — Socket.io client var ama simülasyon yok
7. **Export** — PDF/CSV utility fonksiyonları var ama sayfalara bağlı değil

---

## Sonraki Adımlar (Önerilen)

1. ~~**Web dashboard'u zenginleştir**~~ ✅ Tamamlandı
2. ~~**Mobil P0 ekranları implemente et**~~ ✅ Auth + Onboarding tamamlandı
3. **Mobil Home Dashboard'u NativeWind'e geçir** — Mevcut bileşenler (CalorieRing vb.) korunarak
4. **Mobil P1 ekranları** — Öğün takibi, Kamera/AI, Besin arama
5. **Web Plan Oluşturucu** — Sürükle-bırak (drag-and-drop) entegrasyonu
6. **Web Skeleton/Empty State** — Tüm sayfalara loading ve boş durum bileşenleri
7. **Backend başlangıcı** — Auth API + basic CRUD endpoints

---

## Günlük Geliştirme Kaydı

### 2026-03-17 — Oturum 1

**Web Paneli:**
- `calorie-chart.tsx` → LineChart'tan AreaChart'a dönüştürüldü (gradient + NutriAI yeşil renkleri)
- `macro-pie-chart.tsx` → Renk paleti NutriAI'a uyarlandı (Teal/Green tonları), Donut chart iyileştirildi
- `patient-activity-chart.tsx` → LineChart'tan BarChart'a dönüştürüldü (rounded corners + modern renk paleti)
- Dashboard'daki 3 grafik artık profesyonel görünüyor

**Mobil Uygulama:**
- NativeWind v4 entegrasyonu: `babel.config.js`, `tailwind.config.js`, `global.css`, `nativewind-env.d.ts` oluşturuldu
- `tsconfig.json` güncellendi: `jsx: "react"` + `types: ["nativewind/types"]`
- `App.tsx` içine `import './global.css'` eklendi
- Auth ekranları (5 adet) StyleSheet → NativeWind Tailwind class'larına dönüştürüldü:
  - `WelcomeScreen.tsx` — Logo container, marka, shadow buton
  - `LoginScreen.tsx` — Modern form layout, hata kutusu, shadow buton
  - `RegisterScreen.tsx` — 4 input'lu form, footer link
  - `ForgotPasswordScreen.tsx` — Başarı durumu ile emoji icon
  - (EmailVerification mevcut haliyle bırakıldı)
- Onboarding ekranları (7 adet) StyleSheet → NativeWind'e dönüştürüldü:
  - `BasicInfoScreen.tsx` — Emoji'li cinsiyet kartları, yan yana boy/kilo inputları
  - `GoalScreen.tsx` — Türkçe karakter düzeltmesi
  - `AllergyScreen.tsx` — Türkçe karakter düzeltmesi
  - `DietPreferenceScreen.tsx` — Türkçe karakter düzeltmesi
  - `LifestyleScreen.tsx` — Türkçe karakter düzeltmesi
  - `DietitianCodeScreen.tsx` — Emoji'li tab seçiciler (📝 Kod Gir / 📷 QR Tara), QR placeholder
  - `CalculationResultScreen.tsx` — Modern kalori kartı, makro dağılım kartları, 🎉 buton
- Ortak bileşenler güncellendi:
  - `OnboardingStep.tsx` → NativeWind class'ları
  - `StepIndicator.tsx` → NativeWind class'ları, aktif adım bar genişliği artırıldı
- `DashboardScreen.tsx` — Türkçe karakter düzeltmeleri (Ayşe, Yağ, Haftalık vb.)

### 2026-03-17 — Oturum 2

**Mobil — Meals Ekranları (P1):**
- Ana 5 ekran (MealLog, AddMeal, FoodSearch, FoodDetail, MealDetail) zaten gerçek implementasyon — sadece Türkçe düzeltmeler yapıldı
- `MealLogScreen.tsx` — Türkçe ay adları (Şubat, Ağustos vb.) ve Öğünler düzeltmesi
- `AddMealScreen.tsx` — "Henüz yiyecek eklenmedi" ve "isteğe bağlı" düzeltmeleri
- 5 placeholder ekran gerçek UI'a dönüştürüldü:
  - `RecentFoodsScreen.tsx` — Son kullanılan besinler listesi (FlatList + NativeWind)
  - `FavoritesScreen.tsx` — Favori besinler listesi (kalp icon + NativeWind)
  - `CustomFoodScreen.tsx` — Manuel besin ekleme formu (ad, marka, porsiyon, makrolar)
  - `MealPlanViewScreen.tsx` — Haftalık beslenme planı görünümü (tarihe göre gruplu)
  - `MealPlanDayDetailScreen.tsx` — Günlük plan detayı (makro özet kartı + öğün kartları)

**Mobil — Camera Ekranları (P1):**
- 8 placeholder ekranın tümü gerçek UI'a dönüştürüldü:
  - `CameraCaptureScreen.tsx` — Kamera viewfinder, fotoğraf/barkod mod seçici, capture butonu, kısayollar
  - `PhotoAnalysisScreen.tsx` — AI analiz ekranı: loading animasyonu, güvenilirlik kartı, tespit edilen besinler + makro detayları
  - `AdjustPortionsScreen.tsx` — Porsiyon ayarlama: +/- butonlarla miktar kontrolü, toplam kalori
  - `BarcodeScreen.tsx` — Barkod tarama kamera arayüzü
  - `OCRScreen.tsx` — Besin etiketi okuma kamera arayüzü
  - `TextInputScreen.tsx` — Yazı ile besin girişi (AI'a metin gönderme)
  - `VoiceScreen.tsx` — Sesli besin girişi (mikrofon kayıt simülasyonu)
  - `MenuScanScreen.tsx` — Restoran menüsü tarama kamera arayüzü
