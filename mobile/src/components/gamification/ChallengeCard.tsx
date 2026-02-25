import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface ChallengeCardProps {
  title: string
  description: string
  progress: number // 0 to 1
  reward: string
  daysLeft?: number
  onPress?: () => void
  style?: ViewStyle
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title,
  description,
  progress,
  reward,
  daysLeft,
  onPress,
  style,
}) => {
  const percentage = Math.round(progress * 100)
  const isComplete = progress >= 1

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.container, isComplete && styles.completed, style]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {isComplete && <Text style={styles.completeBadge}>Done</Text>}
        </View>
        {daysLeft !== undefined && !isComplete && (
          <Text style={styles.daysLeft}>{daysLeft}d left</Text>
        )}
      </View>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.progressRow}>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              {
                width: `${percentage}%`,
                backgroundColor: isComplete ? colors.success : colors.primary.main,
              },
            ]}
          />
        </View>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
      <View style={styles.rewardRow}>
        <Text style={styles.rewardLabel}>Reward:</Text>
        <Text style={styles.rewardValue}>{reward}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
  },
  completed: {
    borderLeftColor: colors.success,
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  completeBadge: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.success,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginLeft: spacing.sm,
  },
  daysLeft: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  description: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.primary[100],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  barFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  percentage: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    width: 36,
    textAlign: 'right',
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardLabel: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  rewardValue: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.secondary.main,
  },
})
