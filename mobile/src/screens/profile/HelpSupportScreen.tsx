import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { colors } from '../../theme/colors'
import { fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<ProfileStackParamList>

const faqs = [
  { q: 'AI fotoğraf analizi nasıl çalışır?', a: 'Çektiğiniz fotoğraf Google Gemini AI ile analiz edilerek besinler ve kalori değerleri tespit edilir. Sonuç genellikle 2-3 saniye içinde gelir.' },
  { q: 'Aboneliğimi nasıl iptal ederim?', a: 'Profil > Abonelik sayfasından iptal edebilirsiniz. İptal, mevcut dönemin sonunda geçerli olur.' },
  { q: 'Verilerim güvende mi?', a: 'Evet! Tüm verileriniz AES-256 ile şifrelenir ve ISO 27001 sertifikalı sunucularda saklanır.' },
  { q: 'Diyetisyen ile nasıl görüşürüm?', a: "Profil > Diyetisyen Bağlantısı'ndan bir diyetisyen ile eşleşebilir, mesaj gönderebilir ve randevu alabilirsiniz." },
  { q: 'Aile modunu nasıl kurarım?', a: "Profil > Aile Modu'ndan aile üyelerinizi ekleyerek ortak beslenme takibi yapabilirsiniz." },
]

const quickActions = [
  { icon: 'chatbubble-outline' as const, label: 'Canlı Destek', bg: colors.primary[50], color: colors.primary.main },
  { icon: 'mail-outline' as const, label: 'E-posta', bg: '#DBEAFE', color: '#4A7FB5' },
  { icon: 'book-outline' as const, label: 'Rehber', bg: '#FEF3C7', color: '#E8A040' },
]

export default function HelpSupportScreen() {
  const navigation = useNavigation<Nav>()
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [message, setMessage] = useState('')

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Yardım & Destek" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        <View style={st.quickRow}>
          {quickActions.map((a, i) => (
            <TouchableOpacity key={i} style={st.quickCard} activeOpacity={0.7}>
              <View style={[st.quickIcon, { backgroundColor: a.bg }]}><Ionicons name={a.icon} size={20} color={a.color} /></View>
              <Text style={st.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={st.sectionTitle}>Sık Sorulan Sorular</Text>
        {faqs.map((faq, i) => (
          <TouchableOpacity key={i} style={st.faqCard} activeOpacity={0.7} onPress={() => setExpandedFAQ(expandedFAQ === i ? null : i)}>
            <View style={st.faqHeader}>
              <Text style={st.faqQuestion}>{faq.q}</Text>
              <Ionicons name={expandedFAQ === i ? 'chevron-up' : 'chevron-down'} size={16} color={colors.text.secondary} />
            </View>
            {expandedFAQ === i && <Text style={st.faqAnswer}>{faq.a}</Text>}
          </TouchableOpacity>
        ))}

        <Text style={[st.sectionTitle, { marginTop: 16 }]}>Bize Yazın</Text>
        <TextInput style={st.textArea} value={message} onChangeText={setMessage} placeholder="Mesajınızı yazın..." placeholderTextColor={colors.text.disabled} multiline numberOfLines={4} textAlignVertical="top" />
        <TouchableOpacity style={st.primaryBtn} activeOpacity={0.8}>
          <Text style={st.primaryBtnText}>Gönder</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 20, paddingTop: 16 },
  quickRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  quickCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' },
  quickIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  quickLabel: { fontSize: 14, fontWeight: fontWeights.semibold, color: colors.text.primary },
  sectionTitle: { fontSize: 16, fontWeight: fontWeights.bold, color: colors.text.primary, marginBottom: 12 },
  faqCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' },
  faqHeader: { flexDirection: 'row', alignItems: 'center' },
  faqQuestion: { flex: 1, fontSize: 14, fontWeight: fontWeights.semibold, color: colors.text.primary },
  faqAnswer: { fontSize: 14, color: colors.text.secondary, marginTop: 8, lineHeight: 20 },
  textArea: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: colors.text.primary, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 12, minHeight: 100 },
  primaryBtn: { backgroundColor: colors.primary.main, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 32, shadowColor: colors.primary.main, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  primaryBtnText: { fontSize: 16, fontWeight: fontWeights.semibold, color: '#fff' },
})
