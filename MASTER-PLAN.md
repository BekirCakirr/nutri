# NutriAI — MASTER PLAN: Projeyi Calisir Hale Getirme

> **Olusturma:** 2026-04-09
> **Hedef:** Sunuma kadar (Mayis sonu 2026) tam calisir proje
> **Kalan sure:** ~7 hafta
> **Calisma modu:** Lokal (deploy yok)
> **Kural:** Her sprint TAMAMEN test edilmeden bir sonrakine gecilmez.

---

## MEVCUT DURUM — ACIMASIZ GERCEK

### Mobil (Hasta Uygulamasi)

| Ozellik | Durum | Kanit |
|---------|-------|-------|
| Login/Register | ✅ CALISIYOR | Gercek API, token persist |
| Ogun ekleme (AddMeal) | ✅ CALISIYOR | POST /meals, food search calisiyor |
| AI foto analiz | ✅ CALISIYOR | Gemini Vision entegre |
| Su/Kilo takibi | ✅ CALISIYOR | POST /tracking/water, /weight |
| Dashboard | ⚠️ YARIM | "Ayse" hardcoded (satir 78), 1650 kcal hardcoded (satir 55) |
| Diyetisyen mesajlasma | ❌ YOK | messageStore + 6 chat component VAR, ekran ve navigasyon YOK |
| Bildirimler | ❌ MOCK | NotificationsScreen mockNotifications kullaniyor (satir 30) |
| Randevu alma | ❌ KABUK | BookAppointmentScreen hardcoded tarih/saat, API cagirisi yok |
| Diyet plani goruntuleme | ⚠️ YARIM | MealPlanViewScreen API cagiriyor ama DayDetail mock kullaniyor |
| Profil | ⚠️ YARIM | Auth store'dan isim geliyor ama stat'lar hardcoded (18, 245, 3.2) |
| 18 Progress ekrani | ❌ DEMO | Hepsi "(Demo)" etiketli, hardcoded mock veri |
| Gamification | ❌ KABUK | Liste API'den geliyor ama XP/streak hardcoded return |
| Tarifler | ⚠️ YARIM | Liste geliyor, favori/detay eksik |
| Alisveris listesi | ⚠️ YARIM | API var ama UI entegrasyonu sig |
| Alerji yonetimi | ❌ KABUK | UI var, API yok |
| Aile modu | ❌ KABUK | API yeni eklendi, UI hala mock |
| Barkod tarama | ❌ KABUK | Placeholder ekran |
| Video gorusme | ❌ KABUK | Placeholder ekran |

### Web (Diyetisyen Paneli)

| Ozellik | Durum | Kanit |
|---------|-------|-------|
| Login | ✅ CALISIYOR | Gercek auth |
| Dashboard | ✅ CALISIYOR | Gercek hasta verisi |
| Hasta listesi | ✅ CALISIYOR | Filtreleme, arama |
| Hasta detay | ⚠️ YARIM | Hasta bilgisi gercek, grafikler hardcoded (satir 61-94) |
| Mesajlasma | ✅ CALISIYOR | REST-based |
| Randevular | ✅ CALISIYOR | CRUD tam |
| Ogun inceleme | ✅ CALISIYOR | Kanban board |
| Plan olusturucu | ✅ CALISIYOR | Drag-drop, gercek food search |
| Tarifler | ✅ CALISIYOR | 6 tarif gorunuyor |
| AI asistan | ✅ CALISIYOR | Gemini gercek yanit |
| Raporlar | ⚠️ YARIM | UI var, PDF indirme butonu onClick YOK (satir 135) |
| Alisveris listeleri | ⚠️ YARIM | Goruntuleme var, olusturma butonu no-op (satir 104) |
| Davet kodu | ⚠️ YARIM | Gosterme var, uretme client-side mock (satir 84-94) |
| Canli takip | ✅ CALISIYOR | Gercek hasta verisinden turetiliyor |
| Bildirimler | ✅ CALISIYOR | Gercek API |
| Ayarlar | ⚠️ YARIM | Profil calisir, calisma saatleri/bildirim kaydetme yok |
| Admin paneli | ✅ CALISIYOR | Dashboard, users, food-db |

