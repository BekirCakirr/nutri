c# 🥗 NutriAI v2 — Detaylı Proje Dokümanı

> **Teknoloji:** Node.js + Express | PostgreSQL (Docker) | Socket.io | React (Vite) | Expo (React Native) | AI (Claude/OpenAI API)

---

## 📌 Güncellenmiş Konsept

```
┌─────────────────────────────────────────────────────────┐
│                      NutriAI                             │
│                                                          │
│   📱 MOBİL (Expo)              💻 WEB (React)            │
│   = Kullanıcı Uygulaması      = Diyetisyen Paneli       │
│                                + Admin Paneli            │
│                                                          │
│   ┌─────────────────┐         ┌─────────────────┐       │
│   │  Mod 1:         │         │  Diyetisyen:    │       │
│   │  AI Destekli    │         │  Danışan takibi │       │
│   │  (diyetisyensiz)│         │  Diyet yazma    │       │
│   │                 │◄────────┤  Analiz görme   │       │
│   │  Mod 2:         │ Socket  │  Mesajlaşma     │       │
│   │  Diyetisyenli   │  .io    │                 │       │
│   │  (profesyonel   │────────►│  Admin:         │       │
│   │   takip)        │         │  Besin DB       │       │
│   └─────────────────┘         │  Kullanıcı yön. │       │
│                                └─────────────────┘       │
│                                                          │
│              ┌──────────────────┐                        │
│              │   PostgreSQL     │                        │
│              │   (Docker)       │                        │
│              └──────────────────┘                        │
└─────────────────────────────────────────────────────────┘
```

### İki Kullanım Modu

| Mod | Açıklama | Kimler İçin? |
|-----|----------|-------------|
| **Mod 1: AI Destekli (Bağımsız)** | Kullanıcı diyetisyen olmadan kendi başına kullanır. AI beslenme planı oluşturur, takip eder, önerir | Kendi başına diyet yapanlar, öğrenciler, bütçesi kısıtlı olanlar |
| **Mod 2: Diyetisyenli (Profesyonel)** | Kullanıcı bir diyetisyenle eşleşir. Diyetisyen web panelinden plan yazar, takip eder | Profesyonel destek isteyenler, kronik hastalığı olanlar, ciddi alerji vakaları |

**Kritik:** Her iki modda da aynı mobil uygulama kullanılır. Fark sadece beslenme planının kim tarafından oluşturulduğu (AI vs diyetisyen) ve takibin kim tarafından yapıldığı.

---

## 📱 MOBİL UYGULAMA — Kullanıcı Tarafı (Expo / React Native)

### 1. Onboarding (İlk Kayıt Wizard'ı)

**Ekran 1.1 — Hoş Geldin**
```
┌──────────────────────────┐
│                          │
│      🥗 NutriAI          │
│                          │
│  "Sana özel beslenme     │
│   asistanın"             │
│                          │
│  [E-posta ile Kayıt Ol]  │
│  [Google ile Giriş]      │
│  [Apple ile Giriş]       │
│                          │
│  Zaten hesabın var mı?   │
│  Giriş Yap              │
└──────────────────────────┘
```

**Ekran 1.2 — Temel Bilgiler**
```
Alanlar:
  - Ad Soyad
  - Doğum Tarihi (yaş otomatik hesaplanır)
  - Cinsiyet (Kadın / Erkek / Belirtmek istemiyorum)
  - Boy (cm)
  - Mevcut Kilo (kg)
```

**Ekran 1.3 — Hedefin Ne?**
```
Tek seçim kartları (büyük, görsel):

  🔽 Kilo Vermek
     → Hedef kilo gir (ör: 68 kg)
     → Hedef süre (ör: 3 ay)

  🔼 Kilo Almak
     → Hedef kilo gir (ör: 75 kg)
     → Hedef süre

  💪 Kas Yapmak
     → Mevcut antrenman sıklığı

  ⚖️ Kilomu Korumak / Sağlıklı Beslenmek

  🏥 Hastalık Bazlı Diyet
     → Diyabet Tip 1/2
     → Yüksek Kolesterol
     → Yüksek Tansiyon
     → Demir Eksikliği
     → Diğer (serbest metin)
```

**Ekran 1.4 — Alerjiler ve İntoleranslar**
```
Çoklu seçim grid:
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ 🌾 Gluten│ │ 🥛 Laktoz│ │ 🥜 Fıstık│
  └──────────┘ └──────────┘ └──────────┘
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ 🥚 Yumurta│ │ 🦐 Deniz │ │ 🫘 Soya  │
  └──────────┘ │  Ürünleri│ └──────────┘
               └──────────┘
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ 🐟 Balık │ │ 🌰 Susam │ │ ➕ Diğer │
  └──────────┘ └──────────┘ └──────────┘

Her seçilen alerji için şiddet seçimi:
  ○ Hafif intolerans (rahatsızlık verir)
  ○ Orta alerji (ciddi semptomlar)
  ○ Şiddetli alerji (anafilaksi riski)
```

**Ekran 1.5 — Beslenme Tercihleri**
```
Beslenme Tipi:
  ○ Normal (her şeyi yerim)
  ○ Vejetaryen (et yemem)
  ○ Vegan (hayvansal ürün yok)
  ○ Pesketaryen (sadece balık + sebze)
  ○ Lakto-Vejetaryen

Mutfak Tercihi (çoklu seçim):
  □ Türk Mutfağı
  □ Akdeniz
  □ Asya
  □ Meksika
  □ Fark etmez

Sevmediğin Yiyecekler:
  [Tag input: brokoli, ciğer, kereviz...]

Dini/Kültürel Tercihler:
  □ Helal
  □ Koşer
  □ Yok
```

**Ekran 1.6 — Yaşam Tarzı**
```
Aktivite Seviyesi:
  🛋️ Hareketsiz (masa başı iş, spor yok)
  🚶 Hafif aktif (haftada 1-2 gün hafif egzersiz)
  🏃 Aktif (haftada 3-5 gün egzersiz)
  💪 Çok aktif (her gün yoğun antrenman)

Günlük Su Tüketimi:
  ○ 1-3 bardak
  ○ 4-6 bardak
  ○ 7-8 bardak
  ○ 8+ bardak

Uyku Düzeni:
  ○ 5-6 saat
  ○ 7-8 saat
  ○ 8+ saat
```

**Ekran 1.7 — Nasıl Kullanmak İstiyorsun?**
```
Bu ekran kritik — iki modu ayırır:

  ┌─────────────────────────────────┐
  │  🤖 AI ile Kendi Başıma         │
  │                                  │
  │  AI sana kişisel beslenme planı │
  │  oluşturur, takip eder ve       │
  │  öneriler sunar.                │
  │  Ücretsiz.                      │
  │                                  │
  │  [Bunu Seç]                     │
  └─────────────────────────────────┘

  ┌─────────────────────────────────┐
  │  👩‍⚕️ Diyetisyenle Çalışmak     │
  │                                  │
  │  Profesyonel bir diyetisyen     │
  │  sana özel plan yazar ve       │
  │  gelişimini takip eder.        │
  │                                  │
  │  [Diyetisyen Bul]              │
  └─────────────────────────────────┘

  ℹ️ İstediğin zaman mod değiştirebilirsin
```

