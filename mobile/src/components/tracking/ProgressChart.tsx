import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface DataPoint {
  label: string
  value: number
}

interface ProgressChartProps {
  title: string
  data: DataPoint[]
  unit?: string
  color?: string
  style?: ViewStyle
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  title,
  data,
  unit = '',
  color = colors.primary.main,
  style,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chart}>
        {data.map((point, index) => {
          const barHeight = (point.value / maxValue) * 100
          return (
            <View key={index} style={styles.barContainer}>
              <Text style={styles.value}>
                {point.value}
                {unit}
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${barHeight}%`,
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.label}>{point.label}</Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  value: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  barTrack: {
    width: 24,
    height: 100,
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.sm,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: borderRadius.sm,
  },
  label: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
})
