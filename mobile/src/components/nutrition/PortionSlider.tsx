import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import Slider from '@react-native-community/slider'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface PortionSliderProps {
  value: number
  onValueChange: (value: number) => void
  minimumValue?: number
  maximumValue?: number
  step?: number
  unit?: string
  label?: string
  style?: ViewStyle
}

export const PortionSlider: React.FC<PortionSliderProps> = ({
  value,
  onValueChange,
  minimumValue = 0.5,
  maximumValue = 5,
  step = 0.5,
  unit = 'porsiyon',
  label = 'Porsiyon Boyutu',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value} {unit}
        </Text>
      </View>
      <Slider
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor={colors.primary.main}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary.main}
        style={styles.slider}
      />
      <View style={styles.range}>
        <Text style={styles.rangeText}>
          {minimumValue} {unit}
        </Text>
        <Text style={styles.rangeText}>
          {maximumValue} {unit}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
  },
  value: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.primary.main,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  range: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeText: {
    fontSize: fontSizes.xs,
    color: colors.text.disabled,
  },
})
