# NutriAI — Gercek Durum Analizi ve Test Plani

> **Tarih:** 2026-03-25
> **Amac:** Projenin gercek durumunu ortaya koymak, eksikleri belirlemek, finale giden yolu netlestirmek

---

## Gercek Durum: %70-75 (onceki %90 tahmini iyimserdi)

### Neden %90 degil?

| Sorun | Etki |
|-------|------|
| 14+ web sayfasi API hatalarini sessizce yutuyor | Kullanici mock mu gercek mi gosteriyor bilemez |
| Mobilde `checkAuth()` app acilisinda cagrilmiyor | Uygulama her acilista login istiyor |
| Mobilde 401 token siliyor ama user state kaliyor | Kirik auth durumu |
| `setTimeout(600)` ile loading kapatiliyor, gercek fetch sonucu beklenmeden | Veri yuklenmeden sayfa gosterilebilir |
| 6 admin sayfasi tamamen mock | API baglantisi yok |
| Backend patient/appointment field mapping hala kirik olabilir | 0 gosterilebilir |
| `as any` cast'lari gercek hatalari gizliyor | Runtime crash potansiyeli |
| Gemini API key git'e commit edilmis | Guvenlik riski |
| Hicbir sey gercek backend'e karsi test edilmemis | Tum entegrasyon teorik |

---

## Katman Bazli Gercek Durum

### Backend: %90
- ✅ 16 route, 75+ endpoint, JWT auth, WebSocket
- ✅ PostgreSQL sema dogru, seed data zengin
- ⚠️ Bazi field name uyumsuzluklari kalmis olabilir
- ⚠️ Health endpoint envelope'a sarilmamis (kucuk sorun)

### Web Frontend: %70-75
- ✅ 28 sayfa, UI tamam, hook'lar servislere bagli
- ✅ Auth store gercek API kullanior
- ❌ 14+ sayfada hata UI'i yok — sessiz basa
- ❌ Loading `setTimeout` bazli, fetch sonucu degil
- ❌ Cok sayida `as any` cast gercek hatalari gizliyor
- ❌ 6 admin sayfasi tamamen mock
- ⚠️ Sayfalar API bos donerse mock fallback gosteriyor (kullanici fark edemez)

### Mobil: %55-60
- ✅ 12/15 API modulu yazildi
- ❌ **checkAuth() startup'ta cagrilmiyor** — app her seferinde login istiyor
- ❌ **401'de token siliniyor ama user state kalıyor** — kirik auth
- ❌ meal/food/recipe modulleri try/catch yok — network hatasi crash
- ❌ Offline desteği sıfır
- ❌ Hicbir ekran gercek backend'le test edilmemis

### Altyapi: %50
- ✅ docker-compose, Dockerfile, CI pipeline, deploy config
- ❌ **Gemini API key git'e commit edilmis** — key rotate edilmeli
- ❌ JWT secret'lar zayif fallback ("nutriai-dev-secret")
- ❌ Production CORS ayarlanmamis
- ❌ DB migration stratejisi yok
- ❌ Monitoring/logging yok (production icin)

---

## Kritik Bug Listesi (Oncelik Sirasinda)

### P0 — Sunumda kesinlikle crash eder

| # | Bug | Dosya | Cozum |
|---|-----|-------|-------|
| 1 | Mobil checkAuth() cagrilmiyor — her acilista login | `mobile/App.tsx` veya `RootNavigator` | Startup'ta `checkAuth()` cagir, token varsa restore et |
| 2 | Mobil 401: token siliniyor user state kalıyor | `mobile/src/services/api/client.ts:31-34` | 401'de authStore.logout() cagir |
| 3 | Web loading setTimeout(600) fetch beklemeden kapaniyor | 15+ sayfa | `await fetchX()` sonrasi `setIsLoading(false)` yap |
| 4 | Gemini API key git history'de | `backend/.env` | Key rotate et, .env'i git'ten cikar |

### P1 — Sunumda garip davranis

| # | Bug | Dosya | Cozum |
|---|-----|-------|-------|
| 5 | Web 14+ sayfa hata gostermiyor | dashboard, patient-list, vb. | Sonner toast ile global hata goster |
| 6 | Web patient height/weight 0 gosterebilir | `patient.service.ts mapPatient()` | Backend SELECT'e phone, avatar_url ekle |
| 7 | Appointment dietitianId mapping | `appointment.service.ts:29` | `nutritionistId: raw.dietitianId` duzelt |
| 8 | Mobil meal/food/recipe try/catch yok | `mobile/src/services/api/` | Her fonksiyona try/catch ekle |
| 9 | Web sayfalar mock/API karisik gosteriyor | messages, recipes, shopping | API bos donerse "veri yok" goster, mock gosterme |

### P2 — Iyilestirme

