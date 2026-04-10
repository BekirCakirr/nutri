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
  'normal', 10, 7.0,
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
  'lightly_active', 'disease_management', 20,
  'normal', 8, 8.0,
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
  'moderately_active', 'maintenance', 24,
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
  patient_id, created_by_type, created_by_dietitian_id,
  title, start_date, end_date,
  daily_calorie_target, daily_protein_target, daily_carb_target, daily_fat_target,
  special_notes, status
) VALUES (
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
  ('bb000000-0000-0000-0000-000000000001', 'yoga', 30, 'low', 120),
  ('bb000000-0000-0000-0000-000000000001', 'walking', 50, 'moderate', 250);

-- ── Sleep logs for Ayse ─────────────────────────────────────────────────────
INSERT INTO sleep_logs (patient_id, sleep_start, sleep_end, quality) VALUES
  ('bb000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP - INTERVAL '8 hours', CURRENT_TIMESTAMP, 'excellent'),
  ('bb000000-0000-0000-0000-000000000001', CURRENT_TIMESTAMP - INTERVAL '32 hours', CURRENT_TIMESTAMP - INTERVAL '24.5 hours', 'good');

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

-- ══════════════════════════════════════════════════════════════════════════════
-- ENRICHED SEED DATA (Sprint 1 — 2026-03-29)
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Recipes (6 Türk tarifi) ─────────────────────────────────────────────────

INSERT INTO recipes (
  id, name, description, instructions, prep_time_min, cook_time_min, servings,
  calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving,
  difficulty, tags, ingredients, is_approved, created_by, is_budget_friendly, estimated_cost_tl
) VALUES
(
  'ae000000-0000-0000-0000-000000000001',
  'Mercimek Çorbası',
  'Klasik Türk mutfağının vazgeçilmezi, besleyici ve doyurucu kırmızı mercimek çorbası.',
  E'1. Soğan ve havucu küçük doğrayın.\n2. Zeytinyağında soğanı kavurun.\n3. Havuç ve patatesi ekleyip 2 dk kavurun.\n4. Yıkanmış mercimeği ekleyin.\n5. Sıcak su ekleyip 25 dk pişirin.\n6. Blender ile pürüzsüz hale getirin.\n7. Tuz, karabiber ve pul biber ekleyin.\n8. Limon sıkarak servis edin.',
  10, 25, 4,
  185, 11, 28, 3.5,
  'easy',
  ARRAY['çorba', 'vegan', 'glutensiz', 'bütçe dostu', 'Türk mutfağı'],
  '[{"name": "Kırmızı mercimek", "amount": "1.5 su bardağı"}, {"name": "Soğan", "amount": "1 adet"}, {"name": "Havuç", "amount": "1 adet"}, {"name": "Patates", "amount": "1 küçük"}, {"name": "Zeytinyağı", "amount": "2 yemek kaşığı"}, {"name": "Limon", "amount": "1 adet"}, {"name": "Tuz, karabiber, pul biber", "amount": "Tat için"}]'::jsonb,
  true, 'd0000000-0000-0000-0000-000000000001', true, 25.00
),
(
  'ae000000-0000-0000-0000-000000000002',
  'Izgara Tavuk Salata',
  'Protein ağırlıklı, diyet dostu ızgara tavuk göğsü salatası.',
  E'1. Tavuk göğsünü tuzlayıp biberleyin.\n2. Izgarada her iki yüzünü 5-6 dk pişirin.\n3. Yeşillikleri yıkayıp kurulayın.\n4. Domatesi, salatalığı doğrayın.\n5. Tavuğu dilimleyip yeşilliklerin üzerine dizin.\n6. Zeytinyağı-limon sosu ile servis edin.',
  15, 12, 2,
  320, 38, 12, 14,
  'easy',
  ARRAY['salata', 'yüksek protein', 'düşük karbonhidrat', 'diyet'],
  '[{"name": "Tavuk göğsü", "amount": "300g"}, {"name": "Marul", "amount": "1 küçük"}, {"name": "Domates", "amount": "2 adet"}, {"name": "Salatalık", "amount": "1 adet"}, {"name": "Zeytinyağı", "amount": "2 yemek kaşığı"}, {"name": "Limon suyu", "amount": "1 yemek kaşığı"}]'::jsonb,
  true, 'd0000000-0000-0000-0000-000000000001', true, 45.00
),
(
  'ae000000-0000-0000-0000-000000000003',
  'Yulaf Ezmesi Bowl',
  'Sabah enerjisi için meyve ve kuruyemişli yulaf ezmesi.',
  E'1. Yulafı sütle karıştırın.\n2. Orta ateşte 5 dk pişirin.\n3. Kaseye alın.\n4. Muz dilimlerini, çilekleri ve yaban mersinini üzerine dizin.\n5. Bal ve tarçın serpin.\n6. Ceviz veya badem ekleyin.',
  5, 5, 1,
  380, 12, 58, 12,
  'easy',
  ARRAY['kahvaltı', 'sağlıklı', 'lifli', 'enerji'],
  '[{"name": "Yulaf ezmesi", "amount": "50g"}, {"name": "Süt", "amount": "200ml"}, {"name": "Muz", "amount": "1/2 adet"}, {"name": "Çilek", "amount": "5 adet"}, {"name": "Bal", "amount": "1 tatlı kaşığı"}, {"name": "Ceviz", "amount": "3-4 adet"}]'::jsonb,
  true, 'd0000000-0000-0000-0000-000000000001', true, 20.00
),
(
  'ae000000-0000-0000-0000-000000000004',
  'Fırında Somon',
  'Omega-3 açısından zengin, kolay hazırlanan fırında somon fileto.',
  E'1. Fırını 200°C''ye ısıtın.\n2. Somon filetosunu fırın kabına koyun.\n3. Zeytinyağı, limon suyu, sarımsak ve dereotu ile marine edin.\n4. 15-18 dk fırında pişirin.\n5. Yanında buharda brokoli ile servis edin.',
  10, 18, 2,
  340, 32, 5, 22,
  'medium',
  ARRAY['deniz ürünü', 'omega-3', 'gluten free', 'akşam yemeği'],
  '[{"name": "Somon fileto", "amount": "400g"}, {"name": "Limon", "amount": "1 adet"}, {"name": "Zeytinyağı", "amount": "1 yemek kaşığı"}, {"name": "Sarımsak", "amount": "2 diş"}, {"name": "Dereotu", "amount": "1 demet"}, {"name": "Brokoli", "amount": "200g"}]'::jsonb,
  true, 'd0000000-0000-0000-0000-000000000001', false, 120.00
),
(
  'ae000000-0000-0000-0000-000000000005',
  'Kinoa Salatası',
  'Hafif ve besleyici kinoa salatası, öğle yemeği için ideal.',
  E'1. Kinoayı yıkayıp 15 dk haşlayın.\n2. Soğumaya bırakın.\n3. Domates, salatalık, biber, maydanozu doğrayın.\n4. Hepsini karıştırın.\n5. Zeytinyağı, limon suyu, tuz ile sosunu hazırlayın.\n6. Sosu ekleyip servis edin.',
  15, 15, 2,
  280, 10, 38, 10,
  'easy',
  ARRAY['salata', 'vegan', 'glutensiz', 'öğle yemeği'],
  '[{"name": "Kinoa", "amount": "1 su bardağı"}, {"name": "Domates", "amount": "2 adet"}, {"name": "Salatalık", "amount": "1 adet"}, {"name": "Yeşil biber", "amount": "1 adet"}, {"name": "Maydanoz", "amount": "1/2 demet"}, {"name": "Zeytinyağı", "amount": "2 yemek kaşığı"}, {"name": "Limon suyu", "amount": "2 yemek kaşığı"}]'::jsonb,
  true, 'd0000000-0000-0000-0000-000000000001', true, 35.00
),
(
  'ae000000-0000-0000-0000-000000000006',
  'Smoothie Bowl',
  'Antioksidan zengini, renkli ve ferahlatıcı smoothie bowl.',
  E'1. Donmuş muz ve yaban mersinini blender''a koyun.\n2. Yoğurt ve bir miktar süt ekleyin.\n3. Pürüzsüz olana kadar çekin.\n4. Kaseye dökün.\n5. Üzerine granola, chia tohumu ve taze meyve ekleyin.',
  10, 0, 1,
  290, 9, 48, 7,
  'easy',
  ARRAY['kahvaltı', 'smoothie', 'antioksidan', 'vegan seçenekli'],
  '[{"name": "Muz (donmuş)", "amount": "1 adet"}, {"name": "Yaban mersini", "amount": "1/2 su bardağı"}, {"name": "Yoğurt", "amount": "100g"}, {"name": "Süt", "amount": "50ml"}, {"name": "Granola", "amount": "30g"}, {"name": "Chia tohumu", "amount": "1 tatlı kaşığı"}]'::jsonb,
  false, 'd0000000-0000-0000-0000-000000000001', true, 30.00
);

-- ── Meal plan items for Ayse's plan ─────────────────────────────────────────

INSERT INTO meal_plan_items (
  meal_plan_id, day_of_week, meal_type, food_name, amount_g, calories, protein, carbs, fat, notes, sort_order
) VALUES
-- Pazartesi
((SELECT id FROM meal_plans WHERE title = 'Kilo Verme Programi - Hafta 1' LIMIT 1), 1, 'breakfast', 'Yulaf ezmesi + muz + ceviz', 200, 380, 12, 58, 12, 'Sütle hazırla', 1),
((SELECT id FROM meal_plans WHERE title = 'Kilo Verme Programi - Hafta 1' LIMIT 1), 1, 'lunch', 'Izgara tavuk salata', 350, 320, 38, 12, 14, 'Bol yeşillik', 2),
((SELECT id FROM meal_plans WHERE title = 'Kilo Verme Programi - Hafta 1' LIMIT 1), 1, 'dinner', 'Mercimek çorbası + tam buğday ekmek', 400, 280, 14, 42, 6, NULL, 3),
((SELECT id FROM meal_plans WHERE title = 'Kilo Verme Programi - Hafta 1' LIMIT 1), 1, 'snack', 'Elma + 10 badem', 150, 180, 5, 22, 9, 'Öğleden sonra', 4),
-- Salı
((SELECT id FROM meal_plans WHERE title = 'Kilo Verme Programi - Hafta 1' LIMIT 1), 2, 'breakfast', 'Peynirli omlet (2 yumurta)', 180, 280, 20, 4, 20, 'Az yağda', 1),
((SELECT id FROM meal_plans WHERE title = 'Kilo Verme Programi - Hafta 1' LIMIT 1), 2, 'lunch', 'Kinoa salatası', 300, 280, 10, 38, 10, NULL, 2),
((SELECT id FROM meal_plans WHERE title = 'Kilo Verme Programi - Hafta 1' LIMIT 1), 2, 'dinner', 'Fırında somon + brokoli', 350, 340, 32, 5, 22, NULL, 3),
-- Çarşamba
((SELECT id FROM meal_plans WHERE title = 'Kilo Verme Programi - Hafta 1' LIMIT 1), 3, 'breakfast', 'Yoğurt + müsli + meyve', 250, 310, 14, 48, 8, NULL, 1),
((SELECT id FROM meal_plans WHERE title = 'Kilo Verme Programi - Hafta 1' LIMIT 1), 3, 'lunch', 'Tavuk sote + bulgur pilavı', 350, 420, 30, 45, 12, NULL, 2),
((SELECT id FROM meal_plans WHERE title = 'Kilo Verme Programi - Hafta 1' LIMIT 1), 3, 'dinner', 'Sebze çorbası + salata', 400, 220, 8, 30, 6, 'Hafif akşam', 3);

-- ── Shopping Lists ──────────────────────────────────────────────────────────

INSERT INTO shopping_lists (id, patient_id, meal_plan_id, title, estimated_total_tl) VALUES
  ('50000000-0000-0000-0000-000000000001',
   'bb000000-0000-0000-0000-000000000001',
   (SELECT id FROM meal_plans WHERE title = 'Kilo Verme Programi - Hafta 1' LIMIT 1),
   'Haftalık Alışveriş — Hafta 1',
   285.00),
  ('50000000-0000-0000-0000-000000000002',
   'bb000000-0000-0000-0000-000000000001',
   NULL,
   'Sağlıklı Atıştırmalıklar',
   95.00);

INSERT INTO shopping_list_items (shopping_list_id, food_name, amount, category, is_checked, estimated_price_tl, sort_order) VALUES
  -- Haftalık Alışveriş
  ('50000000-0000-0000-0000-000000000001', 'Tavuk göğsü', '600g', 'Et & Balık', false, 65.00, 1),
  ('50000000-0000-0000-0000-000000000001', 'Somon fileto', '400g', 'Et & Balık', false, 120.00, 2),
  ('50000000-0000-0000-0000-000000000001', 'Yumurta (10lu)', '1 paket', 'Süt Ürünleri', true, 28.00, 3),
  ('50000000-0000-0000-0000-000000000001', 'Yoğurt', '500g', 'Süt Ürünleri', true, 18.00, 4),
  ('50000000-0000-0000-0000-000000000001', 'Beyaz peynir', '250g', 'Süt Ürünleri', false, 22.00, 5),
  ('50000000-0000-0000-0000-000000000001', 'Yulaf ezmesi', '500g', 'Tahıllar', true, 15.00, 6),
  ('50000000-0000-0000-0000-000000000001', 'Kinoa', '300g', 'Tahıllar', false, 25.00, 7),
  ('50000000-0000-0000-0000-000000000001', 'Bulgur', '500g', 'Tahıllar', false, 12.00, 8),
  ('50000000-0000-0000-0000-000000000001', 'Kırmızı mercimek', '500g', 'Baklagiller', true, 15.00, 9),
  ('50000000-0000-0000-0000-000000000001', 'Domates', '1 kg', 'Sebze', false, 12.00, 10),
  ('50000000-0000-0000-0000-000000000001', 'Salatalık', '500g', 'Sebze', false, 8.00, 11),
  ('50000000-0000-0000-0000-000000000001', 'Brokoli', '500g', 'Sebze', false, 15.00, 12),
  ('50000000-0000-0000-0000-000000000001', 'Marul', '1 adet', 'Sebze', false, 8.00, 13),
  ('50000000-0000-0000-0000-000000000001', 'Muz', '1 kg', 'Meyve', false, 18.00, 14),
  ('50000000-0000-0000-0000-000000000001', 'Elma', '1 kg', 'Meyve', false, 12.00, 15),
  ('50000000-0000-0000-0000-000000000001', 'Limon', '3 adet', 'Meyve', false, 6.00, 16),
  ('50000000-0000-0000-0000-000000000001', 'Zeytinyağı', '500ml', 'Yağlar', true, 35.00, 17),
  ('50000000-0000-0000-0000-000000000001', 'Badem', '200g', 'Kuruyemiş', false, 28.00, 18),
  -- Atıştırmalıklar listesi
  ('50000000-0000-0000-0000-000000000002', 'Badem', '200g', 'Kuruyemiş', false, 28.00, 1),
  ('50000000-0000-0000-0000-000000000002', 'Ceviz', '200g', 'Kuruyemiş', false, 25.00, 2),
  ('50000000-0000-0000-0000-000000000002', 'Kuru kayısı', '250g', 'Kuru meyve', false, 18.00, 3),
  ('50000000-0000-0000-0000-000000000002', 'Chia tohumu', '100g', 'Tohumlar', false, 12.00, 4),
  ('50000000-0000-0000-0000-000000000002', 'Çilek', '500g', 'Meyve', false, 12.00, 5);

-- ── Additional Conversations ────────────────────────────────────────────────

-- Conversation: Elif <-> Mehmet
INSERT INTO conversations (id) VALUES
  ('c0000000-0000-0000-0000-000000000002');

INSERT INTO conversation_participants (conversation_id, user_id) VALUES
  ('c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002');

INSERT INTO messages (conversation_id, sender_id, receiver_id, content, created_at) VALUES
  ('c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002',
   'Merhaba Mehmet Bey, antrenman programınıza uygun beslenme planınızı hazırladım. Protein alımınıza özellikle dikkat edeceğiz.', NOW() - INTERVAL '3 days'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001',
   'Teşekkürler Elif Hanım! Haftada 5 gün ağırlık antrenmanı yapıyorum, buna göre makro hedeflerimi ayarladınız mı?', NOW() - INTERVAL '3 days' + INTERVAL '30 minutes'),
  ('c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002',
   'Evet, günlük 180g protein hedefi koydum. Antrenman sonrası 30dk içinde protein alımı çok önemli. Whey protein veya tavuk göğsü öneriyorum.', NOW() - INTERVAL '2 days'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001',
   'Anladım, antrenman öncesi karbonhidrat yükleme yapmalı mıyım?', NOW() - INTERVAL '2 days' + INTERVAL '1 hour'),
  ('c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002',
   'Kaliteli karbonhidrat alın — yulaf, bulgur, tam buğday ekmek. Antrenman1-2 saat öncesinde orta porsiyonları ideal. Planınıza ekledim.', NOW() - INTERVAL '1 day');

-- Conversation: Elif <-> Fatma
INSERT INTO conversations (id) VALUES
  ('c0000000-0000-0000-0000-000000000003');

INSERT INTO conversation_participants (conversation_id, user_id) VALUES
  ('c0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003');

INSERT INTO messages (conversation_id, sender_id, receiver_id, content, created_at) VALUES
  ('c0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003',
   'Fatma Hanım merhaba, kan değerlerinizi inceledim. Açlık şekeriniz biraz yüksek, beslenme planınızda düşük glisemik indeksli besinlere ağırlık vereceğiz.', NOW() - INTERVAL '5 days'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001',
   'Merhaba Elif Hanım, son zamanlarda tatlı isteğim çok artıyor. Ne yapabilirim?', NOW() - INTERVAL '4 days'),
  ('c0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003',
   'Tatlı isteği genelde kan şekeri dalgalanmalarından kaynaklanır. Öğünler arası uzun boşluk bırakmayın, protein + lif kombinasyonu tok tutar. Tarçınlı elma dilimi veya yoğurt + ceviz gibi atıştırmalıklar deneyin.', NOW() - INTERVAL '4 days' + INTERVAL '2 hours'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001',
   'Çok teşekkür ederim, deneyeceğim! Yarınki randevuda detaylı konuşalım.', NOW() - INTERVAL '3 days');

-- Add more messages to Ayse's existing conversation
INSERT INTO messages (conversation_id, sender_id, receiver_id, content, created_at) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
   'Ayşe Hanım, bu haftaki öğün kayıtlarınızı inceledim. Protein alımınız hedefin biraz altında, tavuk veya balık porsiyon miktarını artırmanızı öneriyorum.', NOW() - INTERVAL '2 days'),
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001',
   'Haklısınız, öğle yemeklerinde protein almayı ihmal ediyorum. Bugün ızgara tavuk salata yaptım!', NOW() - INTERVAL '2 days' + INTERVAL '3 hours'),
  ('c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
   'Harika! 🎉 Fotoğrafından gördüm, porsiyon çok güzel. Bu şekilde devam edin. Su içmeyi de unutmayın — bugün 5 bardak görünüyor, hedefimiz 8.', NOW() - INTERVAL '1 day'),
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001',
   'Tamam, daha dikkat edeceğim! Cuma günkü randevuda haftalık değerlendirme yapalım mı?', NOW() - INTERVAL '12 hours');

