// Patients
export { patients, patients as mockPatients, patientGoalLabels, activityLevelLabels } from "./patients";
export type { Patient } from "./patients";

// Meals
export { meals, meals as mockMeals, mealTypeLabels } from "./meals";
export type { MealEntry, MealItem, MealType } from "./meals";

// Diet Plans
export { plans, plans as mockMealPlans } from "./plans";
export type { DietPlan, DayPlan, PlanMeal, PlanMealItem } from "./plans";

// Appointments
export { appointments, appointments as mockAppointments, appointmentTypeLabels, appointmentStatusLabels } from "./appointments";
export type { Appointment, AppointmentStatus, AppointmentType } from "./appointments";

// Messages
export { conversations, conversations as mockConversations, messages, messages as mockMessages } from "./messages";
export type { Conversation, Message } from "./messages";

// Notifications
export { notifications, notifications as mockNotifications, notificationTypeLabels } from "./notifications";
export type { Notification, NotificationType } from "./notifications";

// Recipes
export { recipes, recipes as mockRecipes, recipeCategoryLabels } from "./recipes";
export type { Recipe, RecipeIngredient } from "./recipes";

// Shopping Lists
export { shoppingLists, shoppingLists as mockShoppingLists } from "./shopping-lists";
export type { ShoppingList, ShoppingItem } from "./shopping-lists";

// Reviews
export { reviews, reviews as mockReviews, reviewStats } from "./reviews";
export type { Review } from "./reviews";

// Reports
export { weeklyReports, weeklyReports as mockReports, adherenceHistory, patientProgressData } from "./reports";
export type { WeeklyReport, AdherenceData, PatientProgress } from "./reports";

// Dashboard
export {
  dashboardStats,
  dashboardAlerts,
  recentActivity,
  dashboardChartData,
} from "./dashboard";
export type {
  DashboardStats,
  DashboardAlert,
  RecentActivity,
  ChartDataPoint,
  DashboardChartData,
} from "./dashboard";

// Invite Codes
export { inviteCodes, inviteCodes as mockInviteCodes, inviteCodeStats, inviteCodeStatusLabels } from "./invite-code";
export type { InviteCode, InviteCodeStatus } from "./invite-code";

// Foods
export { foods, foodCategories } from "./foods";
export type { FoodItem, FoodCategory } from "./foods";

// Allergens
export { allergens, allergenCategories } from "./allergens";
export type { Allergen } from "./allergens";

// Admin
export {
  adminStats,
  systemHealth,
  adminUsers,
  adminDietitianStats,
  adminMonthlyGrowth,
} from "./admin";
export type { AdminStats, SystemHealth, AdminUser } from "./admin";

// ---------------------------------------------------------------------------
// Utility: simulateApiCall
// ---------------------------------------------------------------------------

export function simulateApiCall<T>(data: T, delayMs = 500): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs);
  });
}

// ---------------------------------------------------------------------------
// Mock Auth Data
// ---------------------------------------------------------------------------

export const mockUser = {
  id: "usr_001",
  email: "dr.ayse@nutriai.com",
  firstName: "Ayse",
  lastName: "Yilmaz",
  role: "admin" as const,
  avatar: "",
  phone: "+90 532 123 4567",
  bio: "10 yillik deneyimli klinik diyetisyen. Obezite, diyabet ve sporcu beslenmesi uzmani.",
  specializations: ["Obezite", "Diyabet", "Sporcu Beslenmesi"],
  licenseNumber: "DYT-2015-1234",
  status: "active" as const,
  createdAt: "2025-01-01T00:00:00",
  updatedAt: "2026-02-25T00:00:00",
};

export const mockToken = "mock-jwt-token-nutriai-2026";

// ---------------------------------------------------------------------------
// Additional mock data: Live Tracking
// ---------------------------------------------------------------------------

