# NutriAI — Claude Calisma Promptu

Asagidaki promptu Claude'a ver. MASTER-PLAN.md dosyasini da ayrica at.

---

## PROMPT BASLANGIC

Sen bir senior full-stack developer olarak NutriAI projesinde calisiyorsun. Bu bir bitirme projesi — Mayis sonu 2026'da sunulacak. Proje lokalde calisacak, deploy yok.

### Proje Nedir?
NutriAI, diyetisyen-hasta arasinda kopru olan bir beslenme takip platformu:
- **Mobil uygulama** (React Native + Expo): Hasta tarafı — ogun kaydi, AI foto analiz, diyetisyenle mesajlasma, diyet plani goruntuleme
- **Web paneli** (React + Vite + Tailwind + shadcn/ui): Diyetisyen tarafı — hasta yonetimi, ogun inceleme, plan olusturma, mesajlasma, AI asistan
- **Backend** (Node.js + Express + PostgreSQL + Docker): 19 route, JWT auth, Gemini AI, Socket.io

### Mevcut Durum
Proje GORUNTUDE buyuk ama ISLEVDE eksik. 88 mobil ekran var ama cogunun arkasinda gercek fonksiyon yok. Web daha iyi durumda (%75 calisir). Temel sorunlar:
- Mobilde hasta-diyetisyen **mesajlasma ekrani HIC YOK** (API + component'ler hazir, ekran ve navigasyon eksik)
- Dashboard'da kullanici adi "Ayse", kalori hedefi "1650" **hardcoded**
- Bildirimler **mock data** kullaniyor
- Randevu alma ekrani **API baglanmamis**
- Diyet plani gun detayi **mock data** kullaniyor
- Web'de hasta detay grafikleri **hardcoded ornek veri**
- Web'de alisveris listesi olusturma, rapor indirme, davet kodu uretme **butonlari calismıyor**

### Teknik Bilgiler
- Docker calisir durumda: `nutriai-backend` (port 3001) + `nutriai-db` (PostgreSQL port 5432)
- Mobil API URL: `http://192.168.1.4:3001/api` (fiziksel telefon icin LAN IP)
- Backend health: `curl http://localhost:3001/api/health` → OK
- Test hesaplari: Diyetisyen: elif.kaya@nutriai.com / elif1234 | Hasta: ayse.yilmaz@email.com / ayse1234
- Web: `cd web && npm run dev` (port 5173)
- Mobil: `cd mobile && npx expo start`
- TypeScript: hem web hem mobil 0 hata durumunda

### MASTER-PLAN.md
Sana ayrica MASTER-PLAN.md dosyasini gonderdim. Bu dosya projenin ANA YOL HARITASI. Iceriginde:
- Mevcut durumun detayli tablosu
- MVP tanimi
- 5 sprint plani (her sprint icinde detayli gorevler)
- Her gorev icin: sorun, dosyalar, yapilacaklar, test kriterleri
- Calisma kurallari

### Calisma Sekli

1. **MASTER-PLAN.md'yi tamamen oku ve anla**
2. **Sprint 1'den basla** — sirasıyla 1.1, 1.2, 1.3, 1.4 gorevlerini yap
3. Her gorevi bitirdiginde **test kriterlerini calistir** — MUST satirlarinin hepsini dogrula
4. Test gecmeden sonraki goreve gecme
5. Sprint 1 tamamen bittikten sonra Sprint 2'ye gec

### Kritik Kurallar

- **HICBIR mock/hardcoded veri birakma** — her deger API'den gelmeli
- **Her degisiklikten sonra TypeScript kontrol et** — `cd mobile && npx tsc --noEmit` ve `cd web && npx vite build`
- **Console warning/error kabul edilmez** — circular dependency, unused import temizle
- **Dosya okumadan duzenleme yapma** — once oku, pattern'i anla, sonra degistir
- **Mevcut pattern'leri takip et** — projede zaten calisan dosyalar var (review.routes.ts, meal.ts vb.), ayni yapıyı kullan
- **Turkcesini koru** — UI metinleri Turkce, profesyonel ton

### Proje Yapisi
```
nutri/
├── backend/src/
│   ├── controllers/     # Route handler'lar
│   ├── services/        # Is mantigi (DB query'leri)
│   ├── routes/          # Express route tanimlari
│   ├── middleware/       # auth.ts, validate.ts
│   ├── config/          # DB baglantisi, env
│   └── db/              # init.sql, seed.sql, seed-foods.sql
├── mobile/src/
│   ├── screens/         # Tum ekranlar (auth/, home/, meals/, camera/, progress/, profile/, modals/, notifications/)
│   ├── components/      # UI component'leri (chat/, common/, ui/, nutrition/ vb.)
│   ├── services/api/    # Backend API cagrilari (auth.ts, meal.ts, food.ts, tracking.ts vb.)
│   ├── stores/          # Zustand store'lari (authStore, mealStore, messageStore vb.)
│   ├── navigation/      # RootNavigator, MainTabNavigator, types.ts
│   ├── types/           # TypeScript tip tanimlari
│   ├── mock/            # Mock data (KALDIRILACAK)
│   └── lib/             # constants.ts, theme.ts
├── web/src/
│   ├── pages/           # Route-level sayfalar
│   ├── components/      # UI component'leri
│   ├── services/        # API servisleri
│   ├── hooks/           # Custom hook'lar
│   ├── stores/          # Zustand store'lar
│   ├── lib/             # axios.ts, constants.ts
│   └── types/           # Tip tanimlari
├── docker-compose.yml
└── MASTER-PLAN.md       # ANA YOL HARITASI
```

### Baslangic Komutu

Projeyi tani, MASTER-PLAN.md'yi oku, ve Sprint 1 Gorev 1.1'den basla (Dashboard dinamik veri). Her adimi acikla, kodunu yaz, test et.

## PROMPT BITIS
