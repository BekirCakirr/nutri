import { useRef, useEffect } from 'react'
import { Animated, Easing } from 'react-native'
import { duration } from '../../theme/animations'

export function useFadeIn(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(12)).current

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: duration.normal,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: duration.normal,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ])
    animation.start()
  }, [])

  return {
    style: {
      opacity,
      transform: [{ translateY }],
    },
  }
}
