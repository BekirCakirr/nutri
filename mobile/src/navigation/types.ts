import type { NavigatorScreenParams } from '@react-navigation/native'

// ─── Root Stack ──────────────────────────────────────────────────────
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>
  Main: NavigatorScreenParams<MainTabParamList>
  // Modal screens
  DietitianProfile: { dietitianId: string }
  BookAppointment: { dietitianId?: string }
  VideoCall: { appointmentId: string }
  AIChat: undefined
  Badges: undefined
  Challenges: undefined
  Leaderboard: undefined
  RecipeDetail: { recipeId: string }
  ShoppingListDetail: { listId: string }
  AllergenScanner: undefined
}

// ─── Auth Stack ──────────────────────────────────────────────────────
export type AuthStackParamList = {
  Welcome: undefined
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  EmailVerification: undefined
}

// ─── Onboarding Stack ────────────────────────────────────────────────
export type OnboardingStackParamList = {
  BasicInfo: undefined
  Goal: undefined
  Allergy: undefined
  DietPreference: undefined
  Lifestyle: undefined
  DietitianCode: undefined
  CalculationResult: undefined
}

// ─── Main Tab Navigator ──────────────────────────────────────────────
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>
  MealsTab: NavigatorScreenParams<MealsStackParamList>
  CameraTab: NavigatorScreenParams<CameraStackParamList>
  ProgressTab: NavigatorScreenParams<ProgressStackParamList>
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>
}

// ─── Home Stack ──────────────────────────────────────────────────────
export type HomeStackParamList = {
  Dashboard: undefined
  Notifications: undefined
  WeeklyReport: undefined
  MonthlyReport: undefined
}

// ─── Meals Stack ─────────────────────────────────────────────────────
export type MealsStackParamList = {
  MealLog: undefined
  AddMeal: undefined
  FoodSearch: undefined
  FoodDetail: { foodId: string }
  MealDetail: { mealId: string }
  MealPlanView: undefined
  MealPlanDayDetail: { date: string }
  RecentFoods: undefined
  Favorites: undefined
  CustomFood: undefined
}

// ─── Camera Stack ────────────────────────────────────────────────────
export type CameraStackParamList = {
  CameraCapture: undefined
  PhotoAnalysis: { photoUri: string }
  AdjustPortions: { analysisId: string }
  Barcode: undefined
  OCR: undefined
  Voice: undefined
  TextInput: undefined
  MenuScan: undefined
}

// ─── Progress Stack ──────────────────────────────────────────────────
export type ProgressStackParamList = {
  Overview: undefined
  Weight: undefined
  Water: undefined
  Exercise: undefined
  Sleep: undefined
  Mood: undefined
  BloodValues: undefined
  Vitamins: undefined
  ProgressPhotos: undefined
  IntermittentFasting: undefined
  CustomGoals: undefined
  Measurements: undefined
  NutrientBreakdown: undefined
  CalorieHistory: undefined
  MacroTracking: undefined
  Steps: undefined
  HeartRate: undefined
  Stress: undefined
}

// ─── Profile Stack ───────────────────────────────────────────────────
export type ProfileStackParamList = {
  Profile: undefined
  EditProfile: undefined
  Settings: undefined
  AllergyManagement: undefined
  FamilyMode: undefined
  DataExport: undefined
  Language: undefined
  NotificationSettings: undefined
  About: undefined
  PrivacyPolicy: undefined
  TermsOfService: undefined
  Subscription: undefined
  ConnectedDevices: undefined
  HelpSupport: undefined
  Achievements: undefined
  DietitianConnection: undefined
  Goals: undefined
  PersonalData: undefined
  Reminders: undefined
  Theme: undefined
}

// ─── Navigation prop helpers ─────────────────────────────────────────
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
