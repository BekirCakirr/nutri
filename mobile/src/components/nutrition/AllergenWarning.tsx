import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface AllergenWarningProps {
  allergens: string[]
  severity?: 'warning' | 'danger'
  style?: ViewStyle
}

export const AllergenWarning: React.FC<AllergenWarningProps> = ({
  allergens,
  severity = 'warning',
  style,
}) => {
  if (allergens.length === 0) return null

  const isDanger = severity === 'danger'

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDanger ? '#FFEBEE' : '#FFF3E0' },
        style,
      ]}
    >
      <Text style={styles.icon}>{isDanger ? '!' : '!'}</Text>
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: isDanger ? colors.error : '#E65100' },
          ]}
        >
          {isDanger ? 'Allergen Alert' : 'Contains Allergens'}
        </Text>
        <Text style={styles.allergens}>{allergens.join(', ')}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  icon: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.bold,
    marginRight: spacing.sm,
    color: colors.warning,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  allergens: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
})
