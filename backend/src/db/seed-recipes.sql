-- ============================================================================
-- NutriAI — Recipe Seed Data
-- 8 örnek tarif (admin tarafından onaylı)
-- ============================================================================

INSERT INTO recipes (
  id, name, description, instructions,
  prep_time_min, cook_time_min, servings,
  calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving,
  difficulty, ingredients, tags, is_approved, created_by
) VALUES

(
  '11111111-1111-1111-1111-000000000001',
  'Izgara Tavuk Salatası',
  'Yüksek protein, düşük karbonhidrat. Diyet için ideal öğle yemeği.',
  E'1. Tavuk göğsünü baharatlayın ve ızgarada 8 dakika pişirin.\n2. Yeşillikleri yıkayıp doğrayın.\n3. Domates, salatalık ve avokadoyu küp küp doğrayın.\n4. Zeytinyağı-limon sosu hazırlayın.\n5. Tüm malzemeleri karıştırıp servis yapın.',
  10, 8, 2,
  385, 35.0, 12.0, 18.0,
  'easy',
  '[{"name":"Tavuk göğsü","amount":"200g"},{"name":"Marul","amount":"1 baş"},{"name":"Domates","amount":"2 adet"},{"name":"Salatalık","amount":"1 adet"},{"name":"Avokado","amount":"1/2 adet"},{"name":"Zeytinyağı","amount":"2 yk"},{"name":"Limon","amount":"1 adet"}]'::jsonb,
  ARRAY['protein', 'salata', 'düşük_karbonhidrat'],
  true,
  'd0000000-0000-0000-0000-000000000001'
),

(
  '11111111-1111-1111-1111-000000000002',
  'Yulaflı Muzlu Smoothie',
  'Sporcular için harika bir kahvaltı veya antrenman sonrası içecek.',
  E'1. Tüm malzemeleri blendera koyun.\n2. 30 saniye yüksek hızda karıştırın.\n3. Bardağa dökün ve hemen tüketin.',
  5, 0, 1,
  340, 14.0, 52.0, 8.0,
  'easy',
  '[{"name":"Yulaf ezmesi","amount":"40g"},{"name":"Muz","amount":"1 adet"},{"name":"Süt","amount":"250ml"},{"name":"Bal","amount":"1 tk"},{"name":"Tarçın","amount":"1/2 tk"}]'::jsonb,
  ARRAY['kahvaltı', 'smoothie', 'enerji'],
  true,
  'd0000000-0000-0000-0000-000000000001'
),

(
  '11111111-1111-1111-1111-000000000003',
  'Mercimek Çorbası',
  'Klasik Türk çorbası — protein ve lif açısından zengin.',
  E'1. Mercimeği yıkayın ve süzün.\n2. Soğanı doğrayıp tereyağında soteleyin.\n3. Mercimek, soğan, havuç ve patatesi tencereye koyup üzerini örtecek kadar su ekleyin.\n4. 25 dakika kısık ateşte pişirin.\n5. Blender ile pürüzsüz hale getirin.\n6. Tuz, karabiber ekleyin ve servis edin.',
  10, 25, 4,
  185, 12.0, 28.0, 4.0,
  'easy',
  '[{"name":"Kırmızı mercimek","amount":"1.5 su bardağı"},{"name":"Soğan","amount":"1 adet"},{"name":"Havuç","amount":"1 adet"},{"name":"Patates","amount":"1 adet"},{"name":"Tereyağı","amount":"1 yk"},{"name":"Tuz, karabiber","amount":"tatmak için"}]'::jsonb,
  ARRAY['çorba', 'sebze', 'lif'],
  true,
  'd0000000-0000-0000-0000-000000000001'
),

(
  '11111111-1111-1111-1111-000000000004',
  'Fırında Somon ve Sebze',
  'Omega-3 zengini, klinik diyetler için önerilen akşam yemeği.',
  E'1. Fırını 200°C''ye ısıtın.\n2. Somon filetolarını fırın kabına yerleştirin.\n3. Üzerine zeytinyağı, limon, taze otlar gezdirin.\n4. Brokoli ve kabağı somonun yanına dizin.\n5. 18-20 dakika pişirin.\n6. Sıcak servis yapın.',
  15, 20, 2,
  420, 38.0, 14.0, 24.0,
  'medium',
  '[{"name":"Somon fileto","amount":"2x150g"},{"name":"Brokoli","amount":"200g"},{"name":"Kabak","amount":"1 adet"},{"name":"Zeytinyağı","amount":"3 yk"},{"name":"Limon","amount":"1 adet"},{"name":"Kekik","amount":"1 tk"}]'::jsonb,
  ARRAY['balık', 'omega3', 'düşük_karbonhidrat', 'akşam'],
  true,
  'd0000000-0000-0000-0000-000000000001'
),