---

## MVP TANIMI

> Sunumda gosterilecek senaryo:
>
> 1. Hasta mobilde giris yapar
> 2. Dashboard'da kendi verilerini gorur (isim, kalori hedefi, su, kilo)
> 3. Ogun ekler (foto cekip AI analiz veya manual arama)
> 4. Diyetisyenine mesaj atar
> 5. Diyetisyenin olusturdugu diyet planini gorur
> 6. Bildirimlerini gorur
> 7. ---
> 8. Diyetisyen webde giris yapar
> 9. Hasta listesini gorur
> 10. Hasta detayinda gercek grafikleri gorur
> 11. Ogunu inceler (kanban)
> 12. Diyet plani olusturur
> 13. Hastaya mesaj atar
> 14. AI asistanla konusur
> 15. Rapor gorur / aliveris listesi olusturur

---

## SPRINT PLANI

### ═══════════════════════════════════════════════════════════════
### SPRINT 1: MOBIL TEMEL ISLEVLER (En Kritik)
### ═══════════════════════════════════════════════════════════════

> **Oncelik:** MAKSIMUM — bu olmadan proje sunulamaz
> **Hedef:** Hasta mobilde giris yapip temel islemleri yapabilir
> **Tahmini sure:** 2-3 gun

---

#### 1.1 — Dashboard Dinamik Veri

**Sorun:**
- `DashboardScreen.tsx:78` → kullanici adi "Ayse" hardcoded
- `DashboardScreen.tsx:55` → kalori hedefi 1650 hardcoded
- `DashboardScreen.tsx:57` → protein hedefi 82 hardcoded
- `DashboardScreen.tsx:98` → su hedefi 10 hardcoded (constants'dan)

**Dosyalar:**
- `mobile/src/screens/home/DashboardScreen.tsx`
- `mobile/src/stores/authStore.ts` (user.firstName alinacak)
- `mobile/src/stores/trackingStore.ts` (gunluk ozet alinacak)

**Yapilacak:**
1. `useAuthStore()` dan `user` objesini al
2. Kullanici adini `user.firstName || user.name || 'Kullanici'` olarak goster
3. Kalori hedefini `user.dailyCalorieTarget || user.daily_calorie_target || 2000` ile degistir
4. Protein hedefini `user.proteinTargetG || user.protein_target_g || 100` ile degistir
5. Su hedefini `user.dailyWaterTarget || 8` ile degistir
6. Profil stat'lari (streak, XP, level) icin gamification API'den cek

**Test:**
```
MUST: Ayse ile giris yap
MUST: Dashboard'da "Ayse" degil "Ayşe" gozukmeli (DB'den)
MUST: Kalori hedefi 1750 olmali (seed data'daki deger)
MUST: Su hedefi 8 olmali (seed data)
MUST: Ogun eklediginde kalori progress guncellenmeli
FAIL KRITERI: Herhangi bir hardcoded deger gorulurse GECMEZ
```

---

#### 1.2 — Hasta-Diyetisyen Mesajlasma Ekrani (EN KRITIK)

**Sorun:**
- `messageStore.ts` tam — loadConversations, loadMessages, sendMessage hepsi API'ye bagli
- `components/chat/` altinda 6 component hazir: ChatBubble, ChatInput, ChatHeader, SuggestedQuestions, TypingIndicator, VoiceRecorder
- **ANCAK** bu componentleri kullanan bir ekran YOK
- Navigation'da mesaj ekranina giden bir yol YOK

**Dosyalar (YENI OLUSTURULACAK):**
- `mobile/src/screens/messages/ConversationListScreen.tsx` (YENİ)
- `mobile/src/screens/messages/ChatScreen.tsx` (YENİ)

**Dosyalar (DUZENLENECEK):**
- `mobile/src/navigation/RootNavigator.tsx` — yeni ekranlari ekle
- `mobile/src/navigation/types.ts` — parametre tipleri
- `mobile/src/screens/home/DashboardScreen.tsx` — mesaj butonuna navigasyon ekle

**Yapilacak:**

**a) ConversationListScreen.tsx:**
- `useMessageStore()` dan `loadConversations()` cagir
- Her konusma icin: diyetisyen adi, son mesaj, okunmamis sayisi
- Konusmaya tiklaninca ChatScreen'e git

