# NutriAI v3 — Profesyonel Proje Spesifikasyonu (Bitirme Projesi)

> **Versiyon:** 3.0 | **Tarih:** 23 Subat 2026
> **Turu:** Bitirme Projesi — Yapay Zeka Destekli Beslenme Takip Platformu

---

## 1. TEKNOLOJI STACK (TAMAMEN UCRETSIZ)

```
┌──────────────────────────────────────────────────────────────┐
│                    UCRETSIZ TEKNOLOJI STACK                   │
│                                                               │
│  KATMAN              TEKNOLOJI              NEDEN UCRETSIZ?   │
│  ─────────────────── ─────────────────────  ──────────────── │
│  AI Motor            Google Gemini 2.0 Flash Ucretsiz tier:  │
│                      + Gemini Vision API     15 req/dk       │
│                                              1500 req/gun    │
│                                              Foto analiz var │
│                                                               │
│  Backend             Node.js + Express       Acik kaynak      │
│                      + Socket.io             Acik kaynak      │
│                                                               │
│  Veritabani          PostgreSQL              Acik kaynak      │
│                      Docker Container        Acik kaynak      │
│                      docker-compose ile      Lokal calisir    │
│                                                               │
│  Web (Diyetisyen)    React + Vite            Acik kaynak      │
│                      TailwindCSS             Acik kaynak      │
│                      shadcn/ui               Acik kaynak      │
│                      Recharts (grafikler)    Acik kaynak      │
│                                                               │
│  Mobil (Hasta)       Expo (React Native)     Acik kaynak      │
│                      Victory Native (grafik) Acik kaynak      │
│                      Expo Camera/ImagePicker Ucretsiz         │
│                                                               │
│  Gercek Zamanli      Socket.io               Kendi sunucumuz  │
│                      (backend ile birlikte)  Acik kaynak      │
│                                                               │
│  Auth                JWT (jsonwebtoken)       Acik kaynak      │
│                      bcrypt                  Acik kaynak      │
│                      Google OAuth (ucretsiz) Google Cloud     │
│                                                               │
│  Push Bildirim       Firebase Cloud Messaging Tamamen ucretsiz│
│                      (FCM) — sinir yok       Google servisi   │
│                      Expo Notifications      Ucretsiz         │
│                                                               │
│  Foto Depolama       Cloudinary              25GB bant genisligi│
│                      (ucretsiz tier)         25K donusum/ay   │
│                      veya lokal disk         Sunucu uzerinde  │
│                                                               │
│  Barkod Veritabani   Open Food Facts API     Acik kaynak      │
│                      3M+ urun               Tamamen ucretsiz  │
│                                                               │
│  OCR (Etiket Okuma)  Google ML Kit           On-device        │
│                      (Expo ile)              Tamamen ucretsiz  │
│                                                               │
│  Sesli Giris         Expo Speech-to-Text     On-device        │
│                      (react-native-voice)    Ucretsiz         │
│                                                               │
│  Video Gorusme       Jitsi Meet API          Acik kaynak      │
│                      (embed/iframe)          Sinir yok        │
│                                                               │
│  PDF Rapor           jsPDF + html2canvas     Acik kaynak      │
│                      (client-side)           Ucretsiz         │
│                                                               │
│  Harita              OpenStreetMap + Leaflet Acik kaynak      │
│                      (diyetisyen bul)        Tamamen ucretsiz  │
│                                                               │
│  Email               Resend                  3000 email/ay    │
│                      (dogrulama, bildirim)   Ucretsiz tier    │
│                                                               │
│  Hosting (opsiyonel) Render.com (backend)    Ucretsiz tier    │
│                      Vercel (web)            Ucretsiz tier    │
│                      Expo Go (mobil test)    Ucretsiz         │
│                                                               │
│  TOPLAM MALIYET: 0 TL                                        │
└──────────────────────────────────────────────────────────────┘
```

### Neden Docker + PostgreSQL?

```
Supabase yerine Docker + PostgreSQL secme nedenleri:

1. TEKNIK DERINLIK
   - Bitirme projesinde "kendi altyapimi yonetiyorum" demek buyuk arti
   - Docker bilgisi gostermek juri icin etkileyici
   - Veritabani sema tasarimi, migration, index — hepsini sen yonetirsin

2. TAM KONTROL
   - Supabase'de sinirli ozellikler (ucretsiz tier 500MB)
   - Docker'da sinir yok, lokal makinende istedigin kadar veri
   - Custom function, trigger, stored procedure yazabilirsin

3. TASINABILIRLIK
   - docker-compose up tek komutla tum sistem ayaga kalkar
   - Juri bunu kendi bilgisayarinda calistirabilir
   - Sunucuya bagimliligin yok

4. OGRENME DEGERI
   - Gercek dunya projelerinde Docker + PostgreSQL standart
   - Bu tecrube is basvurularinda cok degerli
```

---

## 2. PROJE VIZYONU

NutriAI, hastalarin mobil uygulama uzerinden beslenme takibi yapabilecegi, diyetisyenlerin ise web paneli uzerinden hastalarini yonetebilecegi, yapay zeka destekli profesyonel bir beslenme platformudur.

```
┌──────────────────────────────────────────────────────────────────┐
│                        NutriAI Platform                          │
│                                                                  │
│  MOBIL (Expo/RN)                    WEB (React/Vite)             │
│  ┌──────────────┐                  ┌──────────────────┐          │
│  │ Hasta App    │                  │ Diyetisyen Panel │          │
│  │              │◄── Socket.io ──►│                  │          │
│  │ - Kayit/Giris│    (gercek     │ - Hasta takibi   │          │
│  │ - Ogun takip │     zamanli)   │ - Plan yazma     │          │
│  │ - AI analiz  │                  │ - Foto inceleme  │          │
│  │ - Foto cekme │                  │ - Mesajlasma     │          │
│  │ - Sesli kayit│                  │ - Video gorusme  │          │
│  │ - Barkod/OCR │                  │ - Raporlar       │          │
│  │ - Mesajlasma │                  │ - Randevu        │          │
│  │ - Gamification│                 │ - AI Asistan     │          │
│  └──────┬───────┘                  └────────┬─────────┘          │
│         │                                    │                    │
│         │         ┌──────────────┐          │                    │
│         └────────►│   Backend    │◄─────────┘                    │
│                   │  Node.js +   │                                │
│                   │  Express +   │                                │
│                   │  Socket.io   │                                │
│                   └──────┬───────┘                                │
│                          │                                        │
│              ┌───────────┼───────────┐                            │
│              │           │           │                            │
│       ┌──────┴──────┐ ┌─┴──────┐ ┌──┴───────┐                   │
│       │ PostgreSQL  │ │Firebase│ │ Gemini   │                   │
│       │ (Docker)    │ │ (FCM)  │ │ AI API   │                   │
│       └─────────────┘ └────────┘ └──────────┘                   │
└──────────────────────────────────────────────────────────────────┘
```

### Temel Fark: Diyetisyen Eslestirme Kodu Sistemi

```
AKIS:
1. Diyetisyen web panelinden kayit olur → Admin onaylar
2. Sistem otomatik benzersiz KOD uretir (ornek: DYT-ELIF-7X3K)
3. Diyetisyen bu kodu hastasina verir (WhatsApp, yuz yuze, QR vs.)
4. Hasta mobil uygulamadan kayit olurken kodu girer
5. Sistem kodu dogrular → hasta otomatik o diyetisyenin paneline duser
6. Hasta kodu yoksa "Kendi basima kullanacagim" secer → AI modunda baslar
7. Hasta istediginde Ayarlar'dan diyetisyen kodu girebilir (mod degistirme)
```

### Iki Kullanim Modu

| Mod | Aciklama | Kim Icin? |
|-----|----------|-----------|
| **Mod 1: Bireysel (AI Destekli)** | Hasta diyetisyen olmadan kendi basina kullanir. Gemini AI beslenme plani olusturur, takip eder | Kendi basina diyet yapanlar, ogrenciler, butcesi kisitli olanlar |
| **Mod 2: Profesyonel (Diyetisyenli)** | Hasta bir diyetisyenle eslesir. Diyetisyen web panelinden plan yazar, takip eder, foto inceler | Profesyonel destek isteyenler, kronik hastaligi olanlar |

---