(
  '11111111-1111-1111-1111-000000000005',
  'Sebzeli Bulgur Pilavı',
  'Tam tahıllı, vejetaryen, lif açısından zengin.',
  E'1. Soğan ve sarımsağı doğrayıp tencerede soteleyin.\n2. Domates salçası ekleyip 1 dakika kavurun.\n3. Doğranmış sebzeleri (havuç, biber, mantar) ekleyin, 5 dakika pişirin.\n4. Yıkanmış bulguru ve sıcak suyu ekleyin (1 ölçek bulgura 2 ölçek su).\n5. Tuz, karabiber ekleyin, kısık ateşte 15 dakika pişirin.\n6. Demlenmesi için 10 dakika dinlendirin.',
  10, 25, 4,
  290, 9.0, 52.0, 5.0,
  'easy',
  '[{"name":"Bulgur","amount":"2 su bardağı"},{"name":"Su","amount":"4 su bardağı"},{"name":"Soğan","amount":"1 adet"},{"name":"Sarımsak","amount":"2 diş"},{"name":"Havuç","amount":"1 adet"},{"name":"Biber","amount":"2 adet"},{"name":"Domates salçası","amount":"1 yk"},{"name":"Zeytinyağı","amount":"3 yk"}]'::jsonb,
  ARRAY['vejetaryen', 'tam_tahıl', 'lif'],
  true,
  'd0000000-0000-0000-0000-000000000001'
),

(
  '11111111-1111-1111-1111-000000000006',
  'Yumurtalı Sebzeli Omlet',
  'Hızlı, doyurucu kahvaltı — yüksek protein.',
  E'1. Soğan, biber ve domatesi küp küp doğrayın.\n2. Tavada zeytinyağında soteleyin.\n3. Yumurtaları çırpın, sebzelerin üzerine dökün.\n4. Kısık ateşte üstü piştiğinde katlayın.\n5. Üzerine peynir rendeleyip servis edin.',
  5, 8, 1,
  320, 22.0, 6.0, 22.0,
  'easy',
  '[{"name":"Yumurta","amount":"3 adet"},{"name":"Soğan","amount":"1/2 adet"},{"name":"Biber","amount":"1 adet"},{"name":"Domates","amount":"1 adet"},{"name":"Beyaz peynir","amount":"30g"},{"name":"Zeytinyağı","amount":"1 yk"}]'::jsonb,
  ARRAY['kahvaltı', 'protein', 'hızlı'],
  true,
  'd0000000-0000-0000-0000-000000000001'
),

(
  '11111111-1111-1111-1111-000000000007',
  'Yoğurtlu Sebze Çorbası',
  'Hafif ve sindirim dostu — akşam yemeğinden önce ideal.',
  E'1. Sebzeleri (havuç, kereviz, kabak) küp doğrayıp haşlayın.\n2. Suyunu ayırıp sebzeleri blender ile pürüzsüzleştirin.\n3. Ayrı bir tencerede tereyağı eritin, un ekleyip kavurun.\n4. Yavaş yavaş haşlama suyunu ekleyip karıştırın.\n5. Pürelenmiş sebzeleri ekleyin, 5 dakika kaynatın.\n6. Yoğurt, yumurta sarısı ve limon karışımını ocaktan alıp ekleyin.\n7. Tuz, karabiber, nane ekleyip servis edin.',
  10, 30, 4,
  165, 8.0, 18.0, 7.0,
  'medium',
  '[{"name":"Havuç","amount":"2 adet"},{"name":"Kereviz","amount":"100g"},{"name":"Kabak","amount":"1 adet"},{"name":"Yoğurt","amount":"1 su bardağı"},{"name":"Yumurta sarısı","amount":"1 adet"},{"name":"Tereyağı","amount":"1 yk"},{"name":"Un","amount":"1 yk"},{"name":"Nane","amount":"1 tk"}]'::jsonb,
  ARRAY['çorba', 'sebze', 'hafif', 'akşam'],
  true,
  'd0000000-0000-0000-0000-000000000001'
),

(
  '11111111-1111-1111-1111-000000000008',
  'Avokadolu Tavuklu Sandviç',
  'Tam buğday ekmeği ile pratik, dengeli öğle yemeği.',
  E'1. Tavuk göğsünü ızgarada pişirip dilimleyin.\n2. Ekmek dilimlerini hafif kızartın.\n3. Avokadoyu püre haline getirip ekmeklere sürün.\n4. Tavuk, marul ve domates dilimlerini yerleştirin.\n5. Üstüne biraz limon sıkıp kapatın.',
  10, 8, 2,
  445, 32.0, 38.0, 18.0,
  'easy',
  '[{"name":"Tam buğday ekmeği","amount":"4 dilim"},{"name":"Tavuk göğsü","amount":"150g"},{"name":"Avokado","amount":"1 adet"},{"name":"Marul","amount":"4 yaprak"},{"name":"Domates","amount":"1 adet"},{"name":"Limon","amount":"1/2 adet"}]'::jsonb,
  ARRAY['sandviç', 'öğle', 'dengeli'],
  true,
  'd0000000-0000-0000-0000-000000000001'
)

ON CONFLICT (id) DO NOTHING;
