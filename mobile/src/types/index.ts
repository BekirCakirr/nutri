// ========================
// User & Auth
// ========================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  height?: number; // cm
  weight?: number; // kg
  targetWeight?: number;
  activityLevel?: ActivityLevel;
  goal?: Goal;
  createdAt: string;
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'lose' | 'maintain' | 'gain';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

// ========================
// Profile
// ========================

export interface Profile extends User {
  allergies: string[];
  preferences: DietaryPreference[];
  familyMembers: FamilyMember[];
}

export type DietaryPreference =
  | 'vegetarian'
  | 'vegan'
  | 'gluten_free'
  | 'lactose_free'
  | 'halal'
  | 'kosher'
  | 'pescatarian';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  birthDate?: string;
  allergies: string[];
}

// ========================
// Food & Nutrition
// ========================

export interface NutritionInfo {
  calories: number;
  protein: number; // g
  carbs: number;   // g
  fat: number;     // g
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface Food {
  id: string;
  name: string;
  brand?: string;
  category: FoodCategory;
  servingSize: number;
  servingUnit: string;
  nutrition: NutritionInfo;
  image?: string;
  barcode?: string;
}

export type FoodCategory =
  | 'fruit'
  | 'vegetable'
  | 'grain'
  | 'protein'
  | 'dairy'
  | 'fat'
  | 'snack'
  | 'beverage'
  | 'prepared'
  | 'other';

// ========================
// Meals
// ========================

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealItem {
  food: Food;
  quantity: number;
  unit: string;
}

export interface Meal {
  id: string;
  type: MealType;
  items: MealItem[];
  totalNutrition: NutritionInfo;
  date: string;
  time: string;
  image?: string;
  notes?: string;
}

// ========================
// Tracking
// ========================

export interface DailyTracking {
  date: string;
  waterIntake: number;   // ml
  calories: number;
  macros: NutritionInfo;
  weight?: number;
  exerciseMinutes: number;
  sleep?: number;        // hours
  mood?: MoodLevel;
  steps?: number;
}

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface WeightEntry {
  date: string;
  value: number;
}

export interface WaterEntry {
  date: string;
  value: number;
}

export interface ExerciseEntry {
  date: string;
  minutes: number;
  type: string;
  caloriesBurned?: number;
}

export interface SleepEntry {
  date: string;
  hours: number;
  quality?: MoodLevel;
}

export interface MoodEntry {
  date: string;
  level: MoodLevel;
  note?: string;
}

// ========================
// Plans
// ========================

export interface MealPlanItem {
  type: MealType;
  name: string;
  foods: Food[];
  nutrition: NutritionInfo;
}

export interface DayPlan {
  day: string;
  meals: MealPlanItem[];
  totalCalories: number;
}

export interface WeeklyPlan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: DayPlan[];
  createdBy?: string;
}

// ========================
// Dietitian
// ========================

export interface Dietitian {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  specializations: string[];
  rating: number;
  reviewCount: number;
  experience: number; // years
  hospital?: string;
  available: boolean;
}

// ========================
// Messages
// ========================

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

// ========================
// Notifications
// ========================

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

export type NotificationType =
  | 'meal_reminder'
  | 'water_reminder'
  | 'appointment'
  | 'message'
  | 'achievement'
  | 'plan_update'
  | 'system';

// ========================
// Appointments
// ========================

export interface Appointment {
  id: string;
  dietitianId: string;
  dietitianName: string;
  date: string;
  time: string;
  duration: number; // minutes
  type: 'online' | 'in_person';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

// ========================
// Gamification
// ========================

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  xpReward: number;
  startDate: string;
  endDate: string;
}

// ========================
// Recipes
// ========================

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image?: string;
  category: string;
  prepTime: number;  // minutes
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: RecipeIngredient[];
  instructions: string[];
  nutrition: NutritionInfo;
  tags: string[];
}

export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
}

// ========================
// Shopping
// ========================

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  category?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
}

// ========================
// AI
// ========================

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ========================
// Progress Photos
// ========================

export interface ProgressPhoto {
  id: string;
  uri: string;
  date: string;
  weight?: number;
  note?: string;
}
