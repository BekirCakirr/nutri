# NutriAI — Yapay Zeka Destekli Beslenme Takibi ve Diyetisyen Yonetim Platformu

## Proje Tanitimi

**NutriAI**, diyetisyenler ve hastalar arasindaki beslenme takibi surecini dijitallestiren, yapay zeka destekli kapsamli bir saglik platformudur. Platform; diyetisyenlere yonelik bir **web paneli**, hastalara yonelik bir **mobil uygulama**, tum is mantigi ve veri yonetimini saglayan bir **backend API** ve platform genelinde tutarli veri modellemesi icin **paylasimli tip sistemi** olmak uzere dort ana katmandan olusmaktadir.

---

## Problem Tanimi ve Motivasyon

Geleneksel beslenme takibi sureclerinde diyetisyenler ve hastalar ciddi zorluklar yasamaktadir:

- **Diyetisyenler icin:** Hasta takibi buyuk olcude manuel yurumekte, ogun kayitlari kagit uzerinde veya dagitik mesajlasma uygulamalari araciligiyla toplanmakta, diyet planlari statik dosyalar seklinde hazilanmakta ve hasta ilerlemesi ancak yuz yuze gorusmelerde degerlendirilmektedir. Bu durum diyetisyenin ayni anda takip edebildigi hasta sayisini sinirlandirmakta ve verimli bir klinik surec yurutulememektedir.

- **Hastalar icin:** Ogun kaydi zahmetli bir is olup cogu zaman aksatilmakta, besinlerin icerigini manuel olarak arastirmak motivasyon dusukluune yol acmakta, diyetisyenle iletisim sinirli kalmakta ve ilerlemenin somut olarak goruntulenmemesi tedaviye baglilik oranini dusurmektedir.

**NutriAI** bu problemleri; yapay zeka ile otomatik ogun tanima, gercek zamanli iletisim, interaktif diyet planlama, kapsamli ilerleme takibi ve oyunlastirma mekanizmalari ile cozmektedir.

---

## Hedef Kitle

| Kullanici Rolu | Platform | Profil |
|----------------|----------|--------|
| **Diyetisyen** | Web Paneli | 30-55 yas arasi klinik diyetisyenler, ayni anda birden fazla hasta takip eden profesyoneller |
| **Hasta (Danisan)** | Mobil Uygulama | Diyet programi takip eden, beslenme aliskanliklari izlenmek istenen bireyler |
| **Admin** | Web Paneli | Besin veritabanini yoneten, diyetisyen onaylarini yapan sistem yoneticileri |

---

## Sistem Mimarisi

```
+-------------------+     +-------------------+     +-------------------+
|                   |     |                   |     |                   |
|   Web Paneli      |     |   Mobil Uygulama  |     |   Admin Paneli    |
|   (Diyetisyen)    |     |   (Hasta)         |     |   (Yonetici)      |
|                   |     |                   |     |                   |
|   React 19        |     |   React Native    |     |   React 19        |
|   Tailwind CSS 4  |     |   Expo 54         |     |   Tailwind CSS 4  |
|   shadcn/ui       |     |                   |     |   shadcn/ui       |
+--------+----------+     +--------+----------+     +--------+----------+
         |                          |                          |
         +----------+---------------+--------------------------+
                    |
                    v
         +----------+----------+
         |                     |
         |    Backend API      |
         |    Express.js       |
         |    TypeScript       |
         |    Socket.io        |
         |                     |
         +----------+----------+
                    |
         +----------+----------+
         |                     |
         |    PostgreSQL 16    |
         |    Veritabani       |
         |                     |
         +---------------------+
```

### Katmanlar Arasi Veri Akisi

1. **Paylasimli Tip Sistemi (Shared Types):** Web, mobil ve backend arasinda tutarli veri modeli saglar. 8 enum, 30+ interface ve kapsamli tip tanimlari icerir.
2. **RESTful API:** Tum CRUD islemleri standart HTTP endpoint'leri uzerinden gerceklesir.
3. **WebSocket (Socket.io):** Mesajlasma, bildirimler ve canli takip icin gercek zamanli iki yonlu iletisim saglar.
4. **JWT Kimlik Dogrulama:** Access token + refresh token deseni ile guvenli oturum yonetimi uygulanir.

---

## Teknoloji Yigini

### Web Paneli (Diyetisyen + Admin)
| Teknoloji | Amac |
|-----------|------|
| React 19 + TypeScript | Bilesen tabanli kullanici arayuzu |
| Vite 7 | Hizli gelistirme sunucusu ve uretim derlemesi |
| Tailwind CSS 4 | Utility-first CSS cercevesi |
| shadcn/ui (Radix UI) | Erisilebilir, ozelestirilebilir UI ilkel bilesenleri |
| Zustand | Hafif ve performansli durum yonetimi |
| React Hook Form + Zod | Form yonetimi ve sema tabanli dogrulama |
| Recharts | Interaktif veri gorsellestirme grafikleri |
| Lucide React | Tutarli ikon kutuphanesi |
| Socket.io Client | Gercek zamanli iletisim istemcisi |
| Axios | HTTP istemcisi |

