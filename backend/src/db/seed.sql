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

-- ══════════════════════════════════════════════════════════════════════════════
-- ADDITIONAL PATIENTS FOR DEMO (2026-03-24)
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Patient 2: Mehmet Kaya (Sporcu beslenmesi) ─────────────────────────────
-- Password: ayse1234 (same hash as Ayse for dev convenience)
INSERT INTO users (id, email, password_hash, role, is_active, is_verified) VALUES
  ('b0000000-0000-0000-0000-000000000002', 'mehmet.kaya@email.com',
   '$2b$10$Z7N5stvcCvSrieALvuf6M.8ig1jp29P6aQwq16HrkceR0B/evoPr6',
   'patient', true, true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO patient_profiles (
  id, user_id, first_name, last_name, birth_date, gender,
  height_cm, current_weight_kg, target_weight_kg,
  activity_level, goal_type, goal_duration_weeks,
  diet_type, daily_water_target, sleep_hours,
  usage_mode, bmr, tdee, daily_calorie_target,
  protein_target_g, carb_target_g, fat_target_g,
  onboarding_completed, xp_points, level, current_streak
) VALUES (
  'bb000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000002',
  'Mehmet', 'Kaya', '1985-11-20', 'male',
  180, 92.0, 85.0,
  'very_active', 'muscle_gain', 16,
  'high_protein', 10, 7.0,
  'with_dietitian', 1890.0, 3260.0, 2800.0,
  180.0, 320.0, 85.0,
  true, 120, 2, 2
) ON CONFLICT DO NOTHING;

INSERT INTO dietitian_patients (dietitian_id, patient_id, status, paired_via)
VALUES ('de000000-0000-0000-0000-000000000001', 'bb000000-0000-0000-0000-000000000002', 'active', 'invite_code')
ON CONFLICT DO NOTHING;

-- ── Patient 3: Fatma Demir (Diyabet yonetimi) ─────────────────────────────
-- Password: ayse1234 (same hash as Ayse for dev convenience)
INSERT INTO users (id, email, password_hash, role, is_active, is_verified) VALUES
  ('b0000000-0000-0000-0000-000000000003', 'fatma.demir@email.com',
   '$2b$10$Z7N5stvcCvSrieALvuf6M.8ig1jp29P6aQwq16HrkceR0B/evoPr6',
   'patient', true, true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO patient_profiles (
  id, user_id, first_name, last_name, birth_date, gender,
  height_cm, current_weight_kg, target_weight_kg,
  activity_level, goal_type, goal_duration_weeks,
  diet_type, daily_water_target, sleep_hours,
  usage_mode, bmr, tdee, daily_calorie_target,
  protein_target_g, carb_target_g, fat_target_g,
  onboarding_completed, xp_points, level, current_streak
) VALUES (
  'bb000000-0000-0000-0000-000000000003',
  'b0000000-0000-0000-0000-000000000003',
  'Fatma', 'Demir', '1978-03-10', 'female',
  160, 78.0, 68.0,
  'lightly_active', 'weight_loss', 20,
  'diabetic', 8, 8.0,
  'with_dietitian', 1380.0, 1890.0, 1500.0,
  90.0, 150.0, 50.0,
  true, 50, 1, 0
) ON CONFLICT DO NOTHING;

INSERT INTO dietitian_patients (dietitian_id, patient_id, status, paired_via)
VALUES ('de000000-0000-0000-0000-000000000001', 'bb000000-0000-0000-0000-000000000003', 'active', 'invite_code')
ON CONFLICT DO NOTHING;

-- ── Patient 4: Zeynep Celik (Hamilelik beslenmesi) ─────────────────────────
-- Password: ayse1234 (same hash as Ayse for dev convenience)
INSERT INTO users (id, email, password_hash, role, is_active, is_verified) VALUES
  ('b0000000-0000-0000-0000-000000000004', 'zeynep.celik@email.com',
   '$2b$10$Z7N5stvcCvSrieALvuf6M.8ig1jp29P6aQwq16HrkceR0B/evoPr6',
   'patient', true, true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO patient_profiles (
  id, user_id, first_name, last_name, birth_date, gender,
  height_cm, current_weight_kg, target_weight_kg,
  activity_level, goal_type, goal_duration_weeks,
  diet_type, daily_water_target, sleep_hours,
  usage_mode, bmr, tdee, daily_calorie_target,
  protein_target_g, carb_target_g, fat_target_g,
  onboarding_completed, xp_points, level, current_streak
) VALUES (
  'bb000000-0000-0000-0000-000000000004',
  'b0000000-0000-0000-0000-000000000004',
  'Zeynep', 'Celik', '1993-07-25', 'female',
  168, 65.0, 65.0,
  'moderately_active', 'maintain', 24,
  'normal', 10, 8.5,
  'with_dietitian', 1420.0, 2200.0, 2200.0,
  110.0, 260.0, 70.0,
  true, 580, 4, 12
) ON CONFLICT DO NOTHING;

INSERT INTO dietitian_patients (dietitian_id, patient_id, status, paired_via)
VALUES ('de000000-0000-0000-0000-000000000001', 'bb000000-0000-0000-0000-000000000004', 'active', 'invite_code')
ON CONFLICT DO NOTHING;

-- ── Appointments ────────────────────────────────────────────────────────────
INSERT INTO appointments (dietitian_id, patient_id, appointment_date, start_time, end_time, type, status, notes) VALUES
  ('de000000-0000-0000-0000-000000000001', 'bb000000-0000-0000-0000-000000000001',
   CURRENT_DATE + 2, '10:00', '10:45', 'online', 'scheduled', 'Haftalik kontrol'),
  ('de000000-0000-0000-0000-000000000001', 'bb000000-0000-0000-0000-000000000002',
   CURRENT_DATE + 3, '14:00', '14:45', 'online', 'scheduled', 'Sporcu beslenmesi plani'),
  ('de000000-0000-0000-0000-000000000001', 'bb000000-0000-0000-0000-000000000003',
   CURRENT_DATE + 1, '11:00', '11:45', 'in_person', 'confirmed', 'Diyabet takibi'),
  ('de000000-0000-0000-0000-000000000001', 'bb000000-0000-0000-0000-000000000001',
   CURRENT_DATE - 7, '10:00', '10:45', 'online', 'completed', 'Ilk gorusme tamamlandi'),
  ('de000000-0000-0000-0000-000000000001', 'bb000000-0000-0000-0000-000000000004',
   CURRENT_DATE + 5, '09:00', '09:45', 'online', 'scheduled', 'Hamilelik beslenmesi takibi');

-- ── Notifications for Elif (dietitian) ──────────────────────────────────────
INSERT INTO notifications (user_id, type, title, body) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'meal_review', 'Yeni ogun kaydı',
   'Ayse Yilmaz kahvalti kaydetti. Incelemek ister misiniz?'),
  ('d0000000-0000-0000-0000-000000000001', 'appointment', 'Yarin randevunuz var',
   'Fatma Demir ile saat 11:00 de randevunuz var.'),
  ('d0000000-0000-0000-0000-000000000001', 'alert', 'Dikkat: Dusuk plan uyumu',
   'Fatma Demir son 5 gunde %30 plan uyumu gosteriyor.'),
  ('d0000000-0000-0000-0000-000000000001', 'message', 'Yeni mesaj',
   'Zeynep Celik size mesaj gonderdi.');

-- ── Notifications for Ayse (patient) ────────────────────────────────────────
INSERT INTO notifications (user_id, type, title, body) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'plan_update', 'Diyet planiniz guncellendi',
   'Dyt. Elif Kaya beslenme planinizi guncelledi. Kontrol etmeyi unutmayin!'),
  ('b0000000-0000-0000-0000-000000000001', 'appointment', 'Randevu hatirlatmasi',
   '2 gun sonra saat 10:00 da online randevunuz var.'),
  ('b0000000-0000-0000-0000-000000000001', 'achievement', 'Yeni rozet kazandiniz!',
   '7 Gun Serisi rozetini kazandiniz! Tebrikler!');

-- ── Meal plan for Ayse ──────────────────────────────────────────────────────
INSERT INTO meal_plans (
  id, patient_id, created_by_type, created_by_dietitian_id,
  title, start_date, end_date,
  daily_calorie_target, daily_protein_target, daily_carb_target, daily_fat_target,
  special_notes, status
) VALUES (
  'mp000000-0000-0000-0000-000000000001',
  'bb000000-0000-0000-0000-000000000001',
  'dietitian', 'de000000-0000-0000-0000-000000000001',
  'Kilo Verme Programi - Hafta 1', CURRENT_DATE, CURRENT_DATE + 7,
  1750, 105, 200, 55,
  'Protein agirlikli, dusuk karbonhidrat. Gunde 8 bardak su.', 'active'
);

-- ── More meal logs for Ayse (7 days) ────────────────────────────────────────
INSERT INTO meal_logs (patient_id, meal_type, log_date, entry_method, total_calories, total_protein, total_carbs, total_fat, mood, hunger_level, sent_to_dietitian) VALUES
  ('bb000000-0000-0000-0000-000000000001', 'breakfast', CURRENT_DATE - 1, 'manual', 380, 15, 48, 12, 'happy', 3, true),
  ('bb000000-0000-0000-0000-000000000001', 'lunch',     CURRENT_DATE - 1, 'photo_ai', 620, 32, 55, 20, 'neutral', 4, true),
  ('bb000000-0000-0000-0000-000000000001', 'dinner',    CURRENT_DATE - 1, 'manual', 580, 38, 40, 18, 'happy', 3, true),
  ('bb000000-0000-0000-0000-000000000001', 'breakfast', CURRENT_DATE - 2, 'manual', 350, 12, 45, 10, 'neutral', 2, true),
  ('bb000000-0000-0000-0000-000000000001', 'lunch',     CURRENT_DATE - 2, 'manual', 700, 40, 65, 25, 'sad', 5, true),
  ('bb000000-0000-0000-0000-000000000001', 'dinner',    CURRENT_DATE - 2, 'manual', 550, 30, 50, 18, 'happy', 3, true),
  ('bb000000-0000-0000-0000-000000000001', 'breakfast', CURRENT_DATE - 3, 'manual', 400, 18, 50, 13, 'happy', 3, true),
  ('bb000000-0000-0000-0000-000000000001', 'lunch',     CURRENT_DATE - 3, 'manual', 600, 35, 58, 20, 'neutral', 4, true),
  ('bb000000-0000-0000-0000-000000000001', 'dinner',    CURRENT_DATE - 3, 'manual', 520, 28, 45, 16, 'neutral', 3, true),
  ('bb000000-0000-0000-0000-000000000001', 'snack',     CURRENT_DATE - 1, 'manual', 180, 8, 20, 6, 'happy', 2, false);

-- ── Meal logs for Mehmet ────────────────────────────────────────────────────
INSERT INTO meal_logs (patient_id, meal_type, log_date, entry_method, total_calories, total_protein, total_carbs, total_fat, mood, hunger_level, sent_to_dietitian) VALUES
  ('bb000000-0000-0000-0000-000000000002', 'breakfast', CURRENT_DATE, 'manual', 650, 45, 60, 25, 'happy', 4, true),
  ('bb000000-0000-0000-0000-000000000002', 'lunch',     CURRENT_DATE, 'manual', 850, 55, 80, 30, 'neutral', 5, true);

-- ── Exercise logs for Ayse ──────────────────────────────────────────────────
INSERT INTO exercise_logs (patient_id, exercise_type, duration_min, intensity, calories_burned) VALUES
  ('bb000000-0000-0000-0000-000000000001', 'walking', 45, 'moderate', 220),
  ('bb000000-0000-0000-0000-000000000001', 'yoga', 30, 'light', 120),
  ('bb000000-0000-0000-0000-000000000001', 'walking', 50, 'moderate', 250);

-- ── Sleep logs for Ayse ─────────────────────────────────────────────────────
INSERT INTO sleep_logs (patient_id, sleep_start, sleep_end, quality) VALUES
  ('bb000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP - INTERVAL '8 hours', CURRENT_TIMESTAMP, 4),
  ('bb000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP - INTERVAL '32 hours', CURRENT_TIMESTAMP - INTERVAL '24.5 hours', 3);

-- ── Review from Ayse for Elif ───────────────────────────────────────────────
INSERT INTO dietitian_reviews (patient_id, dietitian_id, rating, comment, is_anonymous) VALUES
  ('bb000000-0000-0000-0000-000000000001', 'de000000-0000-0000-0000-000000000001',
   5, 'Elif Hanim cok ilgili ve bilgili. Beslenme planim mukemmel, kilo vermeye basladim. Kesinlikle tavsiye ederim!', false);

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
