import React from 'react'
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes } from '../../theme/typography'

interface LoadingSpinnerProps {
  size?: 'small' | 'large'
  color?: string
  message?: string
  fullScreen?: boolean
  style?: ViewStyle
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = colors.primary.main,
  message,
  fullScreen = false,
  style,
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen, style]}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    marginTop: spacing.sm,
    fontSize: fontSizes.md,
    color: colors.text.secondary,
  },
})
