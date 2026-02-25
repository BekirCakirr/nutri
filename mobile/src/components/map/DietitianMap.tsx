import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface MapMarker {
  id: string
  latitude: number
  longitude: number
  name: string
}

interface DietitianMapProps {
  markers?: MapMarker[]
  selectedMarkerId?: string
  onMarkerPress?: (markerId: string) => void
  style?: ViewStyle
}

export const DietitianMap: React.FC<DietitianMapProps> = ({
  markers = [],
  selectedMarkerId,
  onMarkerPress,
  style,
}) => {
  // Placeholder - in production, integrate with react-native-maps
  return (
    <View style={[styles.container, style]}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapIcon}>{'\u{1F5FA}'}</Text>
        <Text style={styles.placeholderTitle}>Harita Gorunumu</Text>
        <Text style={styles.placeholderText}>
          Yakininizdaki diyetisyenleri haritada gorun
        </Text>
        {markers.length > 0 && (
          <View style={styles.markerCount}>
            <Text style={styles.markerCountText}>
              {markers.length} diyetisyen bulundu
            </Text>
          </View>
        )}
      </View>
      {markers.length > 0 && (
        <View style={styles.markerList}>
          {markers.map((marker) => (
            <View
              key={marker.id}
              style={[
                styles.markerDot,
                marker.id === selectedMarkerId && styles.markerDotSelected,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F0FE',
    borderRadius: borderRadius.lg,
    margin: spacing.md,
    padding: spacing.xl,
  },
  mapIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  placeholderTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  placeholderText: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  markerCount: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.md,
  },
  markerCountText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: '#FFFFFF',
  },
  markerList: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingBottom: spacing.sm,
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary[300],
  },
  markerDotSelected: {
    backgroundColor: colors.primary.main,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
})
