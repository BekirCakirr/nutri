import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProfileStackParamList>

const sections = [
  {
    title: '1. Kabul ve Onay',
    content: 'NutriAI uygulamasını kullanarak bu Kullanım Şartlarını kabul etmiş olursunuz. Şartları kabul etmiyorsanız uygulamayı kullanmayınız.',
  },
  {
    title: '2. Hizmet Kapsamı',
    content: 'NutriAI, beslenme takibi, yapay zeka destekli yemek analizi ve kişiselleştirilmiş beslenme önerileri sunar. Uygulama tıbbi tavsiye yerine geçmez.',
  },
  {
    title: '3. Kullanım Koşulları',
    content: '• 18 yaşından büyük olmalısınız (veya ebeveyn izni gereklidir)\n• Doğru ve güncel bilgi sağlamalısınız\n• Hesabınızın güvenliğinden siz sorumlusunuz\n• Yasadışı amaçlarla kullanamazsınız',
  },
  {
    title: '4. Premium Abonelik',
    content: 'Premium özellikler aylık veya yıllık abonelik ile sunulur. Abonelik otomatik yenilenir. İptal, mevcut dönem sonunda geçerli olur. İade politikası uygulama mağazası kurallarına tabidir.',
  },
  {
    title: '5. Fikri Mülkiyet',
    content: 'Uygulama tasarımı, logosu, içeriği ve algoritmaları NutriAI\'ye aittir. İzinsiz kopyalama veya dağıtım yasaktır.',
  },
  {
    title: '6. Sorumluluk Sınırlaması',
    content: 'NutriAI, sağlanan bilgilerin doğruluğunu garanti etmez. Beslenme önerileri genel niteliktedir ve kişisel tıbbi durumunuz için doktorunuza danışın.',
  },
  {
    title: '7. Hesap Silme',
    content: 'Hesabınızı istediğiniz zaman Profil > Profili Düzenle > Hesabı Sil yoluyla silebilirsiniz. Silme işlemi geri alınamaz.',
  },
  {
    title: '8. Değişiklikler',
    content: 'Bu şartları önceden bildirim yaparak değiştirme hakkını saklı tutarız. Değişikliklerden sonra uygulamayı kullanmaya devam etmeniz, yeni şartları kabul ettiğiniz anlamına gelir.',
  },
  {
    title: '9. İletişim',
    content: '📧 legal@nutriai.com\n📍 İstanbul, Türkiye\n\nSon güncelleme: 1 Mart 2026',
  },
]

export default function TermsOfServiceScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Kullanım Şartları" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-xs text-[#A8BFB2] mb-4">Son güncelleme: 1 Mart 2026</Text>

        {sections.map((s, i) => (
          <View key={i} className="mb-4">
            <Text className="text-base font-bold text-[#1A2E23] mb-2">{s.title}</Text>
            <Text className="text-sm text-[#5A7264] leading-5">{s.content}</Text>
          </View>
        ))}

        <View className="h-8" />
      </ScrollView>
    </ScreenWrapper>
  )
}