export const mockLiveTrackingData = [
  {
    patientId: "pat-001",
    patientName: "Ayse Yilmaz",
    avatar: "",
    currentCalories: 1120,
    targetCalories: 1500,
    mealsLogged: 3,
    totalMealsExpected: 4,
    lastActivity: "Ogle yemegi kaydetti",
    lastActivityAt: new Date(Date.now() - 3600000).toISOString(),
    waterIntake: 1.5,
    waterTarget: 2.5,
    isOnline: true,
  },
  {
    patientId: "pat-002",
    patientName: "Mehmet Kaya",
    avatar: "",
    currentCalories: 980,
    targetCalories: 1600,
    mealsLogged: 2,
    totalMealsExpected: 4,
    lastActivity: "Kahvalti kaydetti",
    lastActivityAt: new Date(Date.now() - 7200000).toISOString(),
    waterIntake: 0.8,
    waterTarget: 2.0,
    isOnline: true,
  },
  {
    patientId: "pat-003",
    patientName: "Fatma Demir",
    avatar: "",
    currentCalories: 1350,
    targetCalories: 1400,
    mealsLogged: 3,
    totalMealsExpected: 4,
    lastActivity: "Ara ogun kaydetti",
    lastActivityAt: new Date(Date.now() - 1800000).toISOString(),
    waterIntake: 2.0,
    waterTarget: 2.5,
    isOnline: true,
  },
  {
    patientId: "pat-004",
    patientName: "Ali Ozturk",
    avatar: "",
    currentCalories: 600,
    targetCalories: 1800,
    mealsLogged: 1,
    totalMealsExpected: 4,
    lastActivity: "Kahvalti kaydetti",
    lastActivityAt: new Date(Date.now() - 14400000).toISOString(),
    waterIntake: 0.4,
    waterTarget: 2.5,
    isOnline: false,
  },
  {
    patientId: "pat-006",
    patientName: "Emre Arslan",
    avatar: "",
    currentCalories: 1850,
    targetCalories: 2500,
    mealsLogged: 3,
    totalMealsExpected: 5,
    lastActivity: "Antrenman sonrasi ogun kaydetti",
    lastActivityAt: new Date(Date.now() - 5400000).toISOString(),
    waterIntake: 2.8,
    waterTarget: 3.5,
    isOnline: true,
  },
  {
    patientId: "pat-008",
    patientName: "Hasan Sahin",
    avatar: "",
    currentCalories: 1150,
    targetCalories: 1500,
    mealsLogged: 3,
    totalMealsExpected: 4,
    lastActivity: "Ogle yemegi kaydetti",
    lastActivityAt: new Date(Date.now() - 10800000).toISOString(),
    waterIntake: 1.8,
    waterTarget: 2.5,
    isOnline: false,
  },
];

// ---------------------------------------------------------------------------
// Additional mock data: AI Suggestions
// ---------------------------------------------------------------------------

export const mockAiSuggestions = [
  {
    id: "ai-sug-001",
    type: "meal_suggestion" as const,
    patientId: "pat-001",
    title: "Protein takviyesi onerisi",
    content: "Ayse Yilmaz'in son 3 gunluk protein alimi hedefin %15 altinda. Kahvaltiya yumurta veya lor peyniri eklenmesi onerilir.",
    confidence: 0.92,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    status: "pending" as const,
  },
  {
    id: "ai-sug-002",
    type: "plan_adjustment" as const,
    patientId: "pat-002",
    title: "Karbonhidrat ayarlamasi",
    content: "Mehmet Kaya'nin kan sekeri degerleri yuksek seyrediyor. Aksam yemegindeki karbonhidrat miktarinin %20 azaltilmasi onerilir.",
    confidence: 0.88,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    status: "pending" as const,
  },
  {
    id: "ai-sug-003",
    type: "health_alert" as const,
    patientId: "pat-007",
    title: "Inaktif hasta uyarisi",
    content: "Elif Koc 30 gundur sisteme giris yapmadi. Iletisime gecilmesi onerilir.",
    confidence: 0.95,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: "pending" as const,
  },
  {
    id: "ai-sug-004",
    type: "general" as const,
    patientId: "pat-006",
    title: "Performans artisi",
    content: "Emre Arslan'in kas kutlesi artisi ve protein uyumu mukemmel seviyede. Mevcut plan devam ettirilmeli.",
    confidence: 0.90,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    status: "accepted" as const,
  },
  {
    id: "ai-sug-005",
    type: "meal_suggestion" as const,
    patientId: "pat-008",
    title: "Lif alimi arttirilmali",
    content: "Hasan Sahin'in gunluk lif alimi 15g civarinda. Hedef 25g icin sebze ve tam tahil tuketimi arttirilmali.",
    confidence: 0.85,
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    status: "pending" as const,
  },
];
