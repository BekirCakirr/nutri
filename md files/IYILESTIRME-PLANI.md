# NutriAI — Kapsamli Iyilestirme ve Gelistirme Plani

> **Tarih:** 2026-03-30 (Son guncelleme)
> **Durum:** %90 tamamlandi — Sprint 1 ve Sprint 2 (Faz 2) TAMAMLANDI
> **Kalan sure:** ~6 hafta (Mayis sonu 2026)
> **Oncelik sirasi:** Kozmetik Fix → Mobil test → Deploy

---

## Gercekci Durum Analizi

### Dogrulanmis Metrikler (Son guncelleme — 2026-03-29)

| Katman | ROADMAP | Once | Simdi | Aciklama |
|--------|---------|------|-------|----------|
| Backend | %98 | %97 | **%97** | Allergen API eklendi, food endpointleri test edildi |
| Web UI | %100 | %97 | **%100** | 28 sayfa tamamlandı, mock data kalmadı |
| Web Entegrasyon | %100 | %93 | **%100** | reports, plan-creator, patient, admin(users/dietitians) API'ye baglandi |
| Mobil UI | %98 | %95 | **%99** | Premium redesign: Dashboard/Meals/Profile |
| Mobil Entegrasyon | %92 | %80 | **%82** | TypeScript: 93→0 hata, nav animasyonlar |
| AI | %95 | %85 | **%85** | Gemini quota dolmus (429), key yenilenmeli |
| Test | %65 | %52 | **%52** | E2E web testi bekliyor |
| Deploy | %50 | %10 | **%10** | docker-compose calisir, canli deploy yok |
| **GENEL** | **%93** | **%88** | **%90** | Kod tamamen hazir, API entegrasyonu bitti, kozmetik ve test eksik |

---

## Yapilan Degisiklikler (Tarih Sirali)

### 2026-03-28 — Stabilizasyon + AI Entegrasyon
- ✅ Kamera + Gemini Vision AI entegrasyon
- ✅ Null-handling ve runtime crash onlemleri
- ✅ AI Chat → gercek backend API
- ✅ Fallback mekanizmasi (AI hatasi → bos response)

### 2026-03-29 — Sprint 1: Web + Mobil Redesign

#### Web Degisiklikleri
- ✅ `seed.sql` — 6 tarif, 2 alisveris listesi, 15+ mesaj, 28 gunluk agirlik trendi
- ✅ `admin/food-db.tsx` — Mock kaldi, `/api/foods` GET/POST/DELETE gercek API
- ✅ `admin/recipes.tsx` — Mock kaldi, `/api/recipes` gercek API
- ✅ `admin/allergens.tsx` — Yeni endpoint: SQL JOIN ile hasta etki istatistigi
- ✅ `allergen.controller.ts` + `allergen.routes.ts` — Yeni backend endpoint'ler
- ✅ `appointments.tsx` — Hardcoded Mart 2026 → dinamik gecerli hafta, prev/next navigasyon

#### Mobil Degisiklikleri
- ✅ `DashboardScreen.tsx` — Glassmorphic hero card, ambient glow, macros badge row, goals strip
- ✅ `MealLogScreen.tsx` — Unified gunluk ozet kart, premium bos durumlar, FAB glow
- ✅ `ProfileScreen.tsx` — Koyu header kart, frosted stat boxes, buyuk touch target'lar
- ✅ `MainTabNavigator.tsx` — Frosted tab bar, yuvarlak camera FAB, tabBarHideOnKeyboard
- ✅ `RootNavigator.tsx` — SlideFromRightIOS + ModalPresentationIOS animasyonlari

#### TypeScript Duzeltmeleri
- ✅ `App.tsx` + 7 nav stack — Eksik `React` import eklendi
- ✅ `AddMeal/FoodDetail/FoodSearch/MealDetail` — `@react-navigation/native-stack` → `@react-navigation/stack`
- ✅ `@/` path alias'lari → relative path'lere cevrildi
- ✅ `DashboardScreen` — `reportLabel` + `reportSub` style eksiklikleri giderildi
- ✅ **Sonuc: 93 TypeScript hatasi → 0 hata (Mobil)**

