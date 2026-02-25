import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { AllergyChip } from './AllergyChip'

interface Allergy {
  id: string
  label: string
}

interface AllergySelectorProps {
  allergies: Allergy[]
  selectedIds: string[]
  onToggle: (id: string) => void
  title?: string
  subtitle?: string
  style?: ViewStyle
}

const defaultAllergies: Allergy[] = [
  { id: 'gluten', label: 'Gluten' },
  { id: 'lactose', label: 'Laktoz' },
  { id: 'nuts', label: 'Kuruyemis' },
  { id: 'egg', label: 'Yumurta' },
  { id: 'fish', label: 'Balik' },
  { id: 'shellfish', label: 'Kabuklu Deniz Urunleri' },
  { id: 'soy', label: 'Soya' },
  { id: 'wheat', label: 'Bugday' },
  { id: 'sesame', label: 'Susam' },
  { id: 'celery', label: 'Kereviz' },
]

export const AllergySelector: React.FC<AllergySelectorProps> = ({
  allergies = defaultAllergies,
  selectedIds,
  onToggle,
  title = 'Alerjileriniz',
  subtitle = 'Varsa alerjilerinizi secin',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <View style={styles.chipContainer}>
        {allergies.map((allergy) => (
          <AllergyChip
            key={allergy.id}
            label={allergy.label}
            selected={selectedIds.includes(allergy.id)}
            onToggle={() => onToggle(allergy.id)}
          />
        ))}
      </View>
      {selectedIds.length > 0 && (
        <Text style={styles.selectedCount}>
          {selectedIds.length} alerji secildi
        </Text>
      )}
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
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  selectedCount: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
})
