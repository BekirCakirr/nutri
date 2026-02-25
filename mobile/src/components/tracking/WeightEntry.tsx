import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface WeightEntryProps {
  currentWeight?: number
  unit?: 'kg' | 'lbs'
  onSave: (weight: number) => void
  style?: ViewStyle
}

export const WeightEntry: React.FC<WeightEntryProps> = ({
  currentWeight,
  unit = 'kg',
  onSave,
  style,
}) => {
  const [value, setValue] = useState(currentWeight?.toString() || '')

  const handleSave = () => {
    const weight = parseFloat(value)
    if (!isNaN(weight) && weight > 0) {
      onSave(weight)
    }
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Log Weight</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          keyboardType="decimal-pad"
          placeholder="0.0"
          placeholderTextColor={colors.text.disabled}
          maxLength={6}
        />
        <Text style={styles.unit}>{unit}</Text>
      </View>
      {currentWeight && (
        <Text style={styles.lastEntry}>
          Last entry: {currentWeight} {unit}
        </Text>
      )}
      <TouchableOpacity
        onPress={handleSave}
        disabled={!value || parseFloat(value) <= 0}
        style={[
          styles.saveButton,
          (!value || parseFloat(value) <= 0) && styles.saveButtonDisabled,
        ]}
      >
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  input: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'center',
    minWidth: 120,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary.main,
    paddingVertical: spacing.xs,
  },
  unit: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  lastEntry: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  saveButton: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: '#FFFFFF',
  },
})