**b) ChatScreen.tsx:**
- `route.params.conversationId` al
- `loadMessages(conversationId)` cagir
- `ChatBubble` ile mesajlari goster
- `ChatInput` ile mesaj yazma
- `sendMessage(conversationId, content)` ile gonderme
- `markConversationRead(conversationId)` ile okundu isaretle
- Gelen mesaji otomatik goster (store subscription)

**c) Navigation:**
- RootNavigator'a `ConversationList` ve `Chat` ekranlarini ekle
- Dashboard'a "Mesajlar" butonu veya tab bar'a mesaj ikonu ekle
- HomeStack'e ConversationList ekle

**Test:**
```
MUST: Dashboard'dan mesajlar ekranina gecis calisir
MUST: Konusma listesinde Dyt. Elif Kaya gorunur
MUST: Konusmaya tiklaninca mesaj gecmisi yuklenir
MUST: Yeni mesaj yazilip gonderilebilir
MUST: Gonderilen mesaj anlık listeye eklenir
MUST: Web panelinden mesaj atildiginda mobilde gozukur (sayfa yenilenince)
FAIL KRITERI: Mesaj gonderilemiyorsa veya yuklenme hatasi varsa GECMEZ
```

---

#### 1.3 — Bildirimler Gercek API

**Sorun:**
- `NotificationsScreen.tsx:30` → `useState(mockNotifications)` kullaniyor
- Gercek API endpoint `/api/notifications` calisiyor ve veri donuyor

**Dosyalar:**
- `mobile/src/screens/home/NotificationsScreen.tsx`
  (veya `mobile/src/screens/notifications/NotificationsScreen.tsx` — tam yolunu dogrula)

**Yapilacak:**
1. `mockNotifications` importunu kaldir
2. `useEffect` icinde `notificationApi.getNotifications()` cagir
3. Bildirimleri state'e set et
4. Bos durum icin "Bildirim yok" mesaji goster

**Test:**
```
MUST: Bildirimler ekraninda seed data'daki 7 bildirim gorunur
MUST: Mock veri gozukmez
MUST: Bos kullanicida "Bildirim yok" mesaji gosterir
FAIL KRITERI: mockNotifications importu hala varsa GECMEZ
```

---

#### 1.4 — Profil Ekrani Gercek Veri

**Sorun:**
- `ProfileScreen.tsx` → stat'lar (gun, kalori, puan) hardcoded: 18, 245, 3.2

**Dosyalar:**
- `mobile/src/screens/profile/ProfileScreen.tsx`

**Yapilacak:**
1. Auth store'dan user bilgilerini al (isim, email, foto)
2. Gamification API'den streak, total XP al
3. Tracking API'den gun sayisi al (veya streak kullan)
4. Hardcoded degerleri gercek verilerle degistir

**Test:**
```
MUST: Profil ekraninda gercek isim/email gorunur
MUST: Stat sayilari DB'deki degerlerle tutarli
FAIL KRITERI: Hardcoded sayi gorunurse GECMEZ
```

---

#### SPRINT 1 GENEL TEST

