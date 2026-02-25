import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface MapViewProps {
  style?: ViewStyle
  children?: React.ReactNode
}

export const MapView: React.FC<MapViewProps> = ({
  style,
  children,
}) => {
  // Placeholder - in production, integrate with react-native-maps
  return (
    <View style={[styles.container, style]}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderIcon}>{'M'}</Text>
        <Text style={styles.placeholderText}>Map View</Text>
        <Text style={styles.placeholderSubtext}>
          Integrate with react-native-maps
        </Text>
      </View>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAF6',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    fontWeight: fontWeights.bold,
    color: colors.primary[300],
    marginBottom: spacing.sm,
  },
  placeholderText: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.secondary,
  },
  placeholderSubtext: {
    fontSize: fontSizes.sm,
    color: colors.text.disabled,
    marginTop: spacing.xs,
  },
})