**Ekran 1.8 — AI Hesaplama Sonucu**
```
Tüm veriler girildi, AI hesaplıyor:

  ┌─────────────────────────────────┐
  │  📊 Senin İçin Hesapladık       │
  │                                  │
  │  BMR (Bazal Metabolizma): 1650  │
  │  Günlük Kalori Hedefi:  1850   │
  │                                  │
  │  Makro Dağılım:                 │
  │  🟢 Protein:  120g  (%26)      │
  │  🟡 Karbonhidrat: 185g (%40)   │
  │  🔴 Yağ: 70g (%34)             │
  │                                  │
  │  Tahmini Hedefe Ulaşma:         │
  │  📅 ~10 hafta (sağlıklı hız)   │
  │                                  │
  │  ⚠️ Dikkat: Gluten ve Laktoz    │
  │  alerjilerin göz önünde         │
  │  bulundurulacak                 │
  │                                  │
  │  [Harika, Başlayalım! →]       │
  └─────────────────────────────────┘
```

---

### 2. Ana Sayfa (Dashboard)

**Ekran 2.1 — Günlük Dashboard**
```
┌──────────────────────────────────┐
│  Günaydın, Ahmet! 👋             │
│  18 Şubat 2026, Çarşamba         │
│                                   │
│  ┌──────────────────────────────┐│
│  │     Bugünkü Kalorin          ││
│  │                              ││
│  │  ████████████░░░░  1450/2000 ││
│  │                              ││
│  │  🟢 Protein   85g / 120g    ││
│  │  🟡 Karb.    160g / 185g    ││
│  │  🔴 Yağ       40g /  70g    ││
│  └──────────────────────────────┘│
│                                   │
│  📋 Öğünlerin                     │
│  ┌──────────────────────────────┐│
│  │ ✅ Kahvaltı    450 kcal      ││
│  │    Yulaf ezmesi + meyve      ││
│  │ ✅ Öğle        550 kcal      ││
│  │    Izgara tavuk + salata     ││
│  │ ⬜ Akşam       — bekliyor    ││
│  │    📌 Önerilen: Mercimek     ││
│  │       köftesi + bulgur       ││
│  │ ⬜ Ara Öğün    — bekliyor    ││
│  │    📌 Önerilen: Muz +        ││
│  │       badem ezmesi           ││
│  └──────────────────────────────┘│
│                                   │
│  💧 Su Takibi                     │
│  ●●●●●●○○  6/8 bardak           │
│  [+1 Bardak]                     │
│                                   │
│  ⚡ Hızlı Bilgi (AI)              │
│  "Protein hedefinize ulaşmak     │
│   için akşam yemeğinde mercimek  │
│   veya nohut tercih edin"        │
│                                   │
│  👩‍⚕️ Diyetisyenin (varsa):       │
│  "Harika gidiyorsun! Akşam       │
│   yemeğini unutma 😊"             │
│  [Mesaj Gönder]                  │
│                                   │
└──────────────────────────────────┘

Alt Navigasyon:
[🏠 Ana] [🍽️ Öğün] [📊 Takip] [🤖 AI] [👤 Profil]
```

---

### 3. Öğün Yönetimi

**Ekran 3.1 — Günlük Öğün Listesi**
```
Tarih seçici (sağa-sola kaydır)
  ← 16 Şub | 17 Şub | [18 Şub] | 19 Şub →

Kahvaltı (450 kcal)
  ├─ Yulaf ezmesi — 250g — 280 kcal
  ├─ Muz — 1 adet — 105 kcal
  └─ Bal — 1 yemek kaşığı — 65 kcal
  [+ Ekle]

Öğle (550 kcal)
  ├─ Izgara tavuk göğsü — 150g — 250 kcal
  ├─ Karışık salata — 200g — 80 kcal
  └─ Zeytinyağı sos — 2 yk — 220 kcal
  [+ Ekle]

Akşam (planlanmış: 500 kcal)
  📌 AI/Diyetisyen Önerisi: Mercimek köftesi + bulgur pilavı
  [Bunu Yedim ✓] [Farklı Bir Şey Yedim]

Ara Öğün (planlanmış: 200 kcal)
  📌 Öneri: 1 avuç badem + 1 elma
  [Bunu Yedim ✓] [Farklı Bir Şey Yedim]
```

**Ekran 3.2 — Yemek Ekleme (3 Yöntem)**
```
┌──────────────────────────────────┐
│  🍽️ Ne Yedin?                    │
│                                   │
│  ┌──────────────────────────────┐│
│  │ 🔍 Ara: "mercimek çorbası"  ││
│  └──────────────────────────────┘│
│                                   │
│  veya                             │
│                                   │
│  ┌────────┐ ┌────────┐ ┌──────┐ │
│  │📷      │ │📱      │ │🤖    │ │
│  │Fotoğraf│ │Barkod  │ │AI'a  │ │
│  │Çek     │ │Tara    │ │Anlat │ │
│  └────────┘ └────────┘ └──────┘ │
│                                   │
│  Son Eklenenler:                  │
│  • Yulaf ezmesi          280 kcal│
│  • Izgara tavuk göğsü    250 kcal│
│  • Mercimek çorbası       180 kcal│
│                                   │
│  Sık Yediklerin:                  │
│  • Yumurta (haşlanmış)   155 kcal│
│  • Tam buğday ekmeği      80 kcal│
│  • Domates               18 kcal │
└──────────────────────────────────┘
```

**Ekran 3.3 — Barkod Tarama**
```
┌──────────────────────────────────┐
│  📱 Barkodu Tara                  │
│                                   │
│  ┌──────────────────────────────┐│
│  │                              ││
│  │        📷 Kamera             ││
│  │     [Barkod çerçevesi]       ││
│  │                              ││
│  └──────────────────────────────┘│
│                                   │
│  Taranan Ürün:                    │
│  ┌──────────────────────────────┐│
│  │  Eti Burçak Bisküvi          ││
│  │  100g: 470 kcal              ││
│  │  Protein: 7g | Karb: 65g    ││
│  │                              ││
│  │  ⚠️ ALERJEN UYARISI          ││
│  │  🔴 GLUTEN içerir!           ││
│  │  🔴 Bu ürün senin için       ││
│  │     UYGUN DEĞİL              ││
│  │                              ││
│  │  ✅ Güvenli Alternatifler:    ││
│  │  • Glutensiz bisküvi (X marka)│
│  │  • Pirinç patlağı            ││
│  │  • Mısır gevreği             ││
│  └──────────────────────────────┘│
│                                   │
│  [Yine de Ekle] [Alternatif Seç] │
└──────────────────────────────────┘
```