| # | Bug | Dosya | Cozum |
|---|-----|-------|-------|
| 10 | 6 admin sayfasi tamamen mock | `web/src/pages/admin/*` | API'ye bagla (zaman kalirsa) |
| 11 | as any cast'lari (20+) | Cesitli dosyalar | Zaman kalirsa tip guvenligini artir |
| 12 | Mobil offline destek yok | Tum API moduller | AsyncStorage cache (zaman kalirsa) |
| 13 | JWT fallback secret zayif | `backend/src/config/env.ts` | Production'da guclu secret zorla |

---

## Test Senaryolari

### Senaryo 1: Backend Canli Test (docker-compose)

**Onkosul:** `docker-compose up -d` basarili, DB seed yuklenmis

```bash
# 1. Health check
curl http://localhost:3000/api/health
# Beklenen: { "status": "ok", "database": { "connected": true } }

# 2. Login (diyetisyen)
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"elif.kaya@nutriai.com","password":"elif1234"}' \
  | jq -r '.data.tokens.accessToken')
echo "Token: $TOKEN"
# Beklenen: JWT token string

# 3. Profile
curl -s http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq '.data'
# Beklenen: { id, email, role: "dietitian", profile: { firstName: "Elif", ... } }

# 4. Hasta listesi
curl -s http://localhost:3000/api/patients \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'
# Beklenen: 4 (Ayse + Mehmet + Fatma + Zeynep)

# 5. Randevular
curl -s http://localhost:3000/api/appointments \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'
# Beklenen: 5

# 6. Bildirimler
curl -s http://localhost:3000/api/notifications \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'
# Beklenen: 4+ (diyetisyen bildirimleri)

# 7. Ogun gecmisi
curl -s "http://localhost:3000/api/meals/history?startDate=2020-01-01&endDate=2099-12-31" \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'
# Beklenen: 12+ ogun kaydi

# 8. AI Chat (Gemini)
curl -s -X POST http://localhost:3000/api/ai/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Diyabet hastam icin kahvalti onerisi ver"}' | jq '.data.reply'
# Beklenen: Gemini'den Turkce beslenme onerisi

# 9. Tarif arama
curl -s "http://localhost:3000/api/recipes?q=tavuk" \
  -H "Authorization: Bearer $TOKEN" | jq '.data'
# Beklenen: Tarif listesi veya bos array

# 10. Alisveris listesi
curl -s http://localhost:3000/api/shopping-lists \
  -H "Authorization: Bearer $TOKEN" | jq '.data'
# Beklenen: Array (bos olabilir)
```

### Senaryo 2: Web Uctan Uca Test

**Onkosul:** Backend calisiyor, `cd web && npm run dev`

| Adim | Islem | Beklenen | Kontrol |
|------|-------|----------|---------|
| 1 | http://localhost:5173 ac | Login sayfasi goruntu | [ ] |
| 2 | elif.kaya@nutriai.com / elif1234 ile giris | Dashboard yuklensin | [ ] |
| 3 | Dashboard stat kartlari | Hasta sayisi > 0 | [ ] |
| 4 | Sol menuden "Hastalar" | Hasta listesi (4 hasta) | [ ] |
| 5 | Bir hastaya tikla | Hasta detay sayfasi | [ ] |
| 6 | Hasta detayda isim, kilo, boy | Degerler 0 degil | [ ] |
| 7 | Sol menuden "Randevular" | Randevu listesi (5 randevu) | [ ] |
| 8 | Sol menuden "Mesajlar" | Konusma listesi | [ ] |
| 9 | Bir konusmaya tikla | Mesaj gecmisi | [ ] |
| 10 | Mesaj yaz ve gonder | Mesaj gonderilsin | [ ] |
| 11 | Sol menuden "AI Asistan" | Chat arayuzu | [ ] |
| 12 | "Kahvalti onerisi ver" yaz | Gemini'den Turkce yanit | [ ] |
| 13 | Sol menuden "Tarifler" | Tarif listesi | [ ] |
| 14 | Sol menuden "Raporlar" | Rapor listesi | [ ] |
| 15 | Sol menuden "Degerlendirmeler" | Review listesi | [ ] |
| 16 | Sol menuden "Bildirimler" | Bildirim listesi | [ ] |
| 17 | Logout yap | Login sayfasina don | [ ] |
| 18 | Sayfayi yenile | Login sayfasi (token temiz) | [ ] |

### Senaryo 3: Web Hata Durumlari

| Adim | Islem | Beklenen | Kontrol |
|------|-------|----------|---------|
| 1 | Backend kapatilmis halde login | Hata mesaji gosterilmeli | [ ] |
| 2 | Yanlis sifre ile login | "Giris basarisiz" mesaji | [ ] |
| 3 | Backend calismiyorken dashboard | Loading → hata mesaji veya bos state | [ ] |
| 4 | Network kesilmis halde mesaj gonder | Hata gostermeli | [ ] |

