import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface DatePickerProps {
  value: Date
  onChange: (date: Date) => void
  label?: string
  placeholder?: string
  style?: ViewStyle
}

function formatDate(date: Date): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  style,
}) => {
  // Placeholder wrapper - in production, this would open a native date picker
  const handlePress = () => {
    // Would trigger a native date picker modal here
    // For now, this is a display-only placeholder
  }

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity onPress={handlePress} style={styles.button} activeOpacity={0.7}>
        <Text style={styles.dateText}>
          {value ? formatDate(value) : placeholder}
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
  dateText: {
    fontSize: fontSizes.lg,
    color: colors.text.primary,
  },
  icon: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
})
