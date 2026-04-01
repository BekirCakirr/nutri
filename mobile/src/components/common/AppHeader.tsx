import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface AppHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  leftAction?: React.ReactNode
  rightAction?: React.ReactNode
  rightIcon?: string
  onRightPress?: () => void
  transparent?: boolean
  style?: ViewStyle
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBack,
  leftAction,
  rightAction,
  rightIcon,
  onRightPress,
  transparent = false,
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        transparent ? styles.transparent : styles.solid,
        style,
      ]}
    >
      <View style={styles.left}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        ) : leftAction ? (
          <View>{leftAction}</View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        )}
      </View>
      <View style={styles.right}>
        {rightAction ? rightAction : (rightIcon && onRightPress) ? <TouchableOpacity onPress={onRightPress} style={styles.backButton}><Ionicons name={rightIcon as keyof typeof Ionicons.glyphMap} size={24} color={colors.text.primary} /></TouchableOpacity> : <View style={styles.placeholder} />}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: spacing.md,
  },
  solid: {
    backgroundColor: colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  left: {
    width: 56,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 56,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 1,
  },
  placeholder: {
    width: 40,
  },
})
