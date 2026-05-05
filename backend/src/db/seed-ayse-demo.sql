-- ============================================================================
-- NutriAI — Ayşe için ZENGİN demo data
-- Sunum için kullanılacak
-- ============================================================================

-- Ayşe ID: bb000000-0000-0000-0000-000000000001
-- Elif ID: de000000-0000-0000-0000-000000000001

-- ── 1. YENİ TAM DİYET PLANI (7 gün, 28 öğün) ────────────────────────────────
DO $$
DECLARE
  v_plan_id UUID := gen_random_uuid();
BEGIN
  -- Eski test planlarını "completed" yap (active dışına çıkar)
  UPDATE dietary_plans SET status='completed'
   WHERE patient_id='bb000000-0000-0000-0000-000000000001'
     AND status='active'
     AND title LIKE '%API%';

  -- Yeni plan
  INSERT INTO dietary_plans (
    id, patient_id, created_by_type, created_by_dietitian_id,
    title, start_date, end_date,
    daily_calorie_target, daily_protein_target, daily_carb_target, daily_fat_target,
    special_notes, status, sent_at
  ) VALUES (
    v_plan_id,
    'bb000000-0000-0000-0000-000000000001',
    'dietitian',
    'de000000-0000-0000-0000-000000000001',
    'Kilo Verme Programı - Hafta 1',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '7 days',
    1850, 110, 200, 60,
    'Kahvaltıyı asla atlama, su hedefi 2.5L. Hafta sonu cheat day yok!',
    'active',
    NOW()
  );

  -- Plan items (28 öğün, 7 gün × 4 öğün)
  INSERT INTO plan_items (plan_id, day_of_week, meal_type, food_name, amount_g, calories, protein, carbs, fat, sort_order) VALUES
    -- Pazartesi (1)
    (v_plan_id, 1, 'breakfast', 'Yulaf ezmesi + yaban mersini', 200, 280, 10, 48, 6, 0),
    (v_plan_id, 1, 'lunch',     'Izgara tavuk + bulgur pilavı + salata', 350, 480, 38, 45, 12, 1),
    (v_plan_id, 1, 'dinner',    'Fırında somon + buharda brokoli', 250, 420, 36, 8, 22, 2),
    (v_plan_id, 1, 'snack',     'Yoğurt + ceviz', 180, 200, 9, 12, 13, 3),
    -- Salı (2)
    (v_plan_id, 2, 'breakfast', 'Menemen + tam buğday ekmeği', 250, 320, 18, 28, 14, 0),
    (v_plan_id, 2, 'lunch',     'Mercimek çorbası + tavuk göğsü', 400, 450, 40, 38, 10, 1),
    (v_plan_id, 2, 'dinner',    'Sebzeli kıymalı yemek + esmer pirinç', 320, 460, 28, 42, 16, 2),
    (v_plan_id, 2, 'snack',     'Elma + badem', 150, 180, 4, 22, 9, 3),
    -- Çarşamba (3)
    (v_plan_id, 3, 'breakfast', 'Avokadolu yumurta + tam tahıl tost', 220, 350, 18, 30, 18, 0),
    (v_plan_id, 3, 'lunch',     'Köfte + bulgur + cacık', 370, 510, 35, 48, 18, 1),
    (v_plan_id, 3, 'dinner',    'Etli yaprak sarması + yoğurt', 350, 490, 26, 40, 22, 2),
    (v_plan_id, 3, 'snack',     'Süzme yoğurt + bal', 200, 220, 12, 24, 6, 3),
    -- Perşembe (4)
    (v_plan_id, 4, 'breakfast', 'Tam tahıllı sandviç + meyve', 230, 310, 14, 38, 10, 0),
    (v_plan_id, 4, 'lunch',     'Tavuklu sezar salata', 400, 460, 36, 24, 24, 1),
    (v_plan_id, 4, 'dinner',    'Levrek ızgara + sebze graten', 320, 430, 38, 18, 22, 2),
    (v_plan_id, 4, 'snack',     'Çiğ kuruyemiş', 30, 180, 5, 6, 16, 3),
    -- Cuma (5)
    (v_plan_id, 5, 'breakfast', 'Lor peynirli krep + bal', 200, 290, 16, 36, 8, 0),
    (v_plan_id, 5, 'lunch',     'Kuru fasulye + esmer pilav + turşu', 380, 520, 22, 70, 12, 1),
    (v_plan_id, 5, 'dinner',    'Tavuk şiş + ızgara sebzeler', 300, 450, 40, 22, 18, 2),
    (v_plan_id, 5, 'snack',     'Kefir + chia', 200, 180, 10, 14, 8, 3),
    -- Cumartesi (6)
    (v_plan_id, 6, 'breakfast', 'Klasik Türk kahvaltısı (hafif)', 250, 380, 18, 32, 18, 0),
    (v_plan_id, 6, 'lunch',     'Etli nohut + makarna', 380, 540, 32, 60, 16, 1),
    (v_plan_id, 6, 'dinner',    'Hindi şinitzel + salata', 280, 420, 38, 18, 18, 2),
    (v_plan_id, 6, 'snack',     'Meyve + lor', 200, 200, 12, 22, 5, 3),
    -- Pazar (7)
    (v_plan_id, 7, 'breakfast', 'Omlet + avokado + ekmek', 240, 360, 20, 28, 18, 0),
    (v_plan_id, 7, 'lunch',     'Etli güveç + bulgur', 360, 510, 32, 50, 14, 1),
    (v_plan_id, 7, 'dinner',    'Tavuk + sebze ızgara', 280, 410, 36, 14, 18, 2),
    (v_plan_id, 7, 'snack',     'Kuru meyve + ceviz', 50, 220, 5, 24, 12, 3);
