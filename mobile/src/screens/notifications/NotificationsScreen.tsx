import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { useNotifications } from '../../hooks'
import type { AppNotification } from '../../types'
import { colors } from '../../theme/colors'
import { fontWeights } from '../../theme/typography'

function getTypeColor(type: string) {
  switch (type) {
    case 'alert': return '#EF4444'
    case 'achievement': return '#10B981'
    case 'message': return '#3B82F6'
    case 'meal_reminder':
    case 'water_reminder': return '#60A5FA'
    case 'appointment': return '#F59E0B'
    case 'plan_update': return '#8B5CF6'
    case 'system': return '#6B7280'
    default: return '#1A5C37'
  }
}

function getTypeBg(type: string) {
  switch (type) {
    case 'alert': return '#FEE2E2'
    case 'achievement': return '#D1FAE5'
    case 'message': return '#DBEAFE'
    case 'meal_reminder':
    case 'water_reminder': return '#EFF6FF'
    case 'appointment': return '#FEF3C7'
    case 'plan_update': return '#EDE9FE'
    case 'system': return '#F3F4F6'
    default: return '#E8F5EC'
  }
}

function getIcon(type: string): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'alert': return 'warning'
    case 'achievement': return 'trophy'
    case 'message': return 'chatbubble-ellipses'
    case 'meal_reminder': return 'restaurant'
    case 'water_reminder': return 'water'
    case 'appointment': return 'calendar'
    case 'plan_update': return 'document-text'
    case 'system': return 'information-circle'
    default: return 'notifications'
  }
}

function formatTime(dateStr?: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'Şimdi'
  if (diffMin < 60) return `${diffMin} dk önce`
  if (diffHr < 24) return `${diffHr} saat önce`
  if (diffDay < 7) return `${diffDay} gün önce`
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

export default function NotificationsScreen() {
  const navigation = useNavigation()
  const { notifications, loadNotifications, markRead, markAllRead } = useNotifications()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadNotifications()
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [loadNotifications])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadNotifications().catch(() => {})
    setRefreshing(false)
  }, [loadNotifications])

  const handleMarkAllRead = useCallback(async () => {
    await markAllRead().catch(() => {})
  }, [markAllRead])

  const handleNotificationPress = useCallback(
    async (noti: AppNotification) => {
      if (!noti.read) {
        await markRead(noti.id).catch(() => {})
      }
    },
    [markRead],
  )

  if (loading) {
    return (
      <ScreenWrapper padded={false} scrollable={false}>
        <AppHeader title="Bildirimler" onBack={() => navigation.goBack()} />
        <View style={st.center}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <AppHeader
        title="Bildirimler"
        onBack={() => navigation.goBack()}
        rightIcon="checkmark-done-outline"
        onRightPress={handleMarkAllRead}
      />

      <ScrollView
        style={st.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.main]}
            tintColor={colors.primary.main}
          />
        }
      >
        {notifications.length === 0 ? (
          <View style={st.emptyContainer}>
            <View style={st.emptyIcon}>
              <Ionicons name="notifications-off-outline" size={56} color={colors.text.disabled} />
            </View>
            <Text style={st.emptyTitle}>Bildirim yok</Text>
            <Text style={st.emptyDesc}>Yeni bildirimleriniz burada görünecek.</Text>
          </View>
        ) : (
          <View style={st.list}>
            {notifications.map((noti) => {
              const raw = noti as Record<string, unknown>
              const notiType = noti.type || (raw.type as string) || 'system'
              const isRead = noti.read ?? (raw.is_read as boolean) ?? false
              const title = noti.title || (raw.title as string) || ''
              const body = noti.body || (raw.body as string) || (raw.message as string) || ''
              const time = formatTime(noti.createdAt || (raw.created_at as string))

              return (
                <TouchableOpacity
                  key={noti.id}
                  style={[st.card, isRead ? st.cardRead : st.cardUnread]}
                  activeOpacity={0.7}
                  onPress={() => handleNotificationPress(noti)}
                >
                  <View style={[st.iconWrap, { backgroundColor: getTypeBg(notiType) }]}>
                    <Ionicons name={getIcon(notiType)} size={24} color={getTypeColor(notiType)} />
                  </View>

                  <View style={st.cardContent}>
                    <View style={st.cardTopRow}>
                      <Text style={[st.cardTitle, !isRead && st.cardTitleUnread]} numberOfLines={1}>
                        {title}
                      </Text>
                      <Text style={st.cardTime}>{time}</Text>
                    </View>
                    <Text style={[st.cardMessage, !isRead && st.cardMessageUnread]}>
                      {body}
                    </Text>
                  </View>

                  {!isRead && <View style={st.unreadDot} />}
                </TouchableOpacity>
              )
            })}
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 16, paddingTop: 16 },
  list: { gap: 12, paddingBottom: 32 },
  card: { flexDirection: 'row', padding: 16, borderRadius: 16, borderWidth: 1, position: 'relative' },
  cardRead: { backgroundColor: '#FFFFFF', borderColor: '#E8F0EC' },
  cardUnread: { backgroundColor: colors.primary[50], borderColor: `${colors.primary.main}33` },
  iconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  cardContent: { flex: 1 },
  cardTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 },
  cardTitle: { fontWeight: fontWeights.bold, fontSize: 14, color: colors.text.primary, flex: 1, paddingRight: 8 },
  cardTitleUnread: { color: colors.primary.main },
  cardTime: { fontSize: 10, color: colors.text.disabled },
  cardMessage: { fontSize: 13, lineHeight: 20, letterSpacing: 0.3, color: colors.text.secondary },
  cardMessageUnread: { color: colors.text.primary, fontWeight: fontWeights.medium },
  unreadDot: { position: 'absolute', top: 16, right: 16, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: fontWeights.bold, color: colors.text.primary, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: colors.text.secondary, textAlign: 'center' },
})