## 3. VERITABANI SEMASI (PostgreSQL — Docker)

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    container_name: nutriai-db
    environment:
      POSTGRES_DB: nutriai
      POSTGRES_USER: nutriai_user
      POSTGRES_PASSWORD: nutriai_pass
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./backend/src/db/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  backend:
    build: ./backend
    container_name: nutriai-backend
    environment:
      DATABASE_URL: postgresql://nutriai_user:nutriai_pass@postgres:5432/nutriai
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      JWT_SECRET: ${JWT_SECRET}
      FIREBASE_CONFIG: ${FIREBASE_CONFIG}
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  pgdata:
```

### 3.1 Kullanici ve Kimlik Tablolari

```sql
-- ═══════════════════════════════════════════
-- KULLANICI VE KIMLIK
-- ═══════════════════════════════════════════

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'dietitian', 'admin')),
    auth_provider VARCHAR(20) DEFAULT 'email', -- email, google, apple
    auth_provider_id VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    fcm_token TEXT, -- Firebase Cloud Messaging token (push bildirim)
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Hasta profili
CREATE TABLE patient_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'unspecified')),
    height_cm DECIMAL(5,1) NOT NULL,
    current_weight_kg DECIMAL(5,1) NOT NULL,
    target_weight_kg DECIMAL(5,1),
    activity_level VARCHAR(20) CHECK (activity_level IN ('sedentary','light','active','very_active')),
    goal_type VARCHAR(30) CHECK (goal_type IN ('lose_weight','gain_weight','build_muscle','maintain','disease_based')),
    goal_duration_weeks INTEGER,
    diet_type VARCHAR(30) DEFAULT 'normal', -- normal, vegetarian, vegan, pescatarian
    cuisine_preferences TEXT[], -- ['turk','akdeniz','asya']
    disliked_foods TEXT[],
    religious_preferences TEXT[], -- ['helal','koser']
    daily_water_target INTEGER DEFAULT 8,
    sleep_hours VARCHAR(10),
    usage_mode VARCHAR(20) DEFAULT 'ai_independent', -- ai_independent, with_dietitian
    -- Hesaplanan degerler
    bmr DECIMAL(7,2),
    tdee DECIMAL(7,2),
    daily_calorie_target DECIMAL(7,2),
    protein_target_g DECIMAL(5,1),
    carb_target_g DECIMAL(5,1),
    fat_target_g DECIMAL(5,1),
    -- Profil
    profile_photo_url TEXT,
    onboarding_completed BOOLEAN DEFAULT false,
    -- Gamification
    xp_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    -- Tercihler
    dark_mode BOOLEAN DEFAULT false,
    language VARCHAR(5) DEFAULT 'tr', -- tr, en
    notification_enabled BOOLEAN DEFAULT true,
    intermittent_fasting_enabled BOOLEAN DEFAULT false,
    fasting_type VARCHAR(10), -- '16:8', '18:6', '20:4'
    fasting_start_hour INTEGER, -- ornek: 20 (aksam 8)
    fasting_end_hour INTEGER, -- ornek: 12 (ogle 12)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Diyetisyen profili
CREATE TABLE dietitian_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(50), -- 'Uzm. Dyt.', 'Prof. Dr.'
    license_number VARCHAR(50) UNIQUE,
    diploma_url TEXT, -- yuklenen diploma/lisans belgesi
    specializations TEXT[], -- ['alerji','kilo_yonetimi','diyabet','sporcu_beslenmesi']
    university VARCHAR(200),
    experience_years INTEGER,
    bio TEXT,
    profile_photo_url TEXT,
    clinic_name VARCHAR(200),
    clinic_address TEXT,
    city VARCHAR(100),
    offers_online BOOLEAN DEFAULT true,
    offers_in_person BOOLEAN DEFAULT false,
    session_price_tl DECIMAL(10,2),
    -- ESLESTIRME KODU SISTEMI
    invite_code VARCHAR(20) UNIQUE NOT NULL, -- DYT-ELIF-7X3K
    max_patients INTEGER DEFAULT 50,
    -- Randevu ayarlari
    available_days TEXT[], -- ['monday','tuesday','wednesday']
    available_hours JSONB, -- {"monday": ["09:00","10:00","14:00"], ...}
    session_duration_min INTEGER DEFAULT 45,
    -- Onay sistemi
    is_approved BOOLEAN DEFAULT false,
    approval_date TIMESTAMP,
    rejected_reason TEXT,
    -- Puanlama
    rating_avg DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Diyetisyen-Hasta iliskisi
CREATE TABLE dietitian_patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dietitian_id UUID REFERENCES dietitian_profiles(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active', -- active, paused, ended
    paired_via VARCHAR(20) DEFAULT 'invite_code', -- invite_code, search, referral
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    notes TEXT,
    UNIQUE(dietitian_id, patient_id)
);

-- Diyetisyen puanlama/yorum
CREATE TABLE dietitian_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dietitian_id UUID REFERENCES dietitian_profiles(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(dietitian_id, patient_id) -- hasta basina 1 yorum
);
```

### 3.2 Alerji ve Saglik Tablolari

```sql
-- ═══════════════════════════════════════════
-- ALERJI VE SAGLIK
-- ═══════════════════════════════════════════

CREATE TABLE allergens (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    category VARCHAR(50),
    icon VARCHAR(10),
    description TEXT,
    cross_reactions TEXT[]
);

CREATE TABLE patient_allergies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    allergen_id INTEGER REFERENCES allergens(id),
    severity VARCHAR(20) CHECK (severity IN ('mild','moderate','severe')),
    diagnosed_by VARCHAR(200),
    diagnosis_date DATE,
    is_self_reported BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE patient_conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    condition_type VARCHAR(50),
    details TEXT,
    diagnosed_date DATE,
    medications TEXT[],
    doctor_name VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Alerji reaksiyon gunlugu
CREATE TABLE allergy_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    reaction_date TIMESTAMP NOT NULL,
    food_consumed TEXT NOT NULL,
    symptoms TEXT[] NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('mild','moderate','severe')),
    notes TEXT,
    photo_url TEXT, -- reaksiyon fotosu (opsiyonel)
    created_at TIMESTAMP DEFAULT NOW()
);

-- Kan degeri takibi
CREATE TABLE blood_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    value_type VARCHAR(50) NOT NULL,
    -- 'fasting_glucose', 'postprandial_glucose', 'hba1c',
    -- 'ldl', 'hdl', 'total_cholesterol', 'triglyceride',
    -- 'iron', 'b12', 'vitamin_d', 'hemoglobin'
    value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- 'mg/dL', 'ng/mL', '%', 'g/dL'
    measured_at DATE NOT NULL,
    lab_name VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.3 Besin ve Ogun Tablolari

```sql
-- ═══════════════════════════════════════════
-- BESIN VE OGUN
-- ═══════════════════════════════════════════

CREATE TABLE foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    category VARCHAR(50),
    -- Makro besinler (100g basina)
    calories_per_100g DECIMAL(7,2),
    protein_per_100g DECIMAL(5,2),
    carbs_per_100g DECIMAL(5,2),
    fat_per_100g DECIMAL(5,2),
    fiber_per_100g DECIMAL(5,2),
    sugar_per_100g DECIMAL(5,2),
    sodium_per_100g DECIMAL(5,2),
    -- Mikro besinler (100g basina) — VITAMIN/MINERAL TAKIBI
    iron_mg DECIMAL(5,2),
    calcium_mg DECIMAL(7,2),
    vitamin_b12_mcg DECIMAL(5,2),
    vitamin_d_mcg DECIMAL(5,2),
    vitamin_c_mg DECIMAL(5,2),
    zinc_mg DECIMAL(5,2),
    magnesium_mg DECIMAL(5,2),
    potassium_mg DECIMAL(7,2),
    -- Diger
    allergen_ids INTEGER[],
    barcode VARCHAR(50),
    serving_size_g DECIMAL(5,1) DEFAULT 100,
    serving_description VARCHAR(100),
    is_verified BOOLEAN DEFAULT false,
    image_url TEXT,
    season TEXT[], -- mevsimsel: ['spring','summer','fall','winter']
    avg_price_tl DECIMAL(10,2), -- ortalama fiyat (butce onerisi icin)
    created_at TIMESTAMP DEFAULT NOW()
);

-- Gunluk ogunler
CREATE TABLE meal_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
    log_date DATE NOT NULL,
    logged_at TIMESTAMP DEFAULT NOW(),
    -- Kayit yontemi
    entry_method VARCHAR(20) DEFAULT 'manual',
    -- 'manual', 'photo_ai', 'barcode', 'voice', 'ocr', 'text_ai'
    -- AI analiz
    photo_url TEXT,
    ai_analysis_raw JSONB,
    ai_recognized_foods JSONB,
    user_confirmed BOOLEAN DEFAULT false,
    -- Toplam degerler
    total_calories DECIMAL(7,2),
    total_protein DECIMAL(5,2),
    total_carbs DECIMAL(5,2),
    total_fat DECIMAL(5,2),
    -- Mikro besinler toplam
    total_iron_mg DECIMAL(5,2),
    total_calcium_mg DECIMAL(7,2),
    total_vitamin_b12_mcg DECIMAL(5,2),
    total_vitamin_d_mcg DECIMAL(5,2),
    total_vitamin_c_mg DECIMAL(5,2),
    -- Ruh hali takibi — DUYGUSAL YEME
    mood VARCHAR(20), -- 'happy','sad','stressed','neutral','angry','anxious'
    hunger_level INTEGER CHECK (hunger_level BETWEEN 1 AND 5), -- 1=hic acikmadim, 5=cok aciktim
    -- Diyetisyene iletim
    sent_to_dietitian BOOLEAN DEFAULT false,
    dietitian_viewed BOOLEAN DEFAULT false,
    dietitian_viewed_at TIMESTAMP,
    dietitian_feedback TEXT,
    dietitian_feedback_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ogun icindeki besinler
CREATE TABLE meal_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_log_id UUID REFERENCES meal_logs(id) ON DELETE CASCADE,
    food_id INTEGER REFERENCES foods(id),
    food_name VARCHAR(200) NOT NULL,
    -- AI TAHMINI vs KULLANICI DUZELTMESI
    ai_estimated_amount_g DECIMAL(7,1),
    user_adjusted_amount_g DECIMAL(7,1),
    final_amount_g DECIMAL(7,1) NOT NULL,
    -- Hesaplanan besin degerleri
    calories DECIMAL(7,2),
    protein DECIMAL(5,2),
    carbs DECIMAL(5,2),
    fat DECIMAL(5,2),
    -- Mikro besinler
    iron_mg DECIMAL(5,2),
    calcium_mg DECIMAL(7,2),
    vitamin_b12_mcg DECIMAL(5,2),
    vitamin_d_mcg DECIMAL(5,2),
    vitamin_c_mg DECIMAL(5,2),
    -- Alerjen
    allergen_warning BOOLEAN DEFAULT false,
    allergen_ids INTEGER[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Beslenme planlari
CREATE TABLE meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    created_by_type VARCHAR(20) NOT NULL CHECK (created_by_type IN ('dietitian', 'ai')),
    created_by_dietitian_id UUID REFERENCES dietitian_profiles(id),
    title VARCHAR(200),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    daily_calorie_target DECIMAL(7,2),
    daily_protein_target DECIMAL(5,1),
    daily_carb_target DECIMAL(5,1),
    daily_fat_target DECIMAL(5,1),
    special_notes TEXT,
    status VARCHAR(20) DEFAULT 'active',
    is_budget_friendly BOOLEAN DEFAULT false, -- butce dostu plan
    estimated_weekly_cost_tl DECIMAL(10,2),
    sent_at TIMESTAMP,
    patient_viewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE meal_plan_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    meal_type VARCHAR(20) NOT NULL,
    food_name VARCHAR(200) NOT NULL,
    amount_g DECIMAL(7,1),
    calories DECIMAL(7,2),
    protein DECIMAL(5,2),
    carbs DECIMAL(5,2),
    fat DECIMAL(5,2),
    recipe_id UUID,
    alternatives TEXT,
    notes TEXT,
    sort_order INTEGER DEFAULT 0
);
```

