# NutriAI — Kapsamli Yol Haritasi (ROADMAP)

## Context

Proje su an %28-30 tamamlanmis durumda. Frontend (web 28 sayfa, mobil 88 ekran) tamamen kodlandi ancak tum veri mock. Backend kismen var (5 route, auth, socket.io, PostgreSQL semasi). Siradaki buyuk adim: backend'i tamamlayip frontend'leri gercek API'ye baglamak.

---

## Mevcut Durum Ozeti

| Katman | Dosya | Durum |
|--------|-------|-------|
| Web UI | 28 sayfa, 100+ bilesen, 6 store, 16 servis | %95 UI tamam, tumu mock |
| Mobil UI | 88 ekran, 90+ bilesen, 16 store, 20 API modul | %95 UI tamam, tumu mock |
| Backend | 5 route, auth, socket.io, PG semasi | %25 — temel yapi var, eksik route'lar cok |
| Shared Types | 733 satir tip tanimi | %80 — cogu alan kapsaniyor |
| Entegrasyon | Mock servisler, simulateApiCall() | %0 — gercek API baglantisi yok |
| AI | Mock yanit, hardcoded response | %0 |
| Test | Jest kurulu, bos test dosyalari | %5 |
| CI/CD | Yok | %0 |
| Deploy | Docker + docker-compose var | %15 |

---

## Faz 5: Backend Tamamlama

**Tahmini sure: En buyuk faz — 3-4 oturum**
**Oncelik: KRITIK — diger her sey buna bagimli**

### 5.1 — Altyapi Guclendirme
Dosyalar: `backend/src/`