END $$;

-- ── 2. SON 7 GÜN İÇİN ÖĞÜN KAYITLARI (Ayşe günlük plan'a uymuş gibi) ────
DO $$
DECLARE
  i INT;
  log_date_var DATE;
  meal_id UUID;
BEGIN
  FOR i IN 0..6 LOOP
    log_date_var := CURRENT_DATE - i;

    -- Kahvaltı
    INSERT INTO meal_logs (id, patient_id, meal_type, log_date, entry_method, sent_to_dietitian, dietitian_viewed)
    VALUES (gen_random_uuid(), 'bb000000-0000-0000-0000-000000000001', 'breakfast', log_date_var, 'manual', true, i > 1)
    RETURNING id INTO meal_id;
    INSERT INTO meal_items (meal_log_id, food_name, final_amount_g, calories, protein, carbs, fat) VALUES
      (meal_id, 'Yulaf ezmesi + yaban mersini', 200, 280, 10, 48, 6);

    -- Öğle
    INSERT INTO meal_logs (id, patient_id, meal_type, log_date, entry_method, sent_to_dietitian, dietitian_viewed)
    VALUES (gen_random_uuid(), 'bb000000-0000-0000-0000-000000000001', 'lunch', log_date_var, 'manual', true, i > 1)
    RETURNING id INTO meal_id;
    INSERT INTO meal_items (meal_log_id, food_name, final_amount_g, calories, protein, carbs, fat) VALUES
      (meal_id, 'Izgara tavuk göğsü', 150, 230, 35, 0, 8),
      (meal_id, 'Bulgur pilavı', 150, 195, 6, 38, 3),
      (meal_id, 'Mevsim salatası', 100, 60, 2, 8, 2);

    -- Akşam
    INSERT INTO meal_logs (id, patient_id, meal_type, log_date, entry_method, sent_to_dietitian, dietitian_viewed)
    VALUES (gen_random_uuid(), 'bb000000-0000-0000-0000-000000000001', 'dinner', log_date_var, 'manual', true, i > 1)
    RETURNING id INTO meal_id;
    INSERT INTO meal_items (meal_log_id, food_name, final_amount_g, calories, protein, carbs, fat) VALUES
      (meal_id, 'Fırında somon', 150, 310, 34, 0, 18),
      (meal_id, 'Buharda brokoli', 120, 40, 3, 6, 0);

    -- Ara öğün (her gün değil)
    IF i % 2 = 0 THEN
      INSERT INTO meal_logs (id, patient_id, meal_type, log_date, entry_method, sent_to_dietitian, dietitian_viewed)
      VALUES (gen_random_uuid(), 'bb000000-0000-0000-0000-000000000001', 'snack', log_date_var, 'manual', true, false)
      RETURNING id INTO meal_id;
      INSERT INTO meal_items (meal_log_id, food_name, final_amount_g, calories, protein, carbs, fat) VALUES
        (meal_id, 'Yoğurt + ceviz', 180, 200, 9, 12, 13);
    END IF;
  END LOOP;
END $$;

-- ── 3. SU TÜKETİMİ (son 7 gün, günde 4-5 kayıt) ──────────────────────────
DO $$
DECLARE
  i INT;
  log_date_var DATE;
BEGIN
  FOR i IN 0..6 LOOP
    log_date_var := CURRENT_DATE - i;
    INSERT INTO water_logs (patient_id, amount_ml, logged_at) VALUES
      ('bb000000-0000-0000-0000-000000000001', 250, log_date_var + TIME '07:30'),
      ('bb000000-0000-0000-0000-000000000001', 500, log_date_var + TIME '11:00'),
      ('bb000000-0000-0000-0000-000000000001', 300, log_date_var + TIME '13:30'),
      ('bb000000-0000-0000-0000-000000000001', 500, log_date_var + TIME '16:00'),
      ('bb000000-0000-0000-0000-000000000001', 400, log_date_var + TIME '19:30');
  END LOOP;
END $$;

-- ── 4. KİLO TAKİBİ (son 4 hafta, haftalık 1 kayıt) ────────────────────────
INSERT INTO weight_logs (patient_id, weight_kg, logged_at, notes) VALUES
  ('bb000000-0000-0000-0000-000000000001', 74.2, CURRENT_DATE - INTERVAL '28 days', 'Programa başlangıç'),
  ('bb000000-0000-0000-0000-000000000001', 73.5, CURRENT_DATE - INTERVAL '21 days', 'İlk hafta sonu'),
  ('bb000000-0000-0000-0000-000000000001', 72.8, CURRENT_DATE - INTERVAL '14 days', 'İyi gidiyor'),
  ('bb000000-0000-0000-0000-000000000001', 72.2, CURRENT_DATE - INTERVAL '7 days', NULL),
  ('bb000000-0000-0000-0000-000000000001', 71.5, CURRENT_DATE - INTERVAL '1 days', 'Hedef yolunda');

-- ── 5. EGZERSIZ KAYITLARI ────────────────────────────────────────────────
DO $$
DECLARE
  i INT;
  log_date_var DATE;
BEGIN
  FOR i IN 0..13 LOOP
    log_date_var := CURRENT_DATE - i;
    IF i % 2 = 0 THEN
      INSERT INTO exercise_logs (patient_id, exercise_type, duration_min, calories_burned, intensity, logged_at)
      VALUES (
        'bb000000-0000-0000-0000-000000000001',
        CASE WHEN i % 4 = 0 THEN 'walking' ELSE 'yoga' END,
        CASE WHEN i % 4 = 0 THEN 45 ELSE 30 END,
        CASE WHEN i % 4 = 0 THEN 220 ELSE 120 END,
        'moderate',
        log_date_var + TIME '18:00'
      );
    END IF;
  END LOOP;
END $$;

-- ── 6. UYKU KAYITLARI ────────────────────────────────────────────────────
DO $$
DECLARE
  i INT;
  log_date_var DATE;
BEGIN
  FOR i IN 0..6 LOOP
    log_date_var := CURRENT_DATE - i;
    INSERT INTO sleep_logs (patient_id, duration_hours, quality, logged_at)
    VALUES (
      'bb000000-0000-0000-0000-000000000001',
      6.5 + (i % 3) * 0.5,
      CASE i % 3 WHEN 0 THEN 'good' WHEN 1 THEN 'excellent' ELSE 'fair' END,
      log_date_var + TIME '08:00'
    );
  END LOOP;
END $$;

-- ── 7. BİLDİRİMLER (son 7 gün, çeşitli) ──────────────────────────────────
DO $$
DECLARE
  v_user_id UUID := 'b0000000-0000-0000-0000-000000000001'; -- Ayşe user_id
BEGIN
  INSERT INTO notifications (user_id, type, title, body, is_read, priority, created_at) VALUES
    (v_user_id, 'meal_reminder', 'Su İçme Vakti! 💧', 'Bugün hedefiniz: 2500 ml. Şu ana kadar 1750 ml içtiniz.', false, 'normal', NOW() - INTERVAL '2 hours'),
    (v_user_id, 'achievement',   'Tebrikler! 🏆',   '7 gün üst üste kalori hedefini tutturdun. Yeni rozet kazandın!', false, 'high', NOW() - INTERVAL '1 day'),
    (v_user_id, 'message',       'Diyetisyenden Mesaj', 'Dr. Elif Kaya: "Bu hafta kilo grafiğin harika gidiyor, devam et!"', true, 'high', NOW() - INTERVAL '2 days'),
    (v_user_id, 'plan_update',   'Yeni Diyet Planı', 'Diyetisyeniniz 7 günlük yeni planınızı yayınladı.', true, 'high', NOW() - INTERVAL '3 days'),
    (v_user_id, 'meal_reminder', 'Akşam Yemeği Hatırlatması', 'Akşam yemeği için fırında somon önerisi planında var.', true, 'normal', NOW() - INTERVAL '4 days'),
    (v_user_id, 'achievement',   'Streak Devam Ediyor 🔥', '14 günlük streak! Süper gidiyorsun.', true, 'normal', NOW() - INTERVAL '5 days'),
    (v_user_id, 'system',        'Hoş Geldiniz', 'NutriAI ailesine hoş geldiniz. Hedeflerinize bir adım daha yakınsınız.', true, 'low', NOW() - INTERVAL '7 days');
END $$;

-- ── 8. GAMIFICATION GÜNCELLE ─────────────────────────────────────────────
UPDATE patient_profiles
SET
  current_streak = 14,
  longest_streak = 21,
  total_xp = 2450,
  current_level = 5,
  current_weight_kg = 71.5
WHERE id = 'bb000000-0000-0000-0000-000000000001';

-- DONE
SELECT 'AYSE DEMO DATA SEEDED' AS status;
