-- ============================================================================
-- NutriAI — Seed Data (Demo)
-- Demo kullanicilari: Dyt. Elif Kaya + Ayse Yilmaz (hasta)
-- ============================================================================

-- ── Admin user ───────────────────────────────────────────────────────────────
-- Password: admin123 (bcrypt hash)
INSERT INTO users (id, email, password_hash, role, is_active, is_verified) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin@nutriai.com',
   '$2b$10$vN5pslOAApJ5k5GsWLr/R.eOCf2cNiFUeXqz44EcCcyZQxp.0y7F2',
   'admin', true, true);

-- ── Dietitian: Dyt. Elif Kaya ────────────────────────────────────────────────
-- Password: elif1234 (bcrypt hash)
INSERT INTO users (id, email, password_hash, role, is_active, is_verified) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'elif.kaya@nutriai.com',
   '$2b$10$xRBFqlxlDavZydeFiXdK6e4XcKELu.XYnBj1b5lPX89BZDvAQy7sS',
   'dietitian', true, true);

INSERT INTO dietitian_profiles (
  id, user_id, first_name, last_name, title, license_number,
  specializations, university, experience_years, bio,
  clinic_name, city, offers_online, offers_in_person,
  session_price_tl, invite_code, max_patients,
  available_days, session_duration_min, is_approved, approval_date
) VALUES (
  'de000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'Elif', 'Kaya', 'Uzm. Dyt.', 'DYT-34-2019-0042',
  ARRAY['kilo_yonetimi', 'sporcu_beslenmesi', 'diyabet'],
  'Hacettepe Universitesi', 7,
  'Kilo yonetimi ve sporcu beslenmesi alaninda uzman diyetisyen. 7 yillik klinik deneyim.',
  'Saglikli Yasam Klinigi', 'Istanbul', true, true,
  500.00, 'DYT-ELIF-7X3K', 50,
  ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  45, true, NOW()
);

-- ── Patient: Ayse Yilmaz ─────────────────────────────────────────────────────
-- Password: ayse1234 (bcrypt hash)
INSERT INTO users (id, email, password_hash, role, is_active, is_verified) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'ayse.yilmaz@email.com',
   '$2b$10$Z7N5stvcCvSrieALvuf6M.8ig1jp29P6aQwq16HrkceR0B/evoPr6',
   'patient', true, true);

INSERT INTO patient_profiles (
  id, user_id, first_name, last_name, birth_date, gender,
  height_cm, current_weight_kg, target_weight_kg,
  activity_level, goal_type, goal_duration_weeks,
  diet_type, daily_water_target, sleep_hours,
  usage_mode, bmr, tdee, daily_calorie_target,
  protein_target_g, carb_target_g, fat_target_g,
  onboarding_completed, xp_points, level, current_streak
) VALUES (
  'bb000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'Ayse', 'Yilmaz', '1990-05-15', 'female',
  165, 72.5, 62.0,
  'moderately_active', 'weight_loss', 12,
  'normal', 8, 7.5,
  'with_dietitian', 1450.0, 2247.5, 1750.0,
  105.0, 200.0, 55.0,
  true, 350, 3, 5
);

-- ── Pair dietitian and patient ───────────────────────────────────────────────
INSERT INTO dietitian_patients (
  dietitian_id, patient_id, status, paired_via
) VALUES (
  'de000000-0000-0000-0000-000000000001',
  'bb000000-0000-0000-0000-000000000001',
  'active', 'invite_code'
);

-- ── Allergens (Temel alerjenler) ─────────────────────────────────────────────
INSERT INTO allergens (name, name_en, category, icon) VALUES
  ('Gluten', 'Gluten', 'food_allergen', 'wheat'),
  ('Sut', 'Milk', 'food_allergen', 'milk'),
  ('Yumurta', 'Egg', 'food_allergen', 'egg'),
  ('Yer Fistigi', 'Peanut', 'food_allergen', 'peanut'),
  ('Kabuklu Yemis', 'Tree Nuts', 'food_allergen', 'almond'),
  ('Soya', 'Soy', 'food_allergen', 'soy'),
  ('Balik', 'Fish', 'food_allergen', 'fish'),
  ('Kabuklu Deniz Urunleri', 'Shellfish', 'food_allergen', 'shrimp'),
  ('Susam', 'Sesame', 'food_allergen', 'sesame'),
  ('Kereviz', 'Celery', 'food_allergen', 'celery'),
  ('Hardal', 'Mustard', 'food_allergen', 'mustard'),
  ('Lupin', 'Lupin', 'food_allergen', 'lupin'),
  ('Yumusakcalar', 'Mollusks', 'food_allergen', 'mollusk'),
  ('Sülfit', 'Sulfites', 'food_allergen', 'sulfite'),
  ('Laktoz', 'Lactose', 'food_intolerance', 'milk'),
  ('Fruktoz', 'Fructose', 'food_intolerance', 'apple');