```
Senaryo: Ayse ile giris yap
1. Login ekraninda ayse.yilmaz@email.com / ayse1234 gir → Dashboard acilir
2. Dashboard'da "Merhaba, Ayse" (DB'den), kalori hedefi 1750 (DB'den) gorunur
3. Ogun ekle → kalori guncellenir
4. Mesajlar'a git → Elif Kaya ile konusma gorunur
5. Mesaj yaz ve gonder → basariyla gider
6. Bildirimler → 7 bildirim (DB'den)
7. Profil → gercek isim ve istatistikler

TUMU GECMEDEN SPRINT 2'YE GECILMEZ.
```

---

### ═══════════════════════════════════════════════════════════════
### SPRINT 2: MOBIL TAMAMLAMA (Plan + Randevu + Detaylar)
### ═══════════════════════════════════════════════════════════════

> **Oncelik:** YUKSEK — sunumda gosterilecek ikincil akislar
> **Tahmini sure:** 2-3 gun

---

#### 2.1 — Diyet Plani Goruntuleme (DayDetail fix)

**Sorun:**
- `MealPlanViewScreen.tsx` API cagiriyor ✅
- `MealPlanDayDetailScreen.tsx:9,25` → mock meals importu kullaniyor

**Dosyalar:**
- `mobile/src/screens/meals/MealPlanDayDetailScreen.tsx`

**Yapilacak:**
1. Mock import kaldir
2. Route params'dan plan ID ve gun bilgisi al
3. Plan store'dan ilgili gunun ogunlerini filtrele
4. `meal_plan_items` tablosundan gelen veriyi goster

**Test:**
```
MUST: Plan listesinde "Kilo Verme Programi - Hafta 1" gorunur
MUST: Pazartesi'ye tiklaninca 4 ogun gorunur (kahvalti, ogle, aksam, ara)
MUST: Her ogunun kalori/makro bilgisi dogru
FAIL KRITERI: Mock veri gorunurse GECMEZ
```

---

#### 2.2 — Randevu Ekrani Gercek API

**Sorun:**
- `BookAppointmentScreen.tsx:8-22` → hardcoded tarih, saat, tip
- Buton onPress'te API cagirisi yok

**Dosyalar:**
- `mobile/src/screens/modals/BookAppointmentScreen.tsx`
- `mobile/src/services/api/appointment.ts`

**Yapilacak:**
1. Diyetisyenin musait gunlerini API'den cek (dietitian profile → available_days)
2. Saat slotlarini diyetisyen profilinden al (session_duration_min)
3. "Randevu Al" butonuna `appointmentApi.createAppointment()` cagirisi ekle
4. Basarili olusturma sonrasi bildirim goster ve geri don

**Test:**
```
MUST: Musait gunler diyetisyen profilinden geliyor
MUST: Randevu olusturma POST /api/appointments'a gidiyor
MUST: Basarili randevu sonrasi onay mesaji gorunur
MUST: Web panelinde randevu gorunur
FAIL KRITERI: Hardcoded tarih/saat gorunurse GECMEZ
```

---

#### 2.3 — Tarif Detay Ekrani

**Sorun:**
- Tarif listesi geliyor ama `RecipeDetailScreen` tam calismiyor

**Dosyalar:**
- `mobile/src/screens/modals/RecipeDetailScreen.tsx`
- `mobile/src/services/api/recipe.ts`

**Yapilacak:**
1. Route params'dan recipe ID al
2. `recipeApi.getRecipeById(id)` cagir (yoksa ekle: GET /api/recipes/:id)
3. Tarif detayini goster: isim, aciklama, malzemeler, talimatlar, makrolar

**Test:**
```
MUST: Tarif listesinden bir tarife tiklaninca detay acilir
MUST: "Mercimek Corbasi" detayinda 8 malzeme gorunur
MUST: Kalori, protein, karbonhidrat, yag bilgileri dogru
FAIL KRITERI: Bos ekran veya hata gorunurse GECMEZ
```

---

#### 2.4 — Alisveris Listesi Goruntuleme

**Sorun:**
- API bagantisi yarim

