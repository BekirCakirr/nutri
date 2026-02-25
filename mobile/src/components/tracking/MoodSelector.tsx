import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

type Mood = 'terrible' | 'bad' | 'okay' | 'good' | 'great'

interface MoodSelectorProps {
  selected?: Mood
  onSelect: (mood: Mood) => void
  style?: ViewStyle
}

const moodOptions: { mood: Mood; label: string; display: string; color: string }[] = [
  { mood: 'terrible', label: 'Terrible', display: 'T', color: '#E53935' },
  { mood: 'bad', label: 'Bad', display: 'B', color: '#FF7043' },
  { mood: 'okay', label: 'Okay', display: 'O', color: '#FDD835' },
  { mood: 'good', label: 'Good', display: 'G', color: '#66BB6A' },
  { mood: 'great', label: 'Great', display: 'A', color: '#43A047' },
]

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selected,
  onSelect,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>How are you feeling?</Text>
      <View style={styles.options}>
        {moodOptions.map((option) => {
          const isSelected = selected === option.mood
          return (
            <TouchableOpacity
              key={option.mood}
              onPress={() => onSelect(option.mood)}
              activeOpacity={0.7}
              style={styles.option}
            >
              <View
                style={[
                  styles.moodCircle,
                  {
                    backgroundColor: isSelected ? option.color : colors.background.default,
                    borderColor: option.color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.moodDisplay,
                    { color: isSelected ? '#FFFFFF' : option.color },
                  ]}
                >
                  {option.display}
                </Text>
              </View>
              <Text
                style={[
                  styles.label,
                  isSelected && { color: option.color, fontWeight: fontWeights.semibold },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          )
        })}
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
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  option: {
    alignItems: 'center',
  },
  moodCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  moodDisplay: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
  },
  label: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
  },
})
