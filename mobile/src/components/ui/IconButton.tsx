import React from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'

type IconButtonVariant = 'default' | 'primary' | 'ghost'
type IconButtonSize = 'sm' | 'md' | 'lg'

interface IconButtonProps {
  icon: React.ReactNode
  onPress: () => void
  variant?: IconButtonVariant
  size?: IconButtonSize
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
}

const sizeMap: Record<IconButtonSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}) => {
  const dimension = sizeMap[size]

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'default' && styles.default,
        variant === 'ghost' && styles.ghost,
        { width: dimension, height: dimension, borderRadius: dimension / 2 },
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : colors.primary.main}
        />
      ) : (
        icon
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary.main,
  },
  default: {
    backgroundColor: colors.background.default,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
})
