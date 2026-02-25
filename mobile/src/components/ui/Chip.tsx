import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface ChipProps {
  label: string
  selected?: boolean
  onPress?: () => void
  onRemove?: () => void
  disabled?: boolean
  color?: string
  style?: ViewStyle
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  onRemove,
  disabled = false,
  color = colors.primary.main,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress ?? onRemove}
      disabled={disabled || (!onPress && !onRemove)}
      activeOpacity={0.7}
      style={[
        styles.chip,
        selected
          ? { backgroundColor: color }
          : { backgroundColor: 'transparent', borderColor: color, borderWidth: 1 },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: selected ? '#FFFFFF' : color },
        ]}
      >
        {label}
      </Text>
      {onRemove && (
        <Text
          style={[styles.remove, { color: selected ? '#FFFFFF' : color }]}
          onPress={onRemove}
        >
          {' \u00D7'}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },
  remove: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    marginLeft: 2,
  },
  disabled: {
    opacity: 0.5,
  },
})
