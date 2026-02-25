import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius } from '../../theme/spacing'

interface SkeletonProps {
  width: number | string
  height: number
  borderRadiusValue?: number
  circle?: boolean
  style?: ViewStyle
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadiusValue = borderRadius.sm,
  circle = false,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [opacity])

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as number,
          height,
          borderRadius: circle ? height / 2 : borderRadiusValue,
          opacity,
        },
        style,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border,
  },
})