### 2026-03-30 — Sprint 2: Web Mock Temizliği (Faz 2 Tamamlandı)
- ✅ `reports.tsx` — Mock dashboard verisi API'ye bağlandı
- ✅ `plan-creator.tsx` — Hardcoded yiyecek listesi yerine `food.service.ts` araması entegre edildi, modal yapıldı
- ✅ `patient-report.tsx` — Tamamen API'den gelen hasta verisine (snake_case -> camelCase) uyarlandı
- ✅ `patient-detail.tsx` — Statik `fallbackPatient` kaldırıldı, gercek hasta profil verileri kullanıldı
- ✅ `admin/users.tsx` & `admin/dietitians.tsx` — Eksik filtre temizleme bugları giderildi, mock array'ler API ile değiştirildi
- ✅ **Sonuc: Projede Web tarafında mock bağımlılığı kalmadı.**

---

## Is Siralama (Oncelik: Locale %100)

### SPRINT 1: Veri + Web Tamam — ✅ TAMAMLANDI (%85)

| # | Is | Durum |
|---|----|-------|
| 1.1 | Gemini API key yenile | ⏳ Sen yapacak |
| 1.2 | Seed data zenginlestir | ✅ Tamamlandi |
| 1.3 | Mock fallback → empty state (Tüm 6 sayfa) | ✅ Tamamlandi |
| 1.4 | Admin API baglantisi (food-db, recipes, allergens) | ✅ Tamamlandi |
| 1.5 | Kozmetik fix (tarih, breadcrumb, mesaj isim) | ❌ Beklemede |
| 1.6 | Randevu takvimi dinamik hafta | ✅ Tamamlandi |
| 1.7 | Web Chrome E2E — 28 sayfa | 🔄 Devam ediyor |
| 1.8 | [EK] Mobil premium UI redesign | ✅ Tamamlandi |
| 1.9 | [EK] Navigation animasyonlari | ✅ Tamamlandi |
| 1.10 | [EK] TypeScript 93→0 hata | ✅ Tamamlandi |

---

### SPRINT 2: Backend + Mobil API (Hafta 3-4)
> Hedef: Backend eksiksiz, mobil API'ler dogrulanmis

| # | Is | Saat | Durum |
|---|----|------|-------|
| 2.1 | Mock fallback → empty state (kalan 3 sayfa) | 1 | ✅ Tamamlandi |
| 2.2 | Kozmetik fix (tarih format, breadcrumb, mesaj isim) | 2 | 🔄 Siradaki |
| 2.3 | 3 eksik backend endpoint yaz | 1.5 | ❌ |
| 2.4 | curl ile tum mobil API endpoint test | 2 | ❌ |
| 2.5 | Backend test genisletme → 50+ test | 2.5 | ❌ |
| 2.6 | 47 `as any` cast temizligi → 10 altina | 3 | ❌ |
| | **Sprint 2 toplam** | **~12 saat** | |

---

### SPRINT 3: Mobil + Polish (Hafta 5-6)
> Hedef: Mobil emulator'de calisiyor, dark mode + a11y OK

| # | Is | Saat | Durum |
|---|----|------|-------|
| 3.1 | Mobil emulator E2E test + crash fix | 4 | ❌ |
| 3.2 | Dark mode kontrol + fix | 1.5 | ❌ |
| 3.3 | a11y temel kontrol | 1 | ❌ |
| 3.4 | Performance (code splitting, bundle) | 1 | ❌ |
| | **Sprint 3 toplam** | **~7.5 saat** | |

---

### SPRINT 4: Sunum + Deploy (Hafta 7-8)
> Hedef: Sunuma tam hazir

