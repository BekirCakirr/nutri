# NutriAI — Devam Noktasi

> Son Guncelleme: 2026-03-17
> Bu dosyayi bana okutarak kaldigimiz yerden devam edebilirsin.

---

## Proje Ozeti

NutriAI, Turkce konusan diyetisyenler icin yapay zeka destekli beslenme takibi ve hasta yonetim platformu. Web paneli + mobil uygulama + backend olmak uzere 3 katmandan olusuyor.

**Tech Stack:**
- Web: React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + Vite 7
- Mobil: React Native + Expo + NativeWind v4
- Backend: Node.js + Express (henuz baslangic asamasinda)
- Ortak: Zustand (state), React Hook Form + Zod, Recharts, Lucide icons

---

## Tamamlanan Calisma Gecmisi

### Adim 1: Proje Altyapisi (Commit: d088944 — 8fc711b)
- Monorepo yapisi (`web/`, `mobile/`, `backend/`, `shared/`)
- Web paneli icin tam sayfa yapisi, routing, layout sistemi
- shadcn/ui bilesenleri, tema token'lari, dark mode
- Zustand store'lari, mock data, TypeScript tipleri
- Mobil uygulama icin Expo + NativeWind kurulumu

### Adim 2: Mobil Uygulama Ekranlari (Commit: 7d862b7 — 47b2fee)
Toplam **82 mobil ekran** sifirdan kodlandi:

| Grup | Ekran Sayisi |
|------|-------------|
| Auth (Login, Register, Forgot...) | 5 |
| Onboarding (7 adimli akis) | 7 |
| Home (Dashboard, Bildirimler, Raporlar) | 4 |
| Meals (Ogun ekleme, gecmis, favoriler) | 10 |
| Camera (Fotograf, barkod, OCR, sesli) | 8 |
| Progress (Kilo, su, egzersiz, uyku, makro...) | 18 |
| Profile (Profil, ayarlar, alerji, cihazlar...) | 20 |
| Modals (AI chat, rozetler, liderlik tablosu...) | 10 |
| **TOPLAM** | **82** |

### Adim 3: Web Panel — Faz 0 Temizlik (Commit: 53ca29c)
- Yanlis silinen 10 mobil ekran geri yuklendi
- Web tarafina `@hello-pangea/dnd` paketi eklendi
- Dosya yapisi duzenlendi

### Adim 4: Web Panel — Faz 1 + 2 + 3 Polish (SON OTURUM)

#### Faz 1: Plan Creator Drag-and-Drop
- `plan-creator.tsx` sayfasina tam drag-and-drop destegi eklendi
- `sampleItems` const'tan `useState`'e donusturuldu (mutable state)
- `DragDropContext` + `Droppable` + `Draggable` entegrasyonu
- Ayni slot ici siralama + slotlar arasi tasima
- Drop zone gorunumu: `bg-primary/5 border-dashed border-primary/20`
- Bos slot'lara da surukleme destegi
- `weekSummary` useMemo'nun items state'ine bagimli hale getirilmesi

#### Faz 2A: Skeleton Bilesen Kutuphanesi
Yeni dosya: `web/src/components/shared/page-skeletons.tsx`

7 farkli skeleton bileseni olusturuldu:
- `ListPageSkeleton` — Tablo/liste sayfalari icin
- `DetailPageSkeleton` — Detay sayfalari icin
- `DashboardSkeleton` — Dashboard/rapor sayfalari icin
- `ChatSkeleton` — Mesajlasma sayfalari icin
- `CalendarSkeleton` — Takvim sayfasi icin
- `PlanCreatorSkeleton` — Plan olusturucu icin
- `FormPageSkeleton` — Form sayfalari icin

#### Faz 2B: Loading State (24 sayfa)
Tum sayfalara 400ms skeleton loading pattern eklendi:

| Skeleton Tipi | Sayfalar |
|---------------|----------|
| ListPageSkeleton | patient-list, recipes, shopping-lists, reviews, notifications, admin/users, admin/dietitians, admin/food-db, admin/allergens, admin/recipes |
| DetailPageSkeleton | patient-detail, recipe-detail, patient-report, meal-review |
| DashboardSkeleton | admin/dashboard, reports, admin/reports, live-tracking |
| ChatSkeleton | messages, ai-assistant |
| CalendarSkeleton | appointments |
| PlanCreatorSkeleton | plan-creator |
| FormPageSkeleton | invite-code, settings |

