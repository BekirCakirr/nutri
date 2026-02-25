import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface RecipeIngredientItemProps {
  name: string
  amount: string
  unit?: string
  isOptional?: boolean
  isChecked?: boolean
  onToggle?: () => void
  style?: ViewStyle
}

export const RecipeIngredientItem: React.FC<RecipeIngredientItemProps> = ({
  name,
  amount,
  unit,
  isOptional = false,
  isChecked = false,
  onToggle,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {onToggle != null && (
        <View
          style={[styles.checkbox, isChecked && styles.checkboxChecked]}
          onTouchEnd={onToggle}
        >
          {isChecked && <Text style={styles.checkmark}>{'\u2713'}</Text>}
        </View>
      )}
      <View style={styles.content}>
        <Text
          style={[
            styles.name,
            isChecked && styles.nameChecked,
          ]}
        >
          {name}
        </Text>
        {isOptional && <Text style={styles.optional}> (istege bagli)</Text>}
      </View>
      <Text style={[styles.amount, isChecked && styles.amountChecked]}>
        {amount}{unit ? ` ${unit}` : ''}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.xs,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkboxChecked: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  checkmark: {
    fontSize: fontSizes.sm,
    color: '#FFFFFF',
    fontWeight: fontWeights.bold,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: fontSizes.lg,
    color: colors.text.primary,
  },
  nameChecked: {
    textDecorationLine: 'line-through',
    color: colors.text.disabled,
  },
  optional: {
    fontSize: fontSizes.sm,
    color: colors.text.disabled,
    fontStyle: 'italic',
  },
  amount: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  amountChecked: {
    color: colors.text.disabled,
  },
})
