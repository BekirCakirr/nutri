import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { Avatar } from '../ui/Avatar'
import { InfoRow } from '../common/InfoRow'

interface DietitianInfoProps {
  name: string
  avatar?: string
  specialty: string
  experience: string
  education: string
  languages: string[]
  bio?: string
  style?: ViewStyle
}

export const DietitianInfo: React.FC<DietitianInfoProps> = ({
  name,
  avatar,
  specialty,
  experience,
  education,
  languages,
  bio,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Avatar source={avatar} name={name} size="xl" />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.specialty}>{specialty}</Text>
      </View>
      {bio && <Text style={styles.bio}>{bio}</Text>}
      <View style={styles.details}>
        <InfoRow label="Experience" value={experience} />
        <InfoRow label="Education" value={education} />
        <InfoRow label="Languages" value={languages.join(', ')} />
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
  header: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  name: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  specialty: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  bio: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    lineHeight: fontSizes.md * 1.6,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
})
