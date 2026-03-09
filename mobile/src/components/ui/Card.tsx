import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { shadows } from '../../theme/shadows'

interface CardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  headerRight?: React.ReactNode
  shadow?: boolean
  bordered?: boolean
  style?: ViewStyle
  contentStyle?: ViewStyle
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerRight,
  shadow = true,
  bordered = false,
  style,
  contentStyle,
}) => {
  return (
    <View
      style={[
        styles.card,
        shadow && styles.shadow,
        bordered && styles.bordered,
        style,
      ]}
    >
      {(title || headerRight) && (
        <View style={styles.header}>
          <View style={styles.headerText}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {headerRight}
        </View>
      )}
      <View style={contentStyle}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  shadow: {
    ...shadows.md,
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
})
