import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'

interface DietitianCardProps {
  name: string
  specialty: string
  rating: number
  reviewCount: number
  avatar?: string
  isAvailable?: boolean
  onPress?: () => void
  style?: ViewStyle
}

export const DietitianCard: React.FC<DietitianCardProps> = ({
  name,
  specialty,
  rating,
  reviewCount,
  avatar,
  isAvailable = false,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.container, style]}
    >
      <Avatar source={avatar} name={name} size="lg" />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.specialty}>{specialty}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>{'\u2605'}</Text>
          <Text style={styles.rating}>{rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({reviewCount} reviews)</Text>
        </View>
      </View>
      {isAvailable && <Badge label="Available" variant="success" size="sm" />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  specialty: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  star: {
    fontSize: fontSizes.md,
    color: '#FFD54F',
    marginRight: 2,
  },
  rating: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  reviews: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
})
