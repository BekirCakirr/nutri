import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface DietitianMapCardProps {
  name: string
  specialty: string
  rating: number
  distance?: string
  address?: string
  isAvailable?: boolean
  onPress?: () => void
  onDirections?: () => void
  style?: ViewStyle
}

export const DietitianMapCard: React.FC<DietitianMapCardProps> = ({
  name,
  specialty,
  rating,
  distance,
  address,
  isAvailable = false,
  onPress,
  onDirections,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
      style={[styles.container, style]}
    >
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.specialty}>{specialty}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.star}>{'\u2605'}</Text>
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>
      </View>
      {address && (
        <Text style={styles.address} numberOfLines={2}>{address}</Text>
      )}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          {distance && (
            <Text style={styles.distance}>{distance}</Text>
          )}
          {isAvailable && (
            <View style={styles.availableBadge}>
              <View style={styles.availableDot} />
              <Text style={styles.availableText}>Musait</Text>
            </View>
          )}
        </View>
        {onDirections && (
          <TouchableOpacity
            onPress={onDirections}
            style={styles.directionsButton}
            activeOpacity={0.7}
          >
            <Text style={styles.directionsText}>Yol Tarifi</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
    marginRight: spacing.sm,
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
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  star: {
    fontSize: fontSizes.sm,
    color: '#FFD54F',
    marginRight: 2,
  },
  ratingText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  address: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    lineHeight: fontSizes.sm * 1.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  distance: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: spacing.xs,
  },
  availableText: {
    fontSize: fontSizes.sm,
    color: colors.success,
    fontWeight: fontWeights.medium,
  },
  directionsButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary[50],
    borderRadius: borderRadius.md,
  },
  directionsText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.primary.main,
  },
})
