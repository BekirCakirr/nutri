import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface ListItemProps {
  title: string
  subtitle?: string
  leftIcon?: React.ReactNode
  rightElement?: React.ReactNode
  showChevron?: boolean
  onPress?: () => void
  disabled?: boolean
  style?: ViewStyle
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftIcon,
  rightElement,
  showChevron = true,
  onPress,
  disabled = false,
  style,
}) => {
  const Container = onPress ? TouchableOpacity : View

  return (
    <Container
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.container, disabled && styles.disabled, style]}
    >
      {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {rightElement}
      {showChevron && onPress && (
        <Text style={styles.chevron}>{'\u203A'}</Text>
      )}
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.paper,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: fontSizes.h3,
    color: colors.text.disabled,
    marginLeft: spacing.sm,
  },
})
