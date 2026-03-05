import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface DailyGoal {
  id: string
  label: string
  current: number
  target: number
  unit: string
  color: string
}

interface DailyGoalCardProps {
  goals: DailyGoal[]
  style?: ViewStyle
}

export const DailyGoalCard: React.FC<DailyGoalCardProps> = ({
  goals,
  style,
}) => {
  const completed = goals.filter((g) => g.current >= g.target).length

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="flag" size={16} color={colors.primary.main} />
          </View>
          <Text style={styles.title}>Gunluk Hedefler</Text>
        </View>
        <View style={styles.counterBadge}>
          <Text style={styles.counter}>
            {completed}/{goals.length}
          </Text>
        </View>
      </View>
      {goals.map((goal) => {
        const progress = Math.min(goal.current / goal.target, 1)
        const isComplete = progress >= 1
        return (
          <View key={goal.id} style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <View style={styles.goalLabelRow}>
                {isComplete && (
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} style={{ marginRight: 4 }} />
                )}
                <Text style={styles.goalLabel}>{goal.label}</Text>
              </View>
              <Text style={[styles.goalValue, isComplete && { color: colors.success }]}>
                {goal.current}/{goal.target} {goal.unit}
              </Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: isComplete ? colors.success : goal.color,
                  },
                ]}
              />
            </View>
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  counterBadge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  counter: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.primary.main,
  },
  goalItem: {
    marginBottom: spacing.sm,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  goalLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalLabel: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
  },
  goalValue: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
  },
  barTrack: {
    height: 6,
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
})
