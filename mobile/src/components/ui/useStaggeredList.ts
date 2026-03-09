import { useRef, useEffect } from 'react'
import { Animated, Easing } from 'react-native'
import { duration, stagger } from '../../theme/animations'

export function useStaggeredList(itemCount: number, baseDelay = 0) {
  const maxItems = Math.min(itemCount, 20)
  const anims = useRef(
    Array.from({ length: maxItems }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(12),
    })),
  ).current

  useEffect(() => {
    const animations = anims.slice(0, maxItems).map((anim, index) => {
      const delay = baseDelay + index * stagger.normal
      return Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: duration.normal,
          delay,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: duration.normal,
          delay,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    })
    Animated.parallel(animations).start()
  }, [itemCount])

  return anims.slice(0, maxItems).map((anim) => ({
    opacity: anim.opacity,
    transform: [{ translateY: anim.translateY }],
  }))
}
