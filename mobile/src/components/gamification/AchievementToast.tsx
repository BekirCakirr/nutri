import React, { useEffect, useRef } from 'react'
import { Animated, View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface AchievementToastProps {
  title: string
  description: string
  icon?: React.ReactNode
  visible: boolean
  onDismiss?: () => void
  duration?: number
  style?: ViewStyle
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  title,
  description,
  icon,
  visible,
  onDismiss,
  duration = 4000,
  style,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 15,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()

      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onDismiss?.())
      }, duration)

      return () => clearTimeout(timeout)
    }
  }, [visible, duration, translateY, opacity, onDismiss])

  if (!visible) return null

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }], opacity },
        style,
      ]}
    >
      <View style={styles.iconContainer}>
        {icon || <Text style={styles.defaultIcon}>{'*'}</Text>}
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Achievement Unlocked!</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B5E20',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  defaultIcon: {
    fontSize: fontSizes.h3,
    color: '#FFD54F',
    fontWeight: fontWeights.bold,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    color: '#A5D6A7',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: '#FFFFFF',
    marginTop: 1,
  },
  description: {
    fontSize: fontSizes.sm,
    color: '#C8E6C9',
    marginTop: 1,
  },
})
