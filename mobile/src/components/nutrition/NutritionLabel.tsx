import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface Nutrient {
  name: string
  amount: string
  dailyValue?: number
  bold?: boolean
  indent?: boolean
}

interface NutritionLabelProps {
  servingSize: string
  calories: number
  nutrients: Nutrient[]
  style?: ViewStyle
}

export const NutritionLabel: React.FC<NutritionLabelProps> = ({
  servingSize,
  calories,
  nutrients,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Besin Degerleri</Text>
      <View style={styles.thickDivider} />
      <Text style={styles.serving}>Porsiyon {servingSize}</Text>
      <View style={styles.thickDivider} />
      <View style={styles.calorieRow}>
        <Text style={styles.calorieLabel}>Kalori</Text>
        <Text style={styles.calorieValue}>{calories}</Text>
      </View>
      <View style={styles.thinDivider} />
      <Text style={styles.dvHeader}>% Gunluk Deger*</Text>
      <View style={styles.thinDivider} />
      {nutrients.map((nutrient, index) => (
        <View key={index}>
          <View style={styles.nutrientRow}>
            <Text
              style={[
                styles.nutrientName,
                nutrient.bold && styles.bold,
                nutrient.indent && styles.indent,
              ]}
            >
              {nutrient.name} <Text style={styles.amount}>{nutrient.amount}</Text>
            </Text>
            {nutrient.dailyValue !== undefined && (
              <Text style={styles.dailyValue}>{nutrient.dailyValue}%</Text>
            )}
          </View>
          {index < nutrients.length - 1 && <View style={styles.thinDivider} />}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    borderWidth: 1.5,
    borderColor: colors.text.primary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  title: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.extrabold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  thickDivider: {
    height: 4,
    backgroundColor: colors.text.primary,
    marginVertical: spacing.xs,
  },
  thinDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.text.primary,
    marginVertical: spacing.xs,
  },
  serving: {
    fontSize: fontSizes.md,
    color: colors.text.primary,
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calorieLabel: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  calorieValue: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  dvHeader: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'right',
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  nutrientName: {
    fontSize: fontSizes.md,
    color: colors.text.primary,
  },
  bold: {
    fontWeight: fontWeights.bold,
  },
  indent: {
    paddingLeft: spacing.md,
  },
  amount: {
    fontWeight: fontWeights.regular,
  },
  dailyValue: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
})