-- ── Ayse'nin alerjileri ──────────────────────────────────────────────────────
INSERT INTO patient_allergies (patient_id, allergen_id, severity, is_self_reported) VALUES
  ('bb000000-0000-0000-0000-000000000001', 15, 'moderate', true);

-- ── Foods: see seed-foods.sql for 150+ entries ─────────────────────────────
-- Import seed-foods.sql separately or run it after this file
-- To use inline: \i seed-foods.sql

-- ── Badges ───────────────────────────────────────────────────────────────────
INSERT INTO badges (name, description, icon, category, requirement_type, requirement_value, xp_reward) VALUES
  ('3 Gun Serisi', '3 gun ust uste ogun kaydi', 'flame', 'streak', 'streak_days', 3, 25),
  ('7 Gun Serisi', '7 gun ust uste ogun kaydi', 'flame', 'streak', 'streak_days', 7, 50),
  ('30 Gun Serisi', '30 gun ust uste ogun kaydi', 'flame', 'streak', 'streak_days', 30, 150),
  ('100 Gun Efsanesi', '100 gun ust uste ogun kaydi', 'flame', 'streak', 'streak_days', 100, 500),
  ('Protein Sampiyonu', '7 gun protein hedefini tuttur', 'beef', 'nutrition', 'plan_adherence', 7, 75),
  ('Denge Ustasi', '7 gun makro dengesi', 'scale', 'nutrition', 'plan_adherence', 7, 75),
  ('Foto Meraklisi', '50 ogun fotosu yukle', 'camera', 'nutrition', 'photo_count', 50, 100),
  ('Plan Takipcisi', 'Haftalik %90 uyum', 'target', 'nutrition', 'plan_adherence', 90, 100),
  ('Su Perisi', '7 gun su hedefini tuttur', 'droplets', 'water', 'water_goal_days', 7, 50),
  ('Okyanus', '30 gun su hedefini tuttur', 'waves', 'water', 'water_goal_days', 30, 150),
  ('Ilk Kilo', 'Ilk 1 kg verildi', 'weight', 'weight', 'weight_milestone', 1, 50),
  ('Yari Yol', 'Hedefin %50si', 'trophy', 'weight', 'weight_milestone', 50, 150),
  ('Hedefe Ulastin', 'Hedef kiloya ulastin', 'crown', 'weight', 'weight_milestone', 100, 500),
  ('Ilk Eslesme', 'Diyetisyen ile eslesti', 'users', 'social', 'streak_days', 1, 25),
  ('Ilk Degerlendirme', 'Diyetisyeni puanladi', 'star', 'social', 'streak_days', 1, 25);

-- ── Ayse'nin rozetleri ───────────────────────────────────────────────────────
INSERT INTO patient_badges (patient_id, badge_id) VALUES
  ('bb000000-0000-0000-0000-000000000001', 1),
  ('bb000000-0000-0000-0000-000000000001', 2),
  ('bb000000-0000-0000-0000-000000000001', 14);

-- ── Weekly challenge ─────────────────────────────────────────────────────────
INSERT INTO weekly_challenges (title, description, challenge_type, target_value, xp_reward, start_date, end_date) VALUES
  ('5 Gun Plan Uyumu', '5 gun boyunca beslenme planina %90 uyum sagla', 'plan_adherence', 5, 100, CURRENT_DATE, CURRENT_DATE + 7),
  ('Tum Ogunleri Fotola', '7 gun boyunca tum ogunlerin fotosunu cek', 'photo_all_meals', 7, 75, CURRENT_DATE, CURRENT_DATE + 7),
  ('7 Gun Su Hedefi', '7 gun boyunca gunluk su hedefini tuttur', 'water_goal', 7, 75, CURRENT_DATE, CURRENT_DATE + 7);

