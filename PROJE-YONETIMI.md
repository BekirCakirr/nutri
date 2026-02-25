# NutriAI - Proje Yönetimi

> Son Güncelleme: 2026-02-25
> Durum: Geliştirme Aşaması - Faz 1 tamamlandı, Faz 2 devam ediyor

---

## Genel Bakış

NutriAI, AI destekli bir beslenme takip ve yönetim platformu. Üç ana bileşen:

| Bileşen | Teknoloji | Durum |
|---------|-----------|-------|
| **web/** — Diyetisyen Paneli | React + Vite + TailwindCSS + shadcn/ui | ✅ Çalışıyor (build geçiyor) |
| **mobile/** — Hasta Uygulaması | Expo + React Native + TypeScript | ⚠️ Altyapı tamam, ekranlar placeholder |
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
- [ ] **82 ekranın hepsi placeholder** (sadece View + Text)

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
| Dashboard | ~188 | ⚠️ Temel | Stat kartları + aktivite listesi var ama grafik yok |
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

**HEPSİ PLACEHOLDER.** Her ekran sadece:
```tsx
<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
  <Text>Ekran Adı</Text>
</View>
```

Öncelikli ekranlar (implementasyon sırası):

| Öncelik | Ekran Grubu | Ekran Sayısı | Durum |
|---------|-------------|-------------|-------|
| 🔴 P0 | Auth (Login, Register, Welcome) | 3 | ❌ Placeholder |
| 🔴 P0 | Onboarding (7 adım) | 7 | ❌ Placeholder |
| 🔴 P0 | Home Dashboard | 1 | ❌ Placeholder |
| 🟠 P1 | Meal (MealLog, AddMeal, FoodSearch) | 5 | ❌ Placeholder |
| 🟠 P1 | Camera (CameraCapture, PhotoAnalysis) | 3 | ❌ Placeholder |
| 🟡 P2 | Progress (Weight, Water, Exercise) | 5 | ❌ Placeholder |
| 🟡 P2 | Profile (Profile, Settings) | 3 | ❌ Placeholder |
| 🟢 P3 | Dietitian (Chat, Appointments) | 4 | ❌ Placeholder |
| 🟢 P3 | Gamification (Badges, Challenges) | 4 | ❌ Placeholder |
| ⚪ P4 | Recipes, Shopping, Reports vb. | Kalan | ❌ Placeholder |

---

## Faz 3: Profesyonelleştirme 📋 PLANLANMIŞ

### Web İyileştirmeleri
- [ ] Dashboard'a Recharts grafikleri ekle (kalori uyumu, hasta dağılımı, aylık büyüme)
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
- [ ] 82 placeholder ekranı gerçek UI ile değiştir
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

1. **Web dashboard'u zenginleştir** — Recharts grafikleri, daha iyi layout
2. **Mobil P0 ekranları implemente et** — Login, Register, Dashboard, Onboarding
3. **Web'deki temel sayfaları iyileştir** — Grafik ekle, UX geliştir
4. **Mobil P1 ekranları** — Meal logging, camera, food search
5. **Backend başlangıcı** — Auth API + basic CRUD endpoints
