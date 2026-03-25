# NutriAI — Devam Noktasi

> **Son Guncelleme:** 2026-03-25 (Tum kullanici sayfalari API'ye bagli, %90)
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
Faz 5    Backend         ████████████████████ %100  ✅
Faz 6    Web Servisler   ████████████████████ %100  ✅
Faz 6    Web Hook'lar    ████████████████████ %100  ✅
Faz 6.5  Web E2E         ████████████████████ %100  ✅
Faz 7    Mobil Enteg.    ████████████████░░░░ %80   ✅ (test kaldi)
Faz 8    AI              ██████████████████░░ %90   ✅ (key+chat+sayfa bagli)
Faz 9    Test+Kalite     ████████████████░░░░ %80   ✅ (audit+10 bug fix)
Faz 10   Deploy          ██████████░░░░░░░░░░ %50   ⏳ (config hazir, deploy kaldi)
Faz 11   Sunum           ░░░░░░░░░░░░░░░░░░░░ %0
──────────────────────────────────────────────────
GENEL                    ██████████████████░░ %90   ← BURADAN DEVAM
```

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

### ✅ Faz 6.5: Web Uctan Uca (2026-03-24)
- Socket port fix (3001 → 3000)
- 4 store mock temizligi (auth, message, notification, patient)
- Auth store tamamen gercek API'ye gecirildi (login, register, checkAuth, updateProfile)
- 6 sayfa mock temizligi (dashboard, patient-detail, patient-list, plan-creator, reviews, admin/login)
- Dashboard: hook'lardan gercek veri (hasta sayisi, randevular, dikkat hastalar)
- Patient detail: usePatientDetail hook + fallback
- Build basarili, 0 TS hatasi

---

### ✅ Faz 7 API Modulleri (2026-03-24)
- constants.ts: dev URL (10.0.2.2:3000 for Android emulator)
- auth.ts: tamamen yeniden yazildi (login, register, getMe, updateUser, changePassword)
- meal.ts + food.ts: USE_MOCK = false (hybrid code aktif)
- 10 modul yeniden yazildi: tracking, appointment, plan, message, notification, dietitian, recipe, shopping, report, ai
- 3 modul mock kaldi (backend endpoint yok): gamification, family, progress-photo
- TypeScript: API dosyalarinda 0 hata

---

## ⏳ SIRADAKI: Faz 7 Ekran Testi + Faz 8 AI

### Faz 7 kalan isler
- [ ] Expo ile emulator'de test (login → dashboard → meal → messages)
- [ ] Tip uyumsuzluklari duzelt (gercek veriyle kirilacak yerler)
- [ ] Kamera/upload (opsiyonel)

### Faz 8 — AI (kismen tamamlandi)
- Backend AI servisi tam (chat + meal analysis + history)
- Web + mobil AI hook/servisleri gercek API'ye bagli
- [ ] **Gemini API key al** (Google AI Studio → ucretsiz) ve `backend/.env` → `GEMINI_API_KEY=...`
- [ ] AI chat testi (web + mobil)
- [ ] Ogun foto analizi testi

### Seed Data Zenginlestirme (tamamlandi)
- 3 yeni hasta: Mehmet Kaya (sporcu), Fatma Demir (diyabet), Zeynep Celik (hamilelik)
- 5 randevu (3 gelecek, 1 gecmis, 1 onaylanmis)
- 7 bildirim (diyetisyen + hasta)
- 1 aktif diyet plani (Ayse icin)
- 10+ ek ogun kaydı (7 gunluk gercekci veri)
- Egzersiz + uyku kayitlari
- 1 diyetisyen degerlendirmesi (5 yildiz)

### Faz 9-10 kismen (2026-03-24)
- .env.example dosyalari: backend + web
- GitHub Actions CI pipeline (`.github/workflows/ci.yml`) — backend test + web build
- Root .gitignore olusturuldu
- docker-compose.yml → seed-foods.sql eklendi (sira duzeltildi)
- Codebase audit: TODO'lar belgeli, kritik bug yok

→ Sonraki: **Uctan uca test** (docker-compose up) + **Gemini key** + **opsu-explorer + visual-god audit**

---

## Sonraki Fazlar (Ozet)

| Faz | Ne | Ne Zaman |
|-----|-----|----------|
| **7** | Mobil → Backend (13 API modul) | Hafta 2-3 |
| **8** | AI (Gemini chat + foto analiz) | Hafta 4 |
| **9** | Test + Audit (opsu-explorer + visual-god) | Hafta 5-6 |
| **10** | Deploy (Railway + Vercel) | Hafta 7 |
| **11** | Sunum hazirligi | Hafta 8 |

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
| 2 | ~~Store mock init~~ | ✅ Duzeltildi |
| 3 | ~~Sayfa inline mock data~~ | ✅ Duzeltildi |
| 4 | ~~Mobil API mock~~ | ✅ 12/15 gercek API |
| 5 | ~~Review respond stub~~ | ✅ Backend endpoint eklendi |
| 6 | Backend live-tracking aggregate yok | ⚠️ Workaround: getPatients kullaniliyor |
| 7 | ~~Gemini API key bos~~ | ✅ Key eklendi |
| 8 | Mobil gamification/family/photo mock | ⚠️ Backend endpoint yok, mock kalacak |
| 9 | Uctan uca test yapilmadi | ⏳ docker-compose up gerekli |

---

## Teknik Notlar

- **Korunan dosyalar:** `stores/`, `hooks/`, `services/`, `mock/`, `types/`, `lib/`, `shared/types/` — CLAUDE.md'de protected ama kullanici gerektiginde duzeltme izni verdi
- **UI dili:** Tum arayuz metinleri Turkce, profesyonel/medikal ton
- **Tasarim:** "Organik Profesyonel" — botanik + modern saglik dashboard
- **Font:** Outfit | **Renkler:** OKLCH, orman yesili primary | **Radius:** 10px

---

## Devam Etmek Icin

Yeni oturumda Claude'a soyle:

> "DEVAM-NOKTASI.md ve ROADMAP.md dosyalarini oku, kaldigimiz yerden devam et."