#### Faz 2C: Empty State (13 sayfa)
Filtreleme sonucu bos liste dondugunde `EmptyState` bileseni gosteriliyor:
- patient-list, recipes, appointments, live-tracking, messages, meal-review
- admin/users, admin/dietitians, admin/food-db, admin/allergens, admin/recipes

#### Faz 3: Responsive Iyilestirmeler
- **Messages:** Mobilde conversation list / chat toggle (mobileView state)
- **Patient List:** Mobilde tablo yerine kart gorunumu (md altinda)
- **Plan Creator:** TabsList yatay scroll (flex overflow-x-auto)

**Build:** `vite build` hatasiz tamamlandi.

---

## Dosya Degisiklikleri Ozeti (Son Oturum)

| Islem | Dosya Sayisi |
|-------|-------------|
| Yeni dosya | 1 (page-skeletons.tsx) |
| Degistirilen sayfa | 24 |
| Responsive eklenen | 3 (messages, patient-list, plan-creator) |
| **Toplam etkilenen** | **28** |

---

## Yol Haritasi — Bundan Sonra Yapilacaklar

### Adim 5: Web Panel — Ileri Duzey Polish
- [ ] Tema tutarliligi auditi (renk token'lari, spacing, radius)
- [ ] Animasyon/mikro-etkilesim iyilestirmeleri
- [ ] Accessibility auditi (WCAG AA, klavye navigasyonu, ARIA)
- [ ] Performance optimizasyonu (lazy loading, bundle analizi)
- [ ] Dark mode fine-tuning (tum sayfalarda test)

### Adim 6: Backend Baslangici
- [ ] Node.js + Express API yapilandirmasi
- [ ] PostgreSQL veritabani semasi tasarimi
- [ ] JWT Auth (login, register, token refresh)
- [ ] Temel CRUD endpoint'leri:
  - Hastalar (CRUD + filtreleme + sayfalama)
  - Ogunler (kayit + onaylama + reddetme)
  - Diyet planlari (olusturma + atama)
  - Randevular (CRUD + takvim)
  - Mesajlar (gonderme + alma + okundu bilgisi)
- [ ] Dosya yukleme (ogun fotograflari)
- [ ] WebSocket altyapisi (canli takip + mesajlasma)

### Adim 7: Web + Backend Entegrasyon
- [ ] Mock data'dan gercek API'ye gecis
- [ ] Zustand store'larin API service'lere baglanmasi
- [ ] Auth akisi (login/register/logout)
- [ ] Form validasyon + hata yonetimi
- [ ] Loading/error state'lerinin gercek API yanıtlarina baglanmasi

### Adim 8: Mobil + Backend Entegrasyon
- [ ] React Native tarafinda API service katmani
- [ ] Mobil auth akisi
- [ ] Push notification altyapisi
- [ ] Offline-first stratejisi (AsyncStorage + sync)

### Adim 9: AI Entegrasyonu
- [ ] NutriAI asistan icin LLM API entegrasyonu
- [ ] Ogun fotografi analizi (vision API)
- [ ] Otomatik diyet plani onerisi
- [ ] Barkod/OCR besin tespiti

### Adim 10: Test + Deploy
- [ ] Unit test'ler (Vitest + React Testing Library)
- [ ] E2E test'ler (Playwright)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Docker containerization
- [ ] Production deployment

---

## Teknik Notlar

- **Korunan dosyalar:** `stores/`, `hooks/`, `services/`, `mock/`, `types/`, `lib/`, `shared/types/` — bu dizinler degistirilmez
- **UI dili:** Tum arayuz metinleri Turkce, profesyonel/medikal ton
- **Tasarim felsefesi:** "Organik Profesyonel" — botanik referans kitabi + modern saglik dashboard'u
- **Font:** Outfit | **Renkler:** OKLCH tabanli, orman yesili primary | **Radius:** 10px
- **NativeWind v4:** Mobilde tum ekranlar `className` prop'u ile Tailwind kullaniyor

---

## Devam Etmek Icin

> "Bu dosyayi oku ve Adim 5'ten (Web ileri duzey polish) devam et."

veya

> "Bu dosyayi oku ve Adim 6'dan (Backend baslangici) devam et."
