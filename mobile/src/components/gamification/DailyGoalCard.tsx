import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
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
        <Text style={styles.title}>Daily Goals</Text>
        <Text style={styles.counter}>
          {completed}/{goals.length} Complete
        </Text>
      </View>
      {goals.map((goal) => {
        const progress = Math.min(goal.current / goal.target, 1)
        const isComplete = progress >= 1
        return (
          <View key={goal.id} style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalLabel}>{goal.label}</Text>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  counter: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.primary.main,
  },
  goalItem: {
    marginBottom: spacing.md,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  goalLabel: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
  },
  goalValue: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
  },
  barTrack: {
    height: 8,
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
})