- [ ] Structured logging (Pino) — tum request/response logla
- [ ] Rate limiting middleware (express-rate-limit)
- [ ] Helmet.js (HTTP guvenlik header'lari)
- [ ] Request body size limitleri
- [ ] CORS konfigurasyonu env'den oku
- [ ] Hata kodlari katalogu (`backend/src/errors/`)
- [ ] Health check endpoint'ini genislet (DB baglanti durumu, uptime)

### 5.2 — Eksik API Route'lari
Mevcut: auth, foods, meals, patients, dietitians
Eksik olan her biri icin: route + controller + service + Zod validation

- [ ] `POST/GET /api/appointments` — randevu CRUD + takvim slot'lari
- [ ] `POST/GET /api/messages` — mesaj gonder/al + konusma listesi
- [ ] `POST/GET /api/plans` — diyet plani CRUD + hasta atamasi
- [ ] `GET /api/recipes` — tarif CRUD + kategori filtreleme
- [ ] `POST/GET /api/shopping-lists` — alisveris listesi CRUD
- [ ] `POST/GET /api/reviews` — hasta degerlendirmeleri
- [ ] `POST/GET /api/notifications` — bildirim CRUD + okundu isareti
- [ ] `GET /api/reports` — haftalik/aylik rapor uretimi
- [ ] `GET /api/tracking` — canli takip verileri (kalori, su, egzersiz)
- [ ] `GET /api/admin/*` — admin dashboard stats, kullanici yonetimi
- [ ] `POST /api/ai/chat` — AI asistan proxy endpoint
- [ ] `POST /api/ai/analyze-meal` — ogun fotografi analiz endpoint

### 5.3 — Dosya Yukleme
- [ ] Multer + lokal storage (development)
- [ ] Ogun fotografi yukleme endpoint'i
- [ ] Profil fotografi yukleme
- [ ] Resize/optimize middleware

### 5.4 — WebSocket Tamamlama
Mevcut: Temel socket.io kurulumu, mesaj gonderme
Eksik:

- [ ] Canli takip event'leri (hasta kalori/su guncelleme)
- [ ] Bildirim push (yeni mesaj, randevu hatirlatma)
- [ ] Yazmaya basliyor/bitirdi indicator
- [ ] Online/offline durum yayini
- [ ] Randevu hatirlatma zamanlayicisi (node-cron)

### 5.5 — Veritabani Genisletme
- [ ] `admin_audit_log` tablosu
- [ ] Ek index'ler (sik sorgulanan kolonlar)

### Dogrulama
```bash
docker-compose up -d
curl http://localhost:3000/api/health
npm test
```

---

## Faz 6: Web → Backend Entegrasyon

**Tahmini sure: 2-3 oturum**
**Oncelik: YUKSEK**

### 6.1 — Auth Akisi (Ilk Baglanti)
- [ ] `auth.service.ts`: simulateApiCall() → gercek axios POST /api/auth/login, /register, /refresh
- [ ] `auth-store.ts`: mockUser → gercek user verisinden store doldurma
- [ ] `axios.ts`: Interceptor'a token ekleme, 401'de refresh token denemesi
- [ ] Login/Register sayfalarini gercek API'ye bagla

### 6.2 — Veri Servisleri Gecisi
Her servis dosyasi icin: `simulateApiCall(mockData)` → `axios.get/post(url)`

1. [ ] `patient.service.ts` → GET/POST /api/patients
2. [ ] `meal.service.ts` → GET/POST /api/meals
3. [ ] `appointment.service.ts` → GET/POST /api/appointments
4. [ ] `message.service.ts` → GET/POST /api/messages
5. [ ] `plan.service.ts` → GET/POST /api/plans
6. [ ] `recipe.service.ts` → GET /api/recipes
7. [ ] `food.service.ts` → GET /api/foods
8. [ ] `notification.service.ts` → GET/PATCH /api/notifications
9. [ ] `report.service.ts` → GET /api/reports
10. [ ] `review.service.ts` → GET/POST /api/reviews
11. [ ] `shopping.service.ts` → GET/POST /api/shopping-lists
12. [ ] `invite-code.service.ts` → GET/POST /api/invite-codes
13. [ ] `admin.service.ts` → GET /api/admin/*
14. [ ] `ai.service.ts` → POST /api/ai/chat
15. [ ] `dietitian-profile.service.ts` → GET /api/dietitians

### 6.3 — WebSocket Baglantisi
- [ ] `web/src/lib/socket.ts` → gercek backend URL'ine baglan
- [ ] Messages sayfasinda gercek zamanli mesajlasma
- [ ] Live tracking sayfasinda gercek zamanli veri
- [ ] Bildirim popup'lari (sonner toast)

### 6.4 — Dosya Yukleme
- [ ] Ogun fotografi yukleme (meal-review, patient-detail)
- [ ] Profil fotografi yukleme (settings)

### 6.5 — Hata Yonetimi
- [ ] API hata response'larini kullaniciya goster (sonner toast)
- [ ] Network hatasi durumunda retry/offline bilgisi
- [ ] 403 Forbidden → yetkisiz sayfa

---

## Faz 7: Mobil → Backend Entegrasyon

**Tahmini sure: 2-3 oturum**
**Oncelik: YUKSEK**

### 7.1 — API Client Guncelleme
- [ ] `mobile/src/services/api/client.ts` → backend URL'ini dogru ayarla
- [ ] `USE_MOCK` flag'lerini `false` yap

### 7.2 — Auth Entegrasyonu
- [ ] `mobile/src/services/api/auth.ts` → gercek login/register/getMe
- [ ] Auto-logout on 401

### 7.3 — Ekran Bazli Entegrasyon
1. [ ] DashboardScreen → GET /api/patients/summary + tracking/today
2. [ ] MealLogScreen + AddMealScreen → POST/GET /api/meals
3. [ ] FoodSearchScreen → GET /api/foods?search=
4. [ ] TrackingScreens → POST/GET /api/tracking
5. [ ] MealPlanViewScreen → GET /api/plans
6. [ ] AppointmentScreens → GET/POST /api/appointments
7. [ ] MessageScreens → GET/POST /api/messages
8. [ ] ProfileScreens → GET/PATCH /api/users/me
9. [ ] NotificationsScreen → GET /api/notifications
10. [ ] RecipeScreens → GET /api/recipes
11. [ ] ShoppingListScreens → GET/POST /api/shopping-lists

### 7.4 — Kamera + Dosya Yukleme
- [ ] Expo Camera ile ogun fotografi cekme → multipart/form-data upload
- [ ] Profil fotografi yukleme

### 7.5 — Push Notification
- [ ] Expo Notifications kurulumu
- [ ] Backend'den push token kaydi

### 7.6 — Offline-First Strateji
- [ ] AsyncStorage ile son verileri cache'le
- [ ] Network durumu izleme (NetInfo)
- [ ] Offline'da yapilan islemleri queue'la

---

## Faz 8: AI Entegrasyonu

**Tahmini sure: 1-2 oturum**
**Oncelik: ORTA**

### 8.1 — LLM Backend Proxy
- [ ] `POST /api/ai/chat` → Gemini API'ye proxy
- [ ] Streaming response destegi (SSE)
- [ ] Rate limiting (kullanici basina gunluk limit)

### 8.2 — Ogun Fotografi Analizi
- [ ] `POST /api/ai/analyze-meal` → Gemini Vision API
- [ ] Sonuc: tespit edilen yiyecekler + tahmini besin degerleri

### 8.3 — Akilli Oneriler
- [ ] Hasta verilerine gore otomatik diyet plani onerisi
- [ ] Haftalik raporda AI yorumlari

### 8.4 — Barkod / OCR
- [ ] Barkod tarama → besin veritabanindan eslestirme
- [ ] OpenFoodFacts API entegrasyonu

---

## Faz 9: Test + Kalite

**Tahmini sure: 1-2 oturum**
**Oncelik: YUKSEK**

### 9.1 — Backend Unit Test
- [ ] Auth service testleri
- [ ] Patient/Meal/Appointment CRUD testleri
- [ ] Jest + Supertest

### 9.2 — Web Component Test
- [ ] Vitest + React Testing Library kurulumu
- [ ] Kritik bilesen testleri

### 9.3 — E2E Test
- [ ] Playwright kurulumu
- [ ] Kritik akis testleri

### 9.4 — Guvenlik Auditi
- [ ] SQL injection kontrol
- [ ] XSS kontrol
- [ ] JWT expiry suresi dogrulama

### 9.5 — Accessibility Auditi (Web)
- [ ] WCAG AA kontrast kontrol
- [ ] Klavye navigasyonu
- [ ] ARIA label'lari

---

## Faz 10: CI/CD + Production Deploy

**Tahmini sure: 1 oturum**
**Oncelik: SON ADIM**

### 10.1 — CI Pipeline (GitHub Actions)
- [ ] `.github/workflows/ci.yml`
- [ ] Branch protection rules

### 10.2 — Docker Production Build
- [ ] Web icin nginx + static serve Dockerfile
- [ ] docker-compose.prod.yml

### 10.3 — Monitoring + Logging
- [ ] Sentry entegrasyonu
- [ ] Uptime monitoring

### 10.4 — Production Checklist
- [ ] Environment variables dokumantasyonu
- [ ] Database backup stratejisi
- [ ] CORS production domain'e kisitla

### 10.5 — Deploy Hedefleri
- [ ] Backend: Railway, Render, veya VPS
- [ ] Web: Vercel veya Netlify
- [ ] Database: Neon, Supabase, veya self-hosted PG
- [ ] Mobil: Expo EAS Build

---

## Toplam Is Tablosu

| Faz | Konu | Tahmini Oturum | Dosya Sayisi |
|-----|------|---------------|-------------|
| 5 | Backend tamamlama | 3-4 | ~30 yeni + ~10 guncelleme |
| 6 | Web entegrasyon | 2-3 | ~20 guncelleme |
| 7 | Mobil entegrasyon | 2-3 | ~25 guncelleme |
| 8 | AI entegrasyonu | 1-2 | ~8 yeni/guncelleme |
| 9 | Test + kalite | 1-2 | ~15 yeni test dosyasi |
| 10 | CI/CD + deploy | 1 | ~5 config dosyasi |
| **TOPLAM** | | **10-15 oturum** | **~113 dosya** |

---

## Onerilen Calisma Sirasi

```
Faz 5.1 → 5.5 → 5.2 → 5.3 → 5.4   (Backend once)
     ↓
Faz 6.1 → 6.2 → 6.3 → 6.4 → 6.5   (Web entegrasyon)
     ↓
Faz 7.1 → 7.2 → 7.3 → 7.4 → 7.5   (Mobil entegrasyon)
     ↓
Faz 8 (AI — paralel baslayabilir)
     ↓
Faz 9 (Test — her faz sonunda da parcali yapilabilir)
     ↓
Faz 10 (Deploy)
```

**Kritik yol:** Backend (Faz 5) → Web entegrasyon (Faz 6) → Test (Faz 9) → Deploy (Faz 10)
**Paralel calisabilir:** Mobil entegrasyon (Faz 7) web ile paralel, AI (Faz 8) bagimsiz
