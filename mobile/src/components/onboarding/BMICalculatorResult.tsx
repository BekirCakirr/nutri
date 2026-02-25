import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface BMICalculatorResultProps {
  height: number // cm
  weight: number // kg
  age?: number
  gender?: 'male' | 'female'
  style?: ViewStyle
}

function calculateBMI(height: number, weight: number): number {
  const heightInMeters = height / 100
  return weight / (heightInMeters * heightInMeters)
}

function getBMICategory(bmi: number): { label: string; color: string; advice: string } {
  if (bmi < 18.5) {
    return {
      label: 'Zayif',
      color: '#42A5F5',
      advice: 'Saglikli kilo almak icin diyetisyeninize danisin.',
    }
  }
  if (bmi < 25) {
    return {
      label: 'Normal',
      color: colors.success,
      advice: 'Tebrikler! Saglikli bir kiloya sahipsiniz.',
    }
  }
  if (bmi < 30) {
    return {
      label: 'Fazla Kilolu',
      color: colors.warning,
      advice: 'Saglikli bir yasam icin kilo vermeyi dusunebilirsiniz.',
    }
  }
  return {
    label: 'Obez',
    color: colors.error,
    advice: 'Sagliginiz icin bir uzmana danismanizi oneririz.',
  }
}

export const BMICalculatorResult: React.FC<BMICalculatorResultProps> = ({
  height,
  weight,
  age,
  gender,
  style,
}) => {
  const bmi = calculateBMI(height, weight)
  const category = getBMICategory(bmi)
  const position = Math.min(Math.max(((bmi - 15) / 25) * 100, 0), 100)

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>VKI Sonucunuz</Text>
      <Text style={[styles.bmiValue, { color: category.color }]}>
        {bmi.toFixed(1)}
      </Text>
      <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
        <Text style={[styles.categoryText, { color: category.color }]}>
          {category.label}
        </Text>
      </View>

      <View style={styles.scaleContainer}>
        <View style={styles.scaleBar}>
          <View style={[styles.segment, { backgroundColor: '#42A5F5', flex: 1 }]} />
          <View style={[styles.segment, { backgroundColor: colors.success, flex: 2 }]} />
          <View style={[styles.segment, { backgroundColor: colors.warning, flex: 1.5 }]} />
          <View style={[styles.segment, { backgroundColor: colors.error, flex: 1.5 }]} />
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

      <Text style={styles.advice}>{category.advice}</Text>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Boy</Text>
          <Text style={styles.detailValue}>{height} cm</Text>
        </View>
        <View style={styles.detailDivider} />
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Kilo</Text>
          <Text style={styles.detailValue}>{weight} kg</Text>
        </View>
        {age != null && (
          <>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Yas</Text>
              <Text style={styles.detailValue}>{age}</Text>
            </View>
          </>
        )}
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
  categoryBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  categoryText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
  },
  scaleContainer: {
    width: '100%',
    height: 16,
    position: 'relative',
    marginBottom: spacing.xs,
  },
  scaleBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  segment: {
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
    marginBottom: spacing.md,
  },
  scaleLabel: {
    fontSize: fontSizes.xs,
    color: colors.text.disabled,
  },
  advice: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: fontSizes.md * 1.5,
    marginBottom: spacing.lg,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  detailItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
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
  detailDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
})
