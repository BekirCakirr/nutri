import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface FoodListItemProps {
  name: string
  brand?: string
  calories: number
  servingSize: string
  onPress?: () => void
  rightAction?: React.ReactNode
  style?: ViewStyle
}

export const FoodListItem: React.FC<FoodListItemProps> = ({
  name,
  brand,
  calories,
  servingSize,
  onPress,
  rightAction,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.container, style]}
    >
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.details}>
          {brand ? `${brand} \u2022 ` : ''}
          {servingSize}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.calories}>{calories} kcal</Text>
        {rightAction}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
  },
  details: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    marginLeft: spacing.sm,
  },
  calories: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
})
