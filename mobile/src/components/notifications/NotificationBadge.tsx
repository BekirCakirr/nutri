import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface NotificationBadgeProps {
  count: number
  maxCount?: number
  size?: 'sm' | 'md' | 'lg'
  color?: string
  visible?: boolean
  style?: ViewStyle
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  maxCount = 99,
  size = 'md',
  color = colors.error,
  visible = true,
  style,
}) => {
  if (!visible || count <= 0) return null

  const displayCount = count > maxCount ? `${maxCount}+` : `${count}`

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' && styles.badgeSm,
        size === 'md' && styles.badgeMd,
        size === 'lg' && styles.badgeLg,
        { backgroundColor: color },
        displayCount.length > 2 && styles.badgeWide,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'sm' && styles.textSm,
          size === 'lg' && styles.textLg,
        ]}
      >
        {displayCount}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
  },
  badgeSm: {
    minWidth: 16,
    height: 16,
    paddingHorizontal: spacing.xs,
  },
  badgeMd: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: spacing.xs + 1,
  },
  badgeLg: {
    minWidth: 26,
    height: 26,
    paddingHorizontal: spacing.sm,
  },
  badgeWide: {
    paddingHorizontal: spacing.sm,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: fontWeights.bold,
    textAlign: 'center',
    fontSize: fontSizes.xs,
  },
  textSm: {
    fontSize: 9,
  },
  textLg: {
    fontSize: fontSizes.sm,
  },
})
