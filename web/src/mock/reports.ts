import { subDays, subWeeks, format } from "date-fns";

export interface WeeklyReport {
  id: string;
  patientId: string;
  patientName: string;
  weekStartDate: string;
  weekEndDate: string;
  summary: {
    averageDailyCalories: number;
    calorieTarget: number;
    calorieAdherence: number;
    averageProtein: number;
    averageCarbs: number;
    averageFat: number;
    mealsLogged: number;
    mealsExpected: number;
    mealAdherence: number;
    waterIntake: number;
    exerciseMinutes: number;
  };
  weightChange: number;
  currentWeight: number;
  planAdherence: number;
  highlights: string[];
  concerns: string[];
  dietitianNotes: string;
  createdAt: string;
}

export interface AdherenceData {
  date: string;
  adherenceRate: number;
  caloriesConsumed: number;
  calorieTarget: number;
}

export interface PatientProgress {
  patientId: string;
  patientName: string;
  startWeight: number;
  currentWeight: number;
  targetWeight: number;
  progressPercentage: number;
  weeklyWeights: { week: string; weight: number }[];
  monthlyAdherence: { month: string; adherence: number }[];
}

const now = new Date();

export const weeklyReports: WeeklyReport[] = [
  {
    id: "report-001",
    patientId: "pat-001",
    patientName: "Ayşe Yılmaz",
    weekStartDate: format(subWeeks(now, 1), "yyyy-MM-dd"),
    weekEndDate: format(subDays(now, 1), "yyyy-MM-dd"),
    summary: {
      averageDailyCalories: 1480,
      calorieTarget: 1500,
      calorieAdherence: 98.7,
      averageProtein: 108,
      averageCarbs: 148,
      averageFat: 49,
      mealsLogged: 26,
      mealsExpected: 28,
      mealAdherence: 92.9,
      waterIntake: 2.1,
      exerciseMinutes: 150,
    },
    weightChange: -0.6,
    currentWeight: 78.5,
    planAdherence: 91,
    highlights: [
      "Kalori hedefine çok yakın uyum sağlandı",
      "Protein alımı hedefin üzerinde",
      "Akşam atıştırmaları azaldı",
      "Haftada 3 gün egzersiz yapıldı",
    ],
    concerns: [
      "Cumartesi günü öğle yemeği kaydedilmedi",
      "Pazar günü kalori hedefinin %15 üzerine çıkıldı",
    ],
    dietitianNotes: "Genel uyum çok iyi. Hafta sonu disiplinini artırmak için stratejiler konuşulacak.",
    createdAt: format(now, "yyyy-MM-dd"),
  },
  {
    id: "report-002",
    patientId: "pat-002",
    patientName: "Mehmet Kaya",
    weekStartDate: format(subWeeks(now, 1), "yyyy-MM-dd"),
    weekEndDate: format(subDays(now, 1), "yyyy-MM-dd"),
    summary: {
      averageDailyCalories: 1650,
      calorieTarget: 1600,
      calorieAdherence: 96.9,
      averageProtein: 135,
      averageCarbs: 138,
      averageFat: 52,
      mealsLogged: 28,
      mealsExpected: 28,
      mealAdherence: 100,
      waterIntake: 1.8,
      exerciseMinutes: 90,
    },
    weightChange: -0.8,
    currentWeight: 95.2,
    planAdherence: 85,
    highlights: [
      "Tüm öğünler eksiksiz kaydedildi",
      "Kan şekeri ölçümleri düzenli yapıldı",
      "Açlık kan şekeri 125 mg/dL ortalaması",
    ],
    concerns: [
      "3 öğünde plan dışı gıda tüketildi (pirinç pilavı)",
      "Su tüketimi hedefin altında",
      "Egzersiz süresi artırılmalı",
    ],
    dietitianNotes: "Öğün kayıt disiplini mükemmel. Düşük GI alternatifleri vurgulanacak. Su tüketimi hatırlatıcısı ayarlanacak.",
    createdAt: format(now, "yyyy-MM-dd"),
  },
  {
    id: "report-003",
    patientId: "pat-006",
    patientName: "Emre Arslan",
    weekStartDate: format(subWeeks(now, 1), "yyyy-MM-dd"),
    weekEndDate: format(subDays(now, 1), "yyyy-MM-dd"),
    summary: {
      averageDailyCalories: 2520,
      calorieTarget: 2500,
      calorieAdherence: 99.2,
      averageProtein: 195,
      averageCarbs: 225,
      averageFat: 68,
      mealsLogged: 33,
      mealsExpected: 35,
      mealAdherence: 94.3,
      waterIntake: 3.2,
      exerciseMinutes: 420,
    },
    weightChange: 0.3,
    currentWeight: 72.8,
    planAdherence: 95,
    highlights: [
      "Protein hedefine yüksek uyum",
      "Antrenman öncesi ve sonrası öğünler doğru zamanlanmış",
      "Kas kütlesi artışı devam ediyor",
      "Su tüketimi mükemmel",
    ],
    concerns: [
      "Cuma günü akşam yemeği atlanmış",
    ],
    dietitianNotes: "Sporcu beslenmesi çok iyi ilerliyor. Haftalık performans verileri ile beslenme korelasyonu incelenecek.",
    createdAt: format(now, "yyyy-MM-dd"),
  },
  {
    id: "report-004",
    patientId: "pat-001",
    patientName: "Ayşe Yılmaz",
    weekStartDate: format(subWeeks(now, 2), "yyyy-MM-dd"),
    weekEndDate: format(subWeeks(now, 1), "yyyy-MM-dd"),
    summary: {
      averageDailyCalories: 1520,
      calorieTarget: 1500,
      calorieAdherence: 98.7,
      averageProtein: 105,
      averageCarbs: 155,
      averageFat: 50,
      mealsLogged: 25,
      mealsExpected: 28,
      mealAdherence: 89.3,
      waterIntake: 1.9,
      exerciseMinutes: 120,
    },
    weightChange: -0.4,
    currentWeight: 79.1,
    planAdherence: 87,
    highlights: [
      "Kalori uyumu iyi seviyede",
      "Akşam yemeği seçimleri iyileşti",
    ],
    concerns: [
      "3 ara öğün atlanmış",
      "Egzersiz süresi artırılabilir",
      "Su tüketimi yetersiz",
    ],
    dietitianNotes: "Ara öğünlerin önemi tekrar vurgulanacak. Pratik ara öğün alternatifleri önerilecek.",
    createdAt: format(subWeeks(now, 1), "yyyy-MM-dd"),
  },
];

