import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface ShoppingListCardProps {
  title: string
  itemCount: number
  checkedCount: number
  date?: string
  onPress?: () => void
  style?: ViewStyle
}

export const ShoppingListCard: React.FC<ShoppingListCardProps> = ({
  title,
  itemCount,
  checkedCount,
  date,
  onPress,
  style,
}) => {
  const progress = itemCount > 0 ? checkedCount / itemCount : 0

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.card, style]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {date && <Text style={styles.date}>{date}</Text>}
      </View>
      <View style={styles.progressRow}>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              { width: `${progress * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.count}>
          {checkedCount}/{itemCount}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  date: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.primary[100],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.full,
  },
  count: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
  },
})
