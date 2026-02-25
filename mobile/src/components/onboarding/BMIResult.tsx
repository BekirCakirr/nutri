import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface BMIResultProps {
  bmi: number
  height: number
  weight: number
  unit?: 'metric' | 'imperial'
  style?: ViewStyle
}

function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: '#42A5F5' }
  if (bmi < 25) return { label: 'Normal', color: colors.success }
  if (bmi < 30) return { label: 'Overweight', color: colors.warning }
  return { label: 'Obese', color: colors.error }
}

export const BMIResult: React.FC<BMIResultProps> = ({
  bmi,
  height,
  weight,
  unit = 'metric',
  style,
}) => {
  const category = getBMICategory(bmi)
  const position = Math.min(Math.max(((bmi - 15) / 25) * 100, 0), 100)

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Your BMI</Text>
      <Text style={[styles.bmiValue, { color: category.color }]}>
        {bmi.toFixed(1)}
      </Text>
      <Text style={[styles.category, { color: category.color }]}>
        {category.label}
      </Text>
      <View style={styles.scale}>
        <View style={styles.scaleBar}>
          <View style={[styles.scaleSegment, { backgroundColor: '#42A5F5', flex: 1 }]} />
          <View style={[styles.scaleSegment, { backgroundColor: colors.success, flex: 2 }]} />
          <View style={[styles.scaleSegment, { backgroundColor: colors.warning, flex: 1.5 }]} />
          <View style={[styles.scaleSegment, { backgroundColor: colors.error, flex: 1.5 }]} />
        </View>
        <View style={[styles.indicator, { left: `${position}%` }]} />
      </View>
      <View style={styles.scaleLabels}>
        <Text style={styles.scaleLabel}>15</Text>
        <Text style={styles.scaleLabel}>18.5</Text>
        <Text style={styles.scaleLabel}>25</Text>
        <Text style={styles.scaleLabel}>30</Text>
        <Text style={styles.scaleLabel}>40</Text>
      </View>
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Height</Text>
          <Text style={styles.detailValue}>
            {height} {unit === 'metric' ? 'cm' : 'in'}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Weight</Text>
          <Text style={styles.detailValue}>
            {weight} {unit === 'metric' ? 'kg' : 'lbs'}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  bmiValue: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.extrabold,
  },
  category: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.lg,
  },
  scale: {
    width: '100%',
    height: 12,
    marginBottom: spacing.xs,
    position: 'relative',
  },
  scaleBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  scaleSegment: {
    height: '100%',
  },
  indicator: {
    position: 'absolute',
    top: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.text.primary,
    borderWidth: 2,
    borderColor: colors.background.paper,
    marginLeft: -6,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.lg,
  },
  scaleLabel: {
    fontSize: fontSizes.xs,
    color: colors.text.disabled,
  },
  details: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  detailValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    marginTop: 2,
  },
})
