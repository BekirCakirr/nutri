import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

type Difficulty = 'Easy' | 'Medium' | 'Hard'

const difficultyLabels: Record<Difficulty, string> = {
  Easy: 'Kolay',
  Medium: 'Orta',
  Hard: 'Zor',
}

interface RecipeCardProps {
  title: string
  cookTime: string
  calories: number
  servings: number
  difficulty?: Difficulty
  tags?: string[]
  onPress?: () => void
  style?: ViewStyle
}

const difficultyColors: Record<string, string> = {
  Easy: colors.success,
  Medium: colors.warning,
  Hard: colors.error,
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  cookTime,
  calories,
  servings,
  difficulty = 'Easy',
  tags = [],
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.card, style]}
    >
      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderText}>Tarif Gorseli</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{cookTime}</Text>
          <Text style={styles.metaDot}>{'\u2022'}</Text>
          <Text style={styles.meta}>{calories} kcal</Text>
          <Text style={styles.metaDot}>{'\u2022'}</Text>
          <Text style={styles.meta}>{servings} porsiyon</Text>
        </View>
        <View style={styles.footer}>
          <Text style={[styles.difficulty, { color: difficultyColors[difficulty] }]}>
            {difficultyLabels[difficulty]}
          </Text>
          {tags.length > 0 && (
            <View style={styles.tags}>
              {tags.slice(0, 2).map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#0F3D23',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  imagePlaceholder: {
    height: 160,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: fontSizes.md,
    color: colors.primary[400],
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  meta: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  metaDot: {
    fontSize: fontSizes.sm,
    color: colors.text.disabled,
    marginHorizontal: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficulty: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
  },
})
