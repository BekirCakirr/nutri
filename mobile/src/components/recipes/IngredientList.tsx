import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface Ingredient {
  name: string
  amount: string
  unit: string
  optional?: boolean
}

interface IngredientListProps {
  ingredients: Ingredient[]
  servings?: number
  style?: ViewStyle
}

export const IngredientList: React.FC<IngredientListProps> = ({
  ingredients,
  servings,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Malzemeler</Text>
        {servings && (
          <Text style={styles.servings}>
            {servings} porsiyon
          </Text>
        )}
      </View>
      {ingredients.map((item, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.bullet} />
          <Text style={[styles.ingredient, item.optional && styles.optional]}>
            <Text style={styles.amount}>
              {item.amount} {item.unit}
            </Text>
            {'  '}
            {item.name}
            {item.optional ? ' (istege bagli)' : ''}
          </Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  servings: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary.main,
    marginTop: 7,
    marginRight: spacing.sm,
  },
  ingredient: {
    flex: 1,
    fontSize: fontSizes.lg,
    color: colors.text.primary,
    lineHeight: fontSizes.lg * 1.4,
  },
  amount: {
    fontWeight: fontWeights.semibold,
  },
  optional: {
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
})