-- ── Extended Weight Logs (14-day trend for Ayse) ─────────────────────────────
-- Existing: 75.0, 74.5, 74.0, 73.5, 73.0, 72.5
-- Adding more historical data points for a richer graph

INSERT INTO weight_logs (patient_id, weight_kg, measured_at) VALUES
  ('bb000000-0000-0000-0000-000000000001', 76.2, NOW() - INTERVAL '28 days'),
  ('bb000000-0000-0000-0000-000000000001', 76.0, NOW() - INTERVAL '25 days'),
  ('bb000000-0000-0000-0000-000000000001', 75.8, NOW() - INTERVAL '21 days'),
  ('bb000000-0000-0000-0000-000000000001', 75.5, NOW() - INTERVAL '18 days'),
  ('bb000000-0000-0000-0000-000000000001', 75.2, NOW() - INTERVAL '14 days'),
  ('bb000000-0000-0000-0000-000000000001', 72.3, NOW() - INTERVAL '1 day'),
  ('bb000000-0000-0000-0000-000000000001', 72.0, NOW());

-- Weight logs for Mehmet
INSERT INTO weight_logs (patient_id, weight_kg, measured_at) VALUES
  ('bb000000-0000-0000-0000-000000000002', 93.5, NOW() - INTERVAL '21 days'),
  ('bb000000-0000-0000-0000-000000000002', 93.0, NOW() - INTERVAL '14 days'),
  ('bb000000-0000-0000-0000-000000000002', 92.5, NOW() - INTERVAL '7 days'),
  ('bb000000-0000-0000-0000-000000000002', 92.0, NOW());

