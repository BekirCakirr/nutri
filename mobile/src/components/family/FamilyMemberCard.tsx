import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

type Relationship = 'spouse' | 'child' | 'parent' | 'sibling' | 'other'

interface FamilyMemberCardProps {
  name: string
  relationship: Relationship
  age?: number
  avatar?: React.ReactNode
  calorieGoal?: number
  caloriesConsumed?: number
  isActive?: boolean
  onPress?: () => void
  style?: ViewStyle
}

const relationshipLabels: Record<Relationship, string> = {
  spouse: 'Es',
  child: 'Cocuk',
  parent: 'Ebeveyn',
  sibling: 'Kardes',
  other: 'Diger',
}

const relationshipColors: Record<Relationship, string> = {
  spouse: colors.primary.main,
  child: colors.secondary.main,
  parent: colors.accent,
  sibling: '#9C27B0',
  other: colors.text.secondary,
}

export const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({
  name,
  relationship,
  age,
  avatar,
  calorieGoal,
  caloriesConsumed,
  isActive = true,
  onPress,
  style,
}) => {
  const progress =
    calorieGoal && caloriesConsumed
      ? Math.min(caloriesConsumed / calorieGoal, 1)
      : 0
  const accentColor = relationshipColors[relationship]

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
      style={[styles.container, !isActive && styles.inactive, style]}
    >
      <View style={styles.left}>
        {avatar ? (
          <View style={styles.avatarContainer}>{avatar}</View>
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: accentColor + '20' }]}>
            <Text style={[styles.avatarInitial, { color: accentColor }]}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.meta}>
            <Text style={[styles.relationship, { color: accentColor }]}>
              {relationshipLabels[relationship]}
            </Text>
            {age != null && <Text style={styles.age}> - {age} yas</Text>}
          </View>
        </View>
      </View>
      {calorieGoal != null && caloriesConsumed != null && (
        <View style={styles.calorieInfo}>
          <Text style={styles.calorieText}>
            {caloriesConsumed}/{calorieGoal}
          </Text>
          <Text style={styles.calorieUnit}>kcal</Text>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.round(progress * 100)}%`,
                  backgroundColor: progress > 1 ? colors.warning : colors.primary.main,
                },
              ]}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  inactive: {
    opacity: 0.5,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarInitial: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  relationship: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },
  age: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  calorieInfo: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  calorieText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  calorieUnit: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
  },
  progressTrack: {
    width: 80,
    height: 4,
    backgroundColor: colors.primary[100],
    borderRadius: 2,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
})
