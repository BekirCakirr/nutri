# NutriAI — Devam Noktasi

> **Son Guncelleme:** 2026-03-25 (Gercek durum analizi — durust yuzde hesabi)
> **Claude:** Bu dosyayi oku, nerede kaldigimizi anla, siradaki isi yap.
> **Detayli plan icin:** `ROADMAP.md` dosyasina bak.

---

## Proje Ozeti

NutriAI, Turkce konusan diyetisyenler icin yapay zeka destekli beslenme takibi ve hasta yonetim platformu. Web paneli + mobil uygulama + backend olmak uzere 3 katmandan olusuyor. **Bitirme projesi — sunuma ~8 hafta kaldi (Mayis sonu 2026).**

**Tech Stack:**
- Web: React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + Vite 7
- Mobil: React Native + Expo + NativeWind v4
- Backend: Node.js + Express + PostgreSQL 16 + Socket.io
- Ortak: Zustand (state), React Hook Form + Zod, Recharts, Lucide icons
- AI: Google Gemini API (chat + vision)

---

## Proje Ilerleme Tablosu

```
Faz 1-4  UI Gelistirme  ████████████████████ %100  ✅
Faz 5    Backend         ██████████████████░░ %95   ✅ (bazi field name uyumsuzluklari kalabilir)
Faz 6    Web Servisler   ████████████████████ %100  ✅
Faz 6    Web Hook'lar    ████████████████████ %100  ✅
Faz 6.5  Web E2E         ██████████████░░░░░░ %65   ⚠️ (22 sayfa hala setTimeout loading, 15+ inline mock fallback)
Faz 7    Mobil Enteg.    ██████████████░░░░░░ %70   ⚠️ (auth OK, 12/15 API, test edilmedi)
Faz 8    AI              ██████████████░░░░░░ %70   ⚠️ (backend+hook hazir, key var ama test edilmedi)
Faz 9    Test+Kalite     ██████████░░░░░░░░░░ %50   ⚠️ (audit yapildi, fix'ler kismen uygulandi, E2E yok)
Faz 10   Deploy          ██████████░░░░░░░░░░ %50   ⏳ (config hazir, deploy kaldi)
Faz 11   Sunum           ░░░░░░░░░░░░░░░░░░░░ %0
──────────────────────────────────────────────────
GENEL                    ███████████████░░░░░ %78   ← BURADAN DEVAM
```

### Neden %78 ve %90 degil?
- **22 web sayfasi** hala `setTimeout` ile loading kapatıyor — gercek fetch sonucunu beklemiyor
- **15+ sayfa** inline `const mock*` fallback data iceriyor — API bos donerse mock gosteriyor, kullanici fark edemez
- **6 admin sayfasi** tamamen mock — API baglantisi yok
- **57 `as any` cast** web/src genelinde — gercek tip hatalarini gizliyor
- **Uctan uca test hic yapilmadi** — docker-compose ile canli test yok
- Mobil uygulama gercek backend'e karsi hic test edilmedi

---

## Tamamlanan Calisma Gecmisi

### ✅ Faz 1-4: UI Gelistirme (2026-03 oncesi)
- Web: 28 sayfa, 100+ bilesen, 7 skeleton tipi, 13 empty state, responsive
- Mobil: 91 ekran, 90+ bilesen, 16 store, drag-and-drop plan creator
- Ortak: 733 satir tip tanimi, mock data altyapisi
- **Commitler:** d088944 → 53ca29c → c794787

### ✅ Faz 5: Backend Tamamlama (2026-03-18)
- 16 route grubu, 70+ endpoint, tam JWT auth
- PostgreSQL 16: 24 tablo, 300 Turkce besin verisi
- Pino logging, rate limiting, Helmet, Multer upload
- WebSocket: mesaj, online/offline, tracking event'leri
- Seed data: 1 admin + 1 diyetisyen (Elif Kaya) + 1 hasta (Ayse Yilmaz)
- **Commit:** a7f145c

### ✅ Faz 6: Web → Backend Entegrasyon (2026-03-18 → 2026-03-24)
- 16 servis dosyasi → gercek API (axios, snake/camel donusum, envelope unwrap)
- 13 hook → gercek servisler (simulateApiCall tamamen kaldirildi)
- Ek servis fonksiyonlari: createMeal, deleteMeal, toggleItem
- **Commitler:** 3b84aaa, 35cfced + (commit bekliyor)

---

