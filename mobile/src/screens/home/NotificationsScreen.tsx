import React, { useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { NotificationItem } from '../../components/notifications/NotificationItem'
import { mockNotifications } from '../../mock/notifications'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

// Group notifications by date
function groupByDate(notifications: typeof mockNotifications) {
  const groups: Record<string, typeof mockNotifications> = {}
  notifications.forEach((n) => {
    const date = new Date(n.createdAt).toLocaleDateString('tr-TR', {
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
  const [notifications, setNotifications] = useState(mockNotifications)
  const grouped = groupByDate(notifications)

  const handlePress = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

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
      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off-outline" size={48} color={colors.text.disabled} style={{ marginBottom: spacing.md }} />
          <Text style={styles.emptyTitle}>Bildirim Yok</Text>
          <Text style={styles.emptyText}>
            Henuz bildiriminiz bulunmuyor.
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
              {items.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  title={notif.title}
                  message={notif.body}
                  type={notif.type as any}
                  time={new Date(notif.createdAt).toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  read={notif.read}
                  onPress={() => handlePress(notif.id)}
                />
              ))}
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