### Mobil Uygulama (Hasta)
| Teknoloji | Amac |
|-----------|------|
| React Native + Expo 54 | Platformlar arasi mobil uygulama |
| React Navigation | Sayfa yonlendirme (Stack, Bottom Tabs) |
| Zustand | Durum yonetimi |
| Axios | API iletisimi |
| Socket.io Client | Gercek zamanli bildirimler |
| AsyncStorage | Yerel veri saklama |
| i18n | Cok dilli destek (Turkce / Ingilizce) |

### Backend
| Teknoloji | Amac |
|-----------|------|
| Node.js + Express | API sunucusu |
| TypeScript | Tip guvenligi |
| PostgreSQL 16 | Iliskisel veritabani |
| Socket.io | WebSocket sunucusu |
| JWT + bcrypt | Kimlik dogrulama ve sifre hashleme |
| Zod | Istek dogrulama |
| Multer | Dosya yukleme |
| Docker Compose | Konteyner tabanli dagitim |

---

## Veritabani Tasarimi

Veritabani PostgreSQL 16 uzerinde calismakta olup toplam **27+ tablo** icermektedir. Tablolar asagidaki kategorilere ayrilmistir:

### Kullanici ve Kimlik (3 tablo)

- **users** — Temel kullanici bilgileri (e-posta, sifre, rol, dogrulama durumu)
- **patient_profiles** — Hasta profili (dogum tarihi, cinsiyet, boy, kilo, aktivite duzeyi, hedef tipi, BMR/TDEE hesaplamalari, makro hedefleri, XP puanlari, seviye, seri)
- **dietitian_profiles** — Diyetisyen profili (lisans numarasi, uzmanliklar, universite, deneyim yili, klinik adi, davet kodu, maks hasta sayisi, seans ucreti, onay durumu, ortalama puan)

### Iliskiler ve Degerlendirme (3 tablo)

- **dietitian_patients** — Diyetisyen-hasta eslesmesi (durum, esleme yontemi, baslangic/bitis tarihi)
- **dietitian_reviews** — Hasta degerlendirmeleri (1-5 puan, yorum, anonim secenegi)
- **refresh_tokens** — Oturum token yonetimi

### Alerji ve Saglik (4 tablo)

- **allergens** — Alerjen katalogu (isim, kategori, capraz reaksiyonlar)
- **patient_allergies** — Hasta alerjileri (siddet derecesi: hafif/orta/siddetli/anafilaktik)
- **patient_conditions** — Tibbi durumlar (tani tarihi, ilaclar, doktor bilgisi)
- **blood_values** — Kan degerleri (glukoz, kolesterol, demir, B12, D vitamini, hemoglobin vb.)

### Besin ve Ogunler (3 tablo)

- **foods** — Besin veritabani (isim, kategori, 100g basina makro/mikro besin degerleri, alerjen bilgisi, barkod, mevsim, tahmini fiyat)
- **meal_logs** — Ogun kayitlari (ogun tipi, giris yontemi, fotograf, AI analizi, toplam besin degeri, ruh hali, aclik seviyesi, diyetisyen geri bildirimi)
- **meal_items** — Ogun icindeki besinler (AI tahmini miktar, kullanici duzeltmesi, hesaplanan besin degeri, alerjen uyarisi)

### Diyet Planlari (2 tablo)

- **meal_plans** — Plan basligi (hasta, olusturan diyetisyen, tarih araligi, gunluk hedefler, butce dostu secenegi, tahmini haftalik maliyet)
- **meal_plan_items** — Plan icerikleri (haftanin gunu, ogun tipi, besin, miktar, alternatifler)

### Oyunlastirma (4 tablo)

- **badges** — Rozet tanimlari (kategori, gereksinim, XP odulu)
- **patient_badges** — Kazanilan rozetler
- **weekly_challenges** — Haftalik meydan okumalar (hedef deger, XP odulu)
- **patient_challenges** — Meydan okuma ilerlemesi
- **xp_history** — XP islem gecmisi (ogun kaydi, foto yukleme, seri bonusu, rozet kazanma vb.)

### Takip ve Analitik (5 tablo)

- **weight_logs** — Kilo kayitlari (olcum tarihi, fotograf)
- **water_logs** — Su tuketimi (bardak sayisi)
- **exercise_logs** — Egzersiz kayitlari (tip, sure, yakilan kalori, yogunluk)
- **sleep_logs** — Uyku verileri (yatis/kalkis saati, kalite)
- **progress_photos** — Ilerleme fotograflari (on/yan/arka gorunum)

### Iletisim (4 tablo)

