import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface QRScannerProps {
  onScan?: (data: string) => void
  style?: ViewStyle
}

export const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  style,
}) => {
  // Placeholder - in production, integrate with react-native-camera or expo-barcode-scanner
  return (
    <View style={[styles.container, style]}>
      <View style={styles.scanArea}>
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
        <Text style={styles.placeholder}>Camera Preview</Text>
      </View>
      <Text style={styles.instruction}>
        Point your camera at the QR code to scan
      </Text>
    </View>
  )
}

const cornerSize = 24
const cornerWidth = 3

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.md,
  },
  scanArea: {
    width: 240,
    height: 240,
    backgroundColor: '#1a1a1a',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  placeholder: {
    color: colors.text.disabled,
    fontSize: fontSizes.md,
  },
  corner: {
    position: 'absolute',
    width: cornerSize,
    height: cornerSize,
  },
  topLeft: {
    top: spacing.md,
    left: spacing.md,
    borderTopWidth: cornerWidth,
    borderLeftWidth: cornerWidth,
    borderColor: colors.primary.main,
  },
  topRight: {
    top: spacing.md,
    right: spacing.md,
    borderTopWidth: cornerWidth,
    borderRightWidth: cornerWidth,
    borderColor: colors.primary.main,
  },
  bottomLeft: {
    bottom: spacing.md,
    left: spacing.md,
    borderBottomWidth: cornerWidth,
    borderLeftWidth: cornerWidth,
    borderColor: colors.primary.main,
  },
  bottomRight: {
    bottom: spacing.md,
    right: spacing.md,
    borderBottomWidth: cornerWidth,
    borderRightWidth: cornerWidth,
    borderColor: colors.primary.main,
  },
  instruction: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
})