**Ekran 3.4 — AI ile Fotoğraftan Tanıma**
```
┌──────────────────────────────────┐
│  📷 Yemeğini Fotoğrafla          │
│                                   │
│  ┌──────────────────────────────┐│
│  │                              ││
│  │     [Yemek fotoğrafı]        ││
│  │                              ││
│  └──────────────────────────────┘│
│                                   │
│  🤖 AI Analizi:                   │
│  "Bu bir tabak karnıyarık        │
│   görünüyor"                     │
│                                   │
│  Tahmini Değerler:                │
│  • Kalori: ~350 kcal             │
│  • Protein: 18g                  │
│  • Karbonhidrat: 25g            │
│  • Yağ: 20g                     │
│                                   │
│  ✅ Alerjen kontrolü: Güvenli    │
│                                   │
│  Porsiyon: [1 porsiyon ▼]        │
│                                   │
│  [✓ Doğru, Ekle] [✏️ Düzelt]     │
└──────────────────────────────────┘
```

**Ekran 3.5 — AI'a Serbest Anlatma**
```
┌──────────────────────────────────┐
│  🤖 Ne yediğini anlat            │
│                                   │
│  💬 "Öğlen bir tabak makarna     │
│      yedim yanında da ayran      │
│      içtim"                      │
│                                   │
│  AI Çıktısı:                     │
│  ┌──────────────────────────────┐│
│  │ Makarna (spagetti) 250g      ││
│  │   520 kcal | P:18g K:80g    ││
│  │   ⚠️ GLUTEN — dikkat!        ││
│  │                              ││
│  │ Ayran 200ml                  ││
│  │   70 kcal | P:4g K:5g      ││
│  │   ⚠️ LAKTOZ — dikkat!        ││
│  │                              ││
│  │ ⚠️ Bu öğünde 2 alerjenin     ││
│  │   var. Bunu yediğine emin    ││
│  │   misin?                     ││
│  └──────────────────────────────┘│
│                                   │
│  [Evet, Yedim] [Hayır, Düzelt]   │
└──────────────────────────────────┘
```

---

### 4. Alerji Merkezi

**Ekran 4.1 — Alerji Profilim**
```
┌──────────────────────────────────┐
│  🚨 Alerji Profilim              │
│                                   │
│  Aktif Alerjilerim:               │
│  ┌──────────────────────────────┐│
│  │ 🌾 Gluten                    ││
│  │ Şiddet: 🔴 Ciddi Alerji     ││
│  │ Tanı: Dr. Yılmaz, 2023      ││
│  │ [Düzenle] [Kaldır]           ││
│  ├──────────────────────────────┤│
│  │ 🥛 Laktoz                    ││
│  │ Şiddet: 🟡 Orta İntolerans  ││
│  │ Tanı: Öz bildirim           ││
│  │ [Düzenle] [Kaldır]           ││
│  └──────────────────────────────┘│
│                                   │
│  [+ Yeni Alerji Ekle]           │
│                                   │
│  🆘 Acil Durum Bilgileri          │
│  • Doktor: Dr. Ayşe Yılmaz      │
│  • Tel: 0555 123 4567           │
│  • İlaç: EpiPen (sol cep)       │
│  • Kan grubu: A Rh+             │
│  [Düzenle]                       │
└──────────────────────────────────┘
```

**Ekran 4.2 — Güvenli Yiyecek Rehberi**
```
┌──────────────────────────────────┐
│  ✅ Sana Güvenli Yiyecekler       │
│                                   │
│  Alerjilerin baz alınarak        │
│  filtrelendi: Gluten ❌ Laktoz ❌  │
│                                   │
│  🥩 Protein                       │
│  ✅ Tavuk, hindi, balık, yumurta  │
│  ✅ Kırmızı et, kuru baklagiller  │
│                                   │
│  🌾 Tahıl & Karbonhidrat         │
│  ✅ Pirinç, mısır, karabuğday    │
│  ✅ Patates, tatlı patates       │
│  ❌ Buğday, arpa, çavdar, yulaf  │
│                                   │
│  🥛 Süt Ürünleri                  │
│  ❌ Süt, yoğurt, peynir          │
│  ✅ Badem sütü, hindistancevizi  │
│  ✅ Laktozsuz süt/yoğurt         │
│                                   │
│  🍎 Meyve & Sebze                 │
│  ✅ Tamamı güvenli               │
│                                   │
│  🍫 Atıştırmalık                  │
│  ✅ Pirinç patlağı, mısır cipsi  │
│  ✅ Kuru meyve, kuruyemiş        │
│  ❌ Normal bisküvi, kraker       │
│  ❌ Çikolatalı ürünler (kontrol) │
└──────────────────────────────────┘
```

**Ekran 4.3 — Alerji Reaksiyon Günlüğü**
```
Reaksiyon Kaydet:
  Tarih: [bugün]
  Ne yedin?: [arama/seçim]
  Semptomlar: 
    □ Karın ağrısı  □ Şişkinlik  □ İshal
    □ Kaşıntı  □ Kızarıklık  □ Nefes darlığı
    □ Bulantı  □ Baş ağrısı  □ Diğer: [___]
  Şiddeti: Hafif / Orta / Şiddetli
  Not: [serbest metin]

Reaksiyon Geçmişi:
  📅 15 Şub — Karın ağrısı + şişkinlik
     Yenen: Restoranda çorba (muhtemel gluten)
     Şiddet: Orta

  📅 10 Şub — Hafif kaşıntı
     Yenen: Çikolatalı kek
     Şiddet: Hafif

AI Patern Analizi:
  "Son 30 günde 3 reaksiyon kaydedildi.
   Hepsi dışarıda yemek yedikten sonra.
   Restoran yemeklerinde çapraz bulaşma
   riski yüksek. Sipariş verirken
   alerji bilginizi belirtin."
```

**Ekran 4.4 — Ürün Alerjen Tarayıcı**
```
Barkod tarama veya ürün adı yazma

Sonuç örneği:
  ┌──────────────────────────────────┐
  │  Ürün: Knorr Mercimek Çorbası    │
  │                                   │
  │  İçindekiler Analizi:             │
  │  ✅ Laktoz: YOK                   │
  │  ⚠️ Gluten: İÇERİR (buğday unu) │
  │                                   │
  │  Karar: 🔴 UYGUN DEĞİL          │
  │                                   │
  │  Alternatifler:                   │
  │  ✅ Ev yapımı mercimek çorbası    │
  │     (tarife git →)               │
  │  ✅ X Marka Glutensiz çorba      │
  │  ✅ Y Marka Sebze çorbası        │
  └──────────────────────────────────┘
```