**Dosyalar:**
- `mobile/src/screens/modals/ShoppingListDetailScreen.tsx`
- `mobile/src/services/api/shopping.ts`

**Yapilacak:**
1. Shopping list API'den listeyi cek
2. Item'lari check/uncheck yapilabilir hale getir
3. Toplam fiyat goster

**Test:**
```
MUST: "Haftalik Alisveris" listesinde 18 urun gorunur
MUST: Urun check edildiginde UI guncellenir
FAIL KRITERI: Bos liste veya hata gorunurse GECMEZ
```

---

#### SPRINT 2 GENEL TEST

```
Senaryo: Ayse ile giris yap (Sprint 1 testleri hala gecmeli)
1. Diyet plani → "Kilo Verme Programi" gorunur → Pazartesi detayi acilir
2. Randevu al → tarih sec → saat sec → olustur → basarili
3. Tarifler → Mercimek Corbasi detayi → malzemeler ve makrolar gorunur
4. Alisveris listesi → urunler gorunur → check/uncheck calisir

TUMU GECMEDEN SPRINT 3'E GECILMEZ.
```

---

### ═══════════════════════════════════════════════════════════════
### SPRINT 3: WEB EKSIK PARCALAR
### ═══════════════════════════════════════════════════════════════

> **Oncelik:** YUKSEK — web daha iyi durumda ama bazi parcalar kopuk
> **Tahmini sure:** 1-2 gun

---

#### 3.1 — Hasta Detay Grafikleri Gercek Veri

**Sorun:**
- `patient-detail.tsx:61-94` → patientCalorieData, patientWeightData, patientMacroData, patientWaterData hepsi hardcoded

**Dosyalar:**
- `web/src/pages/patient-detail.tsx`

**Yapilacak:**
1. Hasta weight_logs'dan gercek kilo verisi cek (zaten weight endpoint var)
2. Hasta meal_logs'dan haftalik kalori verisi hesapla
3. Hasta meal_logs'dan makro dagılımı hesapla
4. Hasta water_logs'dan su verisi cek
5. Hardcoded array'leri bu gercek verilerle degistir
6. Veri yoksa "Henuz veri yok" mesaji goster

**Test:**
```
MUST: Ayse'nin detayinda 17 kilo kaydinin grafigi gorunur
MUST: Grafik 76.2'den 72.0'a dusen trendi gosterir
MUST: Kalori grafigi son 7 gunun verilerini gosterir
FAIL KRITERI: Hardcoded ornek veri gorunurse GECMEZ
```

---

#### 3.2 — Alisveris Listesi Olusturma

**Sorun:**
- `shopping-lists.tsx:104` → "Olustur" butonu sadece dialog'u kapatiyor
- `shopping.service.ts:11-14` → `createList()` fonksiyonu HAZIR

**Dosyalar:**
- `web/src/pages/shopping-lists.tsx`

**Yapilacak:**
1. Form state'i ekle (title, patientId)
2. Hasta listesini `usePatients()` hook'undan al
3. "Olustur" butonuna `createList({ title, patientId })` cagirisi ekle
4. Basari sonrasi listeyi yenile

**Test:**
```
MUST: Yeni liste olusturma formu acilir
MUST: Hasta secimi gercek hastalardan geliyor
MUST: "Olustur" tiklaninca backend'e POST gider
MUST: Yeni liste sayfada gorunur
FAIL KRITERI: Liste olusturulamiyorsa GECMEZ
```

---

#### 3.3 — Rapor Indirme

**Sorun:**
- `reports.tsx:135` → "PDF Olarak Indir" butonunda onClick YOK
- `report.service.ts:23-29` → `generateReport()` HAZIR

**Dosyalar:**
- `web/src/pages/reports.tsx`

**Yapilacak:**
1. Tarih araligi ve hasta secimi al
2. `generateReport({ patientId, weekStart, weekEnd })` cagir
3. Sonucu goster veya basit bir text rapor olustur
4. PDF yerine sade rapor gorunumu yeterli (sunuma kadar)

