import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

interface MealTypeSelectorProps {
  selected: MealType
  onSelect: (type: MealType) => void
  style?: ViewStyle
}

const mealOptions: { type: MealType; label: string; emoji: string }[] = [
  { type: 'breakfast', label: 'Breakfast', emoji: 'B' },
  { type: 'lunch', label: 'Lunch', emoji: 'L' },
  { type: 'dinner', label: 'Dinner', emoji: 'D' },
  { type: 'snack', label: 'Snack', emoji: 'S' },
]

const mealColors: Record<MealType, string> = {
  breakfast: '#FF9800',
  lunch: '#4CAF50',
  dinner: '#2196F3',
  snack: '#9C27B0',
}

export const MealTypeSelector: React.FC<MealTypeSelectorProps> = ({
  selected,
  onSelect,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {mealOptions.map((option) => {
        const isSelected = selected === option.type
        const color = mealColors[option.type]
        return (
          <TouchableOpacity
            key={option.type}
            onPress={() => onSelect(option.type)}
            activeOpacity={0.7}
            style={[
              styles.option,
              isSelected && { backgroundColor: color + '15', borderColor: color },
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: isSelected ? color : colors.background.default },
              ]}
            >
              <Text
                style={[
                  styles.emoji,
                  { color: isSelected ? '#FFFFFF' : colors.text.secondary },
                ]}
              >
                {option.emoji}
              </Text>
            </View>
            <Text
              style={[
                styles.label,
                isSelected && { color, fontWeight: fontWeights.semibold },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emoji: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
  },
})