### ✅ Faz 6.5: Web Uctan Uca (2026-03-24/25)
- Socket port fix (3001 → 3000)
- 4 store mock temizligi (auth, message, notification, patient) — store'larda mock import kalmadi
- Auth store tamamen gercek API'ye gecirildi (login, register, checkAuth, updateProfile)
- 6 sayfa mock import temizligi (dashboard, patient-detail, patient-list, plan-creator, reviews, admin/login)
- 10+ sayfa gercek API hook'larina baglandi (appointments, notifications, messages, AI, recipes, shopping, invite-code, meal-review, recipe-detail, patient-report)
- Backend stub'lar duzeltildi: review respond endpoint + shopping CRUD eklendi
- Build basarili, 0 TS hatasi
- **KALAN:** 22 sayfa hala setTimeout-based loading, 15+ sayfa inline mock fallback, 6 admin sayfa tamamen mock

---

### ✅ Faz 7 API Modulleri (2026-03-24)
- constants.ts: dev URL (10.0.2.2:3000 for Android emulator)
- auth.ts: tamamen yeniden yazildi (login, register, getMe, updateUser, changePassword)
- meal.ts + food.ts: USE_MOCK = false (hybrid code aktif, mock import hala var fallback icin)
- 10 modul yeniden yazildi: tracking, appointment, plan, message, notification, dietitian, recipe, shopping, report, ai
- 3 modul mock kaldi (backend endpoint yok): gamification, family, progress-photo
- Mobile auth fix: checkAuth startup'ta cagriliyor (RootNavigator), 401'de tam logout
- TypeScript: API dosyalarinda 0 hata
- **KALAN:** Hicbir ekran gercek backend'le test edilmedi, meal/food hala mock import iceriyor

---

## ⏳ SIRADAKI: Web Loading Fix + E2E Test + Deploy

### ONCELIK 1: Web setTimeout Loading → Fetch-based (KRITIK)
22 sayfa `setTimeout(400-600)` ile loading kapatıyor, gercek fetch sonucunu beklemiyor.
Bu, sunumda "veri yukleniyormus gibi gorunup aslinda bos kalma" sorununa yol acar.

- [ ] dashboard.tsx — setTimeout → await fetch sonrasi setIsLoading(false)
- [ ] patient-list.tsx, patient-detail.tsx, patient-report.tsx
- [ ] appointments.tsx, messages.tsx, meal-review.tsx
- [ ] recipes.tsx, recipe-detail.tsx, reviews.tsx
- [ ] shopping-lists.tsx, notifications.tsx, invite-code.tsx
- [ ] settings.tsx, reports.tsx, live-tracking.tsx
- [ ] 6 admin sayfasi (dashboard, users, dietitians, food-db, recipes, allergens)

### ONCELIK 2: Inline Mock Fallback Temizligi
15+ sayfa `const mock*` ile fallback data tanimliyor. API bos donerse bu veriler gosteriliyor, kullanici gercek mi mock mu bilemez.

- [ ] messages.tsx (mockConversations, mockMessages)
- [ ] patient-detail.tsx (mockMeals, mockAppointments, mockMessages, mockPatient)
- [ ] recipes.tsx (mockRecipes), recipe-detail.tsx (mockRecipe)
- [ ] shopping-lists.tsx (mockLists)
- [ ] meal-review.tsx (mockReviews)
- [ ] invite-code.tsx (mockCodes)
- [ ] live-tracking.tsx (mockLivePatients)
- [ ] patient-report.tsx (mockReport)

### ONCELIK 3: Uctan Uca Test (HIC YAPILMADI)
- [ ] `docker-compose up -d` ile backend + DB calistir
- [ ] Backend curl testleri (health, login, patients, appointments)
- [ ] Web tarayici testi (login → dashboard → hasta → mesaj → AI)
- [ ] Mobil emulator testi (login → dashboard → ogun → mesaj)
- [ ] Kirilan yerleri duzelt

### Faz 8 — AI (kismen tamamlandi)
- Backend AI servisi tam (chat + meal analysis + history)
- Web + mobil AI hook/servisleri gercek API'ye bagli
- [x] Gemini API key `backend/.env`'de mevcut
- [ ] AI chat testi (web + mobil) — henuz test edilmedi
- [ ] Ogun foto analizi testi — henuz test edilmedi

### Faz 9 kalan
- [x] Codebase audit yapildi (opsu-explorer + visual-god)
- [x] 10 kritik bug fix uygulanidi (5696f7a commit)
- [ ] **as any cast'lari:** 57 adet — tip guvenligi zayif
- [ ] Backend test tamamlama (auth flow, patient CRUD, meal CRUD)
- [ ] Web smoke test (tum kritik akislar)

### Faz 10 — Deploy
- [x] Config dosyalari hazir (vercel.json, railway.json, docker-compose)
- [ ] Railway'e backend deploy
- [ ] Vercel'e web deploy
- [ ] Production URL'lerle test

→ Sonraki: **setTimeout fix** (en kritik) → **E2E test** (docker-compose up) → **Deploy**

---

## Sonraki Fazlar (Guncellenmis Ozet)

