# NutriAI — Finale Giden Yol Haritasi

> **Son guncelleme:** 2026-03-24
> **Hedef:** Bitirme sunumuna tam calisir proje (~Mayis sonu 2026)
> **Kalan sure:** ~8 hafta

---

## Guncel Durum (2026-03-24)

| Katman | Durum | Detay |
|--------|-------|-------|
| Backend | **%85** | 16 route, 70+ endpoint, seed data var, bazı stub'lar kaldı |
| Web UI | **%95** | 28 sayfa, 100+ bilesen tamam |
| Web Entegrasyon | **%75** | 16 servis + 13 hook → gercek API. **Ama**: 6 sayfa + 4 store hala mock |
| Mobil UI | **%95** | 91 ekran, 90+ bilesen tamam |
| Mobil Entegrasyon | **%5** | 13/15 API modulu tamamen mock, 2 hybrid |
| AI | **%15** | Backend endpoint var, Gemini key yok, chat calisiyor ama analiz eksik |
| Test | **%10** | 4 backend test dosyasi, web/mobil test yok |
| CI/CD | **%0** | Hicbir sey yok |
| Deploy | **%20** | docker-compose var, production config yok |
| **GENEL** | **%55-60** | |

### Bilinen Kritik Buglar

1. **Socket port uyumsuzlugu:** `web/src/stores/socket-store.ts` port 3001 kullanıyor, `web/src/lib/constants.ts` port 3000. Backend 3000'de calisiyor.
2. **6 sayfa hala inline mock data:** dashboard, patient-detail, patient-list, plan-creator, reviews, admin/login
3. **4 store mock ile basliyor:** auth-store, message-store, notification-store, patient-store
4. **Mobil API URL:** `https://api.nutriai.app/v1` (production domain, localhost degil)

---

## ════════════════════════════════════════════════════════════════
## FAZ 6.5: Web Uctan Uca Calisir Hale Getirme
## ════════════════════════════════════════════════════════════════

> **Oncelik:** KRITIK — bu olmadan hicbir sey demo edilemez
> **Tahmini:** 1-2 oturum
> **Hedef:** Login → Dashboard → Hasta → Ogun akisi gercek veriyle calismali

### 6.5.1 — Socket Port Duzeltme (5 dk)
- [ ] `web/src/stores/socket-store.ts` → port 3001'i 3000 yap
  ```
  Dosya: web/src/stores/socket-store.ts:18
  Degisiklik: "http://localhost:3001" → "http://localhost:3000"
  ```

### 6.5.2 — Store Mock Temizligi (30 dk)
Store'lar protected dosyalar ama mock init kaldirmak gerekli.

- [ ] `web/src/stores/auth-store.ts` → `mockUser`/`mockToken` import kaldir, bos init yap
  ```
  Dosya: web/src/stores/auth-store.ts:3
  Kaldir: import { mockUser, mockToken } from "@/mock"
  user: null, token: null ile basla
  ```
- [ ] `web/src/stores/message-store.ts` → `mockConversations`/`mockMessages` import kaldir
  ```
  Dosya: web/src/stores/message-store.ts:2
  Kaldir: import { mockConversations, mockMessages } from "@/mock"
  conversations: [], messages: [] ile basla
  ```
- [ ] `web/src/stores/notification-store.ts` → `mockNotifications` import kaldir
  ```
  Dosya: web/src/stores/notification-store.ts:2
  Kaldir: import { mockNotifications } from "@/mock"
  notifications: [] ile basla
  ```
- [ ] `web/src/stores/patient-store.ts` → `mockPatients` import kaldir
  ```
  Dosya: web/src/stores/patient-store.ts:2
  Kaldir: import { mockPatients } from "@/mock"
  patients: [] ile basla
  ```

### 6.5.3 — Sayfa Mock Temizligi (1-2 saat)
Bu sayfalar inline mock data iceriyor, gercek hook/servis verisiyle degistirilmeli.

- [ ] `web/src/pages/dashboard.tsx`
  ```
  Satir 38-56: mockActivities, mockAttentionPatients, mockUpcomingAppointments
  Cozum: usePatients(), useAppointments() hook'larindan gercek veri cek
  Dashboard'un stat kartlari icin patient.service + report.service kullan
  ```
