import React from 'react'
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

interface FloatingActionButtonProps {
  icon: React.ReactNode
  onPress: () => void
  color?: string
  size?: number
  position?: 'bottom-right' | 'bottom-center'
  disabled?: boolean
  style?: ViewStyle
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onPress,
  color = colors.primary.main,
  size = 56,
  position = 'bottom-right',
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.fab,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        position === 'bottom-right' && styles.bottomRight,
        position === 'bottom-center' && styles.bottomCenter,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 100,
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
