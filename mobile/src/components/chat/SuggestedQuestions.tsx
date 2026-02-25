import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, ScrollView } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface SuggestedQuestionsProps {
  questions: string[]
  onSelect: (question: string) => void
  style?: ViewStyle
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  questions,
  onSelect,
  style,
}) => {
  if (questions.length === 0) return null

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Onerilen Sorular</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {questions.map((question, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelect(question)}
            style={styles.questionButton}
            activeOpacity={0.7}
          >
            <Text style={styles.questionText} numberOfLines={2}>
              {question}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  questionButton: {
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.primary[200],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxWidth: 220,
  },
  questionText: {
    fontSize: fontSizes.md,
    color: colors.primary[800],
    fontWeight: fontWeights.medium,
  },
})