- **conversations** — Sohbet konulari
- **conversation_participants** — Katilimcilar
- **messages** — Mesajlar (metin, gorsel, dosya, ses, video, ogun kaydi, plan guncelleme, sistem mesaji)
- **notifications** — Bildirimler (randevu, mesaj, hedef ilerlemesi, ogun hatirlatma, basarim vb.)
- **appointments** — Randevular (tarih, saat, sure, tip, durum, Jitsi oda kimligi)

### Tarif ve Alisveris (3 tablo)

- **recipes** — Tarif katalogu (malzemeler, besin degeri, zorluk, alerjen bilgisi, mevsim, maliyet)
- **shopping_lists** — Alisveris listeleri (plan baglantisi, paylasim kodu, tahmini toplam)
- **shopping_list_items** — Liste kalemleri (kategori, kontrol durumu, fiyat tahmini)

### AI ve Raporlar (2 tablo)

- **ai_chat_history** — AI sohbet gecmisi (rol, icerik, meta veri)
- **ai_weekly_reports** — Haftalik otomatik raporlar (rapor icerigi, PDF, diyetisyene gonderim durumu)

### Veritabani Ozellikleri

- UUID birincil anahtarlar (tutarli ve guvenli kimliklendirme)
- TIMESTAMPTZ (saat dilimi duyarli zaman damgalari)
- JSONB (esnek veri yapilari: malzemeler, meta veri, AI analiz sonuclari)
- 23 performans indeksi (hasta, ogun, randevu, bildirim aramalari icin)
- Otomatik `updated_at` tetikleyicileri
- Yabanci anahtar basamakli silme kurallari

---

## Web Paneli Ozellikleri (Diyetisyen Arayuzu)

Web paneli, diyetisyenlerin tum klinik is akislarini tek bir platformdan yonetebilecegi kapsamli bir yonetim panelidir. Toplam **23 sayfa** ve **155+ bilesen** icermektedir.

### 1. Gosterge Paneli (Dashboard)

Ana giris ekrani olup diyetisyene gunun ozetini sunar:
- Toplam hasta sayisi, bugunun randevulari, bekleyen ogun incelemeleri
- Hasta aktivite dagilimlari (grafikler)
- Son bildirimler ve uyarilar
- Hizli erisim kisayollari

### 2. Hasta Yonetimi

**Hasta Listesi:**
- Tum hastalarin tablo ve kart gorunumu
- Arama, filtreleme (duruma, hedefe, aktivite seviyesine gore)
- Sayfalama destegi

**Hasta Detay Sayfasi (7 sekme):**
- **Genel Bakis** — Hasta ozet bilgileri, saglik metrikleri, BMI gostergesi
- **Beslenme** — Gunluk kalori/makro takibi, ogun gecmisi, besin degeri analizi
- **Diyet Plani** — Aktif plan goruntuleme, plan gecmisi
- **Raporlar** — Hasta bazli ilerleme raporlari, grafikler
- **Randevular** — Gecmis ve gelecek randevular
- **Mesajlar** — Hasta ile dogrudan mesajlasma
- **Notlar** — Diyetisyen ozel notlari, zaman cizelgesi

### 3. Ogun Inceleme

Hastalarin gonderdigi ogun kayitlarini inceleme ve geri bildirim verme:
- Bekleyen ogun kuyruugu
- Fotograf ve AI analiz sonucu goruntuleme
- Besin degeri dogrulamasi
- Diyetisyen notu ve onay/red mekanizmasi

### 4. Diyet Plani Olusturucu

Surukle-birak tabanli gorsel plan olusturma araci:
- 7 gunluk haftalik plan tasarimi
- Gun bazli ogun yuvalari (kahvalti, ara ogun, ogle, ikindi, aksam, gece)
- Besin arama ve ekleme (veritabanindan)
- AI onerisi entegrasyonu (yapay zeka tabanli plan tavsiyeleri)
- Gunluk/haftalik besin degeri ozet paneli
- Sablon secimi (hazir plan sablonlari)
- Alternatif besin onerileri
- Hasta secici (plani atayacak hasta)

### 5. Canli Takip

Hastalarin anlik durumunu izleme paneli:
- Aktif hastalarin gunluk kalori ilerlemesi
- Su tuketimi durumu
- Ogun kayit zamanlamalari
- Durum gostergeleri (hedefte, geride, ileride)
- Izgara gorunumunde hasta kartlari

### 6. Mesajlasma Sistemi

Iki panelli profesyonel sohbet arayuzu:
- Sol panel: Konusma listesi (son mesaj, okunmamis sayaci)
- Sag panel: Aktif sohbet alani
- Metin, gorsel, dosya, ses mesaji destegi
- Yazma gostergesi (typing indicator)
- Gercek zamanli mesaj iletimi (Socket.io)
- Ogun kaydi ve plan guncelleme mesajlari (ozel mesaj tipleri)

### 7. Randevu Yonetimi

