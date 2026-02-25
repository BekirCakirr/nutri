import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface DietPreference {
  id: string
  title: string
  description: string
  icon?: string
}

interface DietPreferenceSelectorProps {
  preferences?: DietPreference[]
  selectedId?: string
  onSelect: (id: string) => void
  title?: string
  style?: ViewStyle
}

const defaultPreferences: DietPreference[] = [
  { id: 'normal', title: 'Normal', description: 'Herhangi bir diyet kisitlamasi yok', icon: '\u{1F37D}' },
  { id: 'vegetarian', title: 'Vejetaryen', description: 'Et tuketmiyorum', icon: '\u{1F955}' },
  { id: 'vegan', title: 'Vegan', description: 'Hayvansal urun tuketmiyorum', icon: '\u{1F331}' },
  { id: 'pescatarian', title: 'Pesketaryen', description: 'Balik ve deniz urunleri tuketiyorum', icon: '\u{1F41F}' },
  { id: 'keto', title: 'Keto', description: 'Dusuk karbonhidrat, yuksek yag', icon: '\u{1F951}' },
  { id: 'paleo', title: 'Paleo', description: 'Dogal ve islenmemis gidalar', icon: '\u{1F356}' },
]

export const DietPreferenceSelector: React.FC<DietPreferenceSelectorProps> = ({
  preferences = defaultPreferences,
  selectedId,
  onSelect,
  title = 'Diyet Tercihiniz',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {preferences.map((pref) => {
        const isSelected = pref.id === selectedId
        return (
          <TouchableOpacity
            key={pref.id}
            onPress={() => onSelect(pref.id)}
            activeOpacity={0.7}
            style={[styles.option, isSelected && styles.optionSelected]}
          >
            {pref.icon && <Text style={styles.icon}>{pref.icon}</Text>}
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                {pref.title}
              </Text>
              <Text style={styles.optionDescription}>{pref.description}</Text>
            </View>
            <View style={[styles.radio, isSelected && styles.radioSelected]}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        )
      })}
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  optionSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary[50],
  },
  icon: {
    fontSize: fontSizes.h3,
    marginRight: spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  optionTitleSelected: {
    color: colors.primary.main,
  },
  optionDescription: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  radioSelected: {
    borderColor: colors.primary.main,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary.main,
  },
})