### 3.4 Gamification Tablolari

```sql
-- ═══════════════════════════════════════════
-- GAMIFICATION (OYUNLASTIRMA)
-- ═══════════════════════════════════════════

-- Rozet tanimlari
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- '7 Gun Seri', 'Protein Sampiyonu'
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL, -- emoji veya icon ismi
    category VARCHAR(50), -- 'streak','nutrition','water','weight','social'
    requirement_type VARCHAR(50) NOT NULL,
    -- 'streak_days', 'total_meals_logged', 'water_goal_days',
    -- 'weight_milestone', 'plan_adherence', 'photo_count'
    requirement_value INTEGER NOT NULL, -- ornek: 7 (7 gunluk seri)
    xp_reward INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT true
);

-- Hasta rozet kazanimlari
CREATE TABLE patient_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id),
    earned_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(patient_id, badge_id)
);

-- Haftalik challenge'lar
CREATE TABLE weekly_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    challenge_type VARCHAR(50) NOT NULL,
    -- 'plan_adherence', 'water_goal', 'photo_all_meals',
    -- 'no_allergen_violation', 'protein_target', 'exercise_days'
    target_value INTEGER NOT NULL,
    xp_reward INTEGER DEFAULT 100,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Hasta challenge katilimi
CREATE TABLE patient_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES weekly_challenges(id),
    current_progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    joined_at TIMESTAMP DEFAULT NOW()
);

-- XP gecmisi
CREATE TABLE xp_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    xp_amount INTEGER NOT NULL,
    reason VARCHAR(100) NOT NULL,
    -- 'meal_logged', 'photo_uploaded', 'streak_bonus',
    -- 'badge_earned', 'challenge_completed', 'weight_logged',
    -- 'water_goal_reached', 'plan_followed'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seviye tanimlari
-- Level 1: 0 XP, Level 2: 100 XP, Level 3: 300 XP, ...
-- Her seviyede unlockable ozellikler olabilir
```

### 3.5 Takip ve Analiz Tablolari

```sql
-- ═══════════════════════════════════════════
-- TAKIP VE ANALIZ
-- ═══════════════════════════════════════════

CREATE TABLE weight_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    weight_kg DECIMAL(5,1) NOT NULL,
    measured_at TIMESTAMP DEFAULT NOW(),
    photo_url TEXT, -- ilerleme fotosu
    notes TEXT
);

CREATE TABLE water_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    glasses INTEGER NOT NULL DEFAULT 1,
    logged_at TIMESTAMP DEFAULT NOW()
);

-- Egzersiz takibi
CREATE TABLE exercise_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    exercise_type VARCHAR(100) NOT NULL, -- 'yuruyus','kosma','agirlik','yuzme','yoga'
    duration_min INTEGER NOT NULL,
    calories_burned DECIMAL(7,2),
    intensity VARCHAR(20) CHECK (intensity IN ('low','moderate','high')),
    notes TEXT,
    logged_at TIMESTAMP DEFAULT NOW()
);

-- Uyku takibi
CREATE TABLE sleep_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    sleep_start TIMESTAMP NOT NULL,
    sleep_end TIMESTAMP NOT NULL,
    quality VARCHAR(20) CHECK (quality IN ('poor','fair','good','excellent')),
    notes TEXT,
    logged_at TIMESTAMP DEFAULT NOW()
);

-- Ilerleme fotolari (before/after)
CREATE TABLE progress_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    photo_type VARCHAR(20) DEFAULT 'front', -- 'front','side','back'
    weight_at_time DECIMAL(5,1),
    notes TEXT,
    taken_at TIMESTAMP DEFAULT NOW()
);
```

### 3.6 Iletisim Tablolari

```sql
-- ═══════════════════════════════════════════
-- ILETISIM VE BILDIRIM
-- ═══════════════════════════════════════════

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    sender_id UUID REFERENCES users(id),
    receiver_id UUID REFERENCES users(id),
    message_type VARCHAR(20) DEFAULT 'text',
    -- 'text','image','file','plan_share','meal_share','voice'
    content TEXT,
    attachment_url TEXT,
    metadata JSONB,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    -- 'meal_reminder', 'water_reminder', 'new_plan',
    -- 'allergen_warning', 'dietitian_message', 'weekly_report',
    -- 'weight_milestone', 'badge_earned', 'streak_warning',
    -- 'appointment_reminder', 'fasting_start', 'fasting_end',
    -- 'exercise_reminder', 'blood_value_reminder',
    -- 'dietitian_feedback', 'challenge_completed'
    title VARCHAR(200),
    body TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    is_pushed BOOLEAN DEFAULT false, -- FCM ile gonderildi mi
    created_at TIMESTAMP DEFAULT NOW()
);

-- Randevu sistemi
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dietitian_id UUID REFERENCES dietitian_profiles(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    type VARCHAR(20) DEFAULT 'online', -- 'online','in_person'
    status VARCHAR(20) DEFAULT 'scheduled',
    -- 'scheduled','confirmed','completed','cancelled','no_show'
    jitsi_room_id VARCHAR(100), -- video gorusme icin
    notes TEXT,
    dietitian_notes TEXT, -- gorusme sonrasi not
    patient_notes TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.7 Tarif ve Alisveris Tablolari

```sql
-- ═══════════════════════════════════════════
-- TARIF VE ALISVERIS
-- ═══════════════════════════════════════════

CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    instructions TEXT NOT NULL,
    prep_time_min INTEGER,
    cook_time_min INTEGER,
    servings INTEGER DEFAULT 1,
    calories_per_serving DECIMAL(7,2),
    protein_per_serving DECIMAL(5,2),
    carbs_per_serving DECIMAL(5,2),
    fat_per_serving DECIMAL(5,2),
    difficulty VARCHAR(20) DEFAULT 'easy',
    allergen_ids INTEGER[],
    image_url TEXT,
    ingredients JSONB NOT NULL,
    tags TEXT[],
    season TEXT[], -- mevsimsel tarif
    estimated_cost_tl DECIMAL(10,2), -- tahmini maliyet
    is_ai_generated BOOLEAN DEFAULT false,
    is_budget_friendly BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    is_approved BOOLEAN DEFAULT false,
    rating_avg DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE shopping_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    meal_plan_id UUID REFERENCES meal_plans(id),
    title VARCHAR(200),
    share_code VARCHAR(20), -- QR ile paylasim kodu
    estimated_total_tl DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE shopping_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shopping_list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
    food_name VARCHAR(200) NOT NULL,
    amount VARCHAR(100),
    category VARCHAR(50),
    is_checked BOOLEAN DEFAULT false,
    checked_at TIMESTAMP,
    checked_by UUID REFERENCES users(id), -- kim isaretledi (aile paylasimi)
    allergen_warning TEXT,
    estimated_price_tl DECIMAL(10,2),
    sort_order INTEGER DEFAULT 0
);