| Faz | Ne | Durum | Kalan Is |
|-----|-----|-------|----------|
| **6.5** | Web E2E | %65 | setTimeout fix, mock fallback temizligi |
| **7** | Mobil Entegrasyon | %70 | E2E test, tip duzeltmeleri |
| **8** | AI | %70 | Gemini test (chat + foto) |
| **9** | Test + Kalite | %50 | as any temizligi, backend test, smoke test |
| **10** | Deploy | %50 | Railway + Vercel deploy |
| **11** | Sunum hazirligi | %0 | Demo senaryo, materyal, video |

> **Detaylar icin:** `ROADMAP.md` dosyasina bak

---

## Test Hesaplari

| Rol | E-posta | Sifre |
|-----|---------|-------|
| Admin | admin@nutriai.com | admin123 |
| Diyetisyen | elif.kaya@nutriai.com | elif1234 |
| Hasta | ayse.yilmaz@email.com | ayse1234 |
| Davet Kodu | DYT-ELIF-7X3K | — |

---

## Custom Agent'lar

| Agent | Dosya | Kullanim | Faz |
|-------|-------|----------|-----|
| opsu-explorer | `.claude/opsu-explorer.md` | Codebase audit, bug hunt, tip uyumsuzlugu | 9.1 |
| visual-god | `.claude/visual-god.md` | UI/UX review, animasyon, gorsel hiyerarsi | 9.2 |

---

## Bilinen Sorunlar

| # | Sorun | Durum |
|---|-------|-------|
| 1 | ~~Socket port 3001 vs 3000~~ | ✅ Duzeltildi |
| 2 | ~~Store mock init~~ | ✅ Duzeltildi (store'larda mock import kalmadi) |
| 3 | Sayfa inline mock fallback data (15+ sayfa) | ⚠️ `const mock*` hala var, API bos donerse mock gosteriliyor |
| 4 | ~~Mobil API mock~~ | ✅ 12/15 gercek API (gamification/family/photo mock) |
| 5 | ~~Review respond stub~~ | ✅ Backend endpoint eklendi |
| 6 | Backend live-tracking aggregate yok | ⚠️ Workaround: getPatients kullaniliyor |
| 7 | ~~Gemini API key bos~~ | ✅ Key .env'de mevcut |
| 8 | Mobil gamification/family/photo mock | ⚠️ Backend endpoint yok, mock kalacak |
| 9 | **Uctan uca test HIC yapilmadi** | ❌ docker-compose ile canli test yok |
| 10 | **22 sayfa setTimeout loading** | ❌ Fetch sonucu beklenmiyor, 400-600ms timer ile kapaniyor |
| 11 | **6 admin sayfasi tamamen mock** | ⚠️ API baglantisi yok |
| 12 | **57 `as any` cast** web/src genelinde | ⚠️ Gercek tip hatalarini gizliyor |
| 13 | ~~Mobil checkAuth startup'ta cagrilmiyor~~ | ✅ RootNavigator'da cagiriliyor |
| 14 | ~~Mobil 401: token siliniyor user state kaliyor~~ | ✅ logout() tam cagiriliyor |
| 15 | Gemini API key git history'de gorunuyor | ⚠️ Key rotate edilmeli (commit 5696f7a mesajinda) |

---

## Teknik Notlar

- **Korunan dosyalar:** `stores/`, `hooks/`, `services/`, `mock/`, `types/`, `lib/`, `shared/types/` — CLAUDE.md'de protected ama kullanici gerektiginde duzeltme izni verdi
- **UI dili:** Tum arayuz metinleri Turkce, profesyonel/medikal ton
- **Tasarim:** "Organik Profesyonel" — botanik + modern saglik dashboard
- **Font:** Outfit | **Renkler:** OKLCH, orman yesili primary | **Radius:** 10px

---

## Gercekci Zaman Tahmini (Finale Kadar)

| Adim | Sure | Etki |
|------|------|------|
| setTimeout → fetch-based loading (22 sayfa) | 2-3 saat | %78 → %82 |
| Mock fallback temizligi (15 sayfa) | 1-2 saat | %82 → %85 |
| E2E test (docker-compose) + fix'ler | 2-3 saat | %85 → %88 |
| AI test (Gemini chat + foto) | 1 saat | %88 → %90 |
| Admin sayfalari API'ye baglama | 2-3 saat | %90 → %93 |
| Deploy (Railway + Vercel) | 1-2 saat | %93 → %95 |
| Sunum hazirligi | 2 saat | %95 → %98 |
| **TOPLAM** | **~12-17 saat** | **%98** |

---

## Devam Etmek Icin

Yeni oturumda Claude'a soyle:

> "DEVAM-NOKTASI.md ve ROADMAP.md dosyalarini oku, kaldigimiz yerden devam et."
