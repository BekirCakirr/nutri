import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface AllergyChipProps {
  label: string
  selected: boolean
  onToggle: () => void
  style?: ViewStyle
}

export const AllergyChip: React.FC<AllergyChipProps> = ({
  label,
  selected,
  onToggle,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={[
        styles.chip,
        selected && styles.selected,
        style,
      ]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    margin: spacing.xs,
  },
  selected: {
    backgroundColor: colors.error + '15',
    borderColor: colors.error,
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
  },
  selectedLabel: {
    color: colors.error,
    fontWeight: fontWeights.semibold,
  },
})
