import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { colors } from '../../theme/colors'
import { fontWeights } from '../../theme/typography'

type Notification = {
  id: string
  title: string
  message: string
  time: string
  type: 'alert' | 'success' | 'info' | 'reminder'
  read: boolean
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Su İçme Vakti', message: 'Uzun süredir su içmedin. Hedefine ulaşmak için 1 bardak su iç!', time: '10 dk önce', type: 'reminder', read: false },
  { id: '2', title: 'Hedefine Ulaştın! 🏆', message: 'Tebrikler! Dün 10.000 adım hedefini tamamladın.', time: '2 saat önce', type: 'success', read: false },
  { id: '3', title: 'Öğle Yemeği Kaydı', message: 'Öğle yemeğini kaydetmeyi unuttun mu?', time: '4 saat önce', type: 'reminder', read: true },
  { id: '4', title: 'Yeni Mesaj (Diyetisyen)', message: 'Dyt. Buse Hanım sana yeni bir mesaj gönderdi.', time: 'Dün, 14:30', type: 'info', read: true },
  { id: '5', title: 'Alerjen Uyarısı', message: 'Son taradığın üründe gluten tespit edildi!', time: 'Dün, 09:15', type: 'alert', read: true },
]

function getTypeColor(type: string) {
  switch (type) {
    case 'alert': return '#EF4444'
    case 'success': return '#10B981'
    case 'info': return '#3B82F6'
    case 'reminder': return '#60A5FA'
    default: return '#1A5C37'
  }
}

function getTypeBg(type: string) {
  switch (type) {
    case 'alert': return '#FEE2E2'
    case 'success': return '#D1FAE5'
    case 'info': return '#DBEAFE'
    case 'reminder': return '#EFF6FF'
    default: return '#E8F5EC'
  }
}

function getIcon(type: Notification['type']): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'alert': return 'warning'
    case 'success': return 'trophy'
    case 'info': return 'chatbubble-ellipses'
    case 'reminder': return 'water'
    default: return 'notifications'
  }
}

export default function NotificationsScreen() {
  const navigation = useNavigation()

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <AppHeader
        title="Bildirimler"
        onBack={() => navigation.goBack()}
        rightIcon="checkmark-done-outline"
        onRightPress={() => {}}
      />

      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        <View style={st.list}>
          {mockNotifications.map((noti) => (
            <TouchableOpacity
              key={noti.id}
              style={[st.card, noti.read ? st.cardRead : st.cardUnread]}
              activeOpacity={0.7}
            >
              <View style={[st.iconWrap, { backgroundColor: getTypeBg(noti.type) }]}>
                <Ionicons name={getIcon(noti.type)} size={24} color={getTypeColor(noti.type)} />
              </View>

              <View style={st.cardContent}>
                <View style={st.cardTopRow}>
                  <Text style={[st.cardTitle, !noti.read && st.cardTitleUnread]} numberOfLines={1}>
                    {noti.title}
                  </Text>
                  <Text style={st.cardTime}>{noti.time}</Text>
                </View>
                <Text style={[st.cardMessage, !noti.read && st.cardMessageUnread]}>
                  {noti.message}
                </Text>
              </View>

              {!noti.read && <View style={st.unreadDot} />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
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
})
