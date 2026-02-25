import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface RecipeStepItemProps {
  stepNumber: number
  instruction: string
  duration?: string
  tip?: string
  isCompleted?: boolean
  isActive?: boolean
  style?: ViewStyle
}

export const RecipeStepItem: React.FC<RecipeStepItemProps> = ({
  stepNumber,
  instruction,
  duration,
  tip,
  isCompleted = false,
  isActive = false,
  style,
}) => {
  return (
    <View style={[styles.container, isActive && styles.activeContainer, style]}>
      <View
        style={[
          styles.numberCircle,
          isCompleted && styles.numberCircleCompleted,
          isActive && styles.numberCircleActive,
        ]}
      >
        {isCompleted ? (
          <Text style={styles.checkmark}>{'\u2713'}</Text>
        ) : (
          <Text
            style={[
              styles.number,
              isActive && styles.numberActive,
            ]}
          >
            {stepNumber}
          </Text>
        )}
      </View>
      <View style={styles.content}>
        <Text
          style={[
            styles.instruction,
            isCompleted && styles.instructionCompleted,
          ]}
        >
          {instruction}
        </Text>
        {duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        )}
        {tip && (
          <View style={styles.tipContainer}>
            <Text style={styles.tipLabel}>Ipucu:</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  activeContainer: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    marginHorizontal: -spacing.sm,
  },
  numberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.default,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  numberCircleCompleted: {
    backgroundColor: colors.success,
  },
  numberCircleActive: {
    backgroundColor: colors.primary.main,
  },
  number: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text.secondary,
  },
  numberActive: {
    color: '#FFFFFF',
  },
  checkmark: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  instruction: {
    fontSize: fontSizes.lg,
    color: colors.text.primary,
    lineHeight: fontSizes.lg * 1.5,
  },
  instructionCompleted: {
    color: colors.text.disabled,
    textDecorationLine: 'line-through',
  },
  durationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  durationText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.secondary[800],
  },
  tipContainer: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  tipLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.primary[800],
    marginBottom: 2,
  },
  tipText: {
    fontSize: fontSizes.sm,
    color: colors.primary[700],
    lineHeight: fontSizes.sm * 1.4,
  },
})
