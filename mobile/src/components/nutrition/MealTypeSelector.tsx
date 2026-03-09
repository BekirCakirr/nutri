import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors, nutritionColors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { mealTypeConfig } from '../../theme/icons'
import { AnimatedPressable } from '../ui/AnimatedPressable'

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

interface MealTypeSelectorProps {
  selected: MealType
  onSelect: (type: MealType) => void
  style?: ViewStyle
}

const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

export const MealTypeSelector: React.FC<MealTypeSelectorProps> = ({
  selected,
  onSelect,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {mealTypes.map((type) => {
        const isSelected = selected === type
        const config = mealTypeConfig[type]
        const color = nutritionColors.mealType[type]
        return (
          <AnimatedPressable
            key={type}
            onPress={() => onSelect(type)}
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
              <Ionicons
                name={isSelected ? config.activeIcon : config.icon}
                size={20}
                color={isSelected ? '#FFFFFF' : colors.text.secondary}
              />
            </View>
            <Text
              style={[
                styles.label,
                isSelected && { color, fontWeight: fontWeights.semibold },
              ]}
            >
              {config.label}
            </Text>
          </AnimatedPressable>
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
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
  },
})