---

### 5. AI Beslenme Asistanı (Chat)

**Ekran 5.1 — AI Sohbet Ekranı**
```
Mod 1 (Diyetisyensiz) kullanıcılar için ana asistan:

┌──────────────────────────────────┐
│  🤖 AI Beslenme Asistanı         │
│                                   │
│  💬 Sen: "Akşam ne yemeliyim?    │
│  Çok acıktım ama kalori limitim  │
│  dolmak üzere"                   │
│                                   │
│  🤖 AI: "Bugün 1450 kcal aldın,  │
│  550 kcal daha alabilirsin.      │
│  Protein hedefin de düşük       │
│  kalmış. Şunu öneriyorum:       │
│                                   │
│  🥗 Izgara somon (150g) +        │
│  haşlanmış brokoli + kinoa      │
│  → 480 kcal, 42g protein        │
│  → ✅ Alerjenlerine uygun        │
│                                   │
│  veya                            │
│                                   │
│  🥗 Mercimek köftesi (4 adet) +  │
│  bulgur pilavı + cacık (laktozsuz)│
│  → 520 kcal, 28g protein        │
│  → ✅ Alerjenlerine uygun        │
│                                   │
│  Hangisini tercih edersin?"      │
│                                   │
│  [💬 Mesaj yaz...]     [Gönder]  │
└──────────────────────────────────┘

AI'a sorulabilecek örnek sorular:
  → "Haftalık plan oluştur"
  → "Bu ürün bana uygun mu?" + fotoğraf
  → "Glutensiz tatlı tarifi ver"
  → "Protein eksikliğimi nasıl kapatırım?"
  → "Dışarıda ne yiyebilirim?"
  → "Elimde tavuk ve pirinç var, ne yapayım?"
  → "Neden kilo veremiyorum?"
  → "Bugün ne kadar kalori aldım?"
```

---

### 6. Haftalık Beslenme Planı

**Ekran 6.1 — Plan Görünümü**
```
┌──────────────────────────────────┐
│  📋 Haftalık Planın               │
│  12-18 Şubat 2026                │
│  Oluşturan: 🤖 AI / 👩‍⚕️ Dyt.Elif│
│                                   │
│  Pzt  Sal  Çar  Per  Cum  Cts  Pz│
│  [●]  [●]  [◉]  [○]  [○]  [○] [○]│
│  ● tamamlandı ◉ bugün ○ bekliyor │
│                                   │
│  ═══ Çarşamba, 18 Şubat ═══      │
│                                   │
│  🌅 Kahvaltı (450 kcal)           │
│  Yulaf ezmesi + muz + bal        │
│  [Tarife Bak] [Yedim ✓]         │
│                                   │
│  ☀️ Öğle (550 kcal)               │
│  Nohutlu salata + tam buğday     │
│  ⚠️ tam buğday → pirinç ekmeği   │
│  (gluten alerjin için değiştirildi)│
│  [Tarife Bak] [Yedim ✓]         │
│                                   │
│  🌙 Akşam (500 kcal)              │
│  Fırında somon + sebze sote      │
│  [Tarife Bak] [Bu Öğünü Değiştir]│
│                                   │
│  🍎 Ara Öğün (200 kcal)           │
│  1 avuç badem + 1 elma          │
│                                   │
│  Günlük Toplam: 1700 kcal        │
│  Hedef: 1850 kcal                │
│                                   │
│  [🛒 Bu Haftanın Alışveriş       │
│      Listesini Gör]              │
└──────────────────────────────────┘
```

---

### 7. Gelişim Takibi

**Ekran 7.1 — Kilo Takibi**
```
Grafik: Çizgi grafik
  X ekseni: tarih (son 30 gün)
  Y ekseni: kilo
  — Mavi çizgi: gerçek kilo
  — Yeşil noktalı: hedef çizgisi
  
  76 kg ─ ─ ─ ─ ─ ─
  75 kg ─────╮
  74 kg      ╰──╮
  73 kg          ╰──── bugün: 73.5
  ...
  68 kg ─ ─ ─ ─ ─ ─ ─ hedef

  AI Analiz:
  "Son 4 haftada 2.5 kg verdin.
   Bu hız sağlıklı (haftada ~0.6 kg).
   Tahminen 9 hafta sonra hedefe ulaşırsın."

  [+ Bugünkü Kilonu Gir]
```

**Ekran 7.2 — Besin Trendleri**
```
Haftalık Ortalamalar:
  Kalori:  1780 / 1850 (hedef) ✅
  Protein: 95g / 120g          ⚠️ düşük
  Karb:    200g / 185g          ⚠️ biraz fazla
  Yağ:     60g / 70g            ✅

  AI Önerisi:
  "Protein alımını artır:
   • Kahvaltıya 2 yumurta ekle (+12g)
   • Ara öğüne yoğurt ekle (+10g)
   • Bu 22g fark hedefe ulaşmanı sağlar"
```

**Ekran 7.3 — AI Haftalık Rapor**
```
┌──────────────────────────────────┐
│  📊 Haftalık Raporun              │
│  10-16 Şubat 2026                │
│                                   │
│  ✅ İyi Giden:                     │
│  • Kalori hedefini %92 tuttun    │
│  • Su tüketimin geçen haftaya    │
│    göre %15 arttı                │
│  • 5/7 gün öğün planına uydun   │
│                                   │
│  ⚠️ Geliştirilmesi Gereken:       │
│  • Protein hedefinin altındasın  │
│  • Cumartesi kalori aşımı (2800) │
│  • Ara öğünleri sık atlıyorsun  │
│                                   │
│  💡 Bu Hafta İçin Öneriler:       │
│  1. Kahvaltıya protein ekle      │
│  2. Hafta sonu porsiyon kontrolü │
│  3. Ara öğün alarmı kur          │
│                                   │
│  📈 Kilo Değişimi: -0.7 kg       │
│     Hedef hız: ✅ sağlıklı        │
│                                   │
│  [Diyetisyenime Gönder]          │
│  (Mod 2 kullanıcıları için)      │
└──────────────────────────────────┘
```

---

### 8. Tarif Keşfi

**Ekran 8.1 — Tarif Ana Sayfa**
```
🔍 Arama: [glutensiz mercimek köftesi]

Filtreler:
  ✅ Alerjilerime uygun (otomatik açık)
  Kalori: [max 500 kcal ▼]
  Süre: [max 30 dk ▼]
  Zorluk: [Kolay ▼]
  Öğün: [Akşam yemeği ▼]

Önerilen Tarifler:
  ┌──────────────────────────────────┐
  │ [📷 Fotoğraf]                    │
  │ Mercimek Köftesi                 │
  │ ⭐ 4.7 (234 değerlendirme)      │
  │ 🕐 25 dk | 🔥 280 kcal | Kolay │
  │ ✅ Alerjenlerine uygun           │
  │ 🏷️ #glutensiz #düşükkalorili    │
  └──────────────────────────────────┘

AI Önerileri:
  "Protein hedefin düşük, bu yüksek
   proteinli tarifler sana uygun:"
  → Tavuk sote (42g protein)
  → Nohutlu buddha bowl (28g protein)
```

