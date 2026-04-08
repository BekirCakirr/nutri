import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { colors } from '../../theme/colors'
import { fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<ProfileStackParamList>

const sections = [
  { title: '1. Kabul ve Onay', content: 'NutriAI uygulamasını kullanarak bu Kullanım Şartlarını kabul etmiş olursunuz. Şartları kabul etmiyorsanız uygulamayı kullanmayınız.' },
  { title: '2. Hizmet Kapsamı', content: 'NutriAI, beslenme takibi, yapay zeka destekli yemek analizi ve kişiselleştirilmiş beslenme önerileri sunar. Uygulama tıbbi tavsiye yerine geçmez.' },
  { title: '3. Kullanım Koşulları', content: '• 18 yaşından büyük olmalısınız (veya ebeveyn izni gereklidir)\n• Doğru ve güncel bilgi sağlamalısınız\n• Hesabınızın güvenliğinden siz sorumlusunuz\n• Yasadışı amaçlarla kullanamazsınız' },
  { title: '4. Premium Abonelik', content: 'Premium özellikler aylık veya yıllık abonelik ile sunulur. Abonelik otomatik yenilenir. İptal, mevcut dönem sonunda geçerli olur. İade politikası uygulama mağazası kurallarına tabidir.' },
  { title: '5. Fikri Mülkiyet', content: "Uygulama tasarımı, logosu, içeriği ve algoritmaları NutriAI'ye aittir. İzinsiz kopyalama veya dağıtım yasaktır." },
  { title: '6. Sorumluluk Sınırlaması', content: 'NutriAI, sağlanan bilgilerin doğruluğunu garanti etmez. Beslenme önerileri genel niteliktedir ve kişisel tıbbi durumunuz için doktorunuza danışın.' },
  { title: '7. Hesap Silme', content: 'Hesabınızı istediğiniz zaman Profil > Profili Düzenle > Hesabı Sil yoluyla silebilirsiniz. Silme işlemi geri alınamaz.' },
  { title: '8. Değişiklikler', content: 'Bu şartları önceden bildirim yaparak değiştirme hakkını saklı tutarız. Değişikliklerden sonra uygulamayı kullanmaya devam etmeniz, yeni şartları kabul ettiğiniz anlamına gelir.' },
  { title: '9. İletişim', content: '📧 legal@nutriai.com\n📍 İstanbul, Türkiye\n\nSon güncelleme: 1 Mart 2026' },
]

export default function TermsOfServiceScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Kullanım Şartları" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        <Text style={st.date}>Son güncelleme: 1 Mart 2026</Text>
        {sections.map((s, i) => (
          <View key={i} style={st.section}>
            <Text style={st.sectionTitle}>{s.title}</Text>
            <Text style={st.sectionContent}>{s.content}</Text>
          </View>
        ))}
        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 20, paddingTop: 16 },
  date: { fontSize: 12, color: colors.text.disabled, marginBottom: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: fontWeights.bold, color: colors.text.primary, marginBottom: 8 },
  sectionContent: { fontSize: 14, color: colors.text.secondary, lineHeight: 20 },
})
