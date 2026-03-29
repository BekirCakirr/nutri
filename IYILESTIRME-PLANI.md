# NutriAI — Kapsamli Iyilestirme ve Gelistirme Plani

> **Tarih:** 2026-03-28
> **Durum:** %82 tamamlandi — locale'de %100 calisir hale getirme oncelikli
> **Kalan sure:** ~8 hafta (Mayis sonu 2026)
> **Oncelik sirasi:** Locale tam calisir → Her sayfa eksiksiz → Mobil test → Polish → Deploy (EN SON)

---

## Gercekci Durum Analizi

### Dogrulanmis Metrikler (Codebase taramasi — 2026-03-28)

| Katman | ROADMAP | Gercek | Aciklama |
|--------|---------|--------|----------|
| Backend | %98 | **%95** | 16 route, 34 test PASS, AI graceful degradation. 3 eksik endpoint |
| Web UI | %100 | **%95** | 28 sayfa, build 0 hata. 3 admin sayfasi mock |
| Web Entegrasyon | %95 | **%88** | setTimeout silindi, 6 sayfada mock fallback, 47 `as any` |
| Mobil UI | %98 | **%95** | 92 ekran, USE_MOCK=false, API modulleri hazir |
| Mobil Entegrasyon | %92 | **%80** | API modulleri yazildi, hicbiri test edilmedi |
| AI | %95 | **%85** | Chat + Vision entegre, Gemini quota dolmus (429) |
| Test | %65 | **%45** | 34 unit test. E2E: web 1 kez Chrome ile test edildi |
| Deploy | %50 | **%10** | docker-compose calisir. Config dosyalari yok, canli deploy yok |
| **GENEL** | **%92** | **%82** | Kod hazir, test + veri + polish eksik |

---

## Saat Bazli Toplam Is Tahmini

### %100 Locale Calisir Proje Icin

| Kategori | Is | Saat |
|----------|----|------|
| **Veri** | Seed data zenginlestirme (recipe, mesaj, exercise, weight trend) | 1.5 |
| **Veri** | Gemini API key yenileme + test | 0.5 |
| **Web Fix** | 6 sayfadaki mock fallback → empty state | 1.5 |
| **Web Fix** | 3 admin sayfasi API baglantisi (food-db, recipes, allergens) | 2 |
| **Web Fix** | Kozmetik: tarih format, breadcrumb UUID, mesaj isimleri, review mapping | 2 |
| **Web Fix** | Randevu takvimi dinamik hafta | 0.5 |
| **Web Fix** | 47 `as any` → 10'un altina dusur | 3 |
| **Backend** | 3 eksik endpoint (aggregate, delete report, AI suggestions) | 1.5 |
| **Mobil** | curl ile tum API endpoint test + fix | 2 |
| **Mobil** | Emulator E2E test + crash fix | 4 |
| **Test** | Backend test genisletme (auth, appointment, notification) → 50+ test | 2.5 |
| **Test** | Web smoke test: tum sayfalar Chrome ile gez, kirik olanları duzelt | 2 |
| **Polish** | Dark mode kontrol + fix | 1.5 |
| **Polish** | Erisilebilirlik (a11y) temel kontrol | 1 |
| **Polish** | Performance (code splitting, bundle analiz) | 1 |
| **Sunum** | Demo senaryosu + materyal + yedek video | 3 |
| **Deploy** | Railway + Vercel deploy + production test | 3 |
| | **TOPLAM** | **~32 saat** |

### Zaman Degerlendirmesi

- **2 ay = ~8 hafta**
- Haftada ~4-5 saat calisma varsayimi → **32-40 saat mevcut**
- Gerekli is: **~32 saat**
- **Sonuc: Rahat yetisiyor.** Hatta bonus ozellikler (barkod, WebSocket, streaming AI) icin bile zaman kalir.

Haftada ~8 saat calisirsan **4 haftada** her sey biter, 4 hafta tampon kalir.

---

## Is Siralama (Oncelik: Locale %100)

### SPRINT 1: Veri + Web Tamam (Hafta 1-2)
> Hedef: Tum web sayfalari gercek veriyle eksiksiz calismali

| # | Is | Saat | Kim |
|---|----|------|-----|
| 1.1 | Gemini API key yenile | 0.5 | **Sen** (Google AI Studio hesabi) |
| 1.2 | Seed data zenginlestir (recipe, mesaj, exercise, weight) | 1.5 | Claude |
| 1.3 | 6 sayfadaki mock fallback → empty state cevir | 1.5 | Claude |
| 1.4 | 3 admin sayfasi API'ye bagla (food-db, recipes, allergens) | 2 | Claude |
| 1.5 | Kozmetik fix (tarih, breadcrumb, mesaj isim, review mapping) | 2 | Claude |
| 1.6 | Randevu takvimi dinamik hafta | 0.5 | Claude |
| 1.7 | Web Chrome E2E: tum 28 sayfayi gez, kirik olanları not al | 1 | Claude (Chrome ext) |
| | **Sprint 1 toplam** | **~9 saat** | |

