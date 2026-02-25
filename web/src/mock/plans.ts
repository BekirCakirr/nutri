export interface DietPlan {
  id: string;
  name: string;
  description: string;
  goal: "weight_loss" | "weight_gain" | "maintenance" | "muscle_gain" | "health_improvement";
  dailyCalorieTarget: number;
  macroTargets: {
    protein: number;
    carbs: number;
    fat: number;
  };
  duration: number;
  assignedPatientIds: string[];
  dietitianId: string;
  status: "active" | "draft" | "completed" | "paused";
  createdAt: string;
  updatedAt: string;
  weeklySchedule: DayPlan[];
  restrictions: string[];
  notes: string;
}

export interface DayPlan {
  day: number;
  dayName: string;
  meals: PlanMeal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface PlanMeal {
  mealType: "kahvalti" | "ara_ogun_1" | "ogle" | "ara_ogun_2" | "aksam";
  mealLabel: string;
  time: string;
  items: PlanMealItem[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface PlanMealItem {
  foodName: string;
  portion: number;
  portionUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  alternatives: string[];
}

const dayNames = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

export const plans: DietPlan[] = [
  {
    id: "plan-001",
    name: "Dengeli Kilo Verme Programı",
    description: "Günlük 1500 kalorilik, dengeli makro dağılımlı kilo verme programı. Haftada 0.5-0.75 kg kayıp hedeflenir.",
    goal: "weight_loss",
    dailyCalorieTarget: 1500,
    macroTargets: { protein: 30, carbs: 40, fat: 30 },
    duration: 12,
    assignedPatientIds: ["pat-001", "pat-004", "pat-008"],
    dietitianId: "diet-001",
    status: "active",
    createdAt: "2025-11-15",
    updatedAt: "2026-02-20",
    restrictions: ["Şekerli içecekler yasak", "İşlenmiş gıdalar minimumda", "Kızartma yok"],
    notes: "Her hasta için alerjenler kontrol edilmeli. Haftalık tartı takibi yapılacak.",
    weeklySchedule: dayNames.map((dayName, i) => ({
      day: i + 1,
      dayName,
      totalCalories: 1500,
      totalProtein: 112,
      totalCarbs: 150,
      totalFat: 50,
      meals: [
        {
          mealType: "kahvalti" as const,
          mealLabel: "Kahvaltı",
          time: "08:00",
          calories: 350,
          protein: 20,
          carbs: 40,
          fat: 12,
          items: [
            i % 2 === 0
              ? { foodName: "Yulaf ezmesi (süt ile)", portion: 50, portionUnit: "g", calories: 200, protein: 8, carbs: 32, fat: 5, alternatives: ["Tam buğday ekmeği + peynir"] }
              : { foodName: "Beyaz peynir + Tam buğday ekmeği", portion: 1, portionUnit: "porsiyon", calories: 200, protein: 12, carbs: 24, fat: 6, alternatives: ["Lor peyniri + çavdar ekmeği"] },
            { foodName: "Domates-salatalık", portion: 150, portionUnit: "g", calories: 30, protein: 1.5, carbs: 6, fat: 0.3, alternatives: ["Biber", "Roka"] },
            { foodName: "Ceviz", portion: 15, portionUnit: "g", calories: 98, protein: 2.3, carbs: 2, fat: 9.8, alternatives: ["Badem", "Fındık"] },
            { foodName: "Siyah çay (şekersiz)", portion: 200, portionUnit: "ml", calories: 2, protein: 0, carbs: 0.5, fat: 0, alternatives: ["Yeşil çay", "Bitki çayı"] },
          ],
        },
        {
          mealType: "ara_ogun_1" as const,
          mealLabel: "Kuşluk Ara Öğün",
          time: "10:30",
          calories: 150,
          protein: 8,
          carbs: 18,
          fat: 5,
          items: [
            i % 3 === 0
              ? { foodName: "Elma", portion: 1, portionUnit: "adet", calories: 94, protein: 0.5, carbs: 25, fat: 0.3, alternatives: ["Armut", "Portakal"] }
              : i % 3 === 1
                ? { foodName: "Yoğurt (yarım yağlı)", portion: 150, portionUnit: "g", calories: 90, protein: 6, carbs: 6.8, fat: 3.8, alternatives: ["Kefir"] }
                : { foodName: "Havuç çubukları", portion: 100, portionUnit: "g", calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, alternatives: ["Kereviz çubukları"] },
            { foodName: "Badem", portion: 10, portionUnit: "g", calories: 58, protein: 2.1, carbs: 2.2, fat: 5, alternatives: ["Ceviz"] },
          ],
        },
        {
          mealType: "ogle" as const,
          mealLabel: "Öğle Yemeği",
          time: "13:00",
          calories: 450,
          protein: 40,
          carbs: 45,
          fat: 14,
          items: [
            { foodName: "Mercimek çorbası", portion: 200, portionUnit: "ml", calories: 130, protein: 7, carbs: 19, fat: 3.4, alternatives: ["Domates çorbası", "Tarhana çorbası"] },
            i % 2 === 0
              ? { foodName: "Izgara tavuk göğsü", portion: 150, portionUnit: "g", calories: 248, protein: 46.5, carbs: 0, fat: 5.4, alternatives: ["Izgara balık", "Hindi göğsü"] }
              : { foodName: "Izgara köfte", portion: 100, portionUnit: "g", calories: 220, protein: 18, carbs: 3.8, fat: 14.8, alternatives: ["Izgara tavuk", "Balık"] },
            { foodName: "Bulgur pilavı", portion: 80, portionUnit: "g", calories: 120, protein: 3.6, carbs: 24.5, fat: 1.1, alternatives: ["Pirinç pilavı (az)", "Kinoa"] },
            { foodName: "Mevsim salatası", portion: 200, portionUnit: "g", calories: 45, protein: 2, carbs: 8, fat: 1, alternatives: ["Çoban salatası"] },
          ],
        },
        {
          mealType: "ara_ogun_2" as const,
          mealLabel: "İkindi Ara Öğün",
          time: "16:00",
          calories: 150,
          protein: 10,
          carbs: 15,
          fat: 6,
          items: [
            { foodName: "Lor peyniri", portion: 60, portionUnit: "g", calories: 54, protein: 7.2, carbs: 1.8, fat: 1.8, alternatives: ["Yoğurt"] },
            { foodName: "Çilek", portion: 100, portionUnit: "g", calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, alternatives: ["Yaban mersini", "Frambuaz"] },
          ],
        },
        {
          mealType: "aksam" as const,
          mealLabel: "Akşam Yemeği",
          time: "19:00",
          calories: 400,
          protein: 34,
          carbs: 32,
          fat: 13,
          items: [
            i % 3 === 0
              ? { foodName: "Levrek buğulama", portion: 200, portionUnit: "g", calories: 207, protein: 40, carbs: 0, fat: 4.3, alternatives: ["Izgara somon", "Tavuk sote"] }
              : i % 3 === 1
                ? { foodName: "Fırında tavuk but (derisiz)", portion: 150, portionUnit: "g", calories: 220, protein: 32, carbs: 0, fat: 10, alternatives: ["Izgara balık"] }
                : { foodName: "Etli sebze güveç", portion: 250, portionUnit: "g", calories: 280, protein: 22, carbs: 18, fat: 13, alternatives: ["Tavuk sote"] },
            { foodName: "Ispanak (zeytinyağlı)", portion: 200, portionUnit: "g", calories: 70, protein: 5.7, carbs: 7.3, fat: 2.8, alternatives: ["Brokoli", "Karnabahar"] },
            { foodName: "Yoğurt", portion: 150, portionUnit: "g", calories: 90, protein: 6, carbs: 6.8, fat: 3.8, alternatives: ["Ayran", "Cacık"] },
          ],
        },
      ],
    })),
  },
  {
    id: "plan-002",
    name: "Diyabetik Beslenme Programı",
    description: "Düşük glisemik indeksli, kan şekerini dengeleyici beslenme programı. Günlük 1600 kalori.",
    goal: "health_improvement",
    dailyCalorieTarget: 1600,
    macroTargets: { protein: 35, carbs: 35, fat: 30 },
    duration: 16,
    assignedPatientIds: ["pat-002", "pat-005", "pat-010"],
    dietitianId: "diet-001",
    status: "active",
    createdAt: "2025-09-01",
    updatedAt: "2026-02-18",
    restrictions: ["Beyaz şeker yasak", "Beyaz ekmek yasak", "Meyve suyu yasak", "Düşük GI gıdalar tercih edilmeli"],
    notes: "Kan şekeri ölçümleri her öğün öncesi ve sonrası kontrol edilmeli. HbA1c 3 ayda bir takip.",
    weeklySchedule: dayNames.map((dayName, i) => ({
      day: i + 1,
      dayName,
      totalCalories: 1600,
      totalProtein: 140,
      totalCarbs: 140,
      totalFat: 53,
      meals: [
        {
          mealType: "kahvalti" as const,
          mealLabel: "Kahvaltı",
          time: "07:30",
          calories: 380,
          protein: 25,
          carbs: 30,
          fat: 18,
          items: [
            { foodName: "Haşlanmış yumurta", portion: 2, portionUnit: "adet", calories: 156, protein: 12.6, carbs: 1.2, fat: 10.6, alternatives: ["Menemen (yağsız)"] },
            { foodName: "Beyaz peynir (light)", portion: 40, portionUnit: "g", calories: 69, protein: 6.9, carbs: 0.7, fat: 4.3, alternatives: ["Lor peyniri"] },
            { foodName: "Tam buğday ekmeği", portion: 40, portionUnit: "g", calories: 102, protein: 3.6, carbs: 19.2, fat: 1.2, alternatives: ["Çavdar ekmeği"] },
            { foodName: "Domates + Salatalık", portion: 150, portionUnit: "g", calories: 30, protein: 1.4, carbs: 6.2, fat: 0.3, alternatives: ["Yeşil biber", "Roka"] },
          ],
        },
        {
          mealType: "ara_ogun_1" as const,
          mealLabel: "Kuşluk Ara Öğün",
          time: "10:00",
          calories: 180,
          protein: 12,
          carbs: 15,
          fat: 8,
          items: [
            { foodName: "Yoğurt (yarım yağlı)", portion: 150, portionUnit: "g", calories: 90, protein: 6, carbs: 6.8, fat: 3.8, alternatives: ["Kefir"] },
            { foodName: "Ceviz", portion: 15, portionUnit: "g", calories: 98, protein: 2.3, carbs: 2, fat: 9.8, alternatives: ["Badem", "Fındık"] },
          ],
        },
        {
          mealType: "ogle" as const,
          mealLabel: "Öğle Yemeği",
          time: "12:30",
          calories: 450,
          protein: 42,
          carbs: 40,
          fat: 13,
          items: [
            { foodName: "Ezogelin çorbası", portion: 200, portionUnit: "ml", calories: 116, protein: 5.2, carbs: 17.6, fat: 3, alternatives: ["Mercimek çorbası"] },
            i % 2 === 0
              ? { foodName: "Izgara tavuk göğsü", portion: 150, portionUnit: "g", calories: 248, protein: 46.5, carbs: 0, fat: 5.4, alternatives: ["Balık"] }
              : { foodName: "Sebzeli nohut yemeği", portion: 200, portionUnit: "g", calories: 220, protein: 12, carbs: 30, fat: 5, alternatives: ["Kuru fasulye"] },
            { foodName: "Bulgur pilavı", portion: 80, portionUnit: "g", calories: 120, protein: 3.6, carbs: 24.5, fat: 1.1, alternatives: ["Kinoa"] },
          ],
        },
        {
          mealType: "ara_ogun_2" as const,
          mealLabel: "İkindi Ara Öğün",
          time: "15:30",
          calories: 140,
          protein: 8,
          carbs: 18,
          fat: 4,
          items: [
            { foodName: "Elma", portion: 1, portionUnit: "adet (küçük)", calories: 72, protein: 0.4, carbs: 19, fat: 0.2, alternatives: ["Armut", "Greyfurt"] },
            { foodName: "Lor peyniri", portion: 40, portionUnit: "g", calories: 36, protein: 4.8, carbs: 1.2, fat: 1.2, alternatives: ["Badem sütü"] },
          ],
        },
        {
          mealType: "aksam" as const,
          mealLabel: "Akşam Yemeği",
          time: "19:00",
          calories: 450,
          protein: 38,
          carbs: 37,
          fat: 15,
          items: [
            i % 2 === 0
              ? { foodName: "Fırında somon", portion: 150, portionUnit: "g", calories: 280, protein: 30, carbs: 0, fat: 16.7, alternatives: ["Levrek", "Çipura"] }
              : { foodName: "Zeytinyağlı kuru fasulye", portion: 200, portionUnit: "g", calories: 240, protein: 14, carbs: 35, fat: 4, alternatives: ["Nohut yemeği"] },
            { foodName: "Brokoli (buharda)", portion: 200, portionUnit: "g", calories: 69, protein: 5.6, carbs: 13.6, fat: 0.8, alternatives: ["Karnabahar", "Kuşkonmaz"] },
            { foodName: "Cacık", portion: 150, portionUnit: "g", calories: 50, protein: 3.5, carbs: 4, fat: 2, alternatives: ["Ayran"] },
          ],
        },
      ],
    })),
  },
  {
    id: "plan-003",
    name: "Sporcu Kas Geliştirme Programı",
    description: "Yüksek proteinli, aktif sporcular için kas geliştirme beslenme programı. Günlük 2500 kalori.",
    goal: "muscle_gain",
    dailyCalorieTarget: 2500,
    macroTargets: { protein: 40, carbs: 35, fat: 25 },
    duration: 8,
    assignedPatientIds: ["pat-003", "pat-006"],
    dietitianId: "diet-001",
    status: "active",
    createdAt: "2025-12-20",
    updatedAt: "2026-02-22",
    restrictions: ["İşlenmiş gıdalar minimum", "Alkol yasak", "Şekerli içecekler yasak"],
    notes: "Antrenman günleri ve dinlenme günleri farklı kalori hedefleri var. Protein alımı vücut ağırlığının 2 katı gram.",
    weeklySchedule: dayNames.map((dayName, i) => ({
      day: i + 1,
      dayName,
      totalCalories: i < 5 ? 2600 : 2300,
      totalProtein: 200,
      totalCarbs: i < 5 ? 230 : 190,
      totalFat: 70,
      meals: [
        {
          mealType: "kahvalti" as const,
          mealLabel: "Kahvaltı",
          time: "07:00",
          calories: 600,
          protein: 40,
          carbs: 65,
          fat: 20,
          items: [
            { foodName: "Yulaf ezmesi + süt", portion: 80, portionUnit: "g", calories: 340, protein: 14, carbs: 52, fat: 8, alternatives: ["Tam buğday ekmeği + yumurta"] },
            { foodName: "Muz", portion: 1, portionUnit: "adet", calories: 107, protein: 1.3, carbs: 27, fat: 0.4, alternatives: ["Çilek", "Yaban mersini"] },
            { foodName: "Haşlanmış yumurta", portion: 3, portionUnit: "adet", calories: 234, protein: 18.9, carbs: 1.8, fat: 15.9, alternatives: ["Yumurta beyazı omlet"] },
          ],
        },
        {
          mealType: "ara_ogun_1" as const,
          mealLabel: "Antrenman Öncesi",
          time: "10:00",
          calories: 350,
          protein: 25,
          carbs: 40,
          fat: 10,
          items: [
            { foodName: "Tam buğday ekmeği + hindi füme", portion: 1, portionUnit: "porsiyon", calories: 220, protein: 18, carbs: 24, fat: 5, alternatives: ["Yulaf bar"] },
            { foodName: "Muz", portion: 1, portionUnit: "adet", calories: 107, protein: 1.3, carbs: 27, fat: 0.4, alternatives: ["Hurma"] },
          ],
        },
        {
          mealType: "ogle" as const,
          mealLabel: "Öğle Yemeği",
          time: "13:00",
          calories: 650,
          protein: 55,
          carbs: 60,
          fat: 18,
          items: [
            i % 2 === 0
              ? { foodName: "Izgara tavuk göğsü", portion: 250, portionUnit: "g", calories: 413, protein: 77.5, carbs: 0, fat: 9, alternatives: ["Izgara somon"] }
              : { foodName: "Izgara somon", portion: 200, portionUnit: "g", calories: 416, protein: 45.3, carbs: 0, fat: 24.8, alternatives: ["Tavuk göğsü"] },
            { foodName: "Bulgur pilavı", portion: 150, portionUnit: "g", calories: 225, protein: 6.8, carbs: 46, fat: 2.1, alternatives: ["Pirinç pilavı", "Kinoa"] },
            { foodName: "Karışık sebze", portion: 200, portionUnit: "g", calories: 60, protein: 3, carbs: 12, fat: 0.5, alternatives: [] },
          ],
        },
        {
          mealType: "ara_ogun_2" as const,
          mealLabel: "Antrenman Sonrası",
          time: "17:00",
          calories: 400,
          protein: 35,
          carbs: 40,
          fat: 12,
          items: [
            { foodName: "Yoğurt (yarım yağlı)", portion: 300, portionUnit: "g", calories: 180, protein: 12, carbs: 13.5, fat: 7.5, alternatives: ["Protein shake"] },
            { foodName: "Badem", portion: 30, portionUnit: "g", calories: 173, protein: 6.3, carbs: 6.5, fat: 15, alternatives: ["Ceviz", "Fındık"] },
            { foodName: "Çilek", portion: 150, portionUnit: "g", calories: 48, protein: 1, carbs: 11.5, fat: 0.5, alternatives: ["Muz"] },
          ],
        },
        {
          mealType: "aksam" as const,
          mealLabel: "Akşam Yemeği",
          time: "20:00",
          calories: 550,
          protein: 50,
          carbs: 35,
          fat: 20,
          items: [
            i % 3 === 0
              ? { foodName: "Biftek (ızgara)", portion: 200, portionUnit: "g", calories: 370, protein: 50, carbs: 0, fat: 18, alternatives: ["Tavuk göğsü"] }
              : i % 3 === 1
                ? { foodName: "Izgara tavuk but", portion: 200, portionUnit: "g", calories: 320, protein: 42, carbs: 0, fat: 16, alternatives: ["Balık"] }
                : { foodName: "Fırında somon", portion: 200, portionUnit: "g", calories: 374, protein: 40.8, carbs: 0, fat: 22.3, alternatives: ["Et"] },
            { foodName: "Tatlı patates (fırında)", portion: 150, portionUnit: "g", calories: 135, protein: 2, carbs: 31.5, fat: 0.2, alternatives: ["Pirinç"] },
            { foodName: "Avokado", portion: 80, portionUnit: "g", calories: 128, protein: 1.6, carbs: 6.8, fat: 11.8, alternatives: ["Zeytinyağlı salata"] },
          ],
        },
      ],
    })),
  },
];
