-- ============================================================================
-- NutriAI — Seed Data (Demo)
-- Demo kullanicilari: Dyt. Elif Kaya + Ayse Yilmaz (hasta)
-- ============================================================================

-- ── Admin user ───────────────────────────────────────────────────────────────
-- Password: admin123 (bcrypt hash)
INSERT INTO users (id, email, password_hash, role, is_active, is_verified) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin@nutriai.com',
   '$2b$10$8K1p/FEH7B1eSR7s1y3Kj.qPWMKHJWr3rG6d7X4vN8E0R2f5fy0xi',
   'admin', true, true);

-- ── Dietitian: Dyt. Elif Kaya ────────────────────────────────────────────────
-- Password: elif1234 (bcrypt hash)
INSERT INTO users (id, email, password_hash, role, is_active, is_verified) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'elif.kaya@nutriai.com',
   '$2b$10$8K1p/FEH7B1eSR7s1y3Kj.qPWMKHJWr3rG6d7X4vN8E0R2f5fy0xi',
   'dietitian', true, true);

INSERT INTO dietitian_profiles (
  id, user_id, first_name, last_name, title, license_number,
  specializations, university, experience_years, bio,
  clinic_name, city, offers_online, offers_in_person,
  session_price_tl, invite_code, max_patients,
  available_days, session_duration_min, is_approved, approval_date
) VALUES (
  'dp000000-0000-0000-0000-000000000001',
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
  ('p0000000-0000-0000-0000-000000000001', 'ayse.yilmaz@email.com',
   '$2b$10$8K1p/FEH7B1eSR7s1y3Kj.qPWMKHJWr3rG6d7X4vN8E0R2f5fy0xi',
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
  'pp000000-0000-0000-0000-000000000001',
  'p0000000-0000-0000-0000-000000000001',
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
  'dp000000-0000-0000-0000-000000000001',
  'pp000000-0000-0000-0000-000000000001',
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
  ('pp000000-0000-0000-0000-000000000001', 15, 'moderate', true);

-- ── Sample foods (Turk mutfagi) ──────────────────────────────────────────────
INSERT INTO foods (name, name_en, category, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sugar_per_100g, sodium_per_100g, serving_size_g, serving_description, is_verified) VALUES
  ('Tavuk Gogsu (Izgara)', 'Grilled Chicken Breast', 'protein', 165.0, 31.0, 0.0, 3.6, 0.0, 0.0, 74.0, 150, '1 porsiyon', true),
  ('Pirinc Pilavi', 'Rice Pilaf', 'tahil', 130.0, 2.7, 28.0, 1.0, 0.4, 0.1, 1.0, 150, '1 porsiyon', true),
  ('Mercimek Corbasi', 'Lentil Soup', 'corba', 56.0, 3.6, 9.0, 0.8, 2.0, 0.5, 300.0, 250, '1 kase', true),
  ('Coban Salata', 'Shepherd Salad', 'salata', 25.0, 1.0, 4.0, 0.5, 1.2, 2.5, 5.0, 200, '1 porsiyon', true),
  ('Yulaf Ezmesi', 'Oatmeal', 'tahil', 68.0, 2.5, 12.0, 1.4, 1.7, 0.3, 2.0, 250, '1 kase', true),
  ('Yumurta (Haslanmis)', 'Boiled Egg', 'protein', 155.0, 13.0, 1.1, 11.0, 0.0, 1.1, 124.0, 50, '1 adet', true),
  ('Tam Bugday Ekmek', 'Whole Wheat Bread', 'tahil', 247.0, 13.0, 41.0, 3.4, 7.0, 6.0, 400.0, 30, '1 dilim', true),
  ('Beyaz Peynir', 'White Cheese', 'sut_urunleri', 264.0, 17.0, 0.5, 21.0, 0.0, 0.5, 917.0, 30, '1 dilim', true),
  ('Zeytin (Siyah)', 'Black Olives', 'meyve_sebze', 115.0, 0.8, 6.0, 11.0, 3.2, 0.0, 735.0, 20, '5 adet', true),
  ('Domates', 'Tomato', 'meyve_sebze', 18.0, 0.9, 3.9, 0.2, 1.2, 2.6, 5.0, 120, '1 orta boy', true),
  ('Salatalik', 'Cucumber', 'meyve_sebze', 15.0, 0.7, 3.6, 0.1, 0.5, 1.7, 2.0, 100, '1 orta boy', true),
  ('Yogurt (Tam Yagli)', 'Full Fat Yogurt', 'sut_urunleri', 61.0, 3.5, 4.7, 3.3, 0.0, 4.7, 46.0, 200, '1 kase', true),
  ('Muz', 'Banana', 'meyve_sebze', 89.0, 1.1, 23.0, 0.3, 2.6, 12.0, 1.0, 120, '1 orta boy', true),
  ('Elma', 'Apple', 'meyve_sebze', 52.0, 0.3, 14.0, 0.2, 2.4, 10.0, 1.0, 150, '1 orta boy', true),
  ('Ceviz', 'Walnut', 'kuruyemis', 654.0, 15.0, 14.0, 65.0, 6.7, 2.6, 2.0, 30, '1 avuc', true),
  ('Badem', 'Almond', 'kuruyemis', 579.0, 21.0, 22.0, 50.0, 12.5, 4.4, 1.0, 30, '1 avuc', true),
  ('Zeytinyagi', 'Olive Oil', 'yag', 884.0, 0.0, 0.0, 100.0, 0.0, 0.0, 2.0, 15, '1 yemek kasigi', true),
  ('Kuru Fasulye (Pisirilmis)', 'Cooked White Beans', 'bakliyat', 127.0, 8.7, 23.0, 0.5, 6.3, 0.3, 2.0, 200, '1 porsiyon', true),
  ('Bulgur Pilavi', 'Bulgur Pilaf', 'tahil', 83.0, 3.1, 18.6, 0.2, 4.5, 0.1, 1.0, 150, '1 porsiyon', true),
  ('Ispanak (Sote)', 'Sauteed Spinach', 'meyve_sebze', 23.0, 2.9, 3.6, 0.4, 2.2, 0.4, 79.0, 150, '1 porsiyon', true);

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
  ('pp000000-0000-0000-0000-000000000001', 1),
  ('pp000000-0000-0000-0000-000000000001', 2),
  ('pp000000-0000-0000-0000-000000000001', 14);

-- ── Weekly challenge ─────────────────────────────────────────────────────────
INSERT INTO weekly_challenges (title, description, challenge_type, target_value, xp_reward, start_date, end_date) VALUES
  ('5 Gun Plan Uyumu', '5 gun boyunca beslenme planina %90 uyum sagla', 'plan_adherence', 5, 100, CURRENT_DATE, CURRENT_DATE + 7),
  ('Tum Ogunleri Fotola', '7 gun boyunca tum ogunlerin fotosunu cek', 'photo_all_meals', 7, 75, CURRENT_DATE, CURRENT_DATE + 7),
  ('7 Gun Su Hedefi', '7 gun boyunca gunluk su hedefini tuttur', 'water_goal', 7, 75, CURRENT_DATE, CURRENT_DATE + 7);

-- ── Ayse'nin mevcut challenge'i ──────────────────────────────────────────────
INSERT INTO patient_challenges (patient_id, challenge_id, current_progress) VALUES
  ('pp000000-0000-0000-0000-000000000001', 1, 3);

-- ── Sample meal logs for Ayse ────────────────────────────────────────────────
INSERT INTO meal_logs (patient_id, meal_type, log_date, entry_method, total_calories, total_protein, total_carbs, total_fat, mood, hunger_level, sent_to_dietitian) VALUES
  ('pp000000-0000-0000-0000-000000000001', 'breakfast', CURRENT_DATE, 'manual', 420, 18, 52, 15, 'happy', 3, true),
  ('pp000000-0000-0000-0000-000000000001', 'lunch', CURRENT_DATE, 'photo_ai', 650, 35, 60, 22, 'neutral', 4, true);

-- ── Sample weight logs for Ayse ──────────────────────────────────────────────
INSERT INTO weight_logs (patient_id, weight_kg) VALUES
  ('pp000000-0000-0000-0000-000000000001', 75.0),
  ('pp000000-0000-0000-0000-000000000001', 74.5),
  ('pp000000-0000-0000-0000-000000000001', 74.0),
  ('pp000000-0000-0000-0000-000000000001', 73.5),
  ('pp000000-0000-0000-0000-000000000001', 73.0),
  ('pp000000-0000-0000-0000-000000000001', 72.5);

-- ── Sample water logs ────────────────────────────────────────────────────────
INSERT INTO water_logs (patient_id, glasses) VALUES
  ('pp000000-0000-0000-0000-000000000001', 6),
  ('pp000000-0000-0000-0000-000000000001', 8),
  ('pp000000-0000-0000-0000-000000000001', 7);

-- ── Conversation between Elif and Ayse ───────────────────────────────────────
INSERT INTO conversations (id) VALUES
  ('c0000000-0000-0000-0000-000000000001');

INSERT INTO conversation_participants (conversation_id, user_id) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001'),
  ('c0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001');

INSERT INTO messages (conversation_id, sender_id, receiver_id, content) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001',
   'Merhaba Ayse Hanim, beslenme planinizi hazirliyorum. Bu hafta ozellikle protein alimina dikkat edelim.'),
  ('c0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001',
   'Merhaba Elif Hanim, tesekkur ederim! Protein konusunda biraz zorlaniyorum, onerilerinizi bekliyorum.');

-- ── XP history for Ayse ──────────────────────────────────────────────────────
INSERT INTO xp_history (patient_id, xp_amount, reason) VALUES
  ('pp000000-0000-0000-0000-000000000001', 10, 'photo_uploaded'),
  ('pp000000-0000-0000-0000-000000000001', 5, 'meal_logged'),
  ('pp000000-0000-0000-0000-000000000001', 5, 'meal_logged'),
  ('pp000000-0000-0000-0000-000000000001', 50, 'badge_earned'),
  ('pp000000-0000-0000-0000-000000000001', 50, 'badge_earned'),
  ('pp000000-0000-0000-0000-000000000001', 25, 'badge_earned'),
  ('pp000000-0000-0000-0000-000000000001', 5, 'water_goal_reached'),
  ('pp000000-0000-0000-0000-000000000001', 10, 'weight_logged'),
  ('pp000000-0000-0000-0000-000000000001', 15, 'plan_followed'),
  ('pp000000-0000-0000-0000-000000000001', 15, 'plan_followed'),
  ('pp000000-0000-0000-0000-000000000001', 15, 'plan_followed'),
  ('pp000000-0000-0000-0000-000000000001', 15, 'plan_followed'),
  ('pp000000-0000-0000-0000-000000000001', 15, 'plan_followed'),
  ('pp000000-0000-0000-0000-000000000001', 25, 'streak_bonus'),
  ('pp000000-0000-0000-0000-000000000001', 25, 'streak_bonus'),
  ('pp000000-0000-0000-0000-000000000001', 25, 'streak_bonus'),
  ('pp000000-0000-0000-0000-000000000001', 25, 'streak_bonus'),
  ('pp000000-0000-0000-0000-000000000001', 20, 'exercise_logged');
