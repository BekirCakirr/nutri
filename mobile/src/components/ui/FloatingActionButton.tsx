import React, { useRef, useEffect, useCallback, memo } from 'react'
import { TouchableOpacity, StyleSheet, ViewStyle, Animated } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { shadows } from '../../theme/shadows'
import { spring as springConfig } from '../../theme/animations'

interface FloatingActionButtonProps {
  icon: React.ReactNode
  onPress: () => void
  color?: string
  size?: number
  position?: 'bottom-right' | 'bottom-center'
  disabled?: boolean
  style?: ViewStyle
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = memo(({
  icon,
  onPress,
  color = colors.primary.main,
  size = 56,
  position = 'bottom-right',
  disabled = false,
  style,
}) => {
  const scale = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      ...springConfig.bouncy,
    }).start()
  }, [])

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.85,
      ...springConfig.default,
    }).start()
  }, [scale])

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      ...springConfig.bouncy,
    }).start()
  }, [scale])

  return (
    <Animated.View
      style={[
        styles.fab,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ scale }],
        },
        position === 'bottom-right' && styles.bottomRight,
        position === 'bottom-center' && styles.bottomCenter,
        disabled && styles.disabled,
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
        style={styles.touchable}
      >
        {icon}
      </TouchableOpacity>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
    zIndex: 100,
  },
  touchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRight: {
    bottom: spacing.lg,
    right: spacing.lg,
  },
  bottomCenter: {
    bottom: spacing.lg,
    alignSelf: 'center',
    right: '50%',
    transform: [{ translateX: 28 }],
  },
  disabled: {
    opacity: 0.5,
  },
})
