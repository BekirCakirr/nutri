-- ============================================================================
-- NutriAI — PostgreSQL 16 Database Schema
-- Generated from NUTRIAI-PROFESSIONAL-SPEC.md
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. USERS & IDENTITY
-- ============================================================================

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'dietitian', 'admin', 'support')),
  auth_provider VARCHAR(20) NOT NULL DEFAULT 'email' CHECK (auth_provider IN ('email', 'google', 'apple')),
  auth_provider_id VARCHAR(255),
  is_active     BOOLEAN NOT NULL DEFAULT true,
  is_verified   BOOLEAN NOT NULL DEFAULT false,
  fcm_token     TEXT,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE patient_profiles (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  first_name              VARCHAR(100) NOT NULL,
  last_name               VARCHAR(100) NOT NULL,
  birth_date              DATE,
  gender                  VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  height_cm               NUMERIC(5,1),
  current_weight_kg       NUMERIC(5,1),
  target_weight_kg        NUMERIC(5,1),
  activity_level          VARCHAR(30) CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
  goal_type               VARCHAR(30) CHECK (goal_type IN ('weight_loss', 'weight_gain', 'muscle_gain', 'maintenance', 'health_improvement', 'disease_management', 'sports_performance', 'general_wellness', 'custom')),
  goal_duration_weeks     INT,
  diet_type               VARCHAR(30) DEFAULT 'normal' CHECK (diet_type IN ('normal', 'vegetarian', 'vegan', 'pescatarian')),
  cuisine_preferences     TEXT[] DEFAULT '{}',
  disliked_foods          TEXT[] DEFAULT '{}',
  religious_preferences   TEXT[] DEFAULT '{}',
  daily_water_target      INT DEFAULT 8,
  sleep_hours             NUMERIC(3,1),
  usage_mode              VARCHAR(20) DEFAULT 'ai_independent' CHECK (usage_mode IN ('ai_independent', 'with_dietitian')),

  -- Calculated values
  bmr                     NUMERIC(7,1),
  tdee                    NUMERIC(7,1),
  daily_calorie_target    NUMERIC(7,1),
  protein_target_g        NUMERIC(5,1),
  carb_target_g           NUMERIC(5,1),
  fat_target_g            NUMERIC(5,1),

  profile_photo_url       TEXT,
  onboarding_completed    BOOLEAN DEFAULT false,

  -- Gamification
  xp_points               INT DEFAULT 0,
  level                   INT DEFAULT 1,
  current_streak          INT DEFAULT 0,
  longest_streak          INT DEFAULT 0,

  -- Preferences
  dark_mode               BOOLEAN DEFAULT false,
  language                VARCHAR(5) DEFAULT 'tr' CHECK (language IN ('tr', 'en')),
  notification_enabled    BOOLEAN DEFAULT true,

  -- Intermittent fasting
  intermittent_fasting_enabled BOOLEAN DEFAULT false,
  fasting_type            VARCHAR(10) CHECK (fasting_type IN ('16:8', '18:6', '20:4')),
  fasting_start_hour      INT,
  fasting_end_hour        INT,

  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE dietitian_profiles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  first_name          VARCHAR(100) NOT NULL,
  last_name           VARCHAR(100) NOT NULL,
  title               VARCHAR(50),
  license_number      VARCHAR(50) UNIQUE,
  diploma_url         TEXT,
  specializations     TEXT[] DEFAULT '{}',
  university          VARCHAR(200),
  experience_years    INT,
  bio                 TEXT,
  profile_photo_url   TEXT,
  clinic_name         VARCHAR(200),
  clinic_address      TEXT,
  city                VARCHAR(100),
  offers_online       BOOLEAN DEFAULT true,
  offers_in_person    BOOLEAN DEFAULT false,
  session_price_tl    NUMERIC(8,2),

  -- Invite code system
  invite_code         VARCHAR(20) UNIQUE,
  max_patients        INT DEFAULT 50,

  -- Availability
  available_days      TEXT[] DEFAULT '{}',
  available_hours     JSONB DEFAULT '{}',
  session_duration_min INT DEFAULT 45,

  -- Approval
  is_approved         BOOLEAN DEFAULT false,
  approval_date       TIMESTAMPTZ,
  rejected_reason     TEXT,

  -- Ratings
  rating_avg          NUMERIC(3,2) DEFAULT 0,
  rating_count        INT DEFAULT 0,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE dietitian_patients (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dietitian_id    UUID NOT NULL REFERENCES dietitian_profiles(id) ON DELETE CASCADE,
  patient_id      UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  status          VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
  paired_via      VARCHAR(20) CHECK (paired_via IN ('invite_code', 'search', 'referral')),
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at        TIMESTAMPTZ,
  notes           TEXT,
  UNIQUE(dietitian_id, patient_id)
);

CREATE TABLE dietitian_reviews (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dietitian_id    UUID NOT NULL REFERENCES dietitian_profiles(id) ON DELETE CASCADE,
  patient_id      UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  rating          INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment         TEXT,
  is_anonymous    BOOLEAN DEFAULT false,
  dietitian_response TEXT,
  responded_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(dietitian_id, patient_id)
);

-- ============================================================================
-- 2. ALLERGY & HEALTH
-- ============================================================================

CREATE TABLE allergens (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  name_en         VARCHAR(100),
  category        VARCHAR(30) CHECK (category IN ('food_allergen', 'food_intolerance', 'drug_allergen', 'environmental', 'other')),
  icon            VARCHAR(50),
  description     TEXT,
  cross_reactions TEXT[] DEFAULT '{}'
);

CREATE TABLE patient_allergies (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id      UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  allergen_id     INT NOT NULL REFERENCES allergens(id) ON DELETE CASCADE,
  severity        VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe', 'anaphylactic')),
  diagnosed_by    VARCHAR(200),
  diagnosis_date  DATE,
  is_self_reported BOOLEAN DEFAULT true,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE patient_conditions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id      UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  condition_type  VARCHAR(100) NOT NULL,
  details         TEXT,
  diagnosed_date  DATE,
  medications     TEXT[] DEFAULT '{}',
  doctor_name     VARCHAR(200),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE allergy_reactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id      UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  reaction_date   TIMESTAMPTZ NOT NULL,
  food_consumed   TEXT NOT NULL,
  symptoms        TEXT[] DEFAULT '{}',
  severity        VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe')),
  notes           TEXT,
  photo_url       TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE blood_values (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id      UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  value_type      VARCHAR(50) NOT NULL CHECK (value_type IN (
    'fasting_glucose', 'postprandial_glucose', 'hba1c',
    'ldl', 'hdl', 'total_cholesterol', 'triglyceride',
    'iron', 'b12', 'vitamin_d', 'hemoglobin'
  )),
  value           NUMERIC(8,2) NOT NULL,
  unit            VARCHAR(20) NOT NULL,
  measured_at     TIMESTAMPTZ NOT NULL,
  lab_name        VARCHAR(200),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. FOOD & MEALS
-- ============================================================================

CREATE TABLE foods (
  id                  SERIAL PRIMARY KEY,
  name                VARCHAR(200) NOT NULL,
  name_en             VARCHAR(200),
  category            VARCHAR(100),

  -- Macronutrients per 100g
  calories_per_100g   NUMERIC(7,1),
  protein_per_100g    NUMERIC(5,1),
  carbs_per_100g      NUMERIC(5,1),
  fat_per_100g        NUMERIC(5,1),
  fiber_per_100g      NUMERIC(5,1),
  sugar_per_100g      NUMERIC(5,1),
  sodium_per_100g     NUMERIC(5,1),

  -- Micronutrients per 100g
  iron_mg             NUMERIC(5,2),
  calcium_mg          NUMERIC(6,1),
  vitamin_b12_mcg     NUMERIC(5,2),
  vitamin_d_mcg       NUMERIC(5,2),
  vitamin_c_mg        NUMERIC(6,1),
  zinc_mg             NUMERIC(5,2),
  magnesium_mg        NUMERIC(6,1),
  potassium_mg        NUMERIC(7,1),

  allergen_ids        INT[] DEFAULT '{}',
  barcode             VARCHAR(50),
  serving_size_g      NUMERIC(6,1) DEFAULT 100,
  serving_description VARCHAR(100),
  is_verified         BOOLEAN DEFAULT false,
  image_url           TEXT,
  season              TEXT[] DEFAULT '{}',
  avg_price_tl        NUMERIC(6,2),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE meal_logs (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id              UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  meal_type               VARCHAR(30) NOT NULL CHECK (meal_type IN ('breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'evening_snack', 'other')),
  log_date                DATE NOT NULL,
  logged_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  entry_method            VARCHAR(20) CHECK (entry_method IN ('manual', 'photo_ai', 'barcode', 'voice', 'ocr', 'text_ai')),
  photo_url               TEXT,
  ai_analysis_raw         JSONB,
  ai_recognized_foods     JSONB,
  user_confirmed          BOOLEAN DEFAULT false,

  -- Totals
  total_calories          NUMERIC(7,1),
  total_protein           NUMERIC(5,1),
  total_carbs             NUMERIC(5,1),
  total_fat               NUMERIC(5,1),
  total_iron_mg           NUMERIC(5,2),
  total_calcium_mg        NUMERIC(6,1),
  total_vitamin_b12_mcg   NUMERIC(5,2),
  total_vitamin_d_mcg     NUMERIC(5,2),
  total_vitamin_c_mg      NUMERIC(6,1),

  -- Emotional eating
  mood                    VARCHAR(20) CHECK (mood IN ('happy', 'sad', 'stressed', 'neutral', 'angry', 'anxious')),
  hunger_level            INT CHECK (hunger_level BETWEEN 1 AND 5),

  -- Dietitian review
  sent_to_dietitian       BOOLEAN DEFAULT false,
  dietitian_viewed        BOOLEAN DEFAULT false,
  dietitian_viewed_at     TIMESTAMPTZ,
  dietitian_feedback      TEXT,
  dietitian_feedback_at   TIMESTAMPTZ,

  notes                   TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE meal_items (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_log_id             UUID NOT NULL REFERENCES meal_logs(id) ON DELETE CASCADE,
  food_id                 INT REFERENCES foods(id),
  food_name               VARCHAR(200) NOT NULL,

  -- AI vs user
  ai_estimated_amount_g   NUMERIC(6,1),
  user_adjusted_amount_g  NUMERIC(6,1),
  final_amount_g          NUMERIC(6,1) NOT NULL,

  -- Calculated nutrition
  calories                NUMERIC(7,1),
  protein                 NUMERIC(5,1),
  carbs                   NUMERIC(5,1),
  fat                     NUMERIC(5,1),
  iron_mg                 NUMERIC(5,2),
  calcium_mg              NUMERIC(6,1),
  vitamin_b12_mcg         NUMERIC(5,2),
  vitamin_d_mcg           NUMERIC(5,2),
  vitamin_c_mg            NUMERIC(6,1),

  allergen_warning        BOOLEAN DEFAULT false,
  allergen_ids            INT[] DEFAULT '{}',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE meal_plans (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id              UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  created_by_type         VARCHAR(20) NOT NULL CHECK (created_by_type IN ('dietitian', 'ai')),
  created_by_dietitian_id UUID REFERENCES dietitian_profiles(id),
  title                   VARCHAR(200) NOT NULL,
  start_date              DATE NOT NULL,
  end_date                DATE,
  daily_calorie_target    NUMERIC(7,1),
  daily_protein_target    NUMERIC(5,1),
  daily_carb_target       NUMERIC(5,1),
  daily_fat_target        NUMERIC(5,1),
  special_notes           TEXT,
  status                  VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  is_budget_friendly      BOOLEAN DEFAULT false,
  estimated_weekly_cost_tl NUMERIC(8,2),
  sent_at                 TIMESTAMPTZ,
  patient_viewed_at       TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE meal_plan_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_plan_id    UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  day_of_week     INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
  meal_type       VARCHAR(30) NOT NULL,
  food_name       VARCHAR(200) NOT NULL,
  amount_g        NUMERIC(6,1),
  calories        NUMERIC(7,1),
  protein         NUMERIC(5,1),
  carbs           NUMERIC(5,1),
  fat             NUMERIC(5,1),
  recipe_id       UUID,
  alternatives    TEXT,
  notes           TEXT,
  sort_order      INT DEFAULT 0
);

-- ============================================================================
-- 4. GAMIFICATION
-- ============================================================================

CREATE TABLE badges (
  id                SERIAL PRIMARY KEY,
  name              VARCHAR(100) NOT NULL,
  description       TEXT,
  icon              VARCHAR(50),
  category          VARCHAR(30) CHECK (category IN ('streak', 'nutrition', 'water', 'weight', 'social', 'milestone', 'special')),
  requirement_type  VARCHAR(30) CHECK (requirement_type IN ('streak_days', 'total_meals_logged', 'water_goal_days', 'weight_milestone', 'plan_adherence', 'photo_count')),
  requirement_value INT,
  xp_reward         INT DEFAULT 50,
  is_active         BOOLEAN DEFAULT true
);

CREATE TABLE patient_badges (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id  UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  badge_id    INT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(patient_id, badge_id)
);

CREATE TABLE weekly_challenges (
  id              SERIAL PRIMARY KEY,
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  challenge_type  VARCHAR(30) CHECK (challenge_type IN ('plan_adherence', 'water_goal', 'photo_all_meals', 'no_allergen_violation', 'protein_target', 'exercise_days')),
  target_value    INT NOT NULL,
  xp_reward       INT DEFAULT 100,
  start_date      DATE,
  end_date        DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE patient_challenges (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id      UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  challenge_id    INT NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
  current_progress INT DEFAULT 0,
  is_completed    BOOLEAN DEFAULT false,
  completed_at    TIMESTAMPTZ,
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE xp_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id  UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  xp_amount   INT NOT NULL,
  reason      VARCHAR(30) CHECK (reason IN (
    'meal_logged', 'photo_uploaded', 'streak_bonus', 'badge_earned',
    'challenge_completed', 'weight_logged', 'water_goal_reached',
    'plan_followed', 'exercise_logged'
  )),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. TRACKING & ANALYTICS
-- ============================================================================

CREATE TABLE weight_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id  UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  weight_kg   NUMERIC(5,1) NOT NULL,
  measured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  photo_url   TEXT,
  notes       TEXT
);

CREATE TABLE water_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id  UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  glasses     INT NOT NULL DEFAULT 1,
  logged_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE exercise_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id      UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  exercise_type   VARCHAR(50) NOT NULL,
  duration_min    INT NOT NULL,
  calories_burned NUMERIC(7,1),
  intensity       VARCHAR(20) CHECK (intensity IN ('low', 'moderate', 'high')),
  notes           TEXT,
  logged_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sleep_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id  UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  sleep_start TIMESTAMPTZ NOT NULL,
  sleep_end   TIMESTAMPTZ NOT NULL,
  quality     VARCHAR(20) CHECK (quality IN ('poor', 'fair', 'good', 'excellent')),
  notes       TEXT,
  logged_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE progress_photos (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id      UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  photo_url       TEXT NOT NULL,
  photo_type      VARCHAR(20) CHECK (photo_type IN ('front', 'side', 'back')),
  weight_at_time  NUMERIC(5,1),
  notes           TEXT,
  taken_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 6. COMMUNICATION
-- ============================================================================

CREATE TABLE conversations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE conversation_participants (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES users(id),
  receiver_id     UUID REFERENCES users(id),
  message_type    VARCHAR(20) NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'plan_share', 'meal_share', 'voice')),
  content         TEXT,
  attachment_url  TEXT,
  metadata        JSONB,
  is_read         BOOLEAN DEFAULT false,
  read_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(30) NOT NULL,
  title       VARCHAR(200) NOT NULL,
  body        TEXT,
  data        JSONB,
  is_read     BOOLEAN DEFAULT false,
  is_pushed   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE appointments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dietitian_id    UUID NOT NULL REFERENCES dietitian_profiles(id) ON DELETE CASCADE,
  patient_id      UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  type            VARCHAR(20) CHECK (type IN ('online', 'in_person')),
  status          VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  jitsi_room_id   VARCHAR(100),
  notes           TEXT,
  dietitian_notes TEXT,
  patient_notes   TEXT,
  reminder_sent   BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. RECIPES & SHOPPING
-- ============================================================================

CREATE TABLE recipes (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                    VARCHAR(200) NOT NULL,
  description             TEXT,
  instructions            TEXT,
  prep_time_min           INT,
  cook_time_min           INT,
  servings                INT DEFAULT 1,
  calories_per_serving    NUMERIC(7,1),
  protein_per_serving     NUMERIC(5,1),
  carbs_per_serving       NUMERIC(5,1),
  fat_per_serving         NUMERIC(5,1),
  difficulty              VARCHAR(20) DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  allergen_ids            INT[] DEFAULT '{}',
  image_url               TEXT,
  ingredients             JSONB,
  tags                    TEXT[] DEFAULT '{}',
  season                  TEXT[] DEFAULT '{}',
  estimated_cost_tl       NUMERIC(8,2),
  is_ai_generated         BOOLEAN DEFAULT false,
  is_budget_friendly      BOOLEAN DEFAULT false,
  created_by              UUID REFERENCES users(id),
  is_approved             BOOLEAN DEFAULT false,
  rating_avg              NUMERIC(3,2) DEFAULT 0,
  rating_count            INT DEFAULT 0,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shopping_lists (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id      UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  meal_plan_id    UUID REFERENCES meal_plans(id),
  title           VARCHAR(200) NOT NULL,
  share_code      VARCHAR(20),
  estimated_total_tl NUMERIC(8,2),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shopping_list_items (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shopping_list_id    UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  food_name           VARCHAR(200) NOT NULL,
  amount              VARCHAR(100),
  category            VARCHAR(100),
  is_checked          BOOLEAN DEFAULT false,
  checked_at          TIMESTAMPTZ,
  checked_by          UUID REFERENCES users(id),
  allergen_warning    BOOLEAN DEFAULT false,
  estimated_price_tl  NUMERIC(6,2),
  sort_order          INT DEFAULT 0
);

CREATE TABLE family_members (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_patient_id    UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  member_name         VARCHAR(100) NOT NULL,
  birth_date          DATE,
  relationship        VARCHAR(20) CHECK (relationship IN ('cocuk', 'es', 'ebeveyn')),
  allergen_ids        INT[] DEFAULT '{}',
  diet_notes          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 8. AI & REPORTS
-- ============================================================================

CREATE TABLE ai_chat_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id  UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  role        VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content     TEXT NOT NULL,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_weekly_reports (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id          UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  week_start          DATE NOT NULL,
  week_end            DATE NOT NULL,
  report_content      JSONB NOT NULL,
  pdf_url             TEXT,
  sent_to_dietitian   BOOLEAN DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 9. REFRESH TOKENS
-- ============================================================================

CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 10. INDEXES
-- ============================================================================

CREATE INDEX idx_patient_profiles_user_id ON patient_profiles(user_id);
CREATE INDEX idx_dietitian_profiles_user_id ON dietitian_profiles(user_id);
CREATE INDEX idx_dietitian_profiles_invite_code ON dietitian_profiles(invite_code);
CREATE INDEX idx_dietitian_patients_dietitian ON dietitian_patients(dietitian_id);
CREATE INDEX idx_dietitian_patients_patient ON dietitian_patients(patient_id);
CREATE INDEX idx_meal_logs_patient_date ON meal_logs(patient_id, log_date);
CREATE INDEX idx_meal_items_meal_log ON meal_items(meal_log_id);
CREATE INDEX idx_meal_plans_patient ON meal_plans(patient_id);
CREATE INDEX idx_weight_logs_patient ON weight_logs(patient_id);
CREATE INDEX idx_water_logs_patient ON water_logs(patient_id);
CREATE INDEX idx_exercise_logs_patient ON exercise_logs(patient_id);
CREATE INDEX idx_sleep_logs_patient ON sleep_logs(patient_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_appointments_dietitian ON appointments(dietitian_id, appointment_date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_xp_history_patient ON xp_history(patient_id);
CREATE INDEX idx_blood_values_patient ON blood_values(patient_id);
CREATE INDEX idx_foods_name ON foods(name);
CREATE INDEX idx_foods_barcode ON foods(barcode);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- ============================================================================
-- 11. UPDATED_AT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_patient_profiles_updated_at
  BEFORE UPDATE ON patient_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_dietitian_profiles_updated_at
  BEFORE UPDATE ON dietitian_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_conversations_updated_at
  BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
