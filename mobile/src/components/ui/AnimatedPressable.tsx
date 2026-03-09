import React, { useRef, useCallback, memo } from 'react'
import { Animated, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { spring as springConfig } from '../../theme/animations'

interface AnimatedPressableProps extends TouchableOpacityProps {
  scaleValue?: number
}

export const AnimatedPressable: React.FC<AnimatedPressableProps> = memo(({
  children,
  onPressIn,
  onPressOut,
  scaleValue = 0.97,
  style,
  ...props
}) => {
  const scale = useRef(new Animated.Value(1)).current

  const handlePressIn = useCallback(
    (e: any) => {
      Animated.spring(scale, {
        toValue: scaleValue,
        ...springConfig.default,
      }).start()
      onPressIn?.(e)
    },
    [scale, scaleValue, onPressIn],
  )

  const handlePressOut = useCallback(
    (e: any) => {
      Animated.spring(scale, {
        toValue: 1,
        ...springConfig.bouncy,
      }).start()
      onPressOut?.(e)
    },
    [scale, onPressOut],
  )

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style}
        {...props}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  )
})