- Takvim ve liste gorunumu
- Yeni randevu olusturma diyalogu
- Zaman dilimi secici
- Randevu durumu takibi (beklemede, onaylandi, tamamlandi, iptal)
- Goruntulu gorusme entegrasyonu (Jitsi)

### 8. Goruntulu Gorusme

- Tam ekran video arayuzu
- Kamera ve mikrofon kontrolleri
- Ekran paylasimi
- Gorusme zamanlayicisi
- Hasta bilgi paneli

### 9. Davet Kodu Yonetimi

Diyetisyenlerin hastalari platforma davet etme mekanizmasi:
- Benzersiz davet kodu olusturma
- QR kod goruntuleme ve paylasma
- Kod kullanim istatistikleri
- Aktif/pasif kod yonetimi

### 10. Tarif Kutuphanesi

- Kategori bazli tarif listeleme (izgara gorunum)
- Tarif detay sayfasi (malzemeler, yapilis adimlari)
- Besin degeri bilgisi
- Zorluk derecesi, hazirlama/pisirme suresi
- Alerjen uyarilari
- Tahmini maliyet

### 11. Alisveris Listesi

- Diyet planindan otomatik liste olusturma
- Kategori bazli gruplama
- Kalem kontrol (isaretleme)
- Paylasim kodu ile hasta ile paylasma
- Tahmini toplam maliyet

### 12. Raporlama

- Hasta bazli ilerleme raporlari
- Haftalik/aylik karsilastirmali grafikler
- Besin degeri uyum tablolari
- Kilo degisim trendi
- PDF ve CSV disa aktarim
- Filtreleme (tarih araligi, rapor tipi)

### 13. AI Asistan

Diyetisyenin kullanabilecegi yapay zeka sohbet arayuzu:
- Soru-cevap formati
- Hazir prompt butonlari
- Beslenme onerileri
- Hasta analiz destegi

### 14. Bildirim Merkezi

- Tum bildirim turleri (randevu, mesaj, plan guncelleme, hedef ilerlemesi, ogun hatirlatma, basarim, sistem)
- Okundu/okunmadi durumu
- Filtreleme

### 15. Ayarlar

- Profil duzenleme
- Bildirim tercihleri
- Tema secimi (acik/koyu mod)
- Dil secimi
- Guvenlik ayarlari

---

## Web Paneli Ozellikleri (Admin Arayuzu)

Admin paneli, platform genelindeki icerik ve kullanici yonetimini saglayan 7 sayfalik bir yonetim moduludur.

### 1. Admin Gosterge Paneli
- Toplam kullanici, diyetisyen ve hasta sayilari
- Sistem sagligi gostergeleri
- Son kayitlar

### 2. Besin Veritabani Yonetimi
- Besin ekleme, duzenleme, silme (CRUD)
- 100g basina makro/mikro besin degeri girisi
- Barkod eslestirme
- Alerjen isaretleme
- Dogrulama durumu

### 3. Alerjen Veritabani
- Alerjen katalogu yonetimi
- Kategori bazli gruplama (besin alerjisi, intolerans, ilac, cevresel)
- Capraz reaksiyon tanimlari

### 4. Tarif Moderasyonu
- Topluluk tarifleri onay kuyruugu
- Icerik inceleme ve duzenleme
- Yayin/red karari

### 5. Diyetisyen Yonetimi
- Diyetisyen listesi ve onay sureci
- Lisans dogrulama
- Hesap durumu yonetimi

### 6. Kullanici Yonetimi
- Tum kullanici turleri icin liste ve arama
- Hesap durumu (aktif, askida, engellenmis)
- Rol yonetimi

### 7. Sistem Raporlari
- Kullanim istatistikleri
- Platform performans metrikleri

---

## Mobil Uygulama Ozellikleri (Hasta Arayuzu)

Mobil uygulama, hastalarin gunluk beslenme takibini kolaylastiran, 5 ana sekmeli bir yapiya sahiptir. Toplam **82 ekran** ve **109 bilesen** icermektedir.

### Alt Navigasyon Yapisi

| Sekme | Ikon | Isim | Islevler |
|-------|------|------|----------|
| Ana Sayfa | Ev | Ana Sayfa | Gunluk ozet, raporlar, bildirimler |
| Ogunler | Tabak | Ogunler | Ogun kaydi, plan goruntuleme |
| Kamera | Tarama (yukseltilemis buton) | — | Fotograf, barkod, menu tarama |
| Ilerleme | Grafik | Ilerleme | Saglik metrikleri takibi |
| Profil | Kisi | Profil | Ayarlar, basarimlar |

### 1. Kimlik Dogrulama ve Giris (5 ekran)

- **Karsilama Ekrani** — Uygulama tanitimi ve giris/kayit yonlendirmesi
- **Giris Ekrani** — E-posta ve sifre ile oturum acma
- **Kayit Ekrani** — Yeni hasta kaydi (davet kodu ile)
- **Sifremi Unuttum** — Sifre sifirlama akisi
- **E-posta Dogrulama** — Hesap aktivasyonu

