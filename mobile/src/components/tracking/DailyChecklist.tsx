import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface ChecklistItem {
  id: string
  label: string
  completed: boolean
}

interface DailyChecklistProps {
  title?: string
  items: ChecklistItem[]
  onToggle: (id: string) => void
  style?: ViewStyle
}

export const DailyChecklist: React.FC<DailyChecklistProps> = ({
  title = 'Daily Checklist',
  items,
  onToggle,
  style,
}) => {
  const completed = items.filter((i) => i.completed).length

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.counter}>
          {completed}/{items.length}
        </Text>
      </View>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onToggle(item.id)}
          activeOpacity={0.7}
          style={styles.item}
        >
          <View
            style={[
              styles.checkbox,
              item.completed && styles.checkboxChecked,
            ]}
          >
            {item.completed && <Text style={styles.checkmark}>{'\\u2713'}</Text>}
          </View>
          <Text
            style={[
              styles.label,
              item.completed && styles.labelCompleted,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
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
  counter: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.primary.main,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.xs,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
  },
  label: {
    fontSize: fontSizes.lg,
    color: colors.text.primary,
    flex: 1,
  },
  labelCompleted: {
    textDecorationLine: 'line-through',
    color: colors.text.disabled,
  },
})
