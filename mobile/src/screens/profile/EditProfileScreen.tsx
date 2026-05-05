import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { useAuthStore } from '../../stores/authStore'
import apiClient from '../../services/api/client'
import { colors } from '../../theme/colors'
import { fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<ProfileStackParamList>

export default function EditProfileScreen() {
  const navigation = useNavigation<Nav>()
  const user = useAuthStore((s) => s.user)
  const raw = (user ?? {}) as Record<string, unknown>

  const profile = ((raw?.profile as Record<string, unknown>) || raw || {}) as Record<string, unknown>
  const firstName = String(profile.first_name ?? raw?.firstName ?? raw?.first_name ?? '')
  const lastName = String(profile.last_name ?? raw?.lastName ?? raw?.last_name ?? '')
  const initName = `${firstName} ${lastName}`.trim()
  const initEmail = String(raw?.email ?? '')
  const initPhone = String(profile.phone ?? raw?.phone ?? '')

  const [name, setName] = useState(initName)
  const [email] = useState(initEmail)
  const [phone, setPhone] = useState(initPhone)
  const [saving, setSaving] = useState(false)

  const initials = (name || '?')
    .split(' ')
    .filter(Boolean)
    .map((n: string) => (n && n[0]) ? n[0] : '')
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'

  const handleSave = async () => {
    if (saving) return
    const trimmed = name.trim()
    if (!trimmed) {
      Alert.alert('Eksik Bilgi', 'Ad Soyad alanı boş olamaz.')
      return
    }
    setSaving(true)
    try {
      const parts = trimmed.split(/\s+/)
      // Backend expects snake_case (PUT /patients/me)
      await apiClient.put('/patients/me', {
        first_name: parts[0] || '',
        last_name: parts.slice(1).join(' ') || '',
      })
      Alert.alert('Başarılı', 'Profiliniz güncellendi.')
      navigation.goBack()
    } catch (err) {
      console.warn('Profil güncellenemedi:', err)
      Alert.alert('Hata', 'Profil güncellenemedi. Lütfen tekrar deneyin.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Profili Düzenle" onBack={() => navigation.goBack()} />
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={st.avatarArea}>
          <View style={st.avatar}>
            <Text style={st.avatarText}>{initials}</Text>
          </View>
        </View>

        {/* Form fields */}
        <View style={st.field}>
          <Text style={st.label}>Ad Soyad</Text>
          <TextInput style={st.input} value={name} onChangeText={setName} placeholder="Ad Soyad" placeholderTextColor={colors.text.disabled} />
        </View>

        <View style={st.field}>
          <Text style={st.label}>E-posta</Text>
          <TextInput style={[st.input, { backgroundColor: '#F3F4F6' }]} value={email} editable={false} />
        </View>

        <View style={st.field}>
          <Text style={st.label}>Telefon</Text>
          <TextInput style={st.input} value={phone} onChangeText={setPhone} placeholder="Telefon" placeholderTextColor={colors.text.disabled} keyboardType="phone-pad" />
        </View>

        {/* Save button */}
        <TouchableOpacity style={[st.saveBtn, saving && { opacity: 0.6 }]} activeOpacity={0.8} onPress={handleSave} disabled={saving}>
          <Text style={st.saveBtnText}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  )
}

const st = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background.default, paddingHorizontal: 20, paddingTop: 16 },
  avatarArea: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#1A2E23', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24, fontWeight: fontWeights.bold, color: '#fff' },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: fontWeights.semibold, color: colors.text.secondary, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: colors.text.primary, borderWidth: 1, borderColor: '#E8F0EC' },
  saveBtn: { backgroundColor: colors.primary.main, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  saveBtnText: { fontSize: 16, fontWeight: fontWeights.semibold, color: '#FFFFFF' },
})