-- Aile modu
CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    member_name VARCHAR(100) NOT NULL,
    birth_date DATE,
    relationship VARCHAR(50), -- 'cocuk','es','ebeveyn'
    allergen_ids INTEGER[],
    diet_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.8 AI Sohbet Gecmisi

```sql
-- ═══════════════════════════════════════════
-- AI SOHBET
-- ═══════════════════════════════════════════

CREATE TABLE ai_chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    metadata JSONB, -- AI'nin kullandigi context bilgisi
    created_at TIMESTAMP DEFAULT NOW()
);

-- AI tarafindan uretilen haftalik raporlar
CREATE TABLE ai_weekly_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    report_content JSONB NOT NULL, -- yapilandirilmis rapor verisi
    pdf_url TEXT, -- uretilen PDF linki
    sent_to_dietitian BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. DIYETISYEN ESLESTIRME KODU SISTEMI (DETAYLI)

### 4.1 Kod Uretimi

```
Format: DYT-[AD_ILK_4]-[4_RANDOM]
Ornek: DYT-ELIF-7X3K, DYT-AHME-P2M9

Kurallar:
- Benzersiz (DB UNIQUE constraint)
- Buyuk harf + rakam
- Karisik karakterler haric (0/O, 1/I/L yok)
- Diyetisyen isterse yenileyebilir
- Suresiz gecerli
- QR kod olarak da gosterilebilir
```

### 4.2 Eslestirme Akisi

```
HASTA TARAFINDA (Mobil):
┌─────────────────────────────────────┐
│ Ekran: "Diyetisyeniniz var mi?"     │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ "Evet, kodum var"               │ │
│ │ [____________________]          │ │
│ │ [Dogrula]                      │ │
│ │                                 │ │
│ │ veya                            │ │
│ │ [📷 QR Tarat]                  │ │
│ │                                 │ │
│ │ Basarili:                      │ │
│ │ ✅ "Dyt. Elif Kaya ile         │ │
│ │    eslestirildiniz!"           │ │
│ │ [foto] [uzmanlik] [puan]      │ │
│ │ [Onayla ve Devam Et]          │ │
│ │                                 │ │
│ │ Basarisiz:                     │ │
│ │ ❌ "Gecersiz kod"               │ │
│ │ [Tekrar Dene] [Kodsuz Devam]  │ │
│ └─────────────────────────────────┘ │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ "Hayir, AI ile kullanacagim"   │ │
│ │ → AI modunda devam             │ │
│ │ → Ayarlar'dan sonra ekleyebilir│ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

DIYETISYEN TARAFINDA (Web):
┌──────────────────────────────────────┐
│ Panel > Davet Kodum                  │
│                                       │
│ Kodunuz: DYT-ELIF-7X3K              │
│ [Kopyala] [Yeni Kod Uret] [QR Goster]│
│                                       │
│ QR Kod:                              │
│ ┌──────────┐                         │
│ │ [QR KOD] │  Hasta QR'i taratarak   │
│ │          │  kayit olabilir          │
│ └──────────┘                         │
│                                       │
│ [📄 PDF Indir] — Kodu yazili kagit   │
│ olarak hastaya verebilirsiniz         │
│                                       │
│ Aktif Hasta: 18/50                   │
│ Bekleyen: 2                          │
└──────────────────────────────────────┘
```

---

## 5. AI FOTOGRAF ANALIZ SISTEMI (GEMINI VISION)

### 5.1 Gemini API Entegrasyonu

```javascript
// Gemini Vision API kullanimi
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeFood(imageBase64, patientAllergies) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Sen bir beslenme analiz asistanisin. Bu yemek fotografini analiz et.

    Fotograftaki her yiyecegin icin su bilgileri JSON formatinda don:
    - name: Yiyecek adi (Turkce)
    - estimated_amount_g: Tahmini gram miktari
    - confidence: Guven orani (0-1)
    - calories: Toplam kalori (tahmini grama gore)
    - protein: Protein (g)
    - carbs: Karbonhidrat (g)
    - fat: Yag (g)
    - allergens: Icerdigi alerjenler listesi

    Hastanin alerjileri: ${patientAllergies.join(', ')}
    Alerjen iceren yiyecekleri ozellikle belirt.

    Turk mutfagina hakim ol. Porsiyon tahmininde
    Turkiye standart porsiyon boyutlarini kullan.

    SADECE JSON dondur, baska bir sey yazma.
  `;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
  ]);

  return JSON.parse(result.response.text());
}
```

### 5.2 Analiz → Duzeltme → Kayit Akisi

```
ADIM 1: Foto Cekimi
  Hasta kamerayi acar, yemek fotosunu ceker
  → Expo Camera + ImagePicker

ADIM 2: AI Analiz (Gemini Vision)
  Foto base64 olarak API'ye gonderilir
  Gemini Response ornegi:
  {
    "foods": [
      {
        "name": "Karniyarik",
        "estimated_amount_g": 250,
        "confidence": 0.92,
        "calories": 350,
        "protein": 18,
        "carbs": 25,
        "fat": 20,
        "allergens": []
      },
      {
        "name": "Bulgur Pilavi",
        "estimated_amount_g": 150,
        "confidence": 0.88,
        "calories": 170,
        "protein": 5,
        "carbs": 35,
        "fat": 2,
        "allergens": ["gluten"]
      }
    ]
  }

ADIM 3: Hasta Duzeltme Ekrani
  ┌──────────────────────────────────┐
  │ 📷 AI Analiz Sonucu              │
  │ [Yemek Fotografi]                │
  │                                   │
  │ ┌──────────────────────────────┐ │
  │ │ 🍆 Karniyarik               │ │
  │ │ AI: 250g                     │ │
  │ │ Sen: [──────●────] 300g  ✏️  │ │
  │ │ → Slider ile veya rakam gir │ │
  │ │                              │ │
  │ │ Kalori: 420 kcal ↑          │ │
  │ │ P: 22g | K: 30g | Y: 24g   │ │
  │ │ ✅ Alerjen yok               │ │
  │ └──────────────────────────────┘ │
  │                                   │
  │ ┌──────────────────────────────┐ │
  │ │ 🍚 Bulgur Pilavi             │ │
  │ │ AI: 150g                     │ │
  │ │ Sen: [───●─────] 150g  ✏️   │ │
  │ │                              │ │
  │ │ ⚠️ GLUTEN iceriyor!          │ │
  │ │ Bu gercekten bulgur mu?      │ │
  │ │ [Bulgur ✓] [Pirinc] [Diger] │ │
  │ └──────────────────────────────┘ │
  │                                   │
  │ [+ AI'nin tanimadigi yiyecek ekle]│
  │ [🗑️ Yanlis tanima — kaldir]      │
  │                                   │
  │ ── Ruh Halin Nasil? ──           │
  │ [😊] [😐] [😔] [😰] [😡]       │
  │ Mutlu Notr  Uzgun Stres Sinirli │
  │                                   │
  │ ── Aclik Seviyeni Sec ──         │
  │ [1] [2] [3] [4] [5]             │
  │ Hic          Cok aciktim         │
  │                                   │
  │ TOPLAM: 590 kcal                 │
  │ P: 27g | K: 65g | Y: 26g        │
  │                                   │
  │ [✅ Onayla ve Kaydet]             │
  └──────────────────────────────────┘

ADIM 4: Kayit ve Iletim
  → meal_logs tablosuna INSERT
  → meal_items'a her yiyecek eklenir
  → ai_estimated_amount_g = AI tahmini
  → user_adjusted_amount_g = Hasta duzeltmesi
  → final_amount_g = Son deger
  → mood = ruh hali
  → Foto Cloudinary'ye yuklenir
  → Mod 2 ise: Socket.io → diyetisyen anlik gorur
  → XP kazanilir (+10 foto ile kayit)
  → Seri guncellenir
```

### 5.3 Diger Ogun Kayit Yontemleri

```
YONTEM 1: Manuel Arama
  → Besin adi yaz → veritabanindan ara → miktari gir → kaydet

YONTEM 2: Barkod Tarama (Open Food Facts)
  → Kamerayi ac → barkodu tarat → Open Food Facts API'den bilgi cek
  → Alerjen kontrolu yap → miktari gir → kaydet
  → Urun bulunamazsa: "Bu urun veritabanimizda yok. Manuel ekle?"

YONTEM 3: Sesli Kayit
  → Mikrofon butonuna bas
  → "Ogle yemeginde 1 tabak mercimek corbasi ve 2 dilim ekmek yedim"
  → Speech-to-Text → metin olusur
  → Metin Gemini'ye gonderilir → besin analizi
  → Sonuclar duzenleme ekraninda gosterilir

YONTEM 4: Metin ile Anlat
  → Metin kutusuna yaz: "200g tavuk gogsu, pirinc pilavi, salata"
  → Gemini analiz eder → sonuclar duzenleme ekraninda

YONTEM 5: Besin Etiketi OCR
  → Urun arkasindaki besin tablosunu fotografla
  → Google ML Kit ile OCR → metin cikarilir
  → Gemini metni parse eder → kalori/protein/karb/yag cikarir
  → Miktari gir → kaydet

YONTEM 6: Restoran Menusu Tarama
  → Menu sayfasini fotografla
  → Gemini menudeki yemekleri tanir
  → Hastanin alerjilerine gore uygun/uygun degil isaretler
  → Hasta secim yapar → tahmini kalori gosterilir → kaydet
```