### 2. Ise Alim Akisi / Onboarding (7 ekran)

Ilk kayit sonrasi hasta profilini olusturan adimli surec:

1. **Temel Bilgiler** — Yas, cinsiyet, boy, kilo
2. **Alerji Secimi** — Bilinen alerjilerin isaretlenmesi
3. **Hedef Belirleme** — Kilo verme, alma, koruma, kas gelistirme vb.
4. **Diyet Tercihi** — Vejetaryen, vegan, glutensiz, laktosuz vb.
5. **Yasam Tarzi** — Aktivite seviyesi, meslek, uyku duzeni
6. **Diyetisyen Kodu** — Diyetisyen davet kodu girisi ile esleme
7. **Hesaplama Sonucu** — BMR, TDEE ve gunluk hedef ozeti

### 3. Ana Sayfa / Dashboard (4 ekran)

- **Gunluk Ozet** — Kalori ilerlemesi, makro dagilimi, su tuketimi, sonraki ogun hatirlatmasi
- **Haftalik Rapor** — Haftalik beslenme uyumu ve trend grafikleri
- **Aylik Rapor** — Uzun vadeli ilerleme analizi
- **Bildirimler** — Tum bildirim listesi

### 4. Ogun Takibi (8+ ekran)

- **Ogun Kayit Ekrani** — Gunluk ogunlerin zaman cizelgesi gorunumu
- **Ogun Ekleme** — Birden fazla giris yontemiyle besin ekleme
- **Besin Arama** — Veritabanindan besin arama ve secme
- **Besin Detay** — Secilen besinin detayli besin degeri bilgisi
- **Ogun Detay** — Kaydedilmis ogunun icerik ve analiz gorunumu
- **Diyet Plani Goruntuleyici** — Diyetisyenin atadigi haftalik planin goruntulenmesi
- **Son Besinler** — Hizli erisim icin son kullanilan besinler
- **Favori Besinler** — Sik tuketilen besinlerin listesi
- **Ozel Besin Olusturma** — Veritabaninda olmayan besinlerin manuel girisi

### 5. Kamera ve Yapay Zeka Giris Yontemleri (8 ekran)

NutriAI'nin en yenilikci modulu olup birden fazla giris yontemi sunmaktadir:

- **Fotograf Cekimi** — Yemek fotografiyla otomatik besin tanima (AI destekli)
- **Fotograf Analizi** — AI tarafindan taninen besinlerin onay/duzeltme ekrani
- **Barkod Tarayici** — Paketli urunlerin barkod ile hizli kaydi
- **Menu Tarama** — Restoran menulerinin fotograflanarak analizi
- **OCR Tarama** — Besin etiketi okuma ve otomatik veri cekme
- **Metin Girisi** — Serbest metin ile ogun tanimlamasi ("bir kase mercimek corbasi")
- **Sesli Giris** — Sesli komutla ogun kaydi
- **Porsiyon Ayarlama** — AI tahmini sonrasi porsiyon miktarini duzeltme

### 6. Ilerleme ve Saglik Takibi (18 ekran)

Kapsamli saglik metrik takip modulu:

- **Genel Bakis** — Tum metriklerin ozet gorunumu
- **Kilo Takibi** — Kilo degisim grafigi ve gecmisi
- **Vucut Olculeri** — Bel, kalca, gogus, kol olculeri
- **Makro Takibi** — Protein, karbonhidrat, yag dagilimi grafikleri
- **Besin Degeri Dokumu** — Detayli mikro besin analizi
- **Kalori Gecmisi** — Gunluk/haftalik/aylik kalori trendi
- **Su Takibi** — Gunluk su tuketimi (bardak bazli goruntusel takip)
- **Egzersiz Kaydi** — Aktivite turune gore egzersiz loglama
- **Uyku Takibi** — Uyku suresi ve kalitesi
- **Stres Takibi** — Stres seviyesi gostergesi
- **Ruh Hali** — Gunluk ruh hali puanlamasi (1-10 skala)
- **Kalp Atisi** — Kalp ritmi kaydi
- **Kan Degerleri** — Laboratuvar sonuclari girisi ve takibi
- **Vitamin Takibi** — Vitamin alimi izleme
- **Adim Sayaci** — Gunluk adim hedefi
- **Aralikli Oruc** — Yeme/oruc penceresi zamanlayici
- **Ozel Hedefler** — Kullanici tanimli hedef olusturma
- **Ilerleme Fotograflari** — Vucut degisimi foto arsivi (on/yan/arka)

### 7. Profil ve Ayarlar (18 ekran)