**Sprint 1 sonunda:** Web %100 calisiyor, her sayfa gercek veri, bos sayfa yok.

---

### SPRINT 2: Backend + Mobil API (Hafta 3-4)
> Hedef: Backend eksiksiz, mobil API'ler dogrulanmis

| # | Is | Saat | Kim |
|---|----|------|-----|
| 2.1 | 3 eksik backend endpoint yaz | 1.5 | Claude |
| 2.2 | curl ile tum mobil API endpoint test (hasta + diyetisyen) | 2 | Claude |
| 2.3 | Backend test genisletme → 50+ test | 2.5 | Claude |
| 2.4 | 47 `as any` cast temizligi → 10 altina | 3 | Claude |
| | **Sprint 2 toplam** | **~9 saat** | |

**Sprint 2 sonunda:** Backend %100, tum endpoint'ler test edilmis, tip guvenligi saglanmis.

---

### SPRINT 3: Mobil + Polish (Hafta 5-6)
> Hedef: Mobil emulator'de calisiyor, dark mode + a11y OK

| # | Is | Saat | Kim |
|---|----|------|-----|
| 3.1 | Mobil emulator E2E test + crash fix | 4 | Sen + Claude |
| 3.2 | Dark mode kontrol + fix | 1.5 | Claude |
| 3.3 | a11y temel kontrol | 1 | Claude |
| 3.4 | Performance (code splitting, bundle) | 1 | Claude |
| | **Sprint 3 toplam** | **~7.5 saat** | |

**Sprint 3 sonunda:** Mobil test edilmis, tum platformlar polish yapilmis.

---

### SPRINT 4: Sunum + Deploy (Hafta 7-8)
> Hedef: Sunuma tam hazir

| # | Is | Saat | Kim |
|---|----|------|-----|
| 4.1 | Demo senaryosu + sunum materyali | 2 | Sen + Claude |
| 4.2 | Yedek demo videosu kaydet | 1 | Sen |
| 4.3 | Deploy (Railway + Vercel) — **EN SON** | 3 | Sen + Claude |
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

Bu test 100% backend'i dogrular. Mobil UI icin emulator gerekli ama **API katmani** emulator olmadan test edilebilir.

### Tam Yol: Emulator (Sprint 3'te)
1. Android Studio emulator ac
2. `npx expo start` calistir
3. Emulator'de uygulamayi ac
4. Her ekrani gez, crash olanlari not al
5. Claude crash'leri duzeltir

---

## Bonus Ozellikler (Zaman Kalirsa)

| Ozellik | Saat | Etki | Oncelik |
|---------|------|------|---------|
| Barkod tarama (OpenFoodFacts) | 3-4 | Sunumda etkileyici | Dusuk |
| WebSocket canli mesajlasma | 2-3 | Gercek zamanli ozellik | Dusuk |
| Streaming AI (SSE, kelime kelime) | 2 | ChatGPT benzeri UX | Dusuk |
| Expo EAS Build → APK | 1-2 | Telefonda gosterim | Dusuk |
| i18n (coklu dil altyapisi) | 3-4 | Teknik derinlik gosterir | Cok Dusuk |

---

## Basari Kriterleri

### %100 Locale Calisir (Asil Hedef)
- [ ] docker-compose up → backend + DB hazir
- [ ] Web: 28 sayfanin tamami gercek veriyle calisiyor, bos sayfa yok
- [ ] Web: Admin paneli dahil tum sayfalar API'ye bagli
- [ ] Web: Tarihler, isimler, veriler dogru formatlanmis
- [ ] AI Chat calisiyor (Gemini key aktif)
- [ ] AI Foto analizi calisiyor
- [ ] Mobil: Emulator'de crash-free calisma
- [ ] Backend: 50+ test, tumu geciyor
- [ ] Seed data: Gercekci hasta, ogun, randevu, tarif, mesaj verisi
- [ ] Dark mode calisiyor
- [ ] Build: 0 hata (web + backend)

### Sunum Hazir (Ikincil Hedef)
- [ ] Demo senaryosu yazilmis
- [ ] Yedek video hazir
- [ ] Mimari diyagram
- [ ] Canli URL (deploy) — veya localhost yedek

---

## Sonuc

| Soru | Cevap |
|------|-------|
| **%100 icin ne kadar sure?** | ~32 saat (4 sprint) |
| **2 ay yeter mi?** | **Rahat yeter.** Haftada 4 saat bile yeterli. Bonus ozelliklere bile zaman kalir. |
| **En buyuk risk?** | Mobil emulator testi — 92 ekran hic test edilmedi, ilk testte bug cikacak |
| **En hizli kazanim?** | Gemini key yenile (15 dk) → AI ozellikleri canlanir |
| **Deploy ne zaman?** | En son (Sprint 4). Locale tam calismadan deploy anlamsiz |
| **Senin yapman gereken?** | Gemini key yenile + mobil emulator testi (Sprint 3) |
| **Claude'un yapabilecegi?** | Geri kalan her sey: fix, test, seed data, admin API, polish |