---

## 6. GAMIFICATION SISTEMI (DETAYLI)

```
ROZET LISTESI:
┌──────────────────────────────────────────────────┐
│ Kategori    │ Rozet              │ Kosul         │
│─────────────┼────────────────────┼───────────────│
│ Seri        │ 🔥 3 Gun Serisi    │ 3 gun ust uste│
│             │ 🔥 7 Gun Serisi    │ 7 gun         │
│             │ 🔥 30 Gun Serisi   │ 30 gun        │
│             │ 🔥 100 Gun Efsanesi│ 100 gun       │
│─────────────┼────────────────────┼───────────────│
│ Beslenme    │ 🥩 Protein Ustasi  │ 7 gun hedef   │
│             │ 🥗 Denge Sampiyonu │ 7 gun makro ok│
│             │ 📷 Foto Tutkunu    │ 50 foto yukle │
│             │ 🎯 Plan Takipcisi  │ %90 uyum/hafta│
│─────────────┼────────────────────┼───────────────│
│ Su          │ 💧 Su Perisi       │ 7 gun hedef   │
│             │ 🌊 Okyanus         │ 30 gun hedef  │
│─────────────┼────────────────────┼───────────────│
│ Kilo        │ ⚖️ Ilk Kilo       │ Ilk 1 kg      │
│             │ 🏆 Hedef Yarim     │ Hedefe %50    │
│             │ 👑 Hedef Tamam     │ Hedefe ulasti │
│─────────────┼────────────────────┼───────────────│
│ Sosyal      │ 👥 Ilk Eslestirme  │ Diyetisyen bul│
│             │ ⭐ Ilk Yorum       │ Diyetisyeni   │
│             │                    │ puanla        │
└──────────────────────────────────────────────────┘

SEVIYE SISTEMI:
  Level 1: Yeni Basliyor (0 XP)
  Level 2: Merakli (100 XP)
  Level 3: Duzenli (300 XP)
  Level 4: Kararli (600 XP)
  Level 5: Uzman (1000 XP)
  Level 6: Usta (1500 XP)
  Level 7: Efsane (2500 XP)
  Level 8: Sampiyon (4000 XP)
  Level 9: Guru (6000 XP)
  Level 10: NutriAI Efsanesi (10000 XP)

XP KAZANIM TABLOSU:
  Ogun kaydet (manuel): +5 XP
  Ogun kaydet (foto ile): +10 XP
  Su hedefi tuttuk: +5 XP
  Kilo kaydettik: +10 XP
  Plana uygun gun: +15 XP
  Gunluk seri bonusu: +5 XP x seri gunu
  Rozet kazandik: +50 XP
  Challenge tamamladik: +100 XP
  Egzersiz kaydettik: +10 XP

HAFTALIK CHALLENGE ORNEKLERI:
  "Bu hafta 5 gun plana uy" → 100 XP
  "Her gun en az 1 ogun fotografla" → 75 XP
  "7 gun su hedefini tut" → 75 XP
  "3 farkli tarif dene" → 50 XP
  "Her gun egzersiz kaydet" → 100 XP
```

---

## 7. MOBIL UYGULAMA — TUM EKRANLAR

### 7.1 Ekran Listesi

```
ONBOARDING (8 ekran):
  1. Hosgeldin (kayit/giris)
  2. Temel bilgiler
  3. Hedef secimi
  4. Alerjiler
  5. Beslenme tercihleri
  6. Yasam tarzi
  7. Diyetisyen eslestirme (kod girisi)
  8. AI hesaplama sonucu

ANA SAYFA (1 ekran):
  9. Dashboard (kalori, ogunler, su, bildirimler)

OGUN YONETIMI (7 ekran):
  10. Gunluk ogun listesi
  11. Yemek ekleme ana (6 yontem secimi)
  12. Foto ile AI analiz + miktar duzeltme
  13. Barkod tarama
  14. Sesli kayit
  15. Besin etiketi OCR tarama
  16. Restoran menusu tarama

ALERJI MERKEZI (4 ekran):
  17. Alerji profilim
  18. Guvenli yiyecek rehberi
  19. Urun alerjen tarayici
  20. Reaksiyon gunlugu

AI ASISTAN (1 ekran):
  21. AI sohbet ekrani

BESLENME PLANI (2 ekran):
  22. Haftalik plan gorunumu
  23. Gun detayi

TAKIP (6 ekran):
  24. Gunluk takip
  25. Haftalik takip
  26. Kilo grafigi
  27. Vitamin/mineral takip
  28. Egzersiz takibi
  29. Uyku takibi

GAMIFICATION (3 ekran):
  30. Profilim (seviye, XP, seri)
  31. Rozetlerim
  32. Haftalik challenge'lar

TARIF (3 ekran):
  33. Tarif ana sayfa
  34. Tarif detay
  35. AI tarif uretici

ALISVERIS (2 ekran):
  36. Alisveris listesi
  37. QR ile paylasim

DIYETISYEN (Mod 2) (3 ekran):
  38. Diyetisyenim (profil, iletisim)
  39. Mesajlasma
  40. Video gorusme (Jitsi)

ILERLEME FOTOLARI (1 ekran):
  41. Before/after galeri

KAN DEGERLERI (2 ekran):
  42. Kan degeri kayit
  43. Kan degeri grafikleri

AILE MODU (2 ekran):
  44. Aile uyesi ekle/yonet
  45. Aile uyesi takip

PROFIL & AYARLAR (3 ekran):
  46. Profil duzenleme
  47. Ayarlar (dark mode, dil, bildirimler, IF, diyetisyen kodu)
  48. Veri export (CSV/PDF indir)

RANDEVU (2 ekran):
  49. Randevu al
  50. Randevularim

TOPLAM MOBIL: ~50 ekran
```

### 7.2 Alt Navigasyon

```
[🏠 Ana] [🍽️ Ogun] [📷 Foto] [📊 Takip] [👤 Profil]

📷 Foto butonu ortada, buyuk, vurgulu
→ Basilinca direkt kamera acilir (en hizli yol)
```

---

## 8. WEB UYGULAMASI — DIYETISYEN PANELI

### 8.1 Sayfa Listesi

```
AUTH (2 sayfa):
  1. Giris
  2. Kayit (diploma yukleme dahil)

DASHBOARD (1 sayfa):
  3. Ana dashboard (istatistikler, dikkat gerektiren hastalar, son fotolar)

HASTA YONETIMI (2 sayfa):
  4. Hasta listesi
  5. Hasta detay (tab'li: profil, beslenme, fotolar, plan, gelisim, kan degerleri, alerji)

PLAN OLUSTURMA (2 sayfa):
  6. Manuel plan yazma
  7. AI destekli plan olusturma

CANLI TAKIP (1 sayfa):
  8. Anlik hasta takibi (Socket.io)

MESAJLASMA (1 sayfa):
  9. Mesaj paneli

VIDEO GORUSME (1 sayfa):
  10. Jitsi gorusme odasi

RANDEVU (1 sayfa):
  11. Randevu takvimi

RAPORLAR (2 sayfa):
  12. Hasta raporu (detayli)
  13. Genel istatistikler

AI ASISTAN (1 sayfa):
  14. AI analiz araclari

DAVET KODU (1 sayfa):
  15. Kod yonetimi + QR

AYARLAR (1 sayfa):
  16. Profil, fiyat, musaitlik

TOPLAM WEB: ~16 sayfa
```

### 8.2 Hasta Detay Sayfasi — Fotolar Tab'i

```
┌──────────────────────────────────────────────────────────┐
│  👤 Ahmet Yilmaz                                         │
│                                                           │
│  Tab: [Profil][Beslenme][📷 Fotolar][Plan][Gelisim]      │
│       [Kan Degerleri][Alerji]                            │
│                                                           │
│  ═══ 📷 Ogun Fotolari ═══                                │
│                                                           │
│  Tarih: [← 22 Sub] [23 Sub] [24 Sub →]                  │
│                                                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│  │ [📷 FOTO]   │ │ [📷 FOTO]   │ │             │        │
│  │ Kahvalti    │ │ Ogle         │ │ Aksam       │        │
│  │ 08:32       │ │ 12:48        │ │ Bekleniyor  │        │
│  │ 450 kcal    │ │ 520 kcal     │ │             │        │
│  │ ✅ Planla   │ │ ⚠️ Plan disi │ │             │        │
│  │ uyumlu      │ │ ama kalori ok│ │             │        │
│  │             │ │              │ │             │        │
│  │ Ruh hali:😊 │ │ Ruh hali:😰 │ │             │        │
│  │             │ │              │ │             │        │
│  │ AI Analizi: │ │ AI Analizi:  │ │             │        │
│  │ Yulaf 250g  │ │ Tavuk 300g   │ │             │        │
│  │ Muz 1 adet  │ │ Salata 200g  │ │             │        │
│  │ Bal 1 yk    │ │ Sos 2 yk     │ │             │        │
│  │             │ │              │ │             │        │
│  │ Hasta:      │ │ Hasta:       │ │             │        │
│  │ Yulaf→300g  │ │ Degisiklik   │ │             │        │
│  │ (AI:250g)   │ │ yok          │ │             │        │
│  │             │ │              │ │             │        │
│  │ [💬 Yorum]  │ │ [💬 Yorum]   │ │             │        │
│  └─────────────┘ └─────────────┘ └─────────────┘        │
│                                                           │
│  Diyetisyen Yorumu:                                      │
│  [_________________________________________________]     │
│  [Gonder] → Hastaya anlik bildirim gider                 │
│                                                           │
│  📊 Bu Haftanin Foto Ozeti:                              │
│  Toplam foto: 12/21 ogun (%57)                           │
│  Plana uyum: 9/12 (%75)                                  │
│  En cok atlanan: Ara ogun                                │
│  Ruh hali dagilimi: 😊5 😐4 😰2 😔1                     │
│  → "Stresli gunlerde kalori asimi %30 daha fazla"       │
└──────────────────────────────────────────────────────────┘
```