**Test:**
```
MUST: Rapor uret butonu tiklaninca backend'e istek gider
MUST: Hasta secilip tarih girilince rapor olusuyor
FAIL KRITERI: Buton hicbir sey yapmiyorsa GECMEZ
```

---

#### 3.4 — Davet Kodu Uretme

**Sorun:**
- `invite-code.tsx:84-94` → Client-side mock kod uretme
- `invite-code.service.ts:22-26` → `generateCode()` fonksiyonu HAZIR

**Dosyalar:**
- `web/src/pages/invite-code.tsx`

**Yapilacak:**
1. `handleGenerate()` icindeki mock kodu kaldir
2. `generateCode()` servisini cagir
3. Gercek kodu UI'da goster
4. Deactivate butonuna da gercek API cagirisi ekle

**Test:**
```
MUST: "Kod Olustur" tiklaninca backend'den gercek kod gelir
MUST: Kod formati "DYT-XXXX-XXXX" seklinde
MUST: Mevcut kod (DYT-ELIF-7X3K) gorunur
FAIL KRITERI: Random client-side kod gorunurse GECMEZ
```

---

#### 3.5 — Ayarlar Sayfasi Kaydetme

**Sorun:**
- Calisma saatleri ve bildirim sekmeleri "Kaydet" butonlari handler'siz

**Dosyalar:**
- `web/src/pages/settings.tsx`

**Yapilacak:**
1. Calisma saatleri formu icin state ekle
2. Kaydet butonuna `updateProfile({ availableDays, sessionDuration })` cagirisi ekle
3. Bildirim tercihleri icin basit localStorage persist yap (backend endpoint yok)

**Test:**
```
MUST: Profil sekmesi kaydedilince backend'e PUT gider
MUST: Calisma saatleri kaydedilince basari mesaji gorunur
FAIL KRITERI: Kaydet butonu hicbir sey yapmiyorsa GECMEZ
```

---

#### SPRINT 3 GENEL TEST

```
Web testi — elif.kaya@nutriai.com ile giris:
1. Hasta detay → Ayse → gercek grafik gorunur (76→72 kilo trendi)
2. Alisveris listesi → yeni liste olustur → basarili
3. Rapor → tarih sec → uret → sonuc gorunur
4. Davet kodu → DYT-ELIF-7X3K gorunur + yeni kod uretilir
5. Ayarlar → profil guncelle → basarili

TUMU GECMEDEN SPRINT 4'E GECILMEZ.
```

---

### ═══════════════════════════════════════════════════════════════
### SPRINT 4: UCTAN UCA ENTEGRASYON TESTI
### ═══════════════════════════════════════════════════════════════

> **Oncelik:** KRITIK — her sey bir arada calismali
> **Tahmini sure:** 1-2 gun

---

#### 4.1 — Tam Senaryo Testi

**Senaryo A: Hasta-Diyetisyen Koprusu**
```
1. [WEB] Elif giris yapar → Dashboard'da 4 hasta gorunur
2. [WEB] Ayse'nin detayina girer → kilo grafigi 76→72 gorunur
3. [WEB] Ayse icin diyet plani olusturur → kaydet
4. [WEB] Ayse'ye mesaj atar: "Planiniz hazir"
5. [MOBIL] Ayse giris yapar → Dashboard'da gercek veriler
6. [MOBIL] Mesajlar → Elif'ten "Planiniz hazir" mesaji gorunur
7. [MOBIL] Mesaja cevap yazar: "Tesekkurler"
8. [MOBIL] Diyet plani → yeni plan gorunur
9. [MOBIL] Ogun ekle → foto cek → AI analiz → kaydet
10. [WEB] Elif ogun inceleme → Ayse'nin yeni ogunu gorunur
```