- **Profil** — Kullanici bilgileri ozeti
- **Profil Duzenleme** — Kisisel bilgileri guncelleme
- **Ayarlar** — Uygulama geneli tercihler
- **Hedefler** — Aktif hedef yonetimi
- **Basarimlar** — Kazanilan rozetler ve istatistikler
- **Alerji Yonetimi** — Alerji listesi duzenleme
- **Diyetisyen Baglantisi** — Mevcut diyetisyen bilgisi ve esleme durumu
- **Bildirim Ayarlari** — Bildirim tercihleri
- **Dil Secimi** — Turkce / Ingilizce
- **Tema** — Acik / Koyu mod
- **Hatirlaticilar** — Ogun, su, egzersiz hatirlaticilari
- **Bagli Cihazlar** — Apple Health, Google Fit, Fitbit, Garmin vb. entegrasyonlari
- **Veri Disa Aktarim** — Kisisel verilerin disa aktarimi
- **Hakkinda** — Uygulama bilgileri
- **Yardim ve Destek** — SSS ve destek
- **Gizlilik Politikasi** — KVKK uyumlu gizlilik metni
- **Kullanim Kosullari** — Hizmet sartlari
- **Abonelik** — Plan ve odeme yonetimi

### 8. Ozel Ozellik Ekranlari (8+ ekran)

- **AI Sohbet** — Yapay zeka beslenme danismani ile sohbet
- **Alerjen Tarayici** — Besinlerdeki olasi alerjenleri kontrol etme
- **Rozetler** — Tum rozet koleksiyonu ve ilerleme durumu
- **Meydan Okumalar** — Haftalik beslenme meydan okumalari
- **Liderlik Tablosu** — Kullanicilar arasi siralama
- **Randevu Alma** — Diyetisyenden randevu talep etme
- **Diyetisyen Profili** — Bagli olunan diyetisyenin detayli profili
- **Tarif Detay** — Onerilen tariflerin goruntulenmesi
- **Alisveris Listesi** — Diyetisyen tarafindan paylasilan alisveris listeleri
- **Goruntulu Gorusme** — Diyetisyen ile video gorusme

---

## Oyunlastirma Sistemi (Gamification)

Hasta motivasyonunu ve tedaviye bagliligi artirmak icin kapsamli bir oyunlastirma mekanizmasi tasarlanmistir:

### XP (Deneyim Puani) Sistemi
Hastalar asagidaki aksiyonlarla XP kazanir:
- Ogun kaydi yapma
- Fotograf yukleme
- Gunluk seri bonusu
- Rozet kazanma
- Meydan okuma tamamlama
- Kilo kaydi girme
- Su hedefine ulasma
- Plana uyum saglama
- Egzersiz kaydi

### Seviye Sistemi
- XP biriktikce seviye atlanir
- Her seviyenin kendine ozgu ismi vardir
- Seviye atlama animasyonu ve kutlama ekrani

### Rozetler
- Kategori bazli rozetler (beslenme, tutarlilik, ilerleme vb.)
- Nadirlk dereceleri
- Rozet kazanma kosullari (ornegin: "7 gun ust uste ogun kaydi")
- XP odulu

### Haftalik Meydan Okumalar
- Her hafta yeni meydan okumalar
- Hedef deger ve ilerleme takibi
- Tamamlama XP odulu
- Topluluk bazli katilim

### Liderlik Tablosu
- Kullanicilar arasi XP siralamasi
- Haftalik ve genel siralamalar

### Seri (Streak) Takibi
- Gunluk ogun kaydi serisi
- En uzun seri istatistigi
- Seri bonusu XP carpani

---

## Gercek Zamanli Ozellikler (WebSocket)

Socket.io tabanli gercek zamanli iletisim altyapisi sunulan ozellikler:

### Kimlik Dogrulama
- JWT token ile WebSocket baglanti dogrulamasi
- Kullanici bazli ve rol bazli odalar

### Canli Etkinlikler
- **Mesajlasma** — Anlik mesaj iletimi ve okuma bildirimi
- **Yazma Gostergesi** — Karsi tarafin yazip yazmadiginin canli gosterimi
- **Bildirimler** — Push bildirim benzeri anlik uyarilar
- **Canli Takip** — Hastalarin anlik kalori/su ilerlemesinin diyetisyen panelinde goruntulenmesi
- **Cevrimici Durum** — Kullanicilarin aktif/pasif durumunun takibi

---

## Yapay Zeka Entegrasyonu

### Otomatik Ogun Tanima
- Yemek fotografindan besinin otomatik tanimlanmasi
- Porsiyon tahmini
- Besin degeri hesaplamasi
- Diyetisyen onayina sunma

### AI Sohbet Asistani
- Hem hasta hem diyetisyen icin AI sohbet arayuzu
- Beslenme tavsiyeleri ve soru yaniti
- Hazir prompt sablonlari

### Akilli Plan Onerileri
- Hasta profiline gore diyet plani onerileri
- Alerji ve tercih duyarli oneriler

### Haftalik Otomatik Raporlar
- AI tarafindan olusturulan haftalik beslenme ozet raporlari
- Diyetisyene otomatik gonderim
- PDF formatinda disa aktarim