---

## 9. SOCKET.IO GERCEK ZAMANLI OLAYLAR

```javascript
// ═══ HASTA → DIYETISYEN ═══
'meal:logged'           → { patientId, mealType, calories, photoUrl, mood }
'meal:photo_uploaded'   → { patientId, mealLogId, photoUrl, aiAnalysis }
'weight:logged'         → { patientId, weightKg }
'water:logged'          → { patientId, totalGlasses }
'exercise:logged'       → { patientId, type, duration, caloriesBurned }
'allergen:violation'    → { patientId, allergenName, foodName, severity }
'blood_value:logged'    → { patientId, valueType, value }

// ═══ DIYETISYEN → HASTA ═══
'plan:created'          → { planId, dietitianName, startDate }
'plan:updated'          → { planId, changes }
'meal:feedback'         → { mealLogId, feedback, dietitianName }
'message:new'           → { senderId, content, messageType }
'appointment:scheduled' → { appointmentId, date, time, type }
'appointment:reminder'  → { appointmentId, minutesBefore }

// ═══ ESLESTIRME ═══
'patient:paired'        → { patientId, patientName, inviteCode }
'patient:unpaired'      → { patientId, reason }

// ═══ GAMIFICATION ═══
'badge:earned'          → { patientId, badgeName, xpReward }
'level:up'              → { patientId, newLevel }
'challenge:completed'   → { patientId, challengeName, xpReward }
'streak:updated'        → { patientId, streakDays }

// ═══ ALISVERIS LISTESI (PAYLASIMLI) ═══
'shopping:item_checked' → { listId, itemId, checkedBy }
'shopping:item_added'   → { listId, item }
```

---

## 10. API ENDPOINT LISTESI

### 10.1 Auth
```
POST   /api/auth/register              → Kayit
POST   /api/auth/login                 → Giris
POST   /api/auth/google                → Google OAuth
POST   /api/auth/refresh-token         → Token yenile
POST   /api/auth/forgot-password       → Sifre sifirlama
POST   /api/auth/verify-email          → E-posta dogrulama
PUT    /api/auth/fcm-token             → Push bildirim token guncelle
```

### 10.2 Hasta (Patient)
```
GET    /api/patient/profile
PUT    /api/patient/profile
POST   /api/patient/onboarding
POST   /api/patient/pair-dietitian          → Kod ile esles
DELETE /api/patient/unpair-dietitian
GET    /api/patient/dietitian               → Eslestigi diyetisyen bilgisi

-- Ogun
GET    /api/patient/meals?date=
POST   /api/patient/meals
PUT    /api/patient/meals/:id
DELETE /api/patient/meals/:id
POST   /api/patient/meals/photo-analyze     → Gemini Vision ile analiz
POST   /api/patient/meals/text-analyze      → Metin ile analiz
POST   /api/patient/meals/voice-analyze     → Sesli kayit analizi
POST   /api/patient/meals/ocr-analyze       → Besin etiketi OCR
POST   /api/patient/meals/menu-analyze      → Restoran menusu analiz
POST   /api/patient/meals/:id/confirm       → Duzeltmelerle onayla

-- Plan
GET    /api/patient/plan/active
GET    /api/patient/plan/:id

-- Takip
GET    /api/patient/tracking/daily?date=
GET    /api/patient/tracking/weekly?week=
GET    /api/patient/tracking/monthly?month=
GET    /api/patient/tracking/weight
POST   /api/patient/tracking/weight
POST   /api/patient/tracking/water
GET    /api/patient/tracking/water?date=
GET    /api/patient/tracking/vitamins?date=     → Vitamin/mineral ozet
POST   /api/patient/tracking/exercise
GET    /api/patient/tracking/exercise?date=
POST   /api/patient/tracking/sleep
GET    /api/patient/tracking/sleep?date=

-- Alerji
GET    /api/patient/allergies
POST   /api/patient/allergies
PUT    /api/patient/allergies/:id
DELETE /api/patient/allergies/:id
POST   /api/patient/allergies/reactions

-- Kan degerleri
GET    /api/patient/blood-values
POST   /api/patient/blood-values
GET    /api/patient/blood-values/history?type=

-- Gamification
GET    /api/patient/gamification/profile     → XP, level, streak
GET    /api/patient/gamification/badges      → Kazanilan rozetler
GET    /api/patient/gamification/challenges  → Aktif challenge'lar
POST   /api/patient/gamification/challenges/:id/join
GET    /api/patient/gamification/leaderboard → Anonim liderlik

-- Ilerleme fotolari
GET    /api/patient/progress-photos
POST   /api/patient/progress-photos

-- Aile modu
GET    /api/patient/family
POST   /api/patient/family
PUT    /api/patient/family/:id
DELETE /api/patient/family/:id

-- Mesaj
GET    /api/patient/messages
POST   /api/patient/messages
GET    /api/patient/notifications
PUT    /api/patient/notifications/:id/read

-- Randevu
GET    /api/patient/appointments
POST   /api/patient/appointments
PUT    /api/patient/appointments/:id/cancel

-- Diger
GET    /api/patient/weekly-report
POST   /api/patient/export/csv
POST   /api/patient/export/pdf
```

### 10.3 Diyetisyen (Dietitian)
```
GET    /api/dietitian/profile
PUT    /api/dietitian/profile
GET    /api/dietitian/invite-code
POST   /api/dietitian/invite-code/refresh

-- Hasta yonetimi
GET    /api/dietitian/patients
GET    /api/dietitian/patients/:id
GET    /api/dietitian/patients/:id/meals?date=
GET    /api/dietitian/patients/:id/photos?date=
POST   /api/dietitian/patients/:id/feedback
GET    /api/dietitian/patients/:id/tracking
GET    /api/dietitian/patients/:id/allergies
GET    /api/dietitian/patients/:id/blood-values
GET    /api/dietitian/patients/:id/gamification
GET    /api/dietitian/patients/:id/mood-analysis

-- Plan
POST   /api/dietitian/plans
PUT    /api/dietitian/plans/:id
POST   /api/dietitian/plans/:id/send
DELETE /api/dietitian/plans/:id

-- Mesaj
GET    /api/dietitian/messages
POST   /api/dietitian/messages

-- Randevu
GET    /api/dietitian/appointments
PUT    /api/dietitian/appointments/:id
POST   /api/dietitian/appointments/:id/notes

-- Dashboard & raporlar
GET    /api/dietitian/dashboard
GET    /api/dietitian/reports/:patientId
GET    /api/dietitian/reports/:patientId/pdf

-- AI
POST   /api/dietitian/ai/analyze-patient
POST   /api/dietitian/ai/suggest-plan
POST   /api/dietitian/ai/suggest-meal
POST   /api/dietitian/ai/mood-analysis
POST   /api/dietitian/ai/deficiency-check
```

### 10.4 AI
```
POST   /api/ai/analyze-photo         → Gemini Vision foto analiz
POST   /api/ai/analyze-text          → Metin analiz
POST   /api/ai/analyze-menu          → Restoran menusu analiz
POST   /api/ai/generate-plan         → Haftalik plan uret
POST   /api/ai/suggest-meal          → Ogun onerisi
POST   /api/ai/check-allergens       → Alerjen kontrolu
POST   /api/ai/chat                  → Serbest sohbet
POST   /api/ai/weekly-report         → Haftalik rapor uret
POST   /api/ai/mood-analysis         → Duygusal yeme analizi
POST   /api/ai/recipe-generate       → Eldeki malzemelerle tarif
POST   /api/ai/seasonal-suggest      → Mevsimsel oneri
POST   /api/ai/budget-plan           → Butce dostu plan
```

### 10.5 Genel
```
GET    /api/foods/search?q=
GET    /api/foods/barcode/:code       → Open Food Facts
POST   /api/foods/ocr                 → Etiket OCR
GET    /api/recipes?filter=
GET    /api/recipes/:id
POST   /api/recipes/:id/rate
```

