import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { GoalOption } from './GoalOption'

interface Goal {
  id: string
  title: string
  description: string
  icon?: React.ReactNode
}

interface GoalSelectorProps {
  goals: Goal[]
  selectedGoalId?: string
  onSelect: (goalId: string) => void
  title?: string
  multiSelect?: boolean
  selectedGoalIds?: string[]
  onMultiSelect?: (goalIds: string[]) => void
  style?: ViewStyle
}

export const GoalSelector: React.FC<GoalSelectorProps> = ({
  goals,
  selectedGoalId,
  onSelect,
  title = 'Hedefinizi Secin',
  multiSelect = false,
  selectedGoalIds = [],
  onMultiSelect,
  style,
}) => {
  const handlePress = (goalId: string) => {
    if (multiSelect && onMultiSelect) {
      const isSelected = selectedGoalIds.includes(goalId)
      if (isSelected) {
        onMultiSelect(selectedGoalIds.filter((id) => id !== goalId))
      } else {
        onMultiSelect([...selectedGoalIds, goalId])
      }
    } else {
      onSelect(goalId)
    }
  }

  const isSelected = (goalId: string): boolean => {
    if (multiSelect) {
      return selectedGoalIds.includes(goalId)
    }
    return goalId === selectedGoalId
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {goals.map((goal) => (
        <GoalOption
          key={goal.id}
          title={goal.title}
          description={goal.description}
          icon={goal.icon}
          selected={isSelected(goal.id)}
          onPress={() => handlePress(goal.id)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  title: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
})
