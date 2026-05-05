import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RouteProp } from '@react-navigation/native'
import type { HomeStackParamList } from '../../navigation/types'
import { ChatBubble } from '../../components/chat/ChatBubble'
import { ChatInput } from '../../components/chat/ChatInput'
import { ChatHeader } from '../../components/chat/ChatHeader'
import { useMessages } from '../../hooks'
import { useAuthStore } from '../../stores/authStore'
import type { Message } from '../../types'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<HomeStackParamList, 'Chat'>
type Route = RouteProp<HomeStackParamList, 'Chat'>

function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatScreen() {
  const navigation = useNavigation<Nav>()
  const route = useRoute<Route>()
  const conversationId = route.params?.conversationId || ''
  const recipientName = route.params?.recipientName || 'Diyetisyen'
  const recipientAvatarUri = `https://i.pravatar.cc/300?u=${encodeURIComponent(
    conversationId || recipientName,
  )}`
  const recipientAvatar = (
    <Image
      source={{ uri: recipientAvatarUri }}
      style={{ width: 40, height: 40, borderRadius: 20 }}
    />
  )

  const {
    messages,
    loadMessages,
    sendMessage,
    markConversationRead,
    setActiveChat,
  } = useMessages()
  const currentUserId = useAuthStore((s) => s.user?.id)

  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    if (!conversationId) {
      setLoading(false)
      return
    }
    setActiveChat(conversationId)
    Promise.all([
      loadMessages(conversationId),
      markConversationRead(conversationId),
    ])
      .catch(() => {})
      .finally(() => setLoading(false))

    return () => {
      setActiveChat(null)
    }
  }, [conversationId, loadMessages, markConversationRead, setActiveChat])

  const handleSend = useCallback(
    async (content: string) => {
      if (sending) return
      setSending(true)
      try {
        await sendMessage(conversationId, content)
        // Scroll to bottom after sending
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true })
        }, 100)
      } catch (err) {
        console.warn('Mesaj gönderilemedi:', err)
      } finally {
        setSending(false)
      }
    },
    [conversationId, sendMessage, sending],
  )

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => {
      const raw = item as Record<string, unknown>
      const senderId = item.senderId || (raw.sender_id as string)
      const isSent = senderId === currentUserId
      const timestamp =
        item.timestamp || (raw.created_at as string) || (raw.createdAt as string) || ''
      const content = item.content || (raw.content as string) || ''
      const isRead = item.read ?? (raw.is_read as boolean) ?? false

      return (
        <ChatBubble
          message={content}
          timestamp={formatMessageTime(timestamp)}
          isSent={isSent}
          isRead={isRead}
          senderName={!isSent ? recipientName : undefined}
        />
      )
    },
    [currentUserId, recipientName],
  )

  // Sort messages chronologically
  const sortedMessages = [...messages].sort((a, b) => {
    const rawA = a as Record<string, unknown>
    const rawB = b as Record<string, unknown>
    const tA = a.timestamp || (rawA.created_at as string) || ''
    const tB = b.timestamp || (rawB.created_at as string) || ''
    return new Date(tA).getTime() - new Date(tB).getTime()
  })

  if (loading) {
    return (
      <View style={st.container}>
        <ChatHeader
          name={recipientName}
          subtitle="Diyetisyen"
          avatar={recipientAvatar}
          onBack={() => navigation.goBack()}
        />
        <View style={st.center}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={st.loadingText}>Mesajlar yükleniyor...</Text>
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={st.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ChatHeader
        name={recipientName}
        subtitle="Diyetisyen"
        isOnline
        avatar={recipientAvatar}
        onBack={() => navigation.goBack()}
      />

      {sortedMessages.length === 0 ? (
        <View style={st.center}>
          <Text style={st.emptyText}>Henüz mesaj yok</Text>
          <Text style={st.emptySubtext}>İlk mesajı gönderin!</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={sortedMessages}
          keyExtractor={(item, idx) => item?.id ?? `msg-${idx}`}
          renderItem={renderMessage}
          contentContainerStyle={st.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: false })
          }}
        />
      )}

      <ChatInput
        onSend={handleSend}
        disabled={sending || !conversationId}
        placeholder={conversationId ? 'Mesaj yazın...' : 'Konuşma yüklenemedi'}
      />
    </KeyboardAvoidingView>
  )
}

const st = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSizes.md,
    color: colors.text.secondary,
  },
  messageList: {
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: fontSizes.md,
    color: colors.text.disabled,
  },
})
