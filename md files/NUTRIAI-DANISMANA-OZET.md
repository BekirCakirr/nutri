# NutriAI — Yapay Zeka Destekli Beslenme Takip Platformu

## Proje Ozeti

NutriAI, hastalarin mobil uygulama uzerinden beslenme takibi yapabilecegi, diyetisyenlerin ise web paneli uzerinden hastalarini yonetebilecegi bir platformdur. Projede yapay zeka, yemek fotograflarindan besin analizi yapmak, kisisellestirilmis beslenme planlari olusturmak ve kullaniciya akilli oneriler sunmak icin kullanilmaktadir.

---

## Problem

- Turkiye'deki mevcut beslenme uygulamalari (MyFitnessPal, FatSecret vb.) Turk mutfagina yeterince hakim degildir.
- Diyetisyen-hasta iletisimi genellikle WhatsApp uzerinden yurutulmektedir; profesyonel bir takip sistemi bulunmamaktadir.
- Hastaların yediklerini manuel girmesi zahmetlidir ve cogu zaman birakmalara neden olmaktadir.

## Cozum

Hasta telefonuyla yemeginin fotografini ceker, yapay zeka yemegi tanir ve besin degerlerini hesaplar. Hasta sonuclari duzeltebilir (ornegin yapay zekanin 100g olarak tahmini ettigini 300g olarak guncelleyebilir). Tum veriler otomatik olarak diyetisyenin web paneline iletilir. Diyetisyen hastasinin ne yedigini gercek zamanli takip edebilir, yorum yapabilir ve beslenme plani yazabilir.

---

## Iki Kullanim Modu

| Mod | Aciklama |
|-----|----------|
| **Bireysel Kullanim** | Diyetisyeni olmayan kullanicilar yapay zeka destekli olarak kendi beslenme takiplerini yapar |
| **Diyetisyenli Kullanim** | Hasta, diyetisyenin verdigi eslesme kodu ile sisteme baglanir. Diyetisyen web panelinden takip yapar |

Diyetisyen eslestirme sistemi: Diyetisyen web panelinden benzersiz bir davet kodu alir (ornek: DYT-ELIF-7X3K). Hasta mobil uygulamadan kayit olurken bu kodu girerek diyetisyeniyle eslesir.

---

## Teknik Altyapi

| Katman | Teknoloji | Aciklama |
|--------|-----------|----------|
| Mobil Uygulama | Expo (React Native) | iOS ve Android icin tek kod tabani |
| Web Paneli | React + Vite + TailwindCSS | Diyetisyen yonetim paneli |
| Backend | Node.js + Express | REST API + Socket.io (gercek zamanli iletisim) |
| Veritabani | PostgreSQL (Docker uzerinde) | Iliskisel veritabani, container ortaminda |
| Yapay Zeka | Google Gemini 2.0 Flash (Vision API) | Yemek fotografi analizi, metin analizi, plan olusturma |
| Bildirimler | Firebase Cloud Messaging | Mobil push bildirimler |
| Barkod | Open Food Facts API | Urun barkod sorgulama (3M+ urun, acik kaynak) |

Tum teknolojiler acik kaynak veya ucretsiz katman kapsamindadir.

---

## Temel Ozellikler

### Hasta Tarafi (Mobil)
- Kayit ve kisisel bilgi girisi (boy, kilo, hedef, alerjiler)
- Diyetisyen kodu ile eslestirme
- Yemek fotografi cekme → yapay zeka ile besin analizi
- Yapay zeka tahminlerini duzeltebilme (miktar ayarlama)
- Barkod tarama ile urun sorgulama
- Gunluk kalori, protein, karbonhidrat ve yag takibi
- Kilo ve su tuketimi takibi
- Yapay zeka sohbet asistani (beslenme sorulari)
- Haftalik beslenme plani goruntuleme
- Diyetisyenle mesajlasma
- Rozet ve seri sistemi (motivasyon)
- Push bildirimler (ogun hatirlatma, su icme vs.)

### Diyetisyen Tarafi (Web)
- Hasta listesi ve detayli profil goruntuleme
- Hastalarin gonderdigi ogun fotograflarini inceleme
- Gercek zamanli beslenme takibi
- Beslenme plani olusturma (yapay zeka destekli)
- Hastaya mesaj gonderme ve yorum yapma
- Davet kodu yonetimi
- Hasta ilerleme raporlari ve grafikleri

---

## Yapay Zeka Kullanim Alanlari

1. **Yemek Fotografi Analizi** — Hasta fotografini ceker, yapay zeka yemegi tanir ve besin degerlerini hesaplar
2. **Beslenme Plani Olusturma** — Hastanin hedeflerine, alerjilerine ve tercihlerine gore haftalik plan uretimi
3. **Beslenme Asistani** — Soru-cevap tabanli beslenme danismanligi
4. **Duygusal Yeme Analizi** — Ruh hali ile beslenme aliskanliklari arasindaki iliskinin tespiti
5. **Alerjen Kontrolu** — Yiyeceklerdeki alerjen tespiti ve uyari

---

## Gercek Zamanli Iletisim (Socket.io)

- Hasta yemek kaydettikçe diyetisyen paneli anlik guncellenir
- Diyetisyen yeni plan gonderdiginde hasta anlik bildirim alir
- Mesajlasma anliktir

---

## Proje Kapsami

- Yaklasik 50 mobil ekran, 16 web sayfasi
- 100+ REST API endpoint
- PostgreSQL uzerinde 25+ tablo
- Docker ile tek komutla calistirilabilir altyapi

---

## Akademik Katki Potansiyeli

- Gemini Vision API'nin Turk mutfagi tanima dogruluk analizi
- Mevcut beslenme uygulamalari ile karsilastirmali analiz
- Duygusal yeme (ruh hali — kalori iliskisi) korelasyon analizi
- Kullanilabilirlik testi (SUS anketi) sonuclari

---

*Hazirlayan: [Isim Soyisim]*
*Dansman: [Dansman Adi]*
*Tarih: Subat 2026*