export const adherenceHistory: AdherenceData[] = Array.from({ length: 30 }, (_, i) => {
  const date = subDays(now, 29 - i);
  const baseAdherence = 85 + Math.random() * 15;
  const baseCalories = 1400 + Math.random() * 200;
  return {
    date: format(date, "yyyy-MM-dd"),
    adherenceRate: Math.round(baseAdherence * 10) / 10,
    caloriesConsumed: Math.round(baseCalories),
    calorieTarget: 1500,
  };
});

export const patientProgressData: PatientProgress[] = [
  {
    patientId: "pat-001",
    patientName: "Ayşe Yılmaz",
    startWeight: 83.0,
    currentWeight: 78.5,
    targetWeight: 65.0,
    progressPercentage: 25.0,
    weeklyWeights: [
      { week: "Hafta 1", weight: 83.0 },
      { week: "Hafta 2", weight: 82.4 },
      { week: "Hafta 3", weight: 81.8 },
      { week: "Hafta 4", weight: 81.2 },
      { week: "Hafta 5", weight: 80.9 },
      { week: "Hafta 6", weight: 80.3 },
      { week: "Hafta 7", weight: 80.0 },
      { week: "Hafta 8", weight: 79.7 },
      { week: "Hafta 9", weight: 79.5 },
      { week: "Hafta 10", weight: 79.1 },
      { week: "Hafta 11", weight: 79.1 },
      { week: "Hafta 12", weight: 78.5 },
    ],
    monthlyAdherence: [
      { month: "Aralık", adherence: 82 },
      { month: "Ocak", adherence: 88 },
      { month: "Şubat", adherence: 91 },
    ],
  },
  {
    patientId: "pat-002",
    patientName: "Mehmet Kaya",
    startWeight: 102.0,
    currentWeight: 95.2,
    targetWeight: 82.0,
    progressPercentage: 34.0,
    weeklyWeights: [
      { week: "Hafta 1", weight: 102.0 },
      { week: "Hafta 4", weight: 100.5 },
      { week: "Hafta 8", weight: 98.8 },
      { week: "Hafta 12", weight: 97.5 },
      { week: "Hafta 16", weight: 96.8 },
      { week: "Hafta 20", weight: 96.0 },
      { week: "Hafta 24", weight: 95.2 },
    ],
    monthlyAdherence: [
      { month: "Eylül", adherence: 75 },
      { month: "Ekim", adherence: 78 },
      { month: "Kasım", adherence: 80 },
      { month: "Aralık", adherence: 82 },
      { month: "Ocak", adherence: 85 },
      { month: "Şubat", adherence: 85 },
    ],
  },
  {
    patientId: "pat-006",
    patientName: "Emre Arslan",
    startWeight: 70.0,
    currentWeight: 72.8,
    targetWeight: 78.0,
    progressPercentage: 35.0,
    weeklyWeights: [
      { week: "Hafta 1", weight: 70.0 },
      { week: "Hafta 2", weight: 70.3 },
      { week: "Hafta 4", weight: 70.8 },
      { week: "Hafta 6", weight: 71.2 },
      { week: "Hafta 8", weight: 71.5 },
      { week: "Hafta 10", weight: 71.8 },
      { week: "Hafta 12", weight: 72.1 },
      { week: "Hafta 14", weight: 72.5 },
      { week: "Hafta 16", weight: 72.8 },
    ],
    monthlyAdherence: [
      { month: "Kasım", adherence: 90 },
      { month: "Aralık", adherence: 92 },
      { month: "Ocak", adherence: 94 },
      { month: "Şubat", adherence: 95 },
    ],
  },
];