-- ── Ayse'nin mevcut challenge'i ──────────────────────────────────────────────
INSERT INTO patient_challenges (patient_id, challenge_id, current_progress) VALUES
  ('bb000000-0000-0000-0000-000000000001', 1, 3);

-- ── Sample meal logs for Ayse ────────────────────────────────────────────────
INSERT INTO meal_logs (patient_id, meal_type, log_date, entry_method, total_calories, total_protein, total_carbs, total_fat, mood, hunger_level, sent_to_dietitian) VALUES
  ('bb000000-0000-0000-0000-000000000001', 'breakfast', CURRENT_DATE, 'manual', 420, 18, 52, 15, 'happy', 3, true),
  ('bb000000-0000-0000-0000-000000000001', 'lunch', CURRENT_DATE, 'photo_ai', 650, 35, 60, 22, 'neutral', 4, true);

-- ── Sample weight logs for Ayse ──────────────────────────────────────────────
INSERT INTO weight_logs (patient_id, weight_kg) VALUES
  ('bb000000-0000-0000-0000-000000000001', 75.0),
  ('bb000000-0000-0000-0000-000000000001', 74.5),
  ('bb000000-0000-0000-0000-000000000001', 74.0),
  ('bb000000-0000-0000-0000-000000000001', 73.5),
  ('bb000000-0000-0000-0000-000000000001', 73.0),
  ('bb000000-0000-0000-0000-000000000001', 72.5);

-- ── Sample water logs ────────────────────────────────────────────────────────
INSERT INTO water_logs (patient_id, glasses) VALUES
  ('bb000000-0000-0000-0000-000000000001', 6),
  ('bb000000-0000-0000-0000-000000000001', 8),
  ('bb000000-0000-0000-0000-000000000001', 7);

-- ── Conversation between Elif and Ayse ───────────────────────────────────────
INSERT INTO conversations (id) VALUES
  ('c0000000-0000-0000-0000-000000000001');

INSERT INTO conversation_participants (conversation_id, user_id) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001');

INSERT INTO messages (conversation_id, sender_id, receiver_id, content) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
   'Merhaba Ayse Hanim, beslenme planinizi hazirliyorum. Bu hafta ozellikle protein alimina dikkat edelim.'),
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001',
   'Merhaba Elif Hanim, tesekkur ederim! Protein konusunda biraz zorlaniyorum, onerilerinizi bekliyorum.');

-- ── XP history for Ayse ──────────────────────────────────────────────────────
INSERT INTO xp_history (patient_id, xp_amount, reason) VALUES
  ('bb000000-0000-0000-0000-000000000001', 10, 'photo_uploaded'),
  ('bb000000-0000-0000-0000-000000000001', 5, 'meal_logged'),
  ('bb000000-0000-0000-0000-000000000001', 5, 'meal_logged'),
  ('bb000000-0000-0000-0000-000000000001', 50, 'badge_earned'),
  ('bb000000-0000-0000-0000-000000000001', 50, 'badge_earned'),
  ('bb000000-0000-0000-0000-000000000001', 25, 'badge_earned'),
  ('bb000000-0000-0000-0000-000000000001', 5, 'water_goal_reached'),
  ('bb000000-0000-0000-0000-000000000001', 10, 'weight_logged'),
  ('bb000000-0000-0000-0000-000000000001', 15, 'plan_followed'),
  ('bb000000-0000-0000-0000-000000000001', 15, 'plan_followed'),
  ('bb000000-0000-0000-0000-000000000001', 15, 'plan_followed'),
  ('bb000000-0000-0000-0000-000000000001', 15, 'plan_followed'),
  ('bb000000-0000-0000-0000-000000000001', 15, 'plan_followed'),
  ('bb000000-0000-0000-0000-000000000001', 25, 'streak_bonus'),
  ('bb000000-0000-0000-0000-000000000001', 25, 'streak_bonus'),
  ('bb000000-0000-0000-0000-000000000001', 25, 'streak_bonus'),
  ('bb000000-0000-0000-0000-000000000001', 25, 'streak_bonus'),
  ('bb000000-0000-0000-0000-000000000001', 20, 'exercise_logged');