**Senaryo B: AI Akisi**
```
1. [MOBIL] Ayse kameradan yemek fotosu ceker
2. [MOBIL] AI analiz → yiyecekler tanınır
3. [MOBIL] Porsiyonları onayla → ogun kaydedilir
4. [WEB] AI asistan → "Ayse icin aksam yemegi oner" → Gemini yanit verir
```

#### 4.2 — Kirilan Yerleri Duzelt

- Bu testte kirilacak yerler NOT ALINIR
- Her kirik yer icin fix yapilir
- Fix sonrasi ayni test tekrarlanir

**Test:**
```
MUST: Senaryo A'nin 10 adiminin tamami sorunsuz calismali
MUST: Senaryo B'nin 4 adiminin tamami sorunsuz calismali
FAIL KRITERI: Herhangi bir adim basarisiz olursa fix yapilip tekrar test edilmeli
```

---

### ═══════════════════════════════════════════════════════════════
### SPRINT 5: POLISH + IKINCIL OZELLIKLER (VAKIT KALIRSA)
### ═══════════════════════════════════════════════════════════════

> **Oncelik:** ORTA — MVP tamamlandiktan sonra
> **Tahmini sure:** 1-2 hafta

---

#### 5.1 — Mobil Progress Ekranlarini Canlandir

**Mevcut:** 18 ekran hepsi "(Demo)" etiketli, hardcoded mock veri

**Oncelikli 5 ekran (gercek API ile calisir):**
1. **WeightScreen** → weight_logs tablosundan grafik
2. **WaterScreen** → water_logs tablosundan grafik
3. **CalorieHistoryScreen** → meal_logs tablosundan hesapla
4. **ExerciseScreen** → exercise_logs tablosundan
5. **SleepScreen** → sleep_logs tablosundan

**Kalan 13 ekran → Demo kalabilir** (sunumda gosterilmez)

**Yapilacak:**
- Her ekran icin ilgili tracking endpoint'inden veri cek
- "(Demo)" etiketini kaldir
- Gercek grafik goster

---

#### 5.2 — Gamification Canlandir

**Mevcut:** Badge listesi geliyor ama XP ekleme/streak guncelleme mock

**Yapilacak:**
- Ogun eklendiginde XP ekle (backend'de xp_history'ye kayit)
- Streak otomatik guncelle
- Badge kazanma mantigi (basit: streak 3,7,30 gun kontrolu)
- BadgesScreen'de kazanilan/kazanilmamis ayrimi goster

---

#### 5.3 — Mobil Alerji Yonetimi

**Yapilacak:**
- AllergyManagementScreen → patient_allergies tablosundan cek
- Yeni alerji ekle/sil
- Ogun eklerken alerji uyarisi goster

---

#### 5.4 — Web Canli Takip WebSocket

**Mevcut:** REST polling her 30 saniye

**Yapilacak:**
- Socket.io baglantisi kur
- Hasta ogun eklediginde anlik bildirim
- Canli Dashboard guncellemesi

---

#### 5.5 — Web Video Gorusme (Bonus)

**Mevcut:** Placeholder ekran

**Yapilacak:**
- Jitsi Meet embed (veya basit bir "Gorusme baslat" linki)
- Randevu tipine gore "Online" butonunda link ac

---

#### 5.6 — Diger Iyilestirmeler

| Is | Aciklama |
|----|----------|
| Dark mode fix (mobil) | Tema gecisi calisiyor mu kontrol et |
| Profil foto yukleme | Multer + foto gosterimi |
| Barkod tarama | OpenFoodFacts API entegrasyonu |
| Sesli giris | expo-speech entegrasyonu |
| PDF rapor export | Gercek PDF olusturma (pdfkit/jspdf) |
| Aile modu UI | Aile uyeleri ekleme/gosterme |
| Sunum materyali | Demo videosu, mimari diyagram |

---

## ZAMAN CIZELGESI

