import { subDays, format } from "date-fns";

export type MealType = "kahvalti" | "ogle" | "aksam" | "ara_ogun";

export interface MealEntry {
  id: string;
  patientId: string;
  date: string;
  mealType: MealType;
  time: string;
  items: MealItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  photoUrl: string | null;
  notes: string;
  isApproved: boolean | null;
  dietitianComment: string | null;
  loggedAt: string;
}

export interface MealItem {
  foodId: string;
  foodName: string;
  portion: number;
  portionUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const mealTypeLabels: Record<MealType, string> = {
  kahvalti: "Kahvaltı",
  ogle: "Öğle Yemeği",
  aksam: "Akşam Yemeği",
  ara_ogun: "Ara Öğün",
};

const now = new Date();

export const meals: MealEntry[] = [
  // Ayse Yilmaz - Bugun
  {
    id: "meal-001",
    patientId: "pat-001",
    date: format(now, "yyyy-MM-dd"),
    mealType: "kahvalti",
    time: "08:30",
    items: [
      { foodId: "food-021", foodName: "Beyaz peynir (light)", portion: 60, portionUnit: "g", calories: 104, protein: 10.4, carbs: 1.0, fat: 6.4 },
      { foodId: "food-030", foodName: "Domates", portion: 100, portionUnit: "g", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
      { foodId: "food-031", foodName: "Salatalık", portion: 100, portionUnit: "g", calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1 },
      { foodId: "food-060", foodName: "Zeytinyağı", portion: 10, portionUnit: "ml", calories: 80, protein: 0, carbs: 0, fat: 9.0 },
      { foodId: "food-001", foodName: "Tam buğday ekmeği", portion: 50, portionUnit: "g", calories: 128, protein: 4.5, carbs: 24, fat: 1.5 },
      { foodId: "food-070", foodName: "Siyah çay (şekersiz)", portion: 200, portionUnit: "ml", calories: 2, protein: 0, carbs: 0.5, fat: 0 },
    ],
    totalCalories: 347,
    totalProtein: 16.5,
    totalCarbs: 33.0,
    totalFat: 17.2,
    photoUrl: null,
    notes: "",
    isApproved: true,
    dietitianComment: "Harika bir kahvaltı, protein oranı iyi.",
    loggedAt: format(now, "yyyy-MM-dd") + "T08:45:00",
  },
  {
    id: "meal-002",
    patientId: "pat-001",
    date: format(now, "yyyy-MM-dd"),
    mealType: "ara_ogun",
    time: "10:30",
    items: [
      { foodId: "food-062", foodName: "Badem", portion: 20, portionUnit: "g", calories: 115, protein: 4.2, carbs: 4.3, fat: 10.0 },
      { foodId: "food-040", foodName: "Elma", portion: 180, portionUnit: "g", calories: 94, protein: 0.5, carbs: 25, fat: 0.3 },
    ],
    totalCalories: 209,
    totalProtein: 4.7,
    totalCarbs: 29.3,
    totalFat: 10.3,
    photoUrl: null,
    notes: "",
    isApproved: true,
    dietitianComment: null,
    loggedAt: format(now, "yyyy-MM-dd") + "T10:40:00",
  },
  {
    id: "meal-003",
    patientId: "pat-001",
    date: format(now, "yyyy-MM-dd"),
    mealType: "ogle",
    time: "13:00",
    items: [
      { foodId: "food-080", foodName: "Mercimek çorbası", portion: 250, portionUnit: "ml", calories: 165, protein: 9.0, carbs: 24, fat: 4.2 },
      { foodId: "food-010", foodName: "Izgara tavuk göğsü", portion: 150, portionUnit: "g", calories: 248, protein: 46.5, carbs: 0, fat: 5.4 },
      { foodId: "food-033", foodName: "Brokoli (buharda)", portion: 150, portionUnit: "g", calories: 52, protein: 4.2, carbs: 10.2, fat: 0.6 },
      { foodId: "food-002", foodName: "Bulgur pilavı", portion: 100, portionUnit: "g", calories: 150, protein: 4.5, carbs: 30.7, fat: 1.4 },
    ],
    totalCalories: 615,
    totalProtein: 64.2,
    totalCarbs: 64.9,
    totalFat: 11.6,
    photoUrl: null,
    notes: "",
    isApproved: null,
    dietitianComment: null,
    loggedAt: format(now, "yyyy-MM-dd") + "T13:20:00",
  },

  // Mehmet Kaya - Bugun
  {
    id: "meal-004",
    patientId: "pat-002",
    date: format(now, "yyyy-MM-dd"),
    mealType: "kahvalti",
    time: "07:45",
    items: [
      { foodId: "food-003", foodName: "Yumurta (haşlanmış)", portion: 2, portionUnit: "adet", calories: 156, protein: 12.6, carbs: 1.2, fat: 10.6 },
      { foodId: "food-021", foodName: "Beyaz peynir (light)", portion: 40, portionUnit: "g", calories: 69, protein: 6.9, carbs: 0.7, fat: 4.3 },
      { foodId: "food-030", foodName: "Domates", portion: 100, portionUnit: "g", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
      { foodId: "food-001", foodName: "Tam buğday ekmeği", portion: 50, portionUnit: "g", calories: 128, protein: 4.5, carbs: 24, fat: 1.5 },
    ],
    totalCalories: 371,
    totalProtein: 24.9,
    totalCarbs: 29.8,
    totalFat: 16.6,
    photoUrl: null,
    notes: "Şekersiz çay ile birlikte",
    isApproved: true,
    dietitianComment: "Kahvaltıda sebze miktarını biraz artırabilirsiniz.",
    loggedAt: format(now, "yyyy-MM-dd") + "T08:00:00",
  },
  {
    id: "meal-005",
    patientId: "pat-002",
    date: format(now, "yyyy-MM-dd"),
    mealType: "ogle",
    time: "12:30",
    items: [
      { foodId: "food-011", foodName: "Izgara köfte", portion: 150, portionUnit: "g", calories: 331, protein: 27.5, carbs: 5.6, fat: 22.3 },
      { foodId: "food-035", foodName: "Patlıcan (fırında)", portion: 200, portionUnit: "g", calories: 69, protein: 1.6, carbs: 12.0, fat: 2.4 },
      { foodId: "food-003", foodName: "Pirinç pilavı", portion: 100, portionUnit: "g", calories: 140, protein: 2.8, carbs: 30, fat: 1.2 },
      { foodId: "food-072", foodName: "Ayran", portion: 250, portionUnit: "ml", calories: 55, protein: 3.5, carbs: 4.0, fat: 2.5 },
    ],
    totalCalories: 595,
    totalProtein: 35.4,
    totalCarbs: 51.6,
    totalFat: 28.4,
    photoUrl: null,
    notes: "",
    isApproved: false,
    dietitianComment: "Pirinç pilavı yerine bulgur pilavı tercih edin. Kan şekerini daha az etkiler.",
    loggedAt: format(now, "yyyy-MM-dd") + "T12:50:00",
  },

  // Fatma Demir - Dun
  {
    id: "meal-006",
    patientId: "pat-003",
    date: format(subDays(now, 1), "yyyy-MM-dd"),
    mealType: "kahvalti",
    time: "07:00",
    items: [
      { foodId: "food-004", foodName: "Yulaf ezmesi", portion: 60, portionUnit: "g", calories: 225, protein: 8.0, carbs: 40.5, fat: 3.9 },
      { foodId: "food-041", foodName: "Muz", portion: 120, portionUnit: "g", calories: 107, protein: 1.3, carbs: 27, fat: 0.4 },
      { foodId: "food-061", foodName: "Ceviz", portion: 20, portionUnit: "g", calories: 131, protein: 3.1, carbs: 2.7, fat: 13.1 },
      { foodId: "food-022", foodName: "Süt (yarım yağlı)", portion: 200, portionUnit: "ml", calories: 92, protein: 6.4, carbs: 9.6, fat: 3.2 },
    ],
    totalCalories: 555,
    totalProtein: 18.8,
    totalCarbs: 79.8,
    totalFat: 20.6,
    photoUrl: null,
    notes: "Glutensiz yulaf kullanıyorum",
    isApproved: true,
    dietitianComment: "Mükemmel! Glutensiz yulaf seçimi çok doğru.",
    loggedAt: format(subDays(now, 1), "yyyy-MM-dd") + "T07:20:00",
  },
  {
    id: "meal-007",
    patientId: "pat-003",
    date: format(subDays(now, 1), "yyyy-MM-dd"),
    mealType: "ogle",
    time: "12:00",
    items: [
      { foodId: "food-012", foodName: "Izgara somon", portion: 180, portionUnit: "g", calories: 374, protein: 40.8, carbs: 0, fat: 22.3 },
      { foodId: "food-032", foodName: "Ispanak (pişmiş)", portion: 200, portionUnit: "g", calories: 47, protein: 5.7, carbs: 7.3, fat: 0.8 },
      { foodId: "food-003", foodName: "Pirinç pilavı", portion: 150, portionUnit: "g", calories: 210, protein: 4.2, carbs: 45, fat: 1.8 },
    ],
    totalCalories: 631,
    totalProtein: 50.7,
    totalCarbs: 52.3,
    totalFat: 24.9,
    photoUrl: null,
    notes: "",
    isApproved: true,
    dietitianComment: "Protein oranı çok iyi, kas gelişimi için ideal.",
    loggedAt: format(subDays(now, 1), "yyyy-MM-dd") + "T12:15:00",
  },
  {
    id: "meal-008",
    patientId: "pat-003",
    date: format(subDays(now, 1), "yyyy-MM-dd"),
    mealType: "aksam",
    time: "19:30",
    items: [
      { foodId: "food-010", foodName: "Izgara tavuk göğsü", portion: 200, portionUnit: "g", calories: 330, protein: 62.0, carbs: 0, fat: 7.2 },
      { foodId: "food-034", foodName: "Havuç", portion: 100, portionUnit: "g", calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2 },
      { foodId: "food-033", foodName: "Brokoli (buharda)", portion: 200, portionUnit: "g", calories: 69, protein: 5.6, carbs: 13.6, fat: 0.8 },
      { foodId: "food-063", foodName: "Avokado", portion: 80, portionUnit: "g", calories: 128, protein: 1.6, carbs: 6.8, fat: 11.8 },
    ],
    totalCalories: 568,
    totalProtein: 70.1,
    totalCarbs: 30.0,
    totalFat: 20.0,
    photoUrl: null,
    notes: "Antrenman sonrası yemek",
    isApproved: true,
    dietitianComment: null,
    loggedAt: format(subDays(now, 1), "yyyy-MM-dd") + "T20:00:00",
  },

  // Emre Arslan - Bugun
  {
    id: "meal-009",
    patientId: "pat-006",
    date: format(now, "yyyy-MM-dd"),
    mealType: "kahvalti",
    time: "06:30",
    items: [
      { foodId: "food-004", foodName: "Yulaf ezmesi", portion: 80, portionUnit: "g", calories: 300, protein: 10.6, carbs: 54, fat: 5.2 },
      { foodId: "food-041", foodName: "Muz", portion: 120, portionUnit: "g", calories: 107, protein: 1.3, carbs: 27, fat: 0.4 },
      { foodId: "food-022", foodName: "Süt (yarım yağlı)", portion: 300, portionUnit: "ml", calories: 138, protein: 9.6, carbs: 14.4, fat: 4.8 },
      { foodId: "food-062", foodName: "Badem", portion: 30, portionUnit: "g", calories: 173, protein: 6.3, carbs: 6.5, fat: 15 },
    ],
    totalCalories: 718,
    totalProtein: 27.8,
    totalCarbs: 101.9,
    totalFat: 25.4,
    photoUrl: null,
    notes: "Sabah antrenmanı öncesi",
    isApproved: true,
    dietitianComment: "Antrenman öncesi yeterli enerji. Harika!",
    loggedAt: format(now, "yyyy-MM-dd") + "T06:45:00",
  },
  {
    id: "meal-010",
    patientId: "pat-006",
    date: format(now, "yyyy-MM-dd"),
    mealType: "ara_ogun",
    time: "09:30",
    items: [
      { foodId: "food-020", foodName: "Yoğurt (yarım yağlı)", portion: 200, portionUnit: "g", calories: 120, protein: 8.0, carbs: 9.0, fat: 5.0 },
      { foodId: "food-043", foodName: "Çilek", portion: 150, portionUnit: "g", calories: 48, protein: 1.0, carbs: 11.5, fat: 0.5 },
    ],
    totalCalories: 168,
    totalProtein: 9.0,
    totalCarbs: 20.5,
    totalFat: 5.5,
    photoUrl: null,
    notes: "Antrenman sonrası toparlanma",
    isApproved: null,
    dietitianComment: null,
    loggedAt: format(now, "yyyy-MM-dd") + "T09:45:00",
  },

  // Zeynep Celik - Dun
  {
    id: "meal-011",
    patientId: "pat-005",
    date: format(subDays(now, 1), "yyyy-MM-dd"),
    mealType: "kahvalti",
    time: "08:00",
    items: [
      { foodId: "food-023", foodName: "Lor peyniri", portion: 80, portionUnit: "g", calories: 72, protein: 9.6, carbs: 2.4, fat: 2.4 },
      { foodId: "food-030", foodName: "Domates", portion: 100, portionUnit: "g", calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
      { foodId: "food-031", foodName: "Salatalık", portion: 100, portionUnit: "g", calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1 },
      { foodId: "food-001", foodName: "Tam buğday ekmeği", portion: 25, portionUnit: "g", calories: 64, protein: 2.3, carbs: 12, fat: 0.8 },
      { foodId: "food-070", foodName: "Siyah çay (şekersiz)", portion: 200, portionUnit: "ml", calories: 2, protein: 0, carbs: 0.5, fat: 0 },
    ],
    totalCalories: 171,
    totalProtein: 13.5,
    totalCarbs: 22.4,
    totalFat: 3.5,
    photoUrl: null,
    notes: "",
    isApproved: true,
    dietitianComment: "Kalori biraz düşük, bir avuç ceviz ekleyebilirsiniz.",
    loggedAt: format(subDays(now, 1), "yyyy-MM-dd") + "T08:15:00",
  },
  {
    id: "meal-012",
    patientId: "pat-005",
    date: format(subDays(now, 1), "yyyy-MM-dd"),
    mealType: "ogle",
    time: "12:30",
    items: [
      { foodId: "food-082", foodName: "Domates çorbası", portion: 250, portionUnit: "ml", calories: 110, protein: 3.5, carbs: 16, fat: 3.2 },
      { foodId: "food-051", foodName: "Nohut (pişmiş)", portion: 150, portionUnit: "g", calories: 246, protein: 13.2, carbs: 41, fat: 3.9 },
      { foodId: "food-034", foodName: "Havuç", portion: 100, portionUnit: "g", calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2 },
    ],
    totalCalories: 397,
    totalProtein: 17.6,
    totalCarbs: 66.6,
    totalFat: 7.3,
    photoUrl: null,
    notes: "İş yerinde yedim",
    isApproved: true,
    dietitianComment: null,
    loggedAt: format(subDays(now, 1), "yyyy-MM-dd") + "T12:50:00",
  },

  // Ali Ozturk - 2 gun once
  {
    id: "meal-013",
    patientId: "pat-004",
    date: format(subDays(now, 2), "yyyy-MM-dd"),
    mealType: "kahvalti",
    time: "08:00",
    items: [
      { foodId: "food-004", foodName: "Yulaf ezmesi", portion: 40, portionUnit: "g", calories: 150, protein: 5.3, carbs: 27, fat: 2.6 },
      { foodId: "food-061", foodName: "Ceviz", portion: 20, portionUnit: "g", calories: 131, protein: 3.1, carbs: 2.7, fat: 13.1 },
      { foodId: "food-042", foodName: "Portakal", portion: 180, portionUnit: "g", calories: 85, protein: 1.7, carbs: 21, fat: 0.2 },
    ],
    totalCalories: 366,
    totalProtein: 10.1,
    totalCarbs: 50.7,
    totalFat: 15.9,
    photoUrl: null,
    notes: "",
    isApproved: true,
    dietitianComment: "Güzel bir kahvaltı seçimi.",
    loggedAt: format(subDays(now, 2), "yyyy-MM-dd") + "T08:15:00",
  },
  {
    id: "meal-014",
    patientId: "pat-004",
    date: format(subDays(now, 2), "yyyy-MM-dd"),
    mealType: "ogle",
    time: "12:30",
    items: [
      { foodId: "food-080", foodName: "Mercimek çorbası", portion: 250, portionUnit: "ml", calories: 165, protein: 9.0, carbs: 24, fat: 4.2 },
      { foodId: "food-010", foodName: "Izgara tavuk göğsü", portion: 150, portionUnit: "g", calories: 248, protein: 46.5, carbs: 0, fat: 5.4 },
      { foodId: "food-002", foodName: "Bulgur pilavı", portion: 120, portionUnit: "g", calories: 180, protein: 5.4, carbs: 36.8, fat: 1.7 },
    ],
    totalCalories: 593,
    totalProtein: 60.9,
    totalCarbs: 60.8,
    totalFat: 11.3,
    photoUrl: null,
    notes: "",
    isApproved: true,
    dietitianComment: null,
    loggedAt: format(subDays(now, 2), "yyyy-MM-dd") + "T12:45:00",
  },
  {
    id: "meal-015",
    patientId: "pat-004",
    date: format(subDays(now, 2), "yyyy-MM-dd"),
    mealType: "aksam",
    time: "19:00",
    items: [
      { foodId: "food-013", foodName: "Levrek buğulama", portion: 200, portionUnit: "g", calories: 207, protein: 40.0, carbs: 0, fat: 4.3 },
      { foodId: "food-032", foodName: "Ispanak (pişmiş)", portion: 200, portionUnit: "g", calories: 47, protein: 5.7, carbs: 7.3, fat: 0.8 },
      { foodId: "food-020", foodName: "Yoğurt (yarım yağlı)", portion: 200, portionUnit: "g", calories: 120, protein: 8.0, carbs: 9.0, fat: 5.0 },
    ],
    totalCalories: 374,
    totalProtein: 53.7,
    totalCarbs: 16.3,
    totalFat: 10.1,
    photoUrl: null,
    notes: "Kolesterol dostu akşam yemeği",
    isApproved: true,
    dietitianComment: "Mükemmel seçim! Balık ve ıspanak kolesterol için çok faydalı.",
    loggedAt: format(subDays(now, 2), "yyyy-MM-dd") + "T19:30:00",
  },
];
