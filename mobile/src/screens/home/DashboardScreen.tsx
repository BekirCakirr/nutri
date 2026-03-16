import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, Animated } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { HomeStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { SectionHeader } from '../../components/common/SectionHeader'
import { CalorieRing } from '../../components/nutrition/CalorieRing'
import { MacroBar } from '../../components/nutrition/MacroBar'
import { MealCard } from '../../components/nutrition/MealCard'
import { WaterTracker } from '../../components/tracking/WaterTracker'
import { DailyGoalCard } from '../../components/gamification/DailyGoalCard'
import { StreakCounter } from '../../components/tracking/StreakCounter'
import { XPBar } from '../../components/gamification/XPBar'
import { DietitianCard } from '../../components/dietitian/DietitianCard'
import { NotificationBadge } from '../../components/notifications/NotificationBadge'
import { mockMeals } from '../../mock/meals'
import { mockDietitian } from '../../mock/dietitian'
import { mockGamificationData } from '../../mock/gamification'
import { colors, nutritionColors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { shadows } from '../../theme/shadows'
import { AnimatedPressable } from '../../components/ui/AnimatedPressable'
import { useFadeIn } from '../../components/ui/useFadeIn'
import { useStaggeredList } from '../../components/ui/useStaggeredList'

type Nav = StackNavigationProp<HomeStackParamList, 'Dashboard'>

const todayMeals = mockMeals.filter((m) => m.date === '2026-02-25')
const totalConsumed = todayMeals.reduce((s, m) => s + m.totalNutrition.calories, 0)
const totalProtein = todayMeals.reduce((s, m) => s + m.totalNutrition.protein, 0)
const totalCarbs = todayMeals.reduce((s, m) => s + m.totalNutrition.carbs, 0)
const totalFat = todayMeals.reduce((s, m) => s + m.totalNutrition.fat, 0)

const dailyGoals = [
  { id: 'cal', label: 'Kalori', current: totalConsumed, target: 1650, unit: 'kcal', color: colors.primary.main },
  { id: 'water', label: 'Su', current: 6, target: 10, unit: 'bardak', color: nutritionColors.water.main },
  { id: 'protein', label: 'Protein', current: Math.round(totalProtein), target: 82, unit: 'g', color: nutritionColors.macro.protein },
  { id: 'exercise', label: 'Egzersiz', current: 35, target: 45, unit: 'dk', color: '#F59E0B' },
]

const mealTypeMap: Record<string, 'breakfast' | 'lunch' | 'dinner' | 'snack'> = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  snack: 'snack',
  dinner: 'dinner',
}

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>()
  const [waterGlasses, setWaterGlasses] = useState(6)
  const heroFadeIn = useFadeIn(0)
  const mealAnimStyles = useStaggeredList(todayMeals.length, 200)

  return (
    <ScreenWrapper contentStyle={{ paddingBottom: 100 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../../assets/logo-icon.png')}
            style={styles.headerLogo}
          />
          <View>
            <Text style={styles.greeting}>Merhaba,</Text>
            <Text style={styles.name}>Ayşe</Text>
          </View>
        </View>
        <AnimatedPressable
          onPress={() => navigation.navigate('Notifications')}
          style={styles.notifButton}
        >
          <Ionicons name="notifications-outline" size={22} color={colors.text.primary} />
          <NotificationBadge count={2} size="sm" />
        </AnimatedPressable>
      </View>

      {/* Hero: Calorie Ring + Macros */}
      <Animated.View style={[styles.heroCard, heroFadeIn.style]}>
        <CalorieRing consumed={totalConsumed} target={1650} size={160} strokeWidth={14} />
        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <View style={[styles.macroDot, { backgroundColor: nutritionColors.macro.protein }]} />
            <Text style={styles.macroValue}>{Math.round(totalProtein)}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={[styles.macroDot, { backgroundColor: nutritionColors.macro.carbs }]} />
            <Text style={styles.macroValue}>{Math.round(totalCarbs)}g</Text>
            <Text style={styles.macroLabel}>Karb.</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={[styles.macroDot, { backgroundColor: nutritionColors.macro.fat }]} />
            <Text style={styles.macroValue}>{Math.round(totalFat)}g</Text>
            <Text style={styles.macroLabel}>Yağ</Text>
          </View>
        </View>
        <MacroBar
          protein={totalProtein}
          carbs={totalCarbs}
          fat={totalFat}
          showLabels={false}
          height={6}
          style={{ width: '100%', marginTop: spacing.sm }}
        />
      </Animated.View>

      {/* Streak + XP Row */}
      <View style={styles.gamificationRow}>
        <View style={styles.gamificationItem}>
          <StreakCounter count={mockGamificationData.streak} bestStreak={14} />
        </View>
        <View style={styles.gamificationItem}>
          <XPBar
            level={mockGamificationData.level}
            currentXP={mockGamificationData.xp}
            maxXP={mockGamificationData.xpToNextLevel}
          />
        </View>
      </View>

      {/* Daily Goals */}
      <DailyGoalCard goals={dailyGoals} style={{ marginBottom: spacing.lg }} />

      {/* Today's Meals */}
      <SectionHeader title="Bugünün Öğünleri" />
      <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
        {todayMeals.map((meal, index) => (
          <Animated.View key={meal.id} style={mealAnimStyles[index]}>
            <MealCard
              mealType={mealTypeMap[meal.type] || 'snack'}
              time={meal.time}
              totalCalories={meal.totalNutrition.calories}
              foods={meal.items.map((i) => ({
                name: i.food.name,
                calories: Math.round(i.food.nutrition.calories * i.quantity),
              }))}
            />
          </Animated.View>
        ))}
      </View>

      {/* Water Tracker */}
      <WaterTracker
        currentGlasses={waterGlasses}
        targetGlasses={10}
        onAddGlass={() => setWaterGlasses((p) => Math.min(p + 1, 15))}
        onRemoveGlass={() => setWaterGlasses((p) => Math.max(p - 1, 0))}
        style={{ marginBottom: spacing.lg }}
      />

      {/* Dietitian Card */}
      <SectionHeader title="Diyetisyeniniz" />
      <DietitianCard
        name={mockDietitian.name}
        specialty={mockDietitian.title}
        avatar={mockDietitian.avatar}
        rating={mockDietitian.rating}
        reviewCount={mockDietitian.reviewCount}
        isAvailable={mockDietitian.available}
        style={{ marginBottom: spacing.lg }}
      />

      {/* Quick Reports */}
      <SectionHeader title="Raporlar" />
      <View style={styles.reportRow}>
        <AnimatedPressable
          style={styles.reportCard}
          onPress={() => navigation.navigate('WeeklyReport')}
        >
          <View style={[styles.reportIconWrap, { backgroundColor: colors.primary[50] }]}>
            <Ionicons name="bar-chart-outline" size={20} color={colors.primary.main} />
          </View>
          <View>
            <Text style={styles.reportLabel}>Haftalık</Text>
            <Text style={styles.reportSub}>7 günlük özet</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.text.disabled} />
        </AnimatedPressable>
        <AnimatedPressable
          style={styles.reportCard}
          onPress={() => navigation.navigate('MonthlyReport')}
        >
          <View style={[styles.reportIconWrap, { backgroundColor: colors.secondary[50] }]}>
            <Ionicons name="trending-up-outline" size={20} color={colors.secondary[700]} />
          </View>
          <View>
            <Text style={styles.reportLabel}>Aylık</Text>
            <Text style={styles.reportSub}>Trend analizi</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.text.disabled} />
        </AnimatedPressable>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  greeting: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    fontWeight: fontWeights.medium,
  },
  name: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  notifButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.background.paper,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Hero calorie section
  heroCard: {
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.primary[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: spacing.lg,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  macroLabel: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    marginTop: 1,
  },

  // Gamification
  gamificationRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  gamificationItem: {
    flex: 1,
  },

  // Reports
  reportRow: {
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.sm,
  },
  reportIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportLabel: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  reportSub: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    marginTop: 1,
  },
})
