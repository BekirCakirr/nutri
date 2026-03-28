import React, { useEffect } from 'react'
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
import { useMeals, useTracking, useDietitian, useGamification } from '../../hooks'
import { colors, nutritionColors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { shadows } from '../../theme/shadows'
import { AnimatedPressable } from '../../components/ui/AnimatedPressable'
import { useFadeIn } from '../../components/ui/useFadeIn'
import { useStaggeredList } from '../../components/ui/useStaggeredList'

type Nav = StackNavigationProp<HomeStackParamList, 'Dashboard'>


const mealTypeMap: Record<string, 'breakfast' | 'lunch' | 'dinner' | 'snack'> = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  snack: 'snack',
  dinner: 'dinner',
}

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>()
  const heroFadeIn = useFadeIn(0)
  
  const { todayMeals, fetchTodayMeals } = useMeals()
  const { todayCalories, todayMacros, waterGlasses, addWater, waterTarget, loadToday, exerciseMinutes } = useTracking()
  const { pairedDietitian, loadPairedDietitian } = useDietitian()
  const { xp, xpToNextLevel, level, streak, loadAll } = useGamification()

  useEffect(() => {
    fetchTodayMeals()
    loadToday()
    loadPairedDietitian()
    loadAll()
  }, [fetchTodayMeals, loadToday, loadPairedDietitian, loadAll])

  const mealAnimStyles = useStaggeredList(todayMeals?.length || 0, 200)

  const dailyGoals = [
    { id: 'cal', label: 'Kalori', current: todayCalories || 0, target: 1650, unit: 'kcal', color: colors.primary.main },
    { id: 'water', label: 'Su', current: waterGlasses || 0, target: waterTarget || 10, unit: 'bardak', color: nutritionColors.water.main },
    { id: 'protein', label: 'Protein', current: Math.round(todayMacros?.protein || 0), target: 82, unit: 'g', color: nutritionColors.macro.protein },
    { id: 'exercise', label: 'Egzersiz', current: exerciseMinutes || 0, target: 45, unit: 'dk', color: '#F59E0B' },
  ]

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
        <CalorieRing consumed={todayCalories || 0} target={1650} size={160} strokeWidth={14} />
        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <View style={[styles.macroDot, { backgroundColor: nutritionColors.macro.protein }]} />
            <Text style={styles.macroValue}>{Math.round(todayMacros?.protein || 0)}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={[styles.macroDot, { backgroundColor: nutritionColors.macro.carbs }]} />
            <Text style={styles.macroValue}>{Math.round(todayMacros?.carbs || 0)}g</Text>
            <Text style={styles.macroLabel}>Karb.</Text>
          </View>
          <View style={styles.macroItem}>
            <View style={[styles.macroDot, { backgroundColor: nutritionColors.macro.fat }]} />
            <Text style={styles.macroValue}>{Math.round(todayMacros?.fat || 0)}g</Text>
            <Text style={styles.macroLabel}>Yağ</Text>
          </View>
        </View>
        <MacroBar
          protein={todayMacros?.protein || 0}
          carbs={todayMacros?.carbs || 0}
          fat={todayMacros?.fat || 0}
          showLabels={false}
          height={6}
          style={{ width: '100%', marginTop: spacing.sm }}
        />
      </Animated.View>

      {/* Streak + XP Row */}
      <View style={styles.gamificationRow}>
        <View style={styles.gamificationItem}>
          <StreakCounter count={streak || 0} bestStreak={14} />
        </View>
        <View style={styles.gamificationItem}>
          <XPBar
            level={level || 1}
            currentXP={xp || 0}
            maxXP={xpToNextLevel || 100}
          />
        </View>
      </View>

      {/* Daily Goals */}
      <DailyGoalCard goals={dailyGoals} style={{ marginBottom: spacing.lg }} />

      {/* Today's Meals */}
      <SectionHeader title="Bugünün Öğünleri" />
      <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
        {todayMeals?.length > 0 ? (
          todayMeals.map((meal, index) => (
            <Animated.View key={meal.id} style={mealAnimStyles?.[index]}>
              <MealCard
                mealType={mealTypeMap[meal.type] || 'snack'}
                time={meal.time || ''}
                totalCalories={meal.totalNutrition?.calories || 0}
                foods={(meal.items || []).map((i) => ({
                  name: i.food?.name || 'Bilinmeyen',
                  calories: Math.round((i.food?.nutrition?.calories || 0) * (i.quantity || 1)),
                }))}
              />
            </Animated.View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', color: colors.text.disabled, marginVertical: spacing.md }}>
            Henüz öğün eklenmedi
          </Text>
        )}
      </View>

      {/* Water Tracker */}
      <WaterTracker
        currentGlasses={waterGlasses || 0}
        targetGlasses={waterTarget || 10}
        onAddGlass={() => addWater(200)}
        onRemoveGlass={() => {}} // Feature not supported natively
        style={{ marginBottom: spacing.lg }}
      />

      {/* Dietitian Card */}
      <SectionHeader title="Diyetisyeniniz" />
      {pairedDietitian ? (
        <DietitianCard
          name={pairedDietitian.name || 'Diyetisyen'}
          specialty={pairedDietitian.title || 'Uzman'}
          avatar={pairedDietitian.avatar}
          rating={pairedDietitian.rating || 5.0}
          reviewCount={pairedDietitian.reviewCount || 0}
          isAvailable={pairedDietitian.available || false}
          style={{ marginBottom: spacing.lg }}
        />
      ) : (
        <Text style={{ textAlign: 'center', color: colors.text.disabled, marginVertical: spacing.md, marginBottom: spacing.lg }}>
          Henüz bir diyetisyenle eşleşmediniz.
        </Text>
      )}

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
