import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProfileStackParamList>

type FAQItem = { q: string; a: string }

const faqs: FAQItem[] = [
  { q: 'AI fotoğraf analizi nasıl çalışır?', a: 'Çektiğiniz fotoğraf Google Gemini AI ile analiz edilerek besinler ve kalori değerleri tespit edilir. Sonuç genellikle 2-3 saniye içinde gelir.' },
  { q: 'Aboneliğimi nasıl iptal ederim?', a: 'Profil > Abonelik sayfasından iptal edebilirsiniz. İptal, mevcut dönemin sonunda geçerli olur.' },
  { q: 'Verilerim güvende mi?', a: 'Evet! Tüm verileriniz AES-256 ile şifrelenir ve ISO 27001 sertifikalı sunucularda saklanır.' },
  { q: 'Diyetisyen ile nasıl görüşürüm?', a: 'Profil > Diyetisyen Bağlantısı\'ndan bir diyetisyen ile eşleşebilir, mesaj gönderebilir ve randevu alabilirsiniz.' },
  { q: 'Aile modunu nasıl kurarım?', a: 'Profil > Aile Modu\'ndan aile üyelerinizi ekleyerek ortak beslenme takibi yapabilirsiniz.' },
]

export default function HelpSupportScreen() {
  const navigation = useNavigation<Nav>()
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [message, setMessage] = useState('')

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Yardım & Destek" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Quick actions */}
        <View className="flex-row mb-4 gap-3">
          <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 border border-[#E8F0EC] items-center" activeOpacity={0.7}>
            <View className="w-10 h-10 rounded-full bg-[#E8F5EC] items-center justify-center mb-2">
              <Ionicons name="chatbubble-outline" size={20} color="#1A5C37" />
            </View>
            <Text className="text-sm font-semibold text-[#1A2E23]">Canlı Destek</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 border border-[#E8F0EC] items-center" activeOpacity={0.7}>
            <View className="w-10 h-10 rounded-full bg-[#DBEAFE] items-center justify-center mb-2">
              <Ionicons name="mail-outline" size={20} color="#4A7FB5" />
            </View>
            <Text className="text-sm font-semibold text-[#1A2E23]">E-posta</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 border border-[#E8F0EC] items-center" activeOpacity={0.7}>
            <View className="w-10 h-10 rounded-full bg-[#FEF3C7] items-center justify-center mb-2">
              <Ionicons name="book-outline" size={20} color="#E8A040" />
            </View>
            <Text className="text-sm font-semibold text-[#1A2E23]">Rehber</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3">Sık Sorulan Sorular</Text>
        {faqs.map((faq, i) => (
          <TouchableOpacity
            key={i}
            className="bg-white rounded-xl p-4 mb-2.5 border border-[#E8F0EC]"
            activeOpacity={0.7}
            onPress={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
          >
            <View className="flex-row items-center">
              <Text className="flex-1 text-sm font-semibold text-[#1A2E23]">{faq.q}</Text>
              <Ionicons
                name={expandedFAQ === i ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#5A7264"
              />
            </View>
            {expandedFAQ === i && (
              <Text className="text-sm text-[#5A7264] mt-2 leading-5">{faq.a}</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Contact form */}
        <Text className="text-base font-bold text-[#1A2E23] mb-3 mt-4">Bize Yazın</Text>
        <TextInput
          className="bg-white rounded-xl px-4 py-3.5 text-base text-[#1A2E23] border border-[#E8F0EC] mb-3"
          value={message}
          onChangeText={setMessage}
          placeholder="Mesajınızı yazın..."
          placeholderTextColor="#A8BFB2"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={{ minHeight: 100 }}
        />
        <TouchableOpacity
          className="bg-[#1A5C37] rounded-xl py-4 items-center mb-8"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">Gönder</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