| Hafta | Tarih | Sprint | Odak |
|-------|-------|--------|------|
| 1 | 9-13 Nisan | **Sprint 1** | Mobil temel: Dashboard + Mesajlasma + Bildirim + Profil |
| 2 | 14-18 Nisan | **Sprint 2** | Mobil tamamlama: Plan + Randevu + Tarif + Alisveris |
| 3 | 21-25 Nisan | **Sprint 3** | Web eksikler: Grafikler + Olusturma + Rapor + Davet kodu |
| 3.5 | 25-27 Nisan | **Sprint 4** | Uctan uca test + bug fix |
| 4-5 | 28 Nisan - 9 Mayis | **Sprint 5** | Progress ekranlari + Gamification + Polish |
| 6 | 12-16 Mayis | **Sunum hazirlik** | Demo senaryosu + yedek video + materyal |
| 7 | 19-23 Mayis | **Tampon** | Son duzeltmeler |

---

## TEST HESAPLARI

| Rol | E-posta | Sifre | Aciklama |
|-----|---------|-------|----------|
| Diyetisyen | elif.kaya@nutriai.com | elif1234 | Web paneli test |
| Hasta | ayse.yilmaz@email.com | ayse1234 | Mobil test (ana) |
| Hasta 2 | mehmet.kaya@email.com | ayse1234 | Mobil test (ikincil) |
| Admin | admin@nutriai.com | admin123 | Admin paneli |

---

## CALISMA KURALLARI

1. **Her sprint sonunda E2E test yapilir** — test gecmeden sonraki sprinte gecilemez
2. **Her fonksiyon icin "MUST" test kriterleri var** — kriterler karsilanmadan "bitti" denmez
3. **Hicbir mock/hardcoded veri kabul edilmez** — gercek API'den gelmeyen veri = eksik
4. **Mobilde her degisiklik sonrasi telefondan test edilir** — sadece tsc --noEmit yetmez
5. **Web'de her degisiklik sonrasi tarayicida test edilir** — build gecmesi yetmez
6. **Circular dependency, console error → KABUL EDILMEZ** — temiz console

---

## BASARI KRITERI

### MVP Tamamlandi Sayilmasi Icin (Sprint 1-4):
- [ ] Mobil: Hasta giris yapar, dashboard'da gercek verileri gorur
- [ ] Mobil: Ogun ekleme (manual + AI foto) calisir
- [ ] Mobil: Diyetisyenle mesajlasma calisir (gonder + al)
- [ ] Mobil: Diyet plani goruntulenebilir
- [ ] Mobil: Bildirimler gercek API'den
- [ ] Mobil: Randevu alinabilir
- [ ] Mobil: Profil gercek veri gosterir
- [ ] Web: Hasta detayinda gercek grafikler
- [ ] Web: Alisveris listesi olusturulabilir
- [ ] Web: Rapor uretilebilir
- [ ] Web: Davet kodu gercek API'den
- [ ] Web-Mobil: Mesaj attim → karsida gorundu (bidirectional)
- [ ] Web-Mobil: Plan olusturdum → hastada gorundu

### Tam Proje Sayilmasi Icin (Sprint 5 dahil):
- [ ] 5 progress ekrani gercek veriyle calisir
- [ ] Gamification (XP, badge, streak) calisir
- [ ] Alerji yonetimi calisir
- [ ] 0 console hatasi
- [ ] Tum ekranlar arasinda tutarli navigasyon

---

## NOTLAR

- **Deploy YAPILMAYACAK** — sadece lokal calisacak
- **Dark mode ONCELIKLI DEGIL** — vakit kalirsa Sprint 5'te
- **Barkod tarama ONCELIKLI DEGIL** — vakit kalirsa Sprint 5'te
- **Video gorusme ONCELIKLI DEGIL** — vakit kalirsa Sprint 5'te
- **18 progress ekraninin 13'u demo kalabilir** — sunumda gosterilmez
- **Bu dosya projenin ANA YOL HARITASIDIR** — her calisma oturumunda bu dosya referans alinir
