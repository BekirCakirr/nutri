import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface WaterGlassProps {
  fillPercentage: number // 0 to 1
  size?: number
  style?: ViewStyle
}

export const WaterGlass: React.FC<WaterGlassProps> = ({
  fillPercentage,
  size = 60,
  style,
}) => {
  const clampedFill = Math.min(Math.max(fillPercentage, 0), 1)
  const glassHeight = size * 1.3
  const fillHeight = glassHeight * clampedFill

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.glass,
          { width: size, height: glassHeight },
        ]}
      >
        <View
          style={[
            styles.water,
            {
              height: fillHeight,
              backgroundColor: '#42A5F5',
            },
          ]}
        />
      </View>
      <Text style={styles.percentage}>
        {Math.round(clampedFill * 100)}%
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  glass: {
    borderWidth: 2,
    borderColor: '#90CAF9',
    borderTopWidth: 0,
    borderBottomLeftRadius: borderRadius.sm,
    borderBottomRightRadius: borderRadius.sm,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: '#E3F2FD',
  },
  water: {
    width: '100%',
    borderBottomLeftRadius: borderRadius.xs,
    borderBottomRightRadius: borderRadius.xs,
  },
  percentage: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: '#1565C0',
  },
})
