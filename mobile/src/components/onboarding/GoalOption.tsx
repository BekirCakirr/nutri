import React from 'react'
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface GoalOptionProps {
  title: string
  description: string
  icon?: React.ReactNode
  selected: boolean
  onPress: () => void
  style?: ViewStyle
}

export const GoalOption: React.FC<GoalOptionProps> = ({
  title,
  description,
  icon,
  selected,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        selected && styles.selected,
        style,
      ]}
    >
      {icon}
      <Text style={[styles.title, selected && styles.selectedText]}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  selected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary[50],
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  selectedText: {
    color: colors.primary.main,
  },
  description: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: fontSizes.md * 1.4,
  },
})
