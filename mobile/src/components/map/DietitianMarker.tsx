import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface DietitianMarkerProps {
  name: string
  rating?: number
  isAvailable?: boolean
  style?: ViewStyle
}

export const DietitianMarker: React.FC<DietitianMarkerProps> = ({
  name,
  rating,
  isAvailable = false,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.bubble}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {rating !== undefined && (
          <View style={styles.ratingRow}>
            <Text style={styles.star}>{'\u2605'}</Text>
            <Text style={styles.rating}>{rating.toFixed(1)}</Text>
          </View>
        )}
        {isAvailable && <View style={styles.availableDot} />}
      </View>
      <View style={styles.pin}>
        <View style={styles.pinInner} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  bubble: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    paddingHorizontal: spacing.sm + 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    gap: spacing.xs,
  },
  name: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    maxWidth: 100,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: fontSizes.sm,
    color: '#FFD54F',
    marginRight: 1,
  },
  rating: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  pin: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.background.paper,
  },
  pinInner: {},
})
