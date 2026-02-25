import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { ActivityOption } from './ActivityOption'

interface ActivityLevel {
  id: string
  title: string
  description: string
  level: string
}

interface LifestyleSelectorProps {
  levels?: ActivityLevel[]
  selectedId?: string
  onSelect: (id: string) => void
  title?: string
  style?: ViewStyle
}

const defaultLevels: ActivityLevel[] = [
  {
    id: 'sedentary',
    title: 'Hareketsiz',
    description: 'Masa basinda calisma, az hareket',
    level: 'x1.2',
  },
  {
    id: 'light',
    title: 'Hafif Aktif',
    description: 'Haftada 1-3 gun hafif egzersiz',
    level: 'x1.375',
  },
  {
    id: 'moderate',
    title: 'Orta Aktif',
    description: 'Haftada 3-5 gun orta yogunlukta egzersiz',
    level: 'x1.55',
  },
  {
    id: 'active',
    title: 'Aktif',
    description: 'Haftada 6-7 gun yogun egzersiz',
    level: 'x1.725',
  },
  {
    id: 'very_active',
    title: 'Cok Aktif',
    description: 'Gunluk yogun egzersiz veya fiziksel is',
    level: 'x1.9',
  },
]

export const LifestyleSelector: React.FC<LifestyleSelectorProps> = ({
  levels = defaultLevels,
  selectedId,
  onSelect,
  title = 'Aktivite Seviyeniz',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>
        Gunluk aktivite seviyenizi secin
      </Text>
      {levels.map((level) => (
        <ActivityOption
          key={level.id}
          title={level.title}
          description={level.description}
          level={level.level}
          selected={level.id === selectedId}
          onPress={() => onSelect(level.id)}
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
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
})
