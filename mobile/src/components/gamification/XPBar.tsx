import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface XPBarProps {
  currentXP: number
  maxXP: number
  level: number
  style?: ViewStyle
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXP,
  maxXP,
  level,
  style,
}) => {
  const progress = Math.min(currentXP / maxXP, 1)

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Ionicons name="star" size={12} color="#FFFFFF" />
          <Text style={styles.levelText}>Lv.{level}</Text>
        </View>
        <Text style={styles.xpText}>
          {currentXP}/{maxXP} XP
        </Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary.main,
    paddingHorizontal: 10,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  levelText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: '#FFFFFF',
  },
  xpText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
  },
  barTrack: {
    height: 8,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.full,
  },
})