### Diger AI Ozellikleri
- OCR ile besin etiketi okuma
- Menu tarama ve analiz
- Sesli giris isleme
- Serbest metin analizi

---

## Tasarim Sistemi — "Organik Profesyonel"

Platformun gorsel dili, botanik referans kitaplari ile modern saglik panellerinin harmanlanmasindan olusmaktadir. Dogaligin sicakligi (toprak tonlari, organik kavisler, ferah bosluklar) ile klinik hassasiyet (sikistrilmis veri tablolari, net hiyerarsiler) bir arada sunulur.

### Renk Sistemi (OKLCH Tabanli)

OKLCH renk uzayi kullanilarak algisal olarak tutarli ve erisilebilir renkler tanimlanmistir:

| Rol | Deger | Aciklama |
|-----|-------|----------|
| Birincil (Primary) | `oklch(0.40 0.10 155)` | Koyu orman yesili — guven ve profesyonellik |
| Aksan (Accent) | `oklch(0.94 0.025 175)` | Sicak teal — eylem cagrisi ve vurgular |
| Arka Plan | `oklch(0.985 0.004 155)` | Yesil tonlu notr — sicak ve dogal |
| Metin | `oklch(0.145 0.024 155)` | Koyu yesil-gri — okunabilirlik |
| Basari | `oklch(0.55 0.16 150)` | Yesil — olumlu durum |
| Uyari | `oklch(0.75 0.16 75)` | Amber — dikkat |
| Hata | `oklch(0.55 0.22 25)` | Sicak kirmizi — kritik durum |
| Bilgi | `oklch(0.58 0.14 245)` | Mavi — bilgilendirme |

**60-30-10 Kurali:**
- %60 Yesil tonlu notr yuzeyler
- %30 Birincil yesil paneller ve elemanlar
- %10 Teal aksan — CTA butonlari ve vurgular

### Tipografi

- **Yazi Tipi:** Outfit Variable (geometrik ama sicak terminallere sahip)
- **Olcekler:** Akiskan tipografi (viewport genisligine duyarli)
  - xs: 11-12px, sm: 13-14px, base: 14-16px, lg: 16-18px
  - xl: 18-20px, 2xl: 22-24px, 3xl: 28-32px, 4xl: 32-40px

### Izgara ve Bosluk

- **Taban Izgara:** 4 piksel
- **Bosluk Olcegi:** 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px

### Kenar Yuvarlakligi

- **Varsayilan:** 10px (keskin ve balonumsu arasinda dengeli)
- **Olcek:** 6px (sm) → 10px (lg) → 14px (xl) → 18px (2xl) → 26px (4xl)

### Hareket ve Animasyon

- **Sureler:** 100ms (anlik), 200ms (hizli), 300ms (normal), 500ms (yavas)
- **Egriler:** ease-out-quart `cubic-bezier(0.25, 1, 0.5, 1)` — dogal yavaslayanhareket
- **Giris Animasyonlari:** Kadirimli (staggered) fade-up, slide-in, scale-in
- **Erisilebilirlik:** `prefers-reduced-motion` medya sorgusuna saygi — azaltilmis hareket tercihinde animasyonlar devre disi birakilir

### Tema Destegi

- **Acik Mod:** Birincil tasarim — sicak, ferah, dogal tonlar
- **Koyu Mod:** Tam destekli — koyu yesil tonlu arka planlar, yukseltilmis birincil renkler
- **WCAG AA:** Tum metin-arka plan kombinasyonlarinda minimum kontrast orani saglanir

### Dil

- Tum kullanici arayuzu metinleri **Turkce** dilindedir
- **Profesyonel/tibbi ton** kullanilir (gunluk/samimi degil)
- Mobil uygulamada ek olarak **Ingilizce** dil destegi bulunur

---

## Erislebilirlik ve Uyumluluk

- WCAG AA kontrast standartlarina uyum
- `prefers-reduced-motion` destegi
- Semantik HTML yapisi
- Radix UI tabanli erisilebilir bilesen ilkelleri (klavye navigasyonu, ekran okuyucu destegi)
- Duyarli tasarim (responsive) — masaustu, tablet ve mobil uyum

---

## Dagitim Altyapisi

Proje, Docker Compose ile konteyner tabanli dagitim icin yapilandirilmistir:

| Servis | Imaj | Port | Aciklama |
|--------|------|------|----------|
| PostgreSQL 16 | postgres:16-alpine | 5432 | Veritabani sunucusu |
| Backend API | Ozel Dockerfile | 3000 | Express.js API sunucusu |
| Web Paneli | Vite build | 5173 (dev) | Statik dosya sunumu |

### Ortam Degiskenleri
- `DATABASE_URL` — PostgreSQL baglanti dizesi
- `JWT_SECRET` / `JWT_REFRESH_SECRET` — Token imzalama anahtarlari
- `GEMINI_API_KEY` — Google Gemini AI API anahtari
- `CORS_ORIGIN` — Izin verilen kaynak adresleri