**Ekran 8.2 — AI Tarif Üretici**
```
💬 "Elimde tavuk göğsü, brokoli ve
    pirinç var. Glutensiz, 400 kcal
    altında bir tarif öner"

🤖 AI:
  ┌──────────────────────────────────┐
  │  Teriyaki Tavuk Bowl              │
  │  🕐 25 dk | 🔥 380 kcal          │
  │  P: 38g | K: 35g | Y: 10g       │
  │  ✅ Glutensiz ✅ Laktozsuz        │
  │                                   │
  │  Malzemeler:                      │
  │  • Tavuk göğsü — 150g            │
  │  • Brokoli — 100g                │
  │  • Pirinç — 80g (kuru)           │
  │  • Soya sosu — 2 yk (glutensiz!) │
  │  • Bal — 1 tk                    │
  │  • Zencefil — 1 tk               │
  │                                   │
  │  Yapılışı:                        │
  │  1. Pirinci haşla (15 dk)        │
  │  2. Tavuğu küçük doğra, pişir   │
  │  3. Soya+bal+zencefil karıştır   │
  │  4. Brokoliyi 3 dk buharda piş  │
  │  5. Hepsini kaseye koy, sos dök │
  │                                   │
  │  [❤️ Favorilere Ekle]            │
  │  [📋 Malzemeleri Listeye Ekle]   │
  │  [✅ Bunu Yedim Olarak Kaydet]   │
  └──────────────────────────────────┘
```

---

### 9. Market Alışveriş Listesi

**Ekran 9.1 — Alışveriş Listesi**
```
📋 Bu Haftanın Listesi
   Oluşturan: Haftalık plan bazlı (AI)
   Tahmini maliyet: ~450 TL

🥩 Et & Protein
  ☐ Tavuk göğsü — 500g
  ☐ Somon fileto — 300g
  ☐ Yumurta — 15 adet
  ☐ Kuru mercimek — 500g

🥬 Sebze & Meyve
  ☐ Brokoli — 2 adet
  ☐ Domates — 1 kg
  ☐ Muz — 6 adet
  ☐ Elma — 5 adet

🌾 Kuru Gıda
  ☐ Pirinç — 1 kg
  ☐ Bulgur — 500g
  ⚠️ Glutensiz yulaf — 300g (normal yulaf ALMA!)

🥛 İçecek
  ☐ Badem sütü — 1 lt (süt yerine!)
  ☐ Laktozsuz yoğurt — 500g

[👥 Listeyi Paylaş]  ← Socket.io ile anlık paylaşım
[+ Manuel Ürün Ekle]
```

---

### 10. Diyetisyen Etkileşimi (Mod 2 Kullanıcıları)

**Ekran 10.1 — Diyetisyen Bul**
```
Yakındaki Diyetisyenler / Online:

  ┌──────────────────────────────────┐
  │ 👩‍⚕️ Dyt. Elif Kaya               │
  │ ⭐ 4.9 (87 değerlendirme)       │
  │ Uzmanlık: Alerji, Kilo Yönetimi│
  │ 📍 Online + Yüz yüze (Kadıköy) │
  │ 💰 Seans: 500 TL                │
  │ [Profili Gör] [Randevu Al]      │
  └──────────────────────────────────┘
```

**Ekran 10.2 — Diyetisyenle Mesajlaşma**
```
Socket.io ile anlık:

  👩‍⚕️ Dyt. Elif: "Haftalık raporunu
     inceledim. Protein eksikliğin var.
     Planını güncelledim, kontrol et."

  📋 [Yeni Plan Gönderildi — Aç]

  Sen: "Teşekkürler! Öğle yemeklerinde
  dışarıda yiyorum, glutensiz seçenek
  bulmak zor."

  👩‍⚕️ Dyt. Elif: "Şu restoran listesine
     bak, senin alerjilerine uygun
     seçenekleri işaretledim 👇"

  📎 [Alerji Dostu Restoranlar.pdf]
```

---

## 💻 WEB UYGULAMASI — Diyetisyen Paneli (React + Vite)

### 1. Giriş & Dashboard

**Sayfa 1.1 — Diyetisyen Dashboard**
```
┌──────────────────────────────────────────────────────────┐
│  Sidebar          │  Ana İçerik                           │
│  ─────────        │                                       │
│  📊 Dashboard     │  Hoş geldin, Dyt. Elif 👋             │
│  👥 Danışanlarım  │                                       │
│  📋 Plan Oluştur  │  ┌─────────┐ ┌─────────┐ ┌─────────┐│
│  💬 Mesajlar (3)  │  │ 24      │ │ 8       │ │ 3       ││
│  📅 Randevular    │  │ Aktif   │ │ Bugünkü │ │ Okunmamış│
│  📈 Raporlar      │  │ Danışan │ │ Randevu │ │ Mesaj   ││
│  🤖 AI Asistan    │  └─────────┘ └─────────┘ └─────────┘│
│  ⚙️ Ayarlar       │                                       │
│                    │  ⚠️ Dikkat Gerektiren Danışanlar:     │
│                    │                                       │
│                    │  🔴 Ahmet Y. — 3 gündür yemek         │
│                    │     kaydetmedi                        │
│                    │  🟡 Fatma K. — Protein hedefi         │
│                    │     altında (5 gün üst üste)         │
│                    │  🟡 Mehmet A. — Kilo artışı durdu     │
│                    │     (2 hafta değişim yok)            │
│                    │                                       │
│                    │  📅 Bugünkü Randevular:               │
│                    │  10:00 — Ayşe B. (online)            │
│                    │  14:00 — Can D. (yüz yüze)           │
│                    │  16:30 — Zeynep T. (online)          │
│                    │                                       │
│                    │  📊 Bu Haftanın Özeti:                │
│                    │  • 18 danışan planına uydu (%75)     │
│                    │  • 6 danışan hedefini tutturdu       │
│                    │  • Ortalama uyum oranı: %78          │
└──────────────────────────────────────────────────────────┘
```

---

### 2. Danışan Yönetimi