- [ ] `web/src/pages/patient-detail.tsx`
  ```
  Satir 42-117: mockPatient (dev bir obje)
  Cozum: usePatientDetail(id) hook zaten gercek API'ye bagli
  Sayfanin mockPatient referanslarini hook'tan gelen patient ile degistir
  ```
- [ ] `web/src/pages/patient-list.tsx`
  ```
  Satir 54: const mockPatients: Patient[] = [...]
  Cozum: usePatients() hook zaten gercek API'ye bagli, inline mock kaldir
  ```
- [ ] `web/src/pages/plan-creator.tsx`
  ```
  Satir 95: const mockPatients = [...]
  Cozum: usePatients() hook'undan hasta listesi cek
  ```
- [ ] `web/src/pages/reviews.tsx`
  ```
  Satir 15: import { reviews as mockReviews, reviewStats as mockReviewStats } from '@/mock/reviews'
  Cozum: useReviews() hook zaten gercek API'ye bagli
  ```
- [ ] `web/src/pages/admin/login.tsx`
  ```
  Satir 11: import { mockAdminUser, mockToken } from '@/mock'
  Cozum: auth.service login fonksiyonu kullan
  ```

### 6.5.4 — Uctan Uca Test (1 saat)
- [ ] `docker-compose up -d` (backend + DB + seed)
- [ ] `cd web && npm run dev`
- [ ] Login testi: elif.kaya@nutriai.com / elif1234
- [ ] Dashboard verisi yukleniyor mu?
- [ ] Hasta listesi geliyor mu?
- [ ] Hasta detay sayfasi aciliyor mu?
- [ ] Mesajlar calisiyor mu?
- [ ] Randevular listeleniyor mu?

### 6.5.5 — Tip Uyumsuzluklari Duzeltme (1-2 saat)
Gercek veriyle ilk test'te kirilacak yerler:

- [ ] Backend response alan adlari vs hook lokal tipleri kontrol
- [ ] `as unknown as LocalType` cast'larinin dogru calistigini dogrula
- [ ] Null/undefined handling — backend bos donerken sayfalarin crash etmemesi
- [ ] Tarih formatlari — backend ISO string, frontend parse edebiliyor mu?

### Dogrulama
```bash
# Hicbir hook/store/sayfada mock kalmadigini dogrula
grep -r "simulateApiCall\|from ['\"]@/mock" web/src/hooks/ web/src/stores/ web/src/pages/
# Sonuc: BOS olmali

# Build basarili mi
cd web && npm run build

# Uctan uca
docker-compose up -d
cd web && npm run dev
# Tarayicida http://localhost:5173 ac, login yap
```

---

## ════════════════════════════════════════════════════════════════
## FAZ 7: Mobil → Backend Entegrasyon
## ════════════════════════════════════════════════════════════════

> **Oncelik:** YUKSEK
> **Tahmini:** 2-3 oturum
> **Hedef:** Mobil uygulama gercek backend'e baglanmali

