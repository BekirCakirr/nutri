import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { colors } from '../../theme/colors'
import { fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<ProfileStackParamList>

export default function EditProfileScreen() {
  const navigation = useNavigation<Nav>()
  const [name, setName] = useState('Ahmet Yılmaz')
  const [email, setEmail] = useState('ahmet@email.com')
  const [phone, setPhone] = useState('+90 555 123 4567')
  const [birthDate, setBirthDate] = useState('15.06.1995')
  const [gender, setGender] = useState<'Erkek' | 'Kadın' | 'Diğer'>('Erkek')

  const genders = ['Erkek', 'Kadın', 'Diğer'] as const

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Profili Düzenle" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={st.avatarArea}>
          <View style={st.avatar}>
            <Text style={st.avatarText}>AY</Text>
          </View>
          <TouchableOpacity>
            <Text style={st.changePhotoText}>Fotoğraf Değiştir</Text>
          </TouchableOpacity>
        </View>

        {/* Form fields */}
        <View style={st.field}>
          <Text style={st.label}>Ad Soyad</Text>
          <TextInput style={st.input} value={name} onChangeText={setName} placeholder="Ad Soyad" placeholderTextColor={colors.text.disabled} />
        </View>

        <View style={st.field}>
          <Text style={st.label}>E-posta</Text>
          <TextInput style={st.input} value={email} onChangeText={setEmail} placeholder="E-posta" placeholderTextColor={colors.text.disabled} keyboardType="email-address" autoCapitalize="none" />
        </View>

        <View style={st.field}>
          <Text style={st.label}>Telefon</Text>
          <TextInput style={st.input} value={phone} onChangeText={setPhone} placeholder="Telefon" placeholderTextColor={colors.text.disabled} keyboardType="phone-pad" />
        </View>

        <View style={st.field}>
          <Text style={st.label}>Doğum Tarihi</Text>
          <TextInput style={st.input} value={birthDate} onChangeText={setBirthDate} placeholder="GG.AA.YYYY" placeholderTextColor={colors.text.disabled} />
        </View>

        <View style={st.fieldLarge}>
          <Text style={st.label}>Cinsiyet</Text>
          <View style={st.genderRow}>
            {genders.map((g) => (
              <TouchableOpacity
                key={g}
                style={[st.genderBtn, gender === g ? st.genderBtnActive : st.genderBtnInactive]}
                onPress={() => setGender(g)}
              >
                <Text style={[st.genderText, { color: gender === g ? '#FFFFFF' : colors.text.secondary }]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity style={st.saveBtn} activeOpacity={0.8}>
          <Text style={st.saveBtnText}>Kaydet</Text>
        </TouchableOpacity>

        {/* Delete account */}
        <TouchableOpacity style={st.deleteBtn} activeOpacity={0.6}>
          <Text style={st.deleteText}>Hesabı Sil</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 20, paddingTop: 16 },
  avatarArea: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#1A2E23', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 24, fontWeight: fontWeights.bold, color: '#fff' },
  changePhotoText: { fontSize: 14, fontWeight: fontWeights.semibold, color: colors.primary.main },
  field: { marginBottom: 16 },
  fieldLarge: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: fontWeights.semibold, color: colors.text.secondary, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: colors.text.primary, borderWidth: 1, borderColor: '#E8F0EC' },
  genderRow: { flexDirection: 'row', gap: 8 },
  genderBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1 },
  genderBtnActive: { backgroundColor: colors.primary.main, borderColor: colors.primary.main },
  genderBtnInactive: { backgroundColor: '#FFFFFF', borderColor: '#E8F0EC' },
  genderText: { fontSize: 14, fontWeight: fontWeights.semibold },
  saveBtn: { backgroundColor: colors.primary.main, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 16, shadowColor: colors.primary.main, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  saveBtnText: { fontSize: 16, fontWeight: fontWeights.semibold, color: '#fff' },
  deleteBtn: { alignItems: 'center', marginBottom: 32 },
  deleteText: { fontSize: 14, color: '#EF4444' },
})
