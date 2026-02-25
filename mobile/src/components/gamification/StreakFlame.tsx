import React, { useEffect, useRef } from 'react'
import { Animated, Text, StyleSheet, ViewStyle, View } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface StreakFlameProps {
  streak: number
  animated?: boolean
  size?: number
  style?: ViewStyle
}

export const StreakFlame: React.FC<StreakFlameProps> = ({
  streak,
  animated = true,
  size = 48,
  style,
}) => {
  const scale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (animated && streak > 0) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.15,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      )
      animation.start()
      return () => animation.stop()
    }
  }, [animated, streak, scale])

  const flameColor = streak >= 30 ? '#FF5722' : streak >= 7 ? '#FF9800' : '#FFC107'

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.flameContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: flameColor + '20',
            transform: [{ scale: animated ? scale : 1 }],
          },
        ]}
      >
        <Text style={[styles.flame, { fontSize: size * 0.5, color: flameColor }]}>
          {'*'}
        </Text>
      </Animated.View>
      <Text style={styles.count}>{streak}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  flameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flame: {
    fontWeight: fontWeights.bold,
  },
  count: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
})
