import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

interface DividerProps {
  color?: string
  thickness?: number
  marginVertical?: number
  style?: ViewStyle
}

export const Divider: React.FC<DividerProps> = ({
  color = colors.border,
  thickness = 1,
  marginVertical = spacing.md,
  style,
}) => {
  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: color, height: thickness, marginVertical },
        style,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
})