### Senaryo 4: Mobil Test (Expo)

| Adim | Islem | Beklenen | Kontrol |
|------|-------|----------|---------|
| 1 | `npx expo start` | Metro bundler baslasin | [ ] |
| 2 | Emulator'de ac | Login ekrani | [ ] |
| 3 | ayse.yilmaz@email.com / ayse1234 | Dashboard | [ ] |
| 4 | Ogun kaydi sayfasi | Bugunun ogunleri | [ ] |
| 5 | Besin arama | Arama sonuclari | [ ] |
| 6 | App'i kapat ve yeniden ac | **Login ekrani DEGIL, dashboard olmali** | [ ] |
| 7 | Su ekleme | Tracking guncellenmeli | [ ] |

---

## Duzeltme Plani (Oncelik Sirasinda)

### Adim 1: P0 — Crash Engelleyiciler (1 saat)

```
1.1 Mobil checkAuth startup (15 dk)
    Dosya: mobile/App.tsx veya RootNavigator.tsx
    Islem: useEffect icinde authStore.checkAuth() cagir

1.2 Mobil 401 tam logout (10 dk)
    Dosya: mobile/src/services/api/client.ts
    Islem: 401'de authStore.getState().logout() cagir

1.3 Web loading fetch-based (30 dk)
    Dosyalar: dashboard, patient-list, appointments, recipes, + 10 diger sayfa
    Islem: setTimeout yerine await fetch sonrasi setIsLoading(false)

1.4 Gemini key rotate (5 dk)
    NOT: Kullaniciya soylenecek — yeni key alinmali
```

### Adim 2: P1 — Hata Gosterimi (1 saat)

```
2.1 Global error toast sistemi (20 dk)
    Dosya: web/src/lib/axios.ts response interceptor
    Islem: API hatalarinda sonner toast goster

2.2 Sayfa bazli hata state'leri (40 dk)
    Dosyalar: dashboard, patient-list, appointments, meal-review, + 10 diger
    Islem: hook'un error state'ini sayfa UI'inda goster
```

### Adim 3: P1 — Field Mapping Fixes (30 dk)

```
3.1 Backend patient query'sine eksik alanlar ekle
    Dosya: backend/src/services/patient.service.ts
    Islem: SELECT'e u.phone, pp.avatar_url ekle (eger varsa)

3.2 Appointment dietitianId mapping
    Dosya: web/src/services/appointment.service.ts
    Islem: nutritionistId → dietitianId duzelt

3.3 Mobil API modullere try/catch
    Dosyalar: mobile/src/services/api/meal.ts, food.ts, recipe.ts
    Islem: Her exported fonksiyona try/catch + fallback
```

### Adim 4: Uctan Uca Test (1 saat)

```
4.1 docker-compose up -d
4.2 Backend curl testleri (Senaryo 1)
4.3 Web browser testleri (Senaryo 2)
4.4 Kirilan yerleri duzelt
```

### Adim 5: Admin Sayfalari (opsiyonel, 1-2 saat)

```
5.1 admin/dashboard → backend /admin/dashboard endpoint
5.2 admin/users → backend /admin/users endpoint
5.3 Diger admin sayfalari (zaman kalirsa)
```

### Adim 6: Deploy (1 saat)

```
6.1 Railway'e backend deploy
6.2 Vercel'e web deploy
6.3 Production URL'lerle test
```

---

## Dogrulama Komutlari

```bash
# Web build
cd web && npm run build

# Backend type check
cd backend && npx tsc --noEmit

# Backend test
cd backend && npm test

# Mock kalintisi kontrolu (hedef: 0 — hook/store/services icin)
grep -r "simulateApiCall\|from.*@/mock" web/src/hooks/ web/src/stores/ web/src/services/
# Beklenen: BOS

# Admin haric sayfalarda mock sayisi
grep -rn "const mock[A-Z]" web/src/pages/ | grep -v admin/ | wc -l
# Hedef: 10'un altinda (fallback mocklar kabul edilebilir)

# as any cast sayisi
grep -rn "as any" web/src/hooks/ web/src/services/ web/src/pages/ | wc -l
# Mevcut: 30+, hedef: 15'in altinda
```

---

## Gercekci Zaman Tahmini

| Adim | Sure | Etki |
|------|------|------|
| P0 bug fix | 1 saat | %75 → %80 |
| P1 hata gosterimi | 1 saat | %80 → %83 |
| P1 field mapping | 30 dk | %83 → %85 |
| Uctan uca test + fix | 1-2 saat | %85 → %88 |
| Admin sayfalari | 1-2 saat | %88 → %92 |
| Deploy | 1 saat | %92 → %95 |
| Sunum hazirligi | 2 saat | %95 → %98 |
| **TOPLAM** | **~8-10 saat** | **%98** |