---

## 11. PUSH BILDIRIM SENARYOLARI (Firebase Cloud Messaging)

```
ZAMANLAMA BAZLI:
  ⏰ 08:00 → "Gunaydin! Kahvalti zamanin geldi 🌅"
  ⏰ 12:00 → "Ogle yemegi vakti! Ne yedigin kaydetmeyi unutma"
  ⏰ 15:00 → "Ara ogun zamani. 1 avuc badem + 1 elma nasil?"
  ⏰ 19:00 → "Aksam yemegi icin plan: Izgara tavuk + sebze sote"
  ⏰ Her 2 saat → "Su icmeyi unutma! 💧 Bugun: 4/8 bardak"

OLAY BAZLI:
  🔔 Diyetisyen mesaj atti → "Dyt. Elif size mesaj gonderdi"
  🔔 Yeni plan geldi → "Yeni beslenme planiniz hazirlandi!"
  🔔 Diyetisyen yorum yapti → "Dyt. Elif ogunuze yorum yapti"
  🔔 Randevu hatirlatma → "1 saat sonra Dyt. Elif ile gorusmeniz var"
  🔔 Rozet kazanildi → "🏆 Yeni rozet: 7 Gun Serisi!"
  🔔 Seviye atlandi → "⬆️ Level 3'e ulastin! Tebrikler!"
  🔔 Seri tehlikede → "🔥 12 gunluk serin var! Bugunu kacirma!"
  🔔 Kilo hedefi → "⚖️ Hedefe 2 kg kaldi! Devam et!"
  🔔 Alerjen uyarisi → "⚠️ Bu urunde GLUTEN var!"

INTERMITTENT FASTING:
  ⏰ Orucu bozma zamani → "Yeme pencereniz acildi! ✅"
  ⏰ Oruc baslama zamani → "Yeme pencereniz kapaniyor ⏳"
  ⏰ Oruc ortasi → "Orucluyken bol su icmeyi unutmayin 💧"
```

---

## 12. DOSYA YAPISI

```
nutriai/
├── docker-compose.yml
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       │   ├── database.js          → PostgreSQL baglantisi
│       │   ├── gemini.js            → Gemini API yapilandirmasi
│       │   ├── firebase.js          → FCM yapilandirmasi
│       │   ├── cloudinary.js        → Foto yukleme
│       │   └── socket.js            → Socket.io yapilandirmasi
│       ├── db/
│       │   ├── init.sql             → Tablo olusturma
│       │   ├── seed.sql             → Ornek veri
│       │   └── migrations/          → Sema degisiklikleri
│       ├── middleware/
│       │   ├── auth.js              → JWT dogrulama
│       │   ├── role.js              → Rol kontrolu
│       │   ├── upload.js            → Multer (foto)
│       │   ├── validate.js          → Zod validasyon
│       │   └── rateLimiter.js       → Rate limiting
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── patient.routes.js
│       │   ├── dietitian.routes.js
│       │   ├── ai.routes.js
│       │   ├── food.routes.js
│       │   ├── recipe.routes.js
│       │   ├── gamification.routes.js
│       │   └── admin.routes.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── patient.controller.js
│       │   ├── dietitian.controller.js
│       │   ├── ai.controller.js
│       │   ├── meal.controller.js
│       │   ├── tracking.controller.js
│       │   ├── gamification.controller.js
│       │   ├── message.controller.js
│       │   ├── appointment.controller.js
│       │   └── admin.controller.js
│       ├── services/
│       │   ├── gemini.service.js        → Gemini API islemleri
│       │   ├── photo-analysis.service.js→ Foto analiz
│       │   ├── ocr.service.js           → Etiket OCR
│       │   ├── meal-plan.service.js     → Plan olusturma
│       │   ├── notification.service.js  → FCM bildirimler
│       │   ├── invite-code.service.js   → Kod uretimi
│       │   ├── gamification.service.js  → XP, rozet, seri
│       │   ├── report.service.js        → Haftalik rapor
│       │   ├── mood-analysis.service.js → Duygusal yeme
│       │   ├── barcode.service.js       → Open Food Facts
│       │   └── pdf.service.js           → PDF uretimi
│       ├── socket/
│       │   ├── index.js                 → Socket.io ana
│       │   ├── meal.events.js           → Ogun olaylari
│       │   ├── message.events.js        → Mesaj olaylari
│       │   ├── tracking.events.js       → Takip olaylari
│       │   ├── gamification.events.js   → Oyun olaylari
│       │   └── shopping.events.js       → Alisveris olaylari
│       └── utils/
│           ├── calculator.js            → BMR, TDEE, makro hesap
│           ├── allergenChecker.js       → Alerjen kontrol
│           └── helpers.js
│
├── web/                                  (Diyetisyen Paneli)
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── components/
│       │   ├── ui/                      → shadcn/ui bilesenler
│       │   ├── layout/
│       │   │   ├── Sidebar.jsx
│       │   │   ├── Header.jsx
│       │   │   └── Layout.jsx
│       │   ├── charts/
│       │   │   ├── CalorieChart.jsx     → Recharts
│       │   │   ├── WeightChart.jsx
│       │   │   ├── MacroChart.jsx
│       │   │   └── MoodChart.jsx
│       │   ├── patient/
│       │   │   ├── PatientCard.jsx
│       │   │   ├── MealPhotoGrid.jsx
│       │   │   ├── TrackingPanel.jsx
│       │   │   └── BloodValueChart.jsx
│       │   └── plan/
│       │       ├── PlanEditor.jsx
│       │       ├── MealSlot.jsx
│       │       └── AISuggestion.jsx
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── Login.jsx
│       │   │   └── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── PatientList.jsx
│       │   ├── PatientDetail.jsx
│       │   ├── PlanCreator.jsx
│       │   ├── LiveTracking.jsx
│       │   ├── Messages.jsx
│       │   ├── VideoCall.jsx           → Jitsi embed
│       │   ├── Appointments.jsx
│       │   ├── Reports.jsx
│       │   ├── AIAssistant.jsx
│       │   ├── InviteCode.jsx
│       │   └── Settings.jsx
│       ├── hooks/
│       │   ├── useSocket.js
│       │   ├── useAuth.js
│       │   └── useApi.js
│       ├── services/
│       │   ├── api.js                   → Axios instance
│       │   ├── socket.js               → Socket.io client
│       │   └── auth.js
│       └── store/
│           └── index.js                 → Zustand veya Context
│
├── mobile/                               (Hasta Uygulamasi)
│   ├── app.json
│   ├── package.json
│   └── src/
│       ├── screens/
│       │   ├── onboarding/
│       │   │   ├── WelcomeScreen.jsx
│       │   │   ├── BasicInfoScreen.jsx
│       │   │   ├── GoalScreen.jsx
│       │   │   ├── AllergyScreen.jsx
│       │   │   ├── DietPreferenceScreen.jsx
│       │   │   ├── LifestyleScreen.jsx
│       │   │   ├── DietitianCodeScreen.jsx  ← ESLESTIRME
│       │   │   └── CalculationScreen.jsx
│       │   ├── dashboard/
│       │   │   └── DashboardScreen.jsx
│       │   ├── meals/
│       │   │   ├── MealListScreen.jsx
│       │   │   ├── AddMealScreen.jsx        ← 6 yontem
│       │   │   ├── PhotoAnalyzeScreen.jsx   ← AI + DUZELTME
│       │   │   ├── AdjustPortionsScreen.jsx ← MIKTAR DUZELTME
│       │   │   ├── BarcodeScreen.jsx
│       │   │   ├── VoiceInputScreen.jsx
│       │   │   ├── OCRScanScreen.jsx
│       │   │   └── MenuScanScreen.jsx
│       │   ├── tracking/
│       │   │   ├── DailyTrackingScreen.jsx
│       │   │   ├── WeeklyTrackingScreen.jsx
│       │   │   ├── WeightScreen.jsx
│       │   │   ├── VitaminScreen.jsx
│       │   │   ├── ExerciseScreen.jsx
│       │   │   └── SleepScreen.jsx
│       │   ├── allergies/
│       │   │   ├── AllergyProfileScreen.jsx
│       │   │   ├── SafeFoodsScreen.jsx
│       │   │   ├── ProductScannerScreen.jsx
│       │   │   └── ReactionLogScreen.jsx
│       │   ├── gamification/
│       │   │   ├── ProfileLevelScreen.jsx
│       │   │   ├── BadgesScreen.jsx
│       │   │   └── ChallengesScreen.jsx
│       │   ├── ai-chat/
│       │   │   └── AIChatScreen.jsx
│       │   ├── plan/
│       │   │   ├── PlanViewScreen.jsx
│       │   │   └── DayDetailScreen.jsx
│       │   ├── recipes/
│       │   │   ├── RecipeListScreen.jsx
│       │   │   ├── RecipeDetailScreen.jsx
│       │   │   └── AIRecipeScreen.jsx
│       │   ├── shopping/
│       │   │   ├── ShoppingListScreen.jsx
│       │   │   └── QRShareScreen.jsx
│       │   ├── dietitian/
│       │   │   ├── MyDietitianScreen.jsx
│       │   │   ├── ChatScreen.jsx
│       │   │   └── VideoCallScreen.jsx
│       │   ├── blood-values/
│       │   │   ├── BloodValueEntryScreen.jsx
│       │   │   └── BloodValueChartScreen.jsx
│       │   ├── progress/
│       │   │   └── ProgressPhotosScreen.jsx
│       │   ├── family/
│       │   │   ├── FamilyListScreen.jsx
│       │   │   └── FamilyMemberScreen.jsx
│       │   ├── appointments/
│       │   │   ├── BookAppointmentScreen.jsx
│       │   │   └── MyAppointmentsScreen.jsx
│       │   └── profile/
│       │       ├── ProfileScreen.jsx
│       │       ├── SettingsScreen.jsx
│       │       └── DataExportScreen.jsx
│       ├── components/
│       │   ├── CalorieRing.jsx
│       │   ├── MacroBar.jsx
│       │   ├── MealCard.jsx
│       │   ├── WaterTracker.jsx
│       │   ├── StreakCounter.jsx
│       │   ├── BadgeIcon.jsx
│       │   ├── MoodSelector.jsx
│       │   └── PortionSlider.jsx        ← AI MIKTAR DUZELTME
│       ├── hooks/
│       │   ├── useSocket.js
│       │   ├── useAuth.js
│       │   ├── useCamera.js
│       │   ├── useVoice.js
│       │   └── useNotifications.js
│       ├── services/
│       │   ├── api.js
│       │   ├── socket.js
│       │   ├── gemini.js
│       │   └── notifications.js
│       ├── store/
│       │   └── index.js
│       ├── navigation/
│       │   ├── AppNavigator.jsx
│       │   ├── AuthNavigator.jsx
│       │   ├── MainTabNavigator.jsx
│       │   └── OnboardingNavigator.jsx
│       └── theme/
│           ├── colors.js
│           ├── dark.js
│           └── light.js
│
└── README.md
```

