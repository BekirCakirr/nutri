import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { NotificationItem } from '../../components/notifications/NotificationItem'
import { useNotifications } from '../../hooks'
import type { AppNotification } from '../../types'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

// Group notifications by date — accepts the API shape (createdAt or created_at)
function groupByDate(notifications: AppNotification[]) {
  const groups: Record<string, AppNotification[]> = {}
  notifications.forEach((n) => {
    const raw = n as Record<string, unknown>
    const dateStr = (n.createdAt as string) || (raw.created_at as string) || new Date().toISOString()
    const date = new Date(dateStr).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    if (!groups[date]) groups[date] = []
    groups[date].push(n)
  })
  return Object.entries(groups)
}

export default function NotificationsScreen() {
  const navigation = useNavigation()
  const { notifications, loadNotifications, markRead } = useNotifications()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [loadNotifications])

  const safeList = Array.isArray(notifications) ? notifications : []
  const grouped = groupByDate(safeList)

  const handlePress = (id: string) => {
    markRead(id).catch(() => {})
  }

  const unreadCount = safeList.filter((n) => !n?.read).length

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader
        title="Bildirimler"
        onBack={() => navigation.goBack()}
        rightAction={
          unreadCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          ) : undefined
        }
      />
      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      ) : safeList.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off-outline" size={48} color={colors.text.disabled} style={{ marginBottom: spacing.md }} />
          <Text style={styles.emptyTitle}>Bildirim Yok</Text>
          <Text style={styles.emptyText}>
            Henüz bildiriminiz bulunmuyor.
          </Text>
        </View>
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={([date]) => date}
          contentContainerStyle={styles.list}
          renderItem={({ item: [date, items] }) => (
            <View style={styles.group}>
              <Text style={styles.dateLabel}>{date}</Text>
              {items.map((notif) => {
                const raw = notif as Record<string, unknown>
                const type = notif.type || (raw.type as string) || 'info'
                const timeStr = (notif.createdAt as string) || (raw.created_at as string) || ''
                const body = notif.body || (raw.body as string) || (raw.message as string) || ''
                return (
                  <NotificationItem
                    key={notif.id}
                    title={notif.title || ''}
                    message={body}
                    type={
                      type === 'meal_reminder' || type === 'water_reminder' ? 'reminder' :
                      type === 'achievement' ? 'achievement' : 'info'
                    }
                    time={timeStr ? new Date(timeStr).toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : ''}
                    read={notif.read ?? (raw.is_read as boolean) ?? false}
                    onPress={() => handlePress(notif.id)}
                  />
                )
              })}
            </View>
          )}
        />
      )}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.md,
  },
  group: {
    marginBottom: spacing.lg,
  },
  dateLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  badge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
})