**Sayfa 2.1 — Danışan Listesi**
```
┌──────────────────────────────────────────────────────────┐
│  👥 Danışanlarım                    [🔍 Ara] [+ Davet Et]│
│                                                           │
│  Filtre: [Tümü ▼] [Hedefe göre ▼] [Duruma göre ▼]      │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Ad         │ Hedef      │ Kilo      │ Uyum  │ Durum│ │
│  ├─────────────┼────────────┼───────────┼───────┼──────┤ │
│  │ Ahmet Y.   │ Kilo verme │ 82→75 kg │  85%  │ ⚠️   │ │
│  │ Fatma K.   │ Kilo alma  │ 48→55 kg │  72%  │ ⚠️   │ │
│  │ Ayşe B.    │ Sağlıklı   │ 65 kg    │  91%  │ ✅   │ │
│  │ Can D.     │ Kilo verme │ 95→80 kg │  88%  │ ✅   │ │
│  │ Mehmet A.  │ Kas yapma  │ 70→78 kg │  65%  │ 🔴   │ │
│  └─────────────┴────────────┴───────────┴───────┴──────┘ │
│                                                           │
│  Her satıra tıkla → Danışan detay sayfası açılır         │
└──────────────────────────────────────────────────────────┘
```

**Sayfa 2.2 — Danışan Detay Sayfası**
```
┌──────────────────────────────────────────────────────────┐
│  👤 Ahmet Yılmaz                        [💬 Mesaj Gönder]│
│                                                           │
│  Tab: [Profil] [Beslenme] [Plan] [Gelişim] [Alerji]     │
│                                                           │
│  ═══ Profil ═══                                           │
│  Yaş: 28 | Boy: 178 cm | Kilo: 82 kg | Hedef: 75 kg    │
│  Hedef: Kilo verme | Aktivite: Orta | BMR: 1820        │
│  Günlük hedef: 1650 kcal | P:120g K:165g Y:55g         │
│                                                           │
│  🚨 Alerjiler: Gluten (ciddi), Laktoz (orta)            │
│  🥗 Tercih: Normal beslenme, Türk mutfağı               │
│  ❌ Sevmiyor: Brokoli, ciğer                             │
│                                                           │
│  ═══ Son 7 Günlük Beslenme (Anlık) ═══                   │
│  Bugün:                                                   │
│  ☑ Kahvaltı: Yulaf + muz (450 kcal) — 08:30            │
│  ☑ Öğle: Tavuk salata (520 kcal) — 12:45               │
│  ☐ Akşam: henüz kayıt yok                               │
│                                                           │
│  Haftalık kalori ortalaması: 1720 kcal (hedef: 1650)    │
│  Protein ortalaması: 98g (hedef: 120g) ⚠️               │
│                                                           │
│  ═══ Kilo Grafiği ═══                                     │
│  [Son 30 günlük çizgi grafik]                            │
│  Başlangıç: 85 kg → Şu an: 82 kg (−3 kg / 6 hafta)    │
│  AI tahmini: 14 hafta sonra hedefe ulaşır               │
│                                                           │
│  🤖 AI Asistan Özeti:                                     │
│  "Ahmet genel olarak plana uyuyor (%85 uyum).           │
│   Protein alımı düşük. Akşam öğünlerinde protein        │
│   ağırlıklı tarifler önerilmeli. Hafta sonları          │
│   kalori aşımı yaşıyor (dışarıda yemek).               │
│   Restoran seçenekleri konusunda rehberlik gerekli."     │
│                                                           │
│  [📋 Yeni Plan Yaz]  [📊 Detaylı Rapor]  [🤖 AI Analiz] │
└──────────────────────────────────────────────────────────┘
```

---

### 3. Plan Oluşturma (Diyetisyen)

**Sayfa 3.1 — Diyet Planı Yazma**
```
┌──────────────────────────────────────────────────────────┐
│  📋 Yeni Beslenme Planı                                   │
│                                                           │
│  Danışan: [Ahmet Yılmaz ▼]                              │
│  Süre: [1 hafta ▼]  Başlangıç: [19 Şub 2026]           │
│                                                           │
│  ⚠️ Danışan bilgileri:                                    │
│  Alerji: Gluten 🔴, Laktoz 🟡                            │
│  Hedef: 1650 kcal/gün | P:120g K:165g Y:55g            │
│  Sevmiyor: Brokoli, ciğer                                │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ Pzt │ Sal │ Çar │ Per │ Cum │ Cts │ Paz │          │ │
│  │ [◉] │ [○] │ [○] │ [○] │ [○] │ [○] │ [○] │          │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ═══ Pazartesi ═══                                        │
│                                                           │
│  🌅 Kahvaltı:                                             │
│  [Tarif seç veya yaz...                              🔍] │
│  Seçilen: Yulaf ezmesi + muz + bal                       │
│  450 kcal | P:12g K:75g Y:10g                           │
│  ✅ Alerjen kontrolü: Uygun                               │
│                                                           │
│  ☀️ Öğle:                                                  │
│  [Tarif seç veya yaz...                              🔍] │
│  Seçilen: —                                              │
│                                                           │
│  🌙 Akşam:                                                │
│  [Tarif seç veya yaz...                              🔍] │
│                                                           │
│  🍎 Ara Öğün:                                             │
│  [Tarif seç veya yaz...                              🔍] │
│                                                           │
│  Gün toplamı: 450 / 1650 kcal                           │
│                                                           │
│  ┌──────────────────────────────────────────┐            │
│  │  🤖 AI Yardımcısı                        │            │
│  │  [AI ile Bu Günü Doldur]                 │            │
│  │  [AI ile Tüm Haftayı Doldur]            │            │
│  │  [Öğün Önerisi Al]                      │            │
│  │                                          │            │
│  │  AI danışanın alerjilerini, hedeflerini  │            │
│  │  ve tercihlerini otomatik göz önünde     │            │
│  │  bulundurur.                             │            │
│  └──────────────────────────────────────────┘            │
│                                                           │
│  [Taslak Kaydet]  [Danışana Gönder]                      │
│  Gönderildiğinde danışana anlık bildirim gider            │
└──────────────────────────────────────────────────────────┘
```

**Sayfa 3.2 — AI Destekli Plan Oluşturma**
```
Diyetisyen AI'dan yardım istiyor:

  🤖 "Ahmet için Pazartesi öğle yemeği öner.
      Glutensiz, laktozsuz, 500 kcal civarı,
      protein ağırlıklı olsun."

  AI: "3 öneri hazırladım:

  1. Izgara tavuk + kinoa salatası
     490 kcal | P:42g K:38g Y:16g
     ✅ Glutensiz ✅ Laktozsuz

  2. Ton balıklı nohut salatası
     460 kcal | P:35g K:32g Y:18g
     ✅ Glutensiz ✅ Laktozsuz

  3. Mercimek köftesi + bulgur
     510 kcal | P:24g K:65g Y:12g
     ✅ Glutensiz ✅ Laktozsuz"

  Diyetisyen seçer veya düzenler → plana ekler
```

---

### 4. Anlık Danışan Takibi

