import React, { useEffect, useMemo } from 'react'
import { View, Text, StyleSheet, Image, Animated, ScrollView } from 'react-native'
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
import { useAuthStore } from '../../stores/authStore'
import { DEFAULT_CALORIE_TARGET } from '../../lib/constants'
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
  const user = useAuthStore((s) => s.user)
  
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

  // Extract user profile data (handles both flat and nested profile from backend)
  const userProfile = useMemo(() => {
    const p = user?.profile
    const displayName = p?.first_name || user?.firstName || user?.first_name || user?.name?.split(' ')[0] || 'Kullanıcı'
    const calorieTarget = Number(p?.daily_calorie_target || user?.daily_calorie_target) || DEFAULT_CALORIE_TARGET
    const proteinTarget = Number(p?.protein_target_g || user?.protein_target_g) || 100
    const carbTarget = Number(p?.carb_target_g || user?.carb_target_g) || 250
    const fatTarget = Number(p?.fat_target_g || user?.fat_target_g) || 65
    const userWaterTarget = Number(p?.daily_water_target || user?.daily_water_target) || 8
    return { displayName, calorieTarget, proteinTarget, carbTarget, fatTarget, waterTarget: userWaterTarget }
  }, [user])

  const dailyGoals = [
    { id: 'cal', label: 'Kalori', current: todayCalories || 0, target: userProfile.calorieTarget, unit: 'kcal', color: colors.primary.main },
    { id: 'water', label: 'Su', current: waterGlasses || 0, target: waterTarget || userProfile.waterTarget, unit: 'brdk', color: nutritionColors.water.main },
    { id: 'protein', label: 'Protein', current: Math.round(todayMacros?.protein || 0), target: userProfile.proteinTarget, unit: 'g', color: nutritionColors.macro.protein },
    { id: 'exercise', label: 'Egzersiz', current: exerciseMinutes || 0, target: 45, unit: 'dk', color: '#F59E0B' },
  ]

  return (
    <ScreenWrapper contentStyle={{ paddingBottom: 120, backgroundColor: '#F8F9FA' }}>
      {/* Premium Gradient Glow Simulation */}
      <View style={styles.glowTopRight} />
      <View style={styles.glowTopLeft} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require('../../../assets/logo-icon.png')}
              style={styles.headerLogo}
            />
          </View>
          <View>
            <Text style={styles.greeting}>Günaydın,</Text>
            <Text style={styles.name}>{userProfile.displayName}</Text>
          </View>
        </View>
        <AnimatedPressable
          onPress={() => navigation.navigate('Notifications')}
          style={styles.notifButton}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.text.primary} />
          <NotificationBadge count={2} size="sm" style={styles.badgePos} />
        </AnimatedPressable>
      </View>

      {/* Hero: Calorie Ring + Macros (Modern Premium Card) */}
      <Animated.View style={[styles.heroCard, heroFadeIn.style]}>
        <View style={styles.heroHeader}>
          <Text style={styles.heroTitle}>Günlük Özet</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text.disabled} />
        </View>

        <View style={styles.ringContainer}>
          <CalorieRing consumed={todayCalories || 0} target={userProfile.calorieTarget} size={180} strokeWidth={16} />
        </View>

        <View style={styles.macroCard}>
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <View style={[styles.macroIconWrap, { backgroundColor: `${nutritionColors.macro.protein}15` }]}>
                <Ionicons name="fitness" size={18} color={nutritionColors.macro.protein} />
              </View>
              <Text style={styles.macroValue}>{Math.round(todayMacros?.protein || 0)}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroDivider} />
            <View style={styles.macroItem}>
              <View style={[styles.macroIconWrap, { backgroundColor: `${nutritionColors.macro.carbs}15` }]}>
                <Ionicons name="leaf" size={18} color={nutritionColors.macro.carbs} />
              </View>
              <Text style={styles.macroValue}>{Math.round(todayMacros?.carbs || 0)}g</Text>
              <Text style={styles.macroLabel}>Karb.</Text>
            </View>
            <View style={styles.macroDivider} />
            <View style={styles.macroItem}>
              <View style={[styles.macroIconWrap, { backgroundColor: `${nutritionColors.macro.fat}15` }]}>
                <Ionicons name="water" size={18} color={nutritionColors.macro.fat} />
              </View>
              <Text style={styles.macroValue}>{Math.round(todayMacros?.fat || 0)}g</Text>
              <Text style={styles.macroLabel}>Yağ</Text>
            </View>
          </View>
          <MacroBar
            protein={todayMacros?.protein || 0}
            carbs={todayMacros?.carbs || 0}
            fat={todayMacros?.fat || 0}
            showLabels={false}
            height={8}
            style={{ width: '100%', marginTop: spacing.md, borderRadius: 4 }}
          />
        </View>
      </Animated.View>

      {/* Streak + XP Row (Premium Gamification) */}
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

      {/* Daily Goals Scroll */}
      <SectionHeader title="Hedeflerim" style={styles.sectionMargin} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.goalsScroll}>
        {dailyGoals.map(goal => (
          <View key={goal.id} style={styles.miniGoalCard}>
            <View style={[styles.goalIconWrap, { backgroundColor: `${goal.color}15` }]}>
              <Ionicons 
                name={goal.id === 'cal' ? 'flame' : goal.id === 'water' ? 'water' : goal.id === 'protein' ? 'barbell' : 'walk'} 
                size={20} 
                color={goal.color} 
              />
            </View>
            <Text style={styles.goalLabel}>{goal.label}</Text>
            <Text style={styles.goalData}>
              {goal.current} <Text style={styles.goalUnit}>/ {goal.target}</Text>
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Today's Meals */}
      <SectionHeader title="Bugünün Öğünleri" style={styles.sectionMargin} />
      <View style={{ gap: spacing.md, marginBottom: spacing.xl }}>
        {todayMeals && todayMeals.length > 0 ? (
          todayMeals.map((meal, index) => (
            <Animated.View key={meal.id} style={mealAnimStyles?.[index]}>
              <View style={styles.mealCardShadow}>
                <MealCard
                  mealType={mealTypeMap[meal.type] || 'snack'}
                  time={meal.time || ''}
                  totalCalories={meal.totalNutrition?.calories || 0}
                  foods={(meal.items || []).map((i) => ({
                    name: i.food?.name || 'Bilinmeyen',
                    calories: Math.round((i.food?.nutrition?.calories || 0) * (i.quantity || 1)),
                  }))}
                />
              </View>
            </Animated.View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="restaurant-outline" size={40} color={colors.text.disabled} />
            <Text style={styles.emptyText}>Henüz öğün eklenmedi</Text>
            <AnimatedPressable style={styles.emptyBtn}>
              <Text style={styles.emptyBtnText}>+ Öğün Ekle</Text>
            </AnimatedPressable>
          </View>
        )}
      </View>

      {/* Water Tracker */}
      <View style={styles.waterWrapper}>
        <WaterTracker
          currentGlasses={waterGlasses || 0}
          targetGlasses={waterTarget || 10}
          onAddGlass={() => addWater(200)}
          onRemoveGlass={() => {}}
        />
      </View>

      {/* Quick Reports */}
      <SectionHeader title="Analiz ve Raporlar" style={styles.sectionMargin} />
      <View style={styles.reportRow}>
        <AnimatedPressable
          style={styles.newReportCard}
          onPress={() => navigation.navigate('WeeklyReport')}
        >
          <View style={[styles.newReportIconWrap, { backgroundColor: colors.primary[50], borderColor: colors.primary[100], borderWidth: 1 }]}>
            <Ionicons name="stats-chart" size={24} color={colors.primary.main} />
          </View>
          <View style={styles.reportTextWrap}>
            <Text style={styles.reportLabel}>Haftalık Analiz</Text>
            <Text style={styles.reportSub}>Son 7 günlük durumu incele</Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={24} color={colors.primary.main} style={{ opacity: 0.8 }} />
        </AnimatedPressable>

        <AnimatedPressable
          style={styles.newReportCard}
          onPress={() => navigation.navigate('MonthlyReport')}
        >
          <View style={[styles.newReportIconWrap, { backgroundColor: colors.secondary[50], borderColor: colors.secondary[100], borderWidth: 1 }]}>
            <Ionicons name="calendar" size={24} color={colors.secondary[700]} />
          </View>
          <View style={styles.reportTextWrap}>
            <Text style={styles.reportLabel}>Aylık Analiz</Text>
            <Text style={styles.reportSub}>Uzun vadeli trendleri gör</Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={24} color={colors.secondary[700]} style={{ opacity: 0.8 }} />
        </AnimatedPressable>
      </View>

      {/* Messages Quick Access */}
      <SectionHeader title="Mesajlaşma" style={styles.sectionMargin} />
      <AnimatedPressable
        style={styles.newReportCard}
        onPress={() => navigation.navigate('ConversationList')}
      >
        <View style={[styles.newReportIconWrap, { backgroundColor: '#EDE9FE', borderColor: '#DDD6FE', borderWidth: 1 }]}>
          <Ionicons name="chatbubbles" size={24} color="#7C3AED" />
        </View>
        <View style={styles.reportTextWrap}>
          <Text style={styles.reportLabel}>Diyetisyeninize Yazın</Text>
          <Text style={styles.reportSub}>Mesajlarınızı görüntüleyin</Text>
        </View>
        <Ionicons name="arrow-forward-circle" size={24} color="#7C3AED" style={{ opacity: 0.8 }} />
      </AnimatedPressable>

      {/* Dietitian Card */}
      <SectionHeader title="Uzman Diyetisyeniniz" style={styles.sectionMargin} />
      {pairedDietitian ? (
        <View style={styles.dietitianShadow}>
          <DietitianCard
            name={pairedDietitian.name || 'Diyetisyen'}
            specialty={pairedDietitian.title || 'Uzman'}
            avatar={pairedDietitian.avatar}
            rating={pairedDietitian.rating || 5.0}
            reviewCount={pairedDietitian.reviewCount || 0}
            isAvailable={pairedDietitian.available || false}
          />
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Henüz bir diyetisyenle eşleşmediniz.</Text>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  glowTopRight: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary[100],
    opacity: 0.5,
    transform: [{ scale: 2 }],
  },
  glowTopLeft: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FDE68A', // soft yellow
    opacity: 0.3,
    transform: [{ scale: 2 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrapper: {
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  headerLogo: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
  },
  greeting: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    fontWeight: fontWeights.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    lineHeight: 32,
  },
  notifButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF90', // glassmorphic
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  badgePos: {
    position: 'absolute',
    top: 10,
    right: 12,
  },
  // Hero section
  heroCard: {
    backgroundColor: colors.background.paper,
    borderRadius: 32,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    shadowColor: '#1F2937', // dark slate
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.lg,
    color: colors.text.primary,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  macroCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  macroIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  macroLabel: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    fontWeight: fontWeights.medium,
  },
  // gamification
  gamificationRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  gamificationItem: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionMargin: {
    marginBottom: spacing.md,
  },
  goalsScroll: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: 2,
  },
  miniGoalCard: {
    backgroundColor: colors.background.paper,
    borderRadius: 20,
    padding: spacing.md,
    width: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  goalIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  goalLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
  },
  goalData: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginTop: 2,
  },
  goalUnit: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    color: colors.text.disabled,
  },
  mealCardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  emptyCard: {
    backgroundColor: colors.background.paper,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyBtn: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 100,
  },
  emptyBtnText: {
    color: '#FFF',
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.sm,
  },
  waterWrapper: {
    marginBottom: spacing.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  reportRow: {
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  newReportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderRadius: 24,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  newReportIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  reportTextWrap: {
    flex: 1,
  },
  reportLabel: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  reportSub: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    color: colors.text.secondary,
    marginTop: 2,
  },
  dietitianShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
})

