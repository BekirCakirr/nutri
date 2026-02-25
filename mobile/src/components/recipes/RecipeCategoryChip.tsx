import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface RecipeCategoryChipProps {
  label: string
  selected?: boolean
  count?: number
  onPress?: () => void
  style?: ViewStyle
}

export const RecipeCategoryChip: React.FC<RecipeCategoryChipProps> = ({
  label,
  selected = false,
  count,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
      style={[
        styles.chip,
        selected ? styles.chipSelected : styles.chipDefault,
        style,
      ]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
      {count != null && (
        <Text style={[styles.count, selected && styles.countSelected]}>
          {count}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipDefault: {
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary.main,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
  },
  labelSelected: {
    color: '#FFFFFF',
  },
  count: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
    backgroundColor: colors.background.default,
    paddingHorizontal: spacing.xs + 2,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  countSelected: {
    color: colors.primary.main,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
})
