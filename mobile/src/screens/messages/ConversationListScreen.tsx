import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { HomeStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { useMessages } from '../../hooks'
import { useAuthStore } from '../../stores/authStore'
import type { Conversation } from '../../types'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<HomeStackParamList, 'ConversationList'>

function formatTime(dateStr?: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'Şimdi'
  if (diffMin < 60) return `${diffMin} dk`
  if (diffHr < 24) return `${diffHr} saat`
  if (diffDay < 7) return `${diffDay} gün`
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

export default function ConversationListScreen() {
  const navigation = useNavigation<Nav>()
  const { conversations, loadConversations } = useMessages()
  const currentUserId = useAuthStore((s) => s.user?.id)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadConversations()
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [loadConversations])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadConversations().catch(() => {})
    setRefreshing(false)
  }, [loadConversations])

  const getRecipientName = (conv: Conversation): string => {
    const raw = conv as Record<string, unknown>
    // Backend flat shape: other_user_first_name / other_user_last_name
    const flatFirst = raw.other_user_first_name as string | undefined
    const flatLast = raw.other_user_last_name as string | undefined
    if (flatFirst || flatLast) {
      const full = `${flatFirst ?? ''} ${flatLast ?? ''}`.trim()
      if (full) return full
    }
    const participants = raw.participants_info || raw.participantsInfo
    if (Array.isArray(participants)) {
      const other = participants.find(
        (p: Record<string, unknown>) =>
          p.user_id !== currentUserId && p.userId !== currentUserId && p.id !== currentUserId,
      )
      if (other) {
        const name =
          (other as Record<string, unknown>).first_name ||
          (other as Record<string, unknown>).firstName ||
          (other as Record<string, unknown>).name
        const lastName =
          (other as Record<string, unknown>).last_name ||
          (other as Record<string, unknown>).lastName ||
          ''
        if (name) return `${name}${lastName ? ' ' + lastName : ''}`
      }
    }
    // Fallback: check if conversation has a name field
    if (raw.name) return String(raw.name)
    if (raw.recipientName) return String(raw.recipientName)
    return 'Diyetisyen'
  }

  const getLastMessagePreview = (conv: Conversation): string => {
    if (conv.lastMessage) {
      const content = conv.lastMessage.content || ''
      return content.length > 60 ? content.slice(0, 60) + '...' : content
    }
    const raw = conv as Record<string, unknown>
    if (raw.last_message_content) return String(raw.last_message_content).slice(0, 60)
    return 'Henüz mesaj yok'
  }

  const getLastMessageTime = (conv: Conversation): string => {
    const raw = conv as Record<string, unknown>
    const time =
      (raw.last_message_at as string) ||
      conv.updatedAt ||
      conv.lastMessage?.timestamp ||
      (raw.updated_at as string)
    return formatTime(time)
  }

  const getUnreadCount = (conv: Conversation): number => {
    const raw = conv as Record<string, unknown>
    return conv.unreadCount || Number(raw.unread_count) || 0
  }

  const renderConversation = ({ item }: { item: Conversation }) => {
    const name = getRecipientName(item) || 'Diyetisyen'
    const preview = getLastMessagePreview(item)
    const time = getLastMessageTime(item)
    const unread = getUnreadCount(item)
    const initials = (name || 'D')
      .split(' ')
      .filter(Boolean)
      .map((n) => (n && n[0]) ? n[0] : '')
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'D'

    const raw = item as Record<string, unknown>
    const avatarSeed =
      (raw.other_user_email as string) ||
      (raw.other_user_avatar as string) ||
      name ||
      String(item.id)
    const avatarUri = `https://i.pravatar.cc/300?u=${encodeURIComponent(avatarSeed)}`

    return (
      <TouchableOpacity
        style={[st.card, unread > 0 && st.cardUnread]}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate('Chat', {
            conversationId: item.id,
            recipientName: name,
          })
        }
      >
        <View style={[st.avatar, unread > 0 && st.avatarActive]}>
          <Image source={{ uri: avatarUri }} style={st.avatarImage} />
          <Text style={st.avatarText}>{initials}</Text>
          <View style={[st.onlineDot]} />
        </View>

        <View style={st.cardContent}>
          <View style={st.cardTopRow}>
            <Text style={[st.cardName, unread > 0 && st.cardNameUnread]} numberOfLines={1}>
              {name}
            </Text>
            <Text style={[st.cardTime, unread > 0 && st.cardTimeUnread]}>{time}</Text>
          </View>
          <Text style={[st.cardPreview, unread > 0 && st.cardPreviewUnread]} numberOfLines={2}>
            {preview}
          </Text>
        </View>

        {unread > 0 && (
          <View style={st.unreadBadge}>
            <Text style={st.unreadText}>{unread > 9 ? '9+' : unread}</Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <ScreenWrapper scrollable={false} padded={false}>
        <AppHeader title="Mesajlar" onBack={() => navigation.goBack()} />
        <View style={st.center}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={st.loadingText}>Konuşmalar yükleniyor...</Text>
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader
        title="Mesajlar"
        onBack={() => navigation.goBack()}
        rightIcon="create-outline"
        onRightPress={() => {}}
      />

      {conversations.length === 0 ? (
        <View style={st.center}>
          <View style={st.emptyIcon}>
            <Ionicons name="chatbubbles-outline" size={56} color={colors.text.disabled} />
          </View>
          <Text style={st.emptyTitle}>Henüz konuşma yok</Text>
          <Text style={st.emptyDesc}>
            Diyetisyeninizle eşleştiğinizde burada mesajlaşabilirsiniz.
          </Text>
        </View>
      ) : (
        <FlatList
          data={Array.isArray(conversations) ? conversations : []}
          keyExtractor={(item, idx) => item?.id ?? `conv-${idx}`}
          renderItem={renderConversation}
          contentContainerStyle={st.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary.main]}
              tintColor={colors.primary.main}
            />
          }
          ItemSeparatorComponent={() => <View style={st.separator} />}
        />
      )}
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text.secondary,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
  separator: {
    height: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardUnread: {
    backgroundColor: colors.primary[50],
    borderColor: `${colors.primary.main}25`,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 20,
    backgroundColor: '#E8F5EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  avatarActive: {
    backgroundColor: colors.primary[100],
  },
  avatarText: {
    position: 'absolute',
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.primary[700],
    opacity: 0,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cardContent: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardName: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  cardNameUnread: {
    fontWeight: fontWeights.bold,
    color: colors.primary[800],
  },
  cardTime: {
    fontSize: fontSizes.xs,
    color: colors.text.disabled,
  },
  cardTimeUnread: {
    color: colors.primary.main,
    fontWeight: fontWeights.semibold,
  },
  cardPreview: {
    fontSize: fontSizes.sm,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  cardPreviewUnread: {
    color: colors.text.primary,
    fontWeight: fontWeights.medium,
  },
  unreadBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: fontWeights.bold,
    color: '#FFFFFF',
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyDesc: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
})
