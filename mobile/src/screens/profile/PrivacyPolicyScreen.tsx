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
  { title: '1. Giriş', content: 'NutriAI uygulaması ("Uygulama"), kişisel sağlık ve beslenme takibi hizmeti sunmaktadır. Bu Gizlilik Politikası, kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.' },
  { title: '2. Toplanan Veriler', content: '• Ad, e-posta, doğum tarihi gibi kimlik bilgileri\n• Boy, kilo, vücut ölçüleri gibi sağlık verileri\n• Beslenme ve öğün kayıtları\n• İlerleme fotoğrafları\n• Cihaz bilgileri ve kullanım istatistikleri' },
  { title: '3. Verilerin Kullanımı', content: 'Topladığımız veriler:\n• Kişiselleştirilmiş beslenme önerileri sunmak\n• Yapay zeka ile yemek analizi yapmak\n• Sağlık istatistiklerinizi takip etmek\n• Uygulama deneyimini iyileştirmek\namacıyla kullanılır.' },
  { title: '4. Veri Güvenliği', content: 'Verileriniz AES-256 şifreleme ile korunur. SSL/TLS protokolü ile iletilir. Sunucularımız ISO 27001 sertifikalı veri merkezlerinde barınır.' },
  { title: '5. Üçüncü Taraf Paylaşımı', content: 'Kişisel verileriniz, açık onayınız olmadan üçüncü taraflarla paylaşılmaz. AI analiz hizmeti için Google Gemini API kullanılır; bu veriler anonim olarak işlenir.' },
  { title: '6. Veri Saklama Süresi', content: 'Hesabınız aktif olduğu sürece verileriniz saklanır. Hesap silme işleminden sonra verileriniz 30 gün içinde kalıcı olarak silinir.' },
  { title: '7. Haklarınız', content: 'KVKK kapsamında aşağıdaki haklara sahipsiniz:\n• Verilerinize erişim hakkı\n• Düzeltme hakkı\n• Silme hakkı\n• Veri taşınabilirliği hakkı\n• İşlemeye itiraz hakkı' },
  { title: '8. İletişim', content: 'Gizlilik ile ilgili sorularınız için:\n📧 privacy@nutriai.com\n📍 İstanbul, Türkiye' },
]

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Gizlilik Politikası" onBack={() => navigation.goBack()} />
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