---

## 13. GUVENLIK

```
KIMLIK DOGRULAMA:
  - JWT: Access token (15dk) + Refresh token (7 gun)
  - bcrypt: Sifre hashleme (salt: 12)
  - Google OAuth 2.0 (ucretsiz)
  - Role-based access: patient, dietitian, admin

VERI GUVENLIGI:
  - HTTPS zorunlu (production)
  - CORS: Whitelist bazli
  - Helmet.js: HTTP security headers
  - Rate limiting: express-rate-limit
  - Input validation: Zod
  - SQL injection korunma: parameterized queries
  - XSS korunma: sanitize-html
  - Foto upload: max 10MB, sadece jpg/png/webp

GIZLILIK:
  - Ilerleme fotolari sadece hasta + diyetisyen gorebilir
  - Kan degerleri sifrelenmis saklanir
  - Hasta verisini silme hakki (KVKK uyumu)
  - Anonim liderlik tablosu (isim gosterilmez)
```

---

## 14. EKRAN/SAYFA OZETI

### Mobil (Hasta Uygulamasi): ~50 ekran
### Web (Diyetisyen Paneli): ~16 sayfa
### GENEL TOPLAM: ~66 ekran/sayfa

---

## 15. DEMO SENARYOSU (Juri Sunumu — 15 dk)

```
BOLUM 1 — Hasta Kayit & Eslestirme (3 dk):
  1. Telefondan kayit ol
  2. Wizard'i gec (alerji: gluten+laktoz, hedef: kilo ver)
  3. Diyetisyen kodu gir: DYT-ELIF-7X3K → eslestirme basarili!
  4. AI kalori + makro hedefi hesaplasin

BOLUM 2 — AI Yemek Analizi (4 dk):
  5. Yemek fotografi cek → Gemini Vision analiz etsin
  6. AI "250g karniyarik" dedi → 300g olarak duzelt → kaydet
  7. Barkod tara → "GLUTEN VAR!" uyarisi
  8. Sesle anlat: "2 dilim ekmek yedim" → AI analiz
  9. Besin etiketi fotografla → OCR ile otomatik kalori

BOLUM 3 — Diyetisyen Deneyimi (4 dk):
  10. Web panele gir → davet kodunu goster
  11. Hasta listesi → Ahmet'in ogun fotolarini incele
  12. Fotoya yorum yap → hasta anlik bildirim alsin
  13. AI yardimiyla plan olustur → hastaya gonder
  14. Hasta ruh hali analizi goster (duygusal yeme)

BOLUM 4 — Gercek Zamanli + Gamification (4 dk):
  15. Telefondan yemek kaydet → web panelde anlik gorsun
  16. Web'den mesaj at → telefonda anlik gelsin
  17. Kilo gir → grafik anlik guncellensin
  18. Rozet kazanimi goster: "7 Gun Serisi!" → animasyon
  19. Haftalik challenge goster
  20. Video gorusme baslat (Jitsi demo)
```

---

## 16. OZELLIK MATRISI

```
┌──────────────────────────┬────────────┬───────────┬──────────┐
│ Ozellik                  │ Mod 1 (AI) │ Mod 2     │ Teknoloji│
│                          │            │(Diyetisyen)│          │
├──────────────────────────┼────────────┼───────────┼──────────┤
│ Foto ile yemek analizi   │     ✅     │    ✅     │ Gemini   │
│ Miktar duzeltme (slider) │     ✅     │    ✅     │ React    │
│ Barkod tarama            │     ✅     │    ✅     │ OpenFF   │
│ Sesli ogun kaydi         │     ✅     │    ✅     │ STT      │
│ Besin etiketi OCR        │     ✅     │    ✅     │ ML Kit   │
│ Restoran menusu tarama   │     ✅     │    ✅     │ Gemini   │
│ AI beslenme plani        │     ✅     │    ❌     │ Gemini   │
│ Diyetisyen beslenme plani│     ❌     │    ✅     │ Web      │
│ Diyetisyen eslestirme    │     ❌     │    ✅     │ Kod      │
│ Ogun foto → diyetisyene  │     ❌     │    ✅     │ Socket   │
│ Diyetisyen yorum/feedback│     ❌     │    ✅     │ Socket   │
│ Mesajlasma               │     ❌     │    ✅     │ Socket   │
│ Video gorusme            │     ❌     │    ✅     │ Jitsi    │
│ Randevu sistemi          │     ❌     │    ✅     │ Takvim   │
│ AI sohbet asistani       │     ✅     │    ✅     │ Gemini   │
│ Gunluk/haftalik takip    │     ✅     │    ✅     │ Grafik   │
│ Kilo takibi + grafik     │     ✅     │    ✅     │ Grafik   │
│ Su takibi + hatirlatma   │     ✅     │    ✅     │ FCM      │
│ Vitamin/mineral takibi   │     ✅     │    ✅     │ DB       │
│ Egzersiz takibi          │     ✅     │    ✅     │ DB       │
│ Uyku takibi              │     ✅     │    ✅     │ DB       │
│ Kan degeri takibi        │     ✅     │    ✅     │ DB       │
│ Ruh hali takibi          │     ✅     │    ✅     │ DB       │
│ Duygusal yeme analizi    │     ✅     │    ✅     │ Gemini   │
│ Alerji merkezi           │     ✅     │    ✅     │ DB       │
│ Gamification (rozet/XP)  │     ✅     │    ✅     │ DB       │
│ Haftalik challenge       │     ✅     │    ✅     │ DB       │
│ Tarif kesfet + AI uret   │     ✅     │    ✅     │ Gemini   │
│ Alisveris listesi + QR   │     ✅     │    ✅     │ DB       │
│ Ilerleme fotolari        │     ✅     │    ✅     │ Cloud    │
│ Aile modu                │     ✅     │    ✅     │ DB       │
│ Intermittent fasting     │     ✅     │    ✅     │ FCM      │
│ Push bildirimler         │     ✅     │    ✅     │ FCM      │
│ Dark mode                │     ✅     │    ✅     │ Theme    │
│ Coklu dil (TR/EN)        │     ✅     │    ✅     │ i18n     │
│ Offline modu             │     ✅     │    ✅     │ Cache    │
│ PDF rapor export         │     ✅     │    ✅     │ jsPDF    │
│ CSV veri export          │     ✅     │    ✅     │ CSV      │
│ Mevsimsel besin onerisi  │     ✅     │    ✅     │ Gemini   │
│ Butce dostu plan         │     ✅     │    ✅     │ Gemini   │
│ Diyetisyen puanlama      │     ❌     │    ✅     │ DB       │
│ AI haftalik rapor (PDF)  │     ✅     │    ✅     │ Gemini   │
└──────────────────────────┴────────────┴───────────┴──────────┘

TOPLAM: 40+ ozellik
```

---

*Bu dokuman NutriAI projesinin v3 profesyonel bitirme projesi spesifikasyonudur.*
*Tum teknolojiler %100 ucretsiz.*
*Mobil = Hasta Uygulamasi (~50 ekran) | Web = Diyetisyen Paneli (~16 sayfa)*
*Toplam: ~66 ekran/sayfa | 40+ ozellik | 100+ API endpoint*
