import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface TimePickerProps {
  value: string // "HH:mm" format
  onChange: (time: string) => void
  label?: string
  placeholder?: string
  style?: ViewStyle
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select time',
  style,
}) => {
  // Placeholder wrapper - in production, this would open a native time picker
  const handlePress = () => {
    // Would trigger a native time picker modal here
  }

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity onPress={handlePress} style={styles.button} activeOpacity={0.7}>
        <Text style={styles.timeText}>
          {value || placeholder}
        </Text>
        <Text style={styles.icon}>{'\u25BC'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.paper,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  timeText: {
    fontSize: fontSizes.lg,
    color: colors.text.primary,
  },
  icon: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
})
