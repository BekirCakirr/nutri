import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface ShoppingItemProps {
  name: string
  quantity?: string
  checked: boolean
  onToggle: () => void
  onPress?: () => void
  style?: ViewStyle
}

export const ShoppingItem: React.FC<ShoppingItemProps> = ({
  name,
  quantity,
  checked,
  onToggle,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress || onToggle}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      <TouchableOpacity onPress={onToggle} style={styles.checkboxArea}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <Text style={styles.checkmark}>{'\u2713'}</Text>}
        </View>
      </TouchableOpacity>
      <Text
        style={[styles.name, checked && styles.nameChecked]}
        numberOfLines={1}
      >
        {name}
      </Text>
      {quantity && (
        <Text style={[styles.quantity, checked && styles.quantityChecked]}>
          {quantity}
        </Text>
      )}
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
  checkboxArea: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.xs,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
  },
  name: {
    flex: 1,
    fontSize: fontSizes.lg,
    color: colors.text.primary,
  },
  nameChecked: {
    textDecorationLine: 'line-through',
    color: colors.text.disabled,
  },
  quantity: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  quantityChecked: {
    color: colors.text.disabled,
  },
})
