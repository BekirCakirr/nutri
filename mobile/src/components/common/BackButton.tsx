import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes } from '../../theme/typography'

interface BackButtonProps {
  onPress: () => void
  color?: string
  style?: ViewStyle
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  color = colors.text.primary,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.button, style]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={[styles.arrow, { color }]}>{'\u2190'}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: spacing.xs,
  },
  arrow: {
    fontSize: fontSizes.h3,
  },
})
