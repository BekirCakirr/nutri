import React from 'react'
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  style?: ViewStyle
  textStyle?: TextStyle
}

const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: colors.primary[100], text: colors.primary[800] },
  success: { bg: colors.primary[50], text: colors.primary[700] },
  warning: { bg: '#FFF8E1', text: '#F57F17' },
  error: { bg: '#FBE9E7', text: '#BF360C' },
  info: { bg: colors.secondary[50], text: colors.secondary[700] },
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  const colorScheme = variantColors[variant]

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: colorScheme.bg },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'sm' ? styles.textSm : styles.textMd,
          { color: colorScheme.text },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
  },
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs,
  },
  text: {
    fontWeight: fontWeights.medium,
  },
  textSm: {
    fontSize: fontSizes.xs,
  },
  textMd: {
    fontSize: fontSizes.sm,
  },
})
