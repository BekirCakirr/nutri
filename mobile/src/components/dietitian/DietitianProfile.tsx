import React from 'react'
import { View, Text, StyleSheet, ViewStyle, ScrollView } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface DietitianProfileProps {
  name: string
  title?: string
  bio?: string
  specializations: string[]
  rating: number
  reviewCount: number
  experienceYears?: number
  education?: string
  avatar?: React.ReactNode
  isAvailable?: boolean
  style?: ViewStyle
}

export const DietitianProfile: React.FC<DietitianProfileProps> = ({
  name,
  title,
  bio,
  specializations,
  rating,
  reviewCount,
  experienceYears,
  education,
  avatar,
  isAvailable = false,
  style,
}) => {
  return (
    <ScrollView style={style} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        {avatar && <View style={styles.avatarContainer}>{avatar}</View>}
        <Text style={styles.name}>{name}</Text>
        {title && <Text style={styles.title}>{title}</Text>}
        {isAvailable && (
          <View style={styles.availableBadge}>
            <View style={styles.availableDot} />
            <Text style={styles.availableText}>Musait</Text>
          </View>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{rating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Puan</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{reviewCount}</Text>
          <Text style={styles.statLabel}>Degerlendirme</Text>
        </View>
        {experienceYears != null && (
          <>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{experienceYears}+</Text>
              <Text style={styles.statLabel}>Yil Deneyim</Text>
            </View>
          </>
        )}
      </View>

      {bio && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hakkinda</Text>
          <Text style={styles.bioText}>{bio}</Text>
        </View>
      )}

      {specializations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uzmanlik Alanlari</Text>
          <View style={styles.chipContainer}>
            {specializations.map((spec, index) => (
              <View key={index} style={styles.chip}>
                <Text style={styles.chipText}>{spec}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {education && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Egitim</Text>
          <Text style={styles.educationText}>{education}</Text>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  name: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  title: {
    fontSize: fontSizes.lg,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: spacing.xs,
  },
  availableText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.primary[800],
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.paper,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  statValue: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  section: {
    backgroundColor: colors.background.paper,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  bioText: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    lineHeight: fontSizes.md * 1.6,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
  },
  chipText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.primary[800],
  },
  educationText: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    lineHeight: fontSizes.md * 1.5,
  },
})
