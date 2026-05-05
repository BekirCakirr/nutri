import { useRef, useEffect, useMemo } from 'react'
import { Animated, Easing } from 'react-native'
import { duration, stagger } from '../../theme/animations'

const MAX_ITEMS = 20

/**
 * Returns staggered fade+slide animation styles for a list.
 * Allocates a fixed pool of MAX_ITEMS Animated.Values once, then
 * exposes only the slice needed for the current itemCount. This
 * keeps hook order stable across renders even as the list grows.
 */
export function useStaggeredList(itemCount: number, baseDelay = 0) {
  // Always allocate a fixed-size pool to keep hook order stable.
  const pool = useRef(
    Array.from({ length: MAX_ITEMS }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(12),
    })),
  ).current

  const safeCount = Math.max(0, Math.min(itemCount || 0, MAX_ITEMS))

  useEffect(() => {
    if (safeCount <= 0) return
    const animations = pool.slice(0, safeCount).map((anim, index) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeCount, baseDelay])

  return useMemo(
    () =>
      pool.slice(0, safeCount).map((anim) => ({
        opacity: anim.opacity,
        transform: [{ translateY: anim.translateY }],
      })),
    [safeCount, pool],
  )
}
