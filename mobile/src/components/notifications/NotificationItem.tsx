import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

type NotificationType = 'info' | 'reminder' | 'achievement' | 'warning'

interface NotificationItemProps {
  title: string
  message: string
  time: string
  type?: NotificationType
  read?: boolean
  onPress?: () => void
  style?: ViewStyle
}

const typeColors: Record<NotificationType, string> = {
  info: colors.info,
  reminder: colors.primary.main,
  achievement: '#FFD54F',
  warning: colors.warning,
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  message,
  time,
  type = 'info',
  read = false,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        styles.container,
        !read && styles.unread,
        style,
      ]}
    >
      <View style={[styles.indicator, { backgroundColor: typeColors[type] }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, !read && styles.unreadTitle]}>{title}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </View>
      {!read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.paper,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  unread: {
    backgroundColor: colors.primary[50],
  },
  indicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
    flex: 1,
  },
  unreadTitle: {
    fontWeight: fontWeights.semibold,
  },
  time: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  message: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    lineHeight: fontSizes.md * 1.4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.main,
    marginLeft: spacing.sm,
  },
})