**Sayfa 4.1 — Canlı Beslenme Takibi**
```
Socket.io ile anlık güncellenen ekran:

┌──────────────────────────────────────────────────────────┐
│  📡 Canlı Danışan Takibi               [Bugün: 18 Şub] │
│                                                           │
│  Danışan: [Ahmet Yılmaz ▼]                              │
│                                                           │
│  ┌──────────────── Bugün ────────────────┐               │
│  │                                        │               │
│  │  08:32 ✅ Kahvaltı kaydedildi          │               │
│  │     Yulaf + muz + bal (450 kcal)      │               │
│  │     📷 [fotoğraf]                      │               │
│  │     ✅ Plana uygun                     │               │
│  │                                        │               │
│  │  12:48 ✅ Öğle yemeği kaydedildi       │               │
│  │     Tavuk salata (520 kcal)           │               │
│  │     📷 [fotoğraf]                      │               │
│  │     ⚠️ Plandaki: Nohut salatası       │               │
│  │     (Plan dışı ama kalori uygun)      │               │
│  │                                        │               │
│  │  14:15 💧 Su: 4. bardak              │               │
│  │                                        │               │
│  │  — Akşam yemeği bekleniyor —          │               │
│  │                                        │               │
│  └────────────────────────────────────────┘               │
│                                                           │
│  Anlık Durum:                                             │
│  Kalori: 970 / 1650  ████████░░░░░░ %59                  │
│  Protein: 52g / 120g ████░░░░░░░░░░ %43 ⚠️              │
│  Su: 4 / 8 bardak    ████░░░░ %50                        │
│                                                           │
│  [💬 Mesaj At: "Akşam proteini unutma!"]                 │
└──────────────────────────────────────────────────────────┘

Anlık güncelleme:
  Danışan mobilden yemek kaydettiğinde
  → Socket.io ile bu ekran otomatik güncellenir
  → Diyetisyen sayfayı yenilemeden görür
```

---

### 5. Mesajlaşma