-- ── Additional Exercise Logs ────────────────────────────────────────────────

INSERT INTO exercise_logs (patient_id, exercise_type, duration_min, intensity, calories_burned, logged_at) VALUES
  ('bb000000-0000-0000-0000-000000000001', 'running', 30, 'high', 320, NOW() - INTERVAL '6 days'),
  ('bb000000-0000-0000-0000-000000000001', 'swimming', 45, 'moderate', 280, NOW() - INTERVAL '5 days'),
  ('bb000000-0000-0000-0000-000000000001', 'walking', 60, 'low', 200, NOW() - INTERVAL '4 days'),
  ('bb000000-0000-0000-0000-000000000001', 'cycling', 40, 'moderate', 260, NOW() - INTERVAL '3 days'),
  ('bb000000-0000-0000-0000-000000000001', 'yoga', 45, 'low', 140, NOW() - INTERVAL '2 days'),
  ('bb000000-0000-0000-0000-000000000001', 'walking', 35, 'moderate', 180, NOW() - INTERVAL '1 day'),
  -- Mehmet's exercises
  ('bb000000-0000-0000-0000-000000000002', 'weightlifting', 60, 'high', 400, NOW() - INTERVAL '2 days'),
  ('bb000000-0000-0000-0000-000000000002', 'running', 25, 'high', 300, NOW() - INTERVAL '1 day'),
  ('bb000000-0000-0000-0000-000000000002', 'weightlifting', 75, 'high', 500, NOW());

