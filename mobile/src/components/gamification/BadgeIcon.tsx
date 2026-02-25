import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary'

interface BadgeIconProps {
  icon: React.ReactNode
  name: string
  rarity?: BadgeRarity
  earned?: boolean
  size?: number
  style?: ViewStyle
}

const rarityColors: Record<BadgeRarity, string> = {
  common: '#9E9E9E',
  rare: '#42A5F5',
  epic: '#AB47BC',
  legendary: '#FFD54F',
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({
  icon,
  name,
  rarity = 'common',
  earned = true,
  size = 64,
  style,
}) => {
  const color = rarityColors[rarity]

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.badge,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: color,
            backgroundColor: earned ? color + '20' : colors.background.default,
          },
          !earned && styles.locked,
        ]}
      >
        {icon}
      </View>
      <Text style={[styles.name, !earned && styles.lockedText]} numberOfLines={1}>
        {name}
      </Text>
      <Text style={[styles.rarity, { color }]}>
        {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
  },
  badge: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  locked: {
    opacity: 0.4,
  },
  name: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
    textAlign: 'center',
  },
  lockedText: {
    color: colors.text.disabled,
  },
  rarity: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    marginTop: 1,
  },
})