**Sayfa 5.1 — Mesajlaşma Paneli**
```
┌──────────────────────────────────────────────────────────┐
│  💬 Mesajlar                                              │
│                                                           │
│  Danışan Listesi:          Sohbet:                       │
│  ┌──────────────┐         ┌──────────────────────────┐   │
│  │🔴 Ahmet Y.   │         │ Ahmet Yılmaz ile sohbet  │   │
│  │  "Teşekkür..." │       │                          │   │
│  │  14:32        │         │ 👤 Ahmet (14:20):        │   │
│  ├──────────────┤         │ "Hocam öğlen dışarıda    │   │
│  │  Fatma K.    │         │  yedim, glutensiz bir    │   │
│  │  "Plan harika"│         │  şey bulamadım.          │   │
│  │  12:15        │         │  Makarna yedim 😔"       │   │
│  ├──────────────┤         │                          │   │
│  │  Can D.      │         │ 👩‍⚕️ Sen (14:25):          │   │
│  │  "Randevu..." │         │ "Sorun değil, bunu      │   │
│  │  dün         │         │  telafi edebiliriz.      │   │
│  └──────────────┘         │  Akşam yemeğini hafif    │   │
│                            │  tut. Şu tarifi dene:"  │   │
│                            │                          │   │
│                            │ 📎 [Glutensiz Sebze      │   │
│                            │     Çorbası Tarifi]      │   │
│                            │                          │   │
│                            │ [Mesaj yaz...] [Gönder]  │   │
│                            └──────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

### 6. Raporlar & Analiz

**Sayfa 6.1 — Danışan Raporu**
```
┌──────────────────────────────────────────────────────────┐
│  📈 Ahmet Yılmaz — Aylık Rapor                           │
│  Ocak 2026                                               │
│                                                           │
│  Kilo Değişimi:                                          │
│  [───────── Çizgi grafik ─────────]                      │
│  Başlangıç: 85 kg → Ay sonu: 82 kg (−3 kg)             │
│                                                           │
│  Makro Ortalamaları:                                     │
│  [───────── Bar grafik ─────────]                        │
│  Kalori: 1720/1650 (+%4) ⚠️                             │
│  Protein: 98g/120g (−%18) 🔴                            │
│  Karbonhidrat: 195g/165g (+%18) ⚠️                     │
│  Yağ: 58g/55g (+%5) ✅                                  │
│                                                           │
│  Plana Uyum: %78                                         │
│  [───────── Pasta grafik ─────────]                      │
│  Plana uygun öğünler: 68                                 │
│  Plan dışı öğünler: 19                                   │
│  Atlanan öğünler: 5                                      │
│                                                           │
│  Alerji İhlalleri: 2 kez                                 │
│  • 12 Ocak: Restoranda gluten (reaksiyon: karın ağrısı) │
│  • 25 Ocak: Çikolata (süt içerikli)                     │
│                                                           │
│  🤖 AI Özeti:                                             │
│  "Ahmet kilo verme hedefinde iyi ilerliyor.             │
│   Ana sorun: protein yetersizliği ve hafta sonu          │
│   kalori aşımı. Restoran yemeklerinde alerjen           │
│   ihlali riski yüksek. Öneri: Dışarı yemek             │
│   rehberi hazırlanmalı."                                 │
│                                                           │
│  [📄 PDF Olarak İndir] [📤 Danışana Gönder]              │
└──────────────────────────────────────────────────────────┘
```

---

### 7. AI Asistan (Diyetisyen İçin)

**Sayfa 7.1 — AI Analiz Araçları**
```
┌──────────────────────────────────────────────────────────┐
│  🤖 AI Asistan — Diyetisyen Araçları                      │
│                                                           │
│  Danışan: [Ahmet Yılmaz ▼]                              │
│                                                           │
│  Hızlı Eylemler:                                         │
│                                                           │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │ 📊 Haftalık      │  │ 🍽️ Plan Önerisi │               │
│  │ Analiz Oluştur   │  │ AI ile Haftalık │               │
│  │                   │  │ Plan Yaz        │               │
│  └─────────────────┘  └─────────────────┘               │
│                                                           │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │ ⚠️ Eksiklik      │  │ 🔮 İlerleme     │               │
│  │ Tespiti          │  │ Tahmini         │               │
│  │ (vitamin/mineral)│  │ (hedefe ne zaman)│               │
│  └─────────────────┘  └─────────────────┘               │
│                                                           │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │ 🚨 Risk          │  │ 📝 Özet Rapor   │               │
│  │ Analizi          │  │ Oluştur         │               │
│  │ (alerji ihlali)  │  │ (PDF)           │               │
│  └─────────────────┘  └─────────────────┘               │
│                                                           │
│  💬 Serbest Soru:                                         │
│  [AI'a danışanla ilgili herhangi bir soru sor...]       │
│                                                           │
│  Örnek sorular:                                          │
│  • "Ahmet'in en çok eksik kaldığı besinler neler?"      │
│  • "Hafta sonları neden kalori aşıyor?"                  │
│  • "Protein alımını artırmak için 5 pratik öneri ver"    │
│  • "Bu danışan için 3 aylık ilerleme projeksiyonu yap"  │
└──────────────────────────────────────────────────────────┘
```

---

## 🔧 WEB — Admin Paneli

```
Sayfalar:

1. Dashboard
   → Toplam kullanıcı, aktif diyetisyen, günlük kayıt sayısı
   → En yaygın alerjiler (grafik)
   → Kullanıcı hedef dağılımı (pasta grafik)
   → Sistem sağlığı

2. Besin Veritabanı Yönetimi
   → Besin ekle/düzenle/sil
   → Kalori ve makro değerleri
   → Alerjen etiketleme
   → Barkod eşleştirme
   → Toplu import (CSV/Excel)

3. Alerjen Yönetimi
   → Alerjen listesi ekle/düzenle
   → Çapraz reaksiyon tanımları
   → Alternatif besin eşleştirmeleri

4. Tarif Moderasyonu
   → Kullanıcı gönderdiği tarifleri onayla/reddet
   → Alerjen bilgisi doğrulama
   → Öne çıkan tarifler

5. Diyetisyen Yönetimi
   → Başvuruları incele (diploma kontrolü)
   → Onayla/Reddet
   → Değerlendirmeleri izle

6. Kullanıcı Yönetimi
   → Kullanıcı listesi, filtreleme
   → Hesap işlemleri

7. Raporlar
   → Platform kullanım istatistikleri
   → Alerji dağılım raporları
   → Popüler tarifler
   → Diyetisyen performans metrikleri
```

---

## 🔄 Socket.io Akışları (Detaylı)

### Akış 1: Danışan Yemek Kaydediyor
```
Danışan mobilden yemek kaydeder
  → Backend PostgreSQL'e INSERT
  → Backend Socket.io emit: 'client:meal_logged'
  → Diyetisyen web panelinde danışan detay sayfası anlık güncellenir
  → Eğer alerjen ihlali varsa: 'notification:allergen_violation'
  → Diyetisyen anlık uyarı alır
```

### Akış 2: Diyetisyen Plan Gönderir
```
Diyetisyen webden plan oluşturup "Gönder" der
  → Backend PostgreSQL'e INSERT (meal_plans + meal_plan_items)
  → Backend Socket.io emit: 'plan:created'
  → Danışanın mobil uygulamasında anlık bildirim
  → "Diyetisyeniniz yeni beslenme planınızı gönderdi!"
  → Danışan planı açıp görebilir
```

### Akış 3: Paylaşımlı Alışveriş Listesi
```
Kullanıcı A listeden ürün işaretler
  → Backend PostgreSQL UPDATE
  → Socket.io emit: 'shopping:item_checked'
  → Kullanıcı B'nin ekranında ürün anlık işaretlenir
```

### Akış 4: Mesajlaşma
```
Diyetisyen mesaj yazar
  → Backend PostgreSQL INSERT
  → Socket.io emit: 'message:new'
  → Danışanın mobil uygulamasında anlık mesaj + bildirim
  → (Tersi de aynı şekilde çalışır)
```

---

## 📊 Toplam Ekran/Sayfa Sayısı (Güncellenmiş)

### Mobil (Kullanıcı Uygulaması)
| Bölüm | Ekran Sayısı |
|-------|-------------|
| Onboarding (Wizard) | 8 |
| Dashboard | 1 |
| Öğün Yönetimi | 5 (liste, ekleme, barkod, fotoğraf, AI anlat) |
| Alerji Merkezi | 4 (profil, güvenli rehber, tarayıcı, günlük) |
| AI Asistan (Chat) | 1 |
| Haftalık Plan | 2 (plan görünümü, gün detayı) |
| Gelişim Takibi | 3 (kilo, besinler, haftalık rapor) |
| Tarif Keşfi | 3 (ana, detay, AI üretici) |
| Alışveriş Listesi | 2 |
| Diyetisyen (Mod 2) | 3 (bul, profil, mesajlaşma) |
| Topluluk | 3 (gruplar, paylaşımlar, challenge) |
| Profil & Ayarlar | 2 |
| **TOPLAM MOBİL** | **~37 ekran** |

### Web (Diyetisyen + Admin Paneli)
| Bölüm | Sayfa Sayısı |
|-------|-------------|
| Auth (Giriş/Kayıt) | 2 |
| Diyetisyen Dashboard | 1 |
| Danışan Listesi | 1 |
| Danışan Detay | 1 (tab'lı: profil, beslenme, plan, gelişim, alerji) |
| Plan Oluşturma | 2 (manuel + AI destekli) |
| Canlı Takip | 1 |
| Mesajlaşma | 1 |
| Raporlar | 2 (danışan raporu + genel istatistik) |
| AI Asistan | 1 |
| Randevu Yönetimi | 1 |
| Ayarlar (Profil, Fiyat) | 1 |
| Admin Dashboard | 1 |
| Admin Besin DB | 1 |
| Admin Alerjen Yönetimi | 1 |
| Admin Tarif Moderasyon | 1 |
| Admin Diyetisyen Yönetimi | 1 |
| Admin Kullanıcı Yönetimi | 1 |
| Admin Raporlar | 1 |
| **TOPLAM WEB** | **~21 sayfa** |

### GENEL TOPLAM: ~58 ekran/sayfa

---

## 🏆 Güncellenmiş Demo Senaryosu (Jüri Sunumu)

```
BÖLÜM 1 — Kullanıcı Deneyimi (5 dk):
  1. Telefondan kayıt ol, wizard'ı geç (alerji: gluten+laktoz, hedef: kilo ver)
  2. AI kalori hedefi hesaplasın
  3. AI'dan haftalık plan iste → plan + alışveriş listesi gelsin
  4. Barkod tara → "⚠️ GLUTEN VAR!" uyarısı → jüri etkilenir
  5. Yemek fotoğrafı çek → AI tanısın

BÖLÜM 2 — Diyetisyen Deneyimi (5 dk):
  6. Bilgisayardan diyetisyen paneline gir
  7. Danışan listesini göster, birine tıkla
  8. Danışanın anlık beslenme verilerini göster
  9. AI yardımıyla plan oluştur
  10. "Danışana Gönder" → mobilden anlık bildirim gelsin

BÖLÜM 3 — Gerçek Zamanlı Demo (2 dk):
  11. Telefondan yemek kaydet → web panelinde anlık görünsün
  12. Web'den mesaj at → telefonda anlık gelsin

TOPLAM: ~12 dakika, son derece etkileyici demo
```

---

*Bu doküman NutriAI projesinin v2 detaylı versiyonudur.*
*Web = Diyetisyen Paneli + Admin | Mobil = Kullanıcı Uygulaması*
*İki mod: AI destekli bağımsız kullanım + Diyetisyenli profesyonel takip*