-- ── Additional Sleep Logs ───────────────────────────────────────────────────

INSERT INTO sleep_logs (patient_id, sleep_start, sleep_end, quality, logged_at) VALUES
  ('bb000000-0000-0000-0000-000000000001', NOW() - INTERVAL '56 hours', NOW() - INTERVAL '48.5 hours', 'excellent', NOW() - INTERVAL '2 days'),
  ('bb000000-0000-0000-0000-000000000001', NOW() - INTERVAL '80 hours', NOW() - INTERVAL '73 hours', 'good', NOW() - INTERVAL '3 days'),
  ('bb000000-0000-0000-0000-000000000001', NOW() - INTERVAL '104 hours', NOW() - INTERVAL '96 hours', 'excellent', NOW() - INTERVAL '4 days'),
  ('bb000000-0000-0000-0000-000000000001', NOW() - INTERVAL '128 hours', NOW() - INTERVAL '120.5 hours', 'good', NOW() - INTERVAL '5 days');

-- ── Additional Water Logs ───────────────────────────────────────────────────

INSERT INTO water_logs (patient_id, glasses, logged_at) VALUES
  ('bb000000-0000-0000-0000-000000000001', 8, NOW() - INTERVAL '3 days'),
  ('bb000000-0000-0000-0000-000000000001', 5, NOW() - INTERVAL '4 days'),
  ('bb000000-0000-0000-0000-000000000001', 9, NOW() - INTERVAL '5 days'),
  ('bb000000-0000-0000-0000-000000000001', 7, NOW() - INTERVAL '6 days'),
  ('bb000000-0000-0000-0000-000000000001', 6, NOW() - INTERVAL '7 days'),
  -- Mehmet
  ('bb000000-0000-0000-0000-000000000002', 10, NOW() - INTERVAL '1 day'),
  ('bb000000-0000-0000-0000-000000000002', 9, NOW() - INTERVAL '2 days');

-- ── Blood values for Fatma (diyabet yönetimi) ───────────────────────────────

INSERT INTO blood_values (patient_id, value_type, value, unit, measured_at) VALUES
  ('bb000000-0000-0000-0000-000000000003', 'fasting_glucose', 126, 'mg/dL', NOW() - INTERVAL '14 days'),
  ('bb000000-0000-0000-0000-000000000003', 'hba1c', 7.2, '%', NOW() - INTERVAL '14 days'),
  ('bb000000-0000-0000-0000-000000000003', 'total_cholesterol', 215, 'mg/dL', NOW() - INTERVAL '14 days'),
  ('bb000000-0000-0000-0000-000000000003', 'ldl', 140, 'mg/dL', NOW() - INTERVAL '14 days'),
  ('bb000000-0000-0000-0000-000000000003', 'hdl', 45, 'mg/dL', NOW() - INTERVAL '14 days'),
  ('bb000000-0000-0000-0000-000000000003', 'vitamin_d', 18, 'ng/mL', NOW() - INTERVAL '14 days');