---

## Veri Giris Yontemleri

NutriAI, ogun kaydini mumkun oldugunca kolaylastirmak icin **7 farkli giris yontemi** sunmaktadir:

| Yontem | Aciklama |
|--------|----------|
| **Fotograf (AI)** | Yemek fotografini cekerek otomatik besin tanima |
| **Barkod** | Paketli urunlerin barkod taramasiyla kaydi |
| **Sesli Giris** | Konusarak ogun tanimlama |
| **Serbest Metin (AI)** | "Bir tabak pilav, yaninda ayran" gibi dogal dil girisi |
| **OCR** | Besin etiketi fotograflayarak otomatik veri cekme |
| **Menu Tarama** | Restoran menusunu fotograflayarak analiz |
| **Manuel** | Veritabanindan besin arama ve miktar girisi |

---

## Harici Cihaz ve Platform Entegrasyonlari

Mobil uygulama, saglik verilerini senkronize etmek icin asagidaki platformlarla entegrasyon destegi sunmaktadir:

- Apple Health
- Google Fit
- Fitbit
- Garmin
- Samsung Health
- Withings
- Oura
- Whoop
- Strava
- MyFitnessPal

---

## Kullanim Senaryolari

### Senaryo 1: Diyetisyen Hasta Eslesmesi
1. Diyetisyen web panelinden benzersiz davet kodu olusturur
2. Hasta mobil uygulamada kayit sirasinda davet kodunu girer
3. Otomatik esleme gerceklesir
4. Diyetisyen hasta listesinde yeni hastayi gorur

### Senaryo 2: Gunluk Ogun Takibi
1. Hasta oglen yemeginin fotografini ceker
2. AI yemegi otomatik olarak tanir ve porsiyon tahmini yapar
3. Hasta gerekirse duzeltme yapar ve kaydeder
4. Diyetisyen ogun inceleme kuyruugunda kaydi gorur
5. Diyetisyen geri bildirim notu yazar ve onaylar
6. Hasta bildirim alir

### Senaryo 3: Diyet Plani Olusturma
1. Diyetisyen plan olusturucuda hastayi secer
2. 7 gunluk plan sablonu secer veya sifirdan baslar
3. Her gun ve ogun icin besinleri ekler
4. AI alternatif oneriler sunar
5. Besin degeri ozet panelinden toplam degerleri kontrol eder
6. Plani kaydeder ve hastaya atar
7. Hasta mobil uygulamada planini gorur

### Senaryo 4: Ilerleme Takibi ve Motivasyon
1. Hasta her sabah kilosunu girer
2. Haftalik grafiklerde trendi gorur
3. 7 gun ust uste kayit yaptigi icin seri bonusu ve rozet kazanir
4. Haftalik meydan okumaya katilir (orn: "5 gun sebze tuketimi")
5. XP biriktirir ve seviye atlar
6. Diyetisyen canli takip panelinden hastanin ilerlemesini izler

---

## Ozellik Ozet Tablosu

| Ozellik | Web (Diyetisyen) | Web (Admin) | Mobil (Hasta) |
|---------|:-:|:-:|:-:|
| Gosterge Paneli | + | + | + |
| Hasta Yonetimi | + | — | — |
| Ogun Kaydi | Inceleme | — | + |
| Diyet Plani | Olusturma | — | Goruntuleme |
| Canli Takip | + | — | — |
| Mesajlasma | + | — | + |
| Goruntulu Gorusme | + | — | + |
| Randevu | + | — | + |
| Tarif Kutuphanesi | + | Moderasyon | + |
| Alisveris Listesi | + | — | + |
| Raporlama | + | + | + |
| AI Asistan | + | — | + |
| Bildirimler | + | — | + |
| Besin Veritabani | — | + | — |
| Alerjen Yonetimi | — | + | + |
| Kullanici Yonetimi | — | + | — |
| Oyunlastirma | — | — | + |
| Kamera/AI Tarama | — | — | + |
| Saglik Metrikleri | Goruntuleme | — | Giris + Takip |
| Cihaz Entegrasyonu | — | — | + |
| Cok Dilli Destek | — | — | + |
| Koyu Mod | + | + | + |

---

## Sonuc

NutriAI, beslenme takibi alaninda diyetisyen ve hasta arasindaki iletisimi guclu bir dijital platformda birlestiren, yapay zeka destekli kapsamli bir saglik cozumudur. Platform; 30 sayfalik profesyonel web paneli, 82 ekranlik zengin mobil uygulama, gercek zamanli iletisim altyapisi, 27+ tabloluk iliskisel veritabani, 7 farkli ogun giris yontemi, oyunlastirma mekanizmalari ve 10+ harici cihaz entegrasyonu ile beslenme yonetimini butunsel bir sekilde dijitallestirmeyi hedeflemektedir.