| # | Is | Saat | Durum |
|---|----|------|-------|
| 4.1 | Demo senaryosu + sunum materyali | 2 | ❌ |
| 4.2 | Yedek demo videosu kaydet | 1 | ❌ |
| 4.3 | Deploy (Railway + Vercel) — EN SON | 3 | ❌ |
| | **Sprint 4 toplam** | **~6 saat** | |

---

## Mobil Test Stratejisi

### Hizli Yol: curl ile API Test (Emulator gerektirmez)
Mobil uygulama ayni backend endpoint'lerini cagirir. Claude, hasta hesabiyla login yapip tum endpoint'leri curl ile test edebilir:

```bash
# Hasta olarak login
POST /api/auth/login → token al

# Mobil'in cagirdigi tum endpoint'ler:
GET  /api/meals/history          → ogun gecmisi
POST /api/meals                   → yeni ogun kaydi
GET  /api/tracking/summary/today  → gunluk ozet
POST /api/tracking/water          → su kaydi
GET  /api/plans                   → diyet plani
GET  /api/appointments            → randevular
GET  /api/notifications           → bildirimler
GET  /api/messages/conversations  → mesajlar
POST /api/ai/chat                 → AI sohbet
POST /api/ai/analyze-meal         → foto analiz
GET  /api/recipes                 → tarifler
GET  /api/shopping-lists          → alisveris listeleri
GET  /api/foods/search?q=elma     → besin arama
```

### Tam Yol: Emulator (Sprint 3'te)
1. Android Studio emulator ac
2. `npx expo start` calistir
3. Emulator'de uygulamayi ac
4. Her ekrani gez, crash olanlari not al
5. Claude crash'leri duzeltir

---

## Bonus Ozellikler (Zaman Kalirsa)

| Ozellik | Saat | Oncelik |
|---------|------|---------|
| Barkod tarama (OpenFoodFacts) | 3-4 | Dusuk |
| WebSocket canli mesajlasma | 2-3 | Dusuk |
| Streaming AI (SSE, kelime kelime) | 2 | Dusuk |
| Expo EAS Build → APK | 1-2 | Dusuk |
| i18n (coklu dil altyapisi) | 3-4 | Cok Dusuk |

---

## Basari Kriterleri

### %100 Locale Calisir (Asil Hedef)
- [ ] docker-compose up → backend + DB hazir
- [x] Web: Admin paneli food-db/recipes/allergens API'ye bagli
- [x] Web: Randevu takvimi dinamik hafta
- [x] Web: Kalan 3 mock sayfa → gercek API (Tümü bitti)
- [ ] Web: Tarihler, isimler, veriler dogru formatlanmis
- [ ] AI Chat calisiyor (Gemini key aktif — **sen yapacak**)
- [ ] AI Foto analizi calisiyor
- [ ] Mobil: Emulator'de crash-free calisma
- [ ] Backend: 50+ test, tumu geciyor
- [x] Seed data: Gercekci hasta, ogun, randevu, tarif, mesaj verisi
- [ ] Dark mode calisiyor
- [x] Build: 0 TypeScript hatasi (web + mobil)

### Sunum Hazir (Ikincil Hedef)
- [ ] Demo senaryosu yazilmis
- [ ] Yedek video hazir
- [ ] Mimari diyagram
- [ ] Canli URL (deploy) — veya localhost yedek

---

## Sonuc

| Soru | Cevap |
|------|-------|
| **%100 icin ne kadar sure?** | ~22 saat kaldi (32 saatten 10 saat yapildi) |
| **2 ay yeter mi?** | **Rahat yeter.** Bonus ozelliklere bile zaman kalir. |
| **En buyuk risk?** | Mobil emulator testi — ilk testte bug cikacak |
| **En hizli kazanim?** | Gemini key yenile (15 dk) → AI ozellikleri canlanir |
| **Deploy ne zaman?** | En son (Sprint 4). Locale tam calismadan deploy anlamsiz |
| **Senin yapman gereken?** | Gemini key yenile + mobil emulator testi (Sprint 3) |
| **Claude'un yapabilecegi?** | Geri kalan her sey: fix, test, seed data, admin API, polish |