### 7.1 — API Client Ayari (15 dk)
- [ ] `mobile/src/lib/constants.ts` → API_URL'i localhost'a cevir (development icin)
  ```
  API_URL: __DEV__ ? "http://10.0.2.2:3000/api" : "https://api.nutriai.app/v1"
  SOCKET_URL: __DEV__ ? "http://10.0.2.2:3000" : "wss://api.nutriai.app"
  ```
  (10.0.2.2 = Android emulator'den host makineye erisim)
- [ ] `mobile/src/services/api/client.ts` → axios instance'i dogrula

### 7.2 — Auth Entegrasyonu (1 saat)
- [ ] `mobile/src/services/api/auth.ts` → tamamen yeniden yaz
  ```
  Mevcut: Tum fonksiyonlar mockUser donderiyor
  Hedef: apiClient.post("/auth/login"), apiClient.get("/auth/me") vb.
  ```
- [ ] Login/Register ekranlarini test et
- [ ] Token persist (AsyncStorage) dogrula
- [ ] 401 → auto-logout

### 7.3 — API Modulleri Gecisi (3-4 saat)
Her modul icin: `USE_MOCK = true` → gercek API cagrilari

**Oncelik sirasi (kritik akis once):**
1. [ ] `meal.ts` — USE_MOCK = false yap (zaten hybrid, hazir)
2. [ ] `food.ts` — USE_MOCK = false yap (zaten hybrid, hazir)
3. [ ] `tracking.ts` — pure mock → gercek API
4. [ ] `plan.ts` — pure mock → gercek API
5. [ ] `appointment.ts` — pure mock → gercek API
6. [ ] `message.ts` — pure mock → gercek API
7. [ ] `notification.ts` — pure mock → gercek API
8. [ ] `dietitian.ts` — pure mock → gercek API
9. [ ] `recipe.ts` — pure mock → gercek API
10. [ ] `shopping.ts` — pure mock → gercek API
11. [ ] `report.ts` — pure mock → gercek API
12. [ ] `ai.ts` — pure mock → gercek API
13. [ ] `gamification.ts` — pure mock → gercek API (veya mock birak, sunumda oncelikli degil)
14. [ ] `family.ts` — pure mock → gercek API (veya mock birak)
15. [ ] `progress-photo.ts` — pure mock → gercek API (veya mock birak)

### 7.4 — Ekran Testi (2 saat)
Kritik 10 ekrani gercek veriyle test et:
- [ ] LoginScreen → auth.ts
- [ ] DashboardScreen → tracking.ts
- [ ] MealLogScreen → meal.ts
- [ ] FoodSearchScreen → food.ts
- [ ] MessagesScreen → message.ts
- [ ] AppointmentsScreen → appointment.ts
- [ ] MealPlanViewScreen → plan.ts
- [ ] ProfileScreen → auth.ts (getMe)
- [ ] NotificationsScreen → notification.ts
- [ ] RecipeScreen → recipe.ts

### 7.5 — Kamera + Upload (opsiyonel, sunumda etkileyici)
- [ ] Expo Camera ile foto cek
- [ ] multipart/form-data ile backend'e yukle
- [ ] Profil fotografi yukleme

### Dogrulama
```bash
# Mock kalintisi yok mu
grep -r "USE_MOCK = true\|const USE_MOCK" mobile/src/services/
# USE_MOCK = false veya kaldirilmis olmali

# Expo calistir
cd mobile && npx expo start
# Emulator'de login yap: ayse.yilmaz@email.com / ayse1234
```

---

## ════════════════════════════════════════════════════════════════
## FAZ 8: AI Entegrasyonu
## ════════════════════════════════════════════════════════════════

> **Oncelik:** ORTA (ama sunumda COK etkileyici)
> **Tahmini:** 1 oturum
> **Hedef:** AI chat + ogun foto analizi calisir

### 8.1 — Gemini API Baglantisi (30 dk)
- [ ] Google AI Studio'dan Gemini API key al (ucretsiz tier)
- [ ] `backend/.env` → `GEMINI_API_KEY=...` ekle
- [ ] `backend/src/services/ai.service.ts` → key kontrolu, fallback mesaji
- [ ] `/api/ai/chat` endpoint'ini test et (curl veya Postman)

### 8.2 — Ogun Foto Analizi (1 saat)
- [ ] `POST /api/ai/analyze-meal` → Gemini Vision API'ye resim gonder
- [ ] Response'u parse et: yiyecek adlari + tahmini kalori/makro
- [ ] Web'de meal-review sayfasinda foto yukleme + analiz butonu
- [ ] Mobil'de CameraCaptureScreen → foto cek → analiz et

### 8.3 — AI Chat Iyilestirme (30 dk)
- [ ] System prompt'u Turkce diyetisyen asistani olarak ayarla
- [ ] Chat gecmisi (son 10 mesaj) context olarak gonder
- [ ] Streaming response (opsiyonel, SSE)

### 8.4 — Barkod (Opsiyonel — zaman kalirsa)
- [ ] OpenFoodFacts API entegrasyonu
- [ ] Barkod → besin bilgisi eslestirme
- [ ] Bu sadece bonus — sunumda gosterirsen etkileyici ama zorunlu degil

### Dogrulama
```bash
# AI chat testi
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Diyabet hastam icin kahvalti onerisi ver"}'
# Gemini'den anlamli Turkce yanit gelmeli
```

---

## ════════════════════════════════════════════════════════════════
## FAZ 9: Test + Kalite + Polish
## ════════════════════════════════════════════════════════════════

> **Oncelik:** YUKSEK
> **Tahmini:** 2 oturum
> **Hedef:** Sunumda crash etmeyecek kalitede stabil uygulama

### 9.1 — opsu-explorer ile Codebase Audit (1 saat)
Custom agent `opsu-explorer` kullanarak:
- [ ] Dead code tespiti (kullanilmayan importlar, fonksiyonlar)
- [ ] Tip uyumsuzlugu tespiti (backend response vs frontend tip)
- [ ] SQL injection riski olan sorgular
- [ ] Hardcoded degerler (API URL, secret key vb.)
- [ ] Error handling eksikleri

### 9.2 — visual-god ile UI Review (1 saat)
Custom agent `visual-god` kullanarak:
- [ ] Animasyon zamanlama kontrolu (200-300ms mi?)
- [ ] Gorsel hiyerarsi — focal point dogru mu?
- [ ] Spacing tutarliligi (4pt grid)
- [ ] WCAG AA kontrast kontrolu
- [ ] Responsive tasarim kontrolu (mobile, tablet, desktop)

### 9.3 — Backend Test Tamamlama (1 saat)
- [ ] Auth flow testi (register → login → refresh → me)
- [ ] Patient CRUD testi
- [ ] Meal CRUD testi
- [ ] Appointment CRUD testi
- [ ] `npm test` → tum testler gecmeli

### 9.4 — Web Smoke Test (30 dk)
- [ ] Login/Logout akisi
- [ ] Dashboard istatistikleri yukluyor mu
- [ ] Hasta ekleme/duzenleme
- [ ] Ogun inceleme
- [ ] Mesajlasma (gercek zamanli)
- [ ] Tarif arama
- [ ] Rapor uretme

### 9.5 — Bug Fix Sprint (1-2 saat)
Audit'lerden cikan sorunlari duzelt:
- [ ] Kritik buglar (crash, veri kaybi)
- [ ] Orta buglar (yanlis gosterim, eksik veri)
- [ ] Minor buglar (kozmetik, alignment)

### 9.6 — Seed Data Zenginlestirme (30 dk)
Sunumda gosterilecek gercekci veri:
- [ ] 3-5 hasta profili (farkli hedefler: kilo verme, sporcu, diyabet)
- [ ] Her hasta icin 7 gunluk ogun gecmisi
- [ ] Birkac randevu (gecmis + gelecek)
- [ ] Mesaj konusmalari
- [ ] En az 1 diyet plani
- [ ] Bildirimler

### Dogrulama
```bash
cd backend && npm test        # Backend testleri
cd web && npm run build       # Web build
# Tum kritik akislari tarayicida test et
```

---

## ════════════════════════════════════════════════════════════════
## FAZ 10: Deploy + Production
## ════════════════════════════════════════════════════════════════

> **Oncelik:** GEREKLI
> **Tahmini:** 1 oturum
> **Hedef:** Canli URL ile sunumda demo yapilabilir

### 10.1 — Backend Deploy (1 saat)
- [ ] Railway veya Render'da hesap ac
- [ ] PostgreSQL addon ekle
- [ ] Backend'i deploy et
- [ ] Environment variables ayarla (DATABASE_URL, JWT_SECRET, GEMINI_API_KEY)
- [ ] Seed data'yi production DB'ye yukle
- [ ] Health check: `https://api.nutriai.app/api/health` → 200 OK

### 10.2 — Web Deploy (30 dk)
- [ ] Vercel'de hesap ac
- [ ] `VITE_API_URL` → production backend URL
- [ ] `VITE_SOCKET_URL` → production WebSocket URL
- [ ] Deploy et: `https://nutriai.vercel.app`
- [ ] Login testi: sunumda kullanilacak hesapla gir

### 10.3 — Mobil Build (opsiyonel)
- [ ] Expo EAS Build ile APK/IPA olustur
- [ ] Veya: sunumda emulator uzerinden goster (daha guvenli)

### 10.4 — Production Checklist
- [ ] JWT secret → guclu random string
- [ ] CORS → sadece production domain'e izin ver
- [ ] Rate limiting → production degerleri
- [ ] Gemini API key → production key
- [ ] HTTPS zorunlu
- [ ] `.env.example` dosyalari guncelle

### 10.5 — Yedek Plan (sunumda bir sey bozulursa)
- [ ] Backend cokerse → web'de graceful error mesajlari
- [ ] API yavas calisirsa → loading skeleton'lar zaten var
- [ ] Internet yoksa → onceden cekilmis ekran goruntuleri/video hazirla
- [ ] Demo videosu kaydet (yedek olarak)

### Dogrulama
```bash
# Production health check
curl https://YOUR-BACKEND-URL/api/health

# Production login testi
curl -X POST https://YOUR-BACKEND-URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "elif.kaya@nutriai.com", "password": "elif1234"}'
```

---

## ════════════════════════════════════════════════════════════════
## FAZ 11: Sunum Hazirligi
## ════════════════════════════════════════════════════════════════

> **Tahmini:** Son hafta
> **Hedef:** Etkileyici, sorunsuz demo

### 11.1 — Demo Senaryosu (2 saat)
Sunumda gosterilecek akis (5-10 dk):

1. **Diyetisyen giris yapar** (elif.kaya@nutriai.com)
2. **Dashboard** → gunluk ozet, randevular, dikkat gerektiren hastalar
3. **Hasta listesi** → filtreleme, arama
4. **Hasta detay** → kilo grafigi, ogun gecmisi, uyum skoru
5. **Ogun inceleme** → AI foto analizi (foto yukle → besin tespiti)
6. **Diyet plani olustur** → sablondan veya sifirdan
7. **Mesajlasma** → hastayla gercek zamanli mesaj
8. **AI Asistan** → "Bu hastam icin aksamyemegi onerisi ver"
9. **Raporlar** → haftalik rapor uret
10. **Mobil gosterim** → hasta tarafindan ogun kaydi (bonus)

### 11.2 — Demo Verisi Hazirlama
- [ ] Sunumda kullanilacak hesaplari olustur
- [ ] Gercekci hasta verileri (Turkce isimler, gercekci degerler)
- [ ] Grafiklerde anlamli trend gosteren veriler
- [ ] AI chat gecmisinde ornek konusmalar

### 11.3 — Sunum Materyali
- [ ] Mimari diyagram (Backend/Web/Mobil/DB)
- [ ] Teknoloji yigini tablosu
- [ ] Ekran goruntuleri (light + dark mode)
- [ ] Demo videosu (yedek)

---

## Haftalik Takvim

| Hafta | Tarih | Faz | Odak |
|-------|-------|-----|------|
| 1 | 24-30 Mart | **6.5** | Web uctan uca calisir hale |
| 2 | 31 Mart - 6 Nisan | **7** | Mobil API entegrasyonu (auth + kritik 5 modul) |
| 3 | 7-13 Nisan | **7** | Mobil kalan moduller + ekran testleri |
| 4 | 14-20 Nisan | **8** | AI entegrasyonu (Gemini chat + foto analiz) |
| 5 | 21-27 Nisan | **9** | Test + opsu-explorer audit + visual-god review |
| 6 | 28 Nisan - 4 Mayis | **9** | Bug fix sprint + seed data zenginlestirme |
| 7 | 5-11 Mayis | **10** | Deploy (Railway + Vercel) + production test |
| 8 | 12-18 Mayis | **11** | Sunum hazirligi + demo rehearsal |

---

## Dosya Degisiklik Ozeti

### Faz 6.5 (Web Tamamlama) — ~12 dosya
| Dosya | Degisiklik |
|-------|-----------|
| `web/src/stores/socket-store.ts` | Port 3001 → 3000 |
| `web/src/stores/auth-store.ts` | Mock import kaldir |
| `web/src/stores/message-store.ts` | Mock import kaldir |
| `web/src/stores/notification-store.ts` | Mock import kaldir |
| `web/src/stores/patient-store.ts` | Mock import kaldir |
| `web/src/pages/dashboard.tsx` | Inline mock → hook/servis |
| `web/src/pages/patient-detail.tsx` | mockPatient → usePatientDetail |
| `web/src/pages/patient-list.tsx` | Inline mock → usePatients hook |
| `web/src/pages/plan-creator.tsx` | mockPatients → usePatients hook |
| `web/src/pages/reviews.tsx` | Mock import → useReviews hook |
| `web/src/pages/admin/login.tsx` | Mock import → auth.service |
| `backend/src/db/seed.sql` | Daha zengin demo verisi (opsiyonel) |

### Faz 7 (Mobil) — ~17 dosya
| Dosya | Degisiklik |
|-------|-----------|
| `mobile/src/lib/constants.ts` | API_URL → localhost (dev) |
| `mobile/src/services/api/auth.ts` | Tamamen yeniden yaz |
| `mobile/src/services/api/tracking.ts` | Mock → gercek API |
| `mobile/src/services/api/plan.ts` | Mock → gercek API |
| `mobile/src/services/api/appointment.ts` | Mock → gercek API |
| `mobile/src/services/api/message.ts` | Mock → gercek API |
| `mobile/src/services/api/notification.ts` | Mock → gercek API |
| `mobile/src/services/api/dietitian.ts` | Mock → gercek API |
| `mobile/src/services/api/recipe.ts` | Mock → gercek API |
| `mobile/src/services/api/shopping.ts` | Mock → gercek API |
| `mobile/src/services/api/report.ts` | Mock → gercek API |
| `mobile/src/services/api/ai.ts` | Mock → gercek API |
| `mobile/src/services/api/gamification.ts` | Mock → gercek API (veya atla) |
| `mobile/src/services/api/family.ts` | Mock → gercek API (veya atla) |
| `mobile/src/services/api/progress-photo.ts` | Mock → gercek API (veya atla) |
| `mobile/src/services/api/meal.ts` | USE_MOCK = false |
| `mobile/src/services/api/food.ts` | USE_MOCK = false |

---

## Test Hesaplari (Seed Data)

| Rol | E-posta | Sifre | Aciklama |
|-----|---------|-------|----------|
| Admin | admin@nutriai.com | admin123 | Platform yonetimi |
| Diyetisyen | elif.kaya@nutriai.com | elif1234 | Ana demo hesabi |
| Hasta | ayse.yilmaz@email.com | ayse1234 | Demo hasta |
| Davet kodu | DYT-ELIF-7X3K | — | Hasta eslestirme icin |

---

## Custom Agent Kullanimi

### opsu-explorer (Faz 9.1)
```
Kullanim: Codebase audit, bug hunting, tip uyumsuzlugu tespiti
Dosya: .claude/opsu-explorer.md
Ne zaman: Faz 9'da test asamasinda
```

### visual-god (Faz 9.2)
```
Kullanim: UI/UX review, animasyon zamanlama, gorsel hiyerarsi
Dosya: .claude/visual-god.md
Ne zaman: Faz 9'da polish asamasinda
```

---

## Backend Eksik/Stub Endpoint'ler

| Endpoint | Durum | Not |
|----------|-------|-----|
| `POST /api/reviews/:id/respond` | STUB | review.service.ts bos obje donderiyor |
| `GET /api/tracking/aggregate` | YOK | Diyetisyen icin tum hastalarin ozeti — live-tracking hook buna ihtiyac duyuyor |
| `DELETE /api/reports/:id` | YOK | Rapor silme backend'de yok |
| `POST /api/shopping-lists/:id/items` | YOK | Alisveris listesine oge ekleme |
| `DELETE /api/shopping-lists/items/:id` | YOK | Alisveris listesinden oge silme |
| `POST /api/ai/suggestions` | YOK | AI oneri accept/dismiss |

> Bu endpoint'ler sunuma kadar eklenmeli veya frontend'de graceful fallback olmali.
