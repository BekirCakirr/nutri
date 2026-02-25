import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface WaterTrackerProps {
  currentGlasses: number
  targetGlasses: number
  glassSize?: number // in ml
  onAddGlass: () => void
  onRemoveGlass: () => void
  style?: ViewStyle
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  currentGlasses,
  targetGlasses,
  glassSize = 250,
  onAddGlass,
  onRemoveGlass,
  style,
}) => {
  const totalMl = currentGlasses * glassSize
  const progress = Math.min(currentGlasses / targetGlasses, 1)

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Water Intake</Text>
        <Text style={styles.total}>{totalMl} ml</Text>
      </View>
      <View style={styles.glassRow}>
        {Array.from({ length: targetGlasses }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.glass,
              index < currentGlasses && styles.glassFilled,
            ]}
          >
            <Text
              style={[
                styles.glassIcon,
                index < currentGlasses && styles.glassIconFilled,
              ]}
            >
              {index < currentGlasses ? 'W' : 'W'}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={onRemoveGlass}
          disabled={currentGlasses <= 0}
          style={[styles.button, currentGlasses <= 0 && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.count}>
          {currentGlasses} / {targetGlasses} glasses
        </Text>
        <TouchableOpacity
          onPress={onAddGlass}
          style={[styles.button, styles.buttonPrimary]}
        >
          <Text style={[styles.buttonText, styles.buttonTextPrimary]}>+</Text>
        </TouchableOpacity>
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
  total: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: '#1565C0',
  },
  glassRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  glass: {
    width: 32,
    height: 40,
    borderRadius: borderRadius.xs,
    borderWidth: 1.5,
    borderColor: '#90CAF9',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
  },
  glassFilled: {
    backgroundColor: '#42A5F5',
    borderColor: '#1E88E5',
  },
  glassIcon: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: '#90CAF9',
  },
  glassIconFilled: {
    color: '#FFFFFF',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E3F2FD',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#42A5F5',
    borderRadius: borderRadius.full,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#42A5F5',
    borderColor: '#42A5F5',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  count: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
  },
})
