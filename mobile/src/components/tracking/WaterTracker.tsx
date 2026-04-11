import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, nutritionColors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { shadows } from '../../theme/shadows'

interface WaterTrackerProps {
  currentGlasses: number
  targetGlasses: number
  glassSize?: number // in ml
  onAddGlass: () => void
  onRemoveGlass: () => void
  style?: ViewStyle
}

const waterBlue = nutritionColors.water

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
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Ionicons name="water" size={18} color={waterBlue.main} />
          </View>
          <Text style={styles.title}>Su Takibi</Text>
        </View>
        <Text style={styles.total}>{totalMl} ml</Text>
      </View>

      {/* Glass grid */}
      <View style={styles.glassRow}>
        {Array.from({ length: Math.min(targetGlasses, 20) }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.glass,
              index < currentGlasses && styles.glassFilled,
            ]}
          >
            <Ionicons
              name={index < currentGlasses ? 'water' : 'water-outline'}
              size={14}
              color={index < currentGlasses ? '#FFFFFF' : waterBlue.medium}
            />
          </View>
        ))}
        {targetGlasses > 20 && (
          <Text style={{fontSize: 10, alignSelf:'center', color: waterBlue.dark}}>+{targetGlasses - 20}</Text>
        )}
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Controls */}
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={onRemoveGlass}
          disabled={currentGlasses <= 0}
          style={[styles.button, currentGlasses <= 0 && styles.buttonDisabled]}
          activeOpacity={0.7}
        >
          <Ionicons name="remove" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
        <Text style={styles.count}>
          {currentGlasses} / {targetGlasses} bardak
        </Text>
        <TouchableOpacity
          onPress={onAddGlass}
          style={[styles.button, styles.buttonPrimary]}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
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
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: waterBlue.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  total: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: waterBlue.dark,
  },
  glassRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.md,
    gap: 6,
  },
  glass: {
    width: 30,
    height: 36,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: waterBlue.light,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: waterBlue.light,
  },
  glassFilled: {
    backgroundColor: waterBlue.medium,
    borderColor: waterBlue.main,
  },
  progressBar: {
    height: 4,
    backgroundColor: waterBlue.light,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: waterBlue.main,
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.default,
  },
  buttonPrimary: {
    backgroundColor: waterBlue.main,
    borderColor: waterBlue.main,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  count: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
  },
})
