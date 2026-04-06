# NutriAI Mobile Düzeltme — Görev Takibi

## Faz 0: NativeWind Kaldırma
- [ ] package.json'dan nativewind + tailwindcss kaldır
- [ ] tailwind.config.js, global.css, nativewind-env.d.ts sil
- [ ] App.tsx'den global.css import kaldır

## Faz 1: Auth + Onboarding (7+6 dosya)
- [ ] WelcomeScreen.tsx
- [ ] LoginScreen.tsx
- [ ] RegisterScreen.tsx
- [ ] ForgotPasswordScreen.tsx
- [ ] EmailVerificationScreen.tsx
- [ ] BasicInfoScreen.tsx
- [ ] GoalScreen.tsx
- [ ] AllergyScreen.tsx
- [ ] DietPreferenceScreen.tsx
- [ ] LifestyleScreen.tsx
- [ ] DietitianCodeScreen.tsx
- [ ] CalculationResultScreen.tsx
- [ ] StepIndicator + OnboardingStep components

## Faz 2: Ana Tab Ekranları (~14 dosya)
- [ ] OverviewScreen.tsx (Progress)
- [ ] ProfileScreen.tsx
- [ ] NotificationsScreen.tsx (home)
- [ ] WeeklyReportScreen.tsx (home)
- [ ] MonthlyReportScreen.tsx (home)
- [ ] AddMealScreen.tsx
- [ ] FoodSearchScreen.tsx
- [ ] MealDetailScreen.tsx
- [ ] FoodDetailScreen.tsx
- [ ] MealPlanViewScreen.tsx
- [ ] MealPlanDayDetailScreen.tsx
- [ ] CustomFoodScreen.tsx
- [ ] FavoritesScreen.tsx
- [ ] RecentFoodsScreen.tsx

## Faz 3: Profile Alt Ekranları (20 dosya)
- [ ] EditProfileScreen → SettingsScreen → GoalsScreen → ...tümü

## Faz 4: Progress Ekranları (17 dosya) 
- [ ] Weight → Water → CalorieHistory → ...tümü

## Faz 5: Modals + Camera + Bildirimler (13+ dosya)
- [ ] AIChat → DietitianProfile → BookAppointment → ...tümü
- [ ] Camera placeholder'ları iyileştir

## Faz 6: Eksik API + Backend Bağlantıları
- [ ] Mock temizliği (meal.ts, food.ts import kalıntıları)
- [ ] Kamera placeholder ekranları (Barcode, MenuScan, OCR, Voice) iyileştir
- [ ] Backend E2E test
