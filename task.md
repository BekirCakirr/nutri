# NutriAI Mobile Düzeltme — Görev Takibi

## Faz 0: NativeWind Kaldırma
- [x] package.json'dan nativewind + tailwindcss kaldır
- [x] tailwind.config.js, global.css, nativewind-env.d.ts sil
- [x] App.tsx'den global.css import kaldır

## Faz 1: Auth + Onboarding (7+6 dosya)
- [x] WelcomeScreen.tsx
- [x] LoginScreen.tsx
- [x] RegisterScreen.tsx
- [x] ForgotPasswordScreen.tsx
- [x] EmailVerificationScreen.tsx
- [x] BasicInfoScreen.tsx
- [x] GoalScreen.tsx
- [x] AllergyScreen.tsx
- [x] DietPreferenceScreen.tsx
- [x] LifestyleScreen.tsx
- [x] DietitianCodeScreen.tsx
- [x] CalculationResultScreen.tsx
- [x] StepIndicator + OnboardingStep components

## Faz 2: Ana Tab Ekranları (~14 dosya)
- [x] OverviewScreen.tsx (Progress)
- [x] ProfileScreen.tsx
- [x] NotificationsScreen.tsx (home)
- [x] WeeklyReportScreen.tsx (home)
- [x] MonthlyReportScreen.tsx (home)
- [x] AddMealScreen.tsx
- [x] FoodSearchScreen.tsx
- [x] MealDetailScreen.tsx
- [x] FoodDetailScreen.tsx
- [x] MealPlanViewScreen.tsx
- [x] MealPlanDayDetailScreen.tsx
- [x] CustomFoodScreen.tsx
- [x] FavoritesScreen.tsx
- [x] RecentFoodsScreen.tsx

## Faz 3: Profile Alt Ekranları (20 dosya)
- [x] EditProfileScreen → SettingsScreen → GoalsScreen → ...tümü

## Faz 4: Progress Ekranları (17 dosya) 
- [x] Weight → Water → CalorieHistory → ...tümü

## Faz 5: Modals + Camera + Bildirimler (13+ dosya)
- [x] AIChat → DietitianProfile → BookAppointment → ...tümü
- [x] Camera placeholder'ları iyileştir

## Faz 6: Eksik API + Backend Bağlantıları
- [ ] Mock temizliği (meal.ts, food.ts import kalıntıları)
- [ ] Kamera placeholder ekranları (Barcode, MenuScan, OCR, Voice) iyileştir
- [ ] Backend E2E test
