import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

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
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-[#1A2E23] items-center justify-center mb-3">
            <Text className="text-2xl font-bold text-white">AY</Text>
          </View>
          <TouchableOpacity>
            <Text className="text-sm font-semibold text-[#1A5C37]">Fotoğraf Değiştir</Text>
          </TouchableOpacity>
        </View>

        {/* Form fields */}
        <View className="mb-4">
          <Text className="text-sm font-semibold text-[#5A7264] mb-1.5">Ad Soyad</Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-3.5 text-base text-[#1A2E23] border border-[#E8F0EC]"
            value={name}
            onChangeText={setName}
            placeholder="Ad Soyad"
            placeholderTextColor="#A8BFB2"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-semibold text-[#5A7264] mb-1.5">E-posta</Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-3.5 text-base text-[#1A2E23] border border-[#E8F0EC]"
            value={email}
            onChangeText={setEmail}
            placeholder="E-posta"
            placeholderTextColor="#A8BFB2"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-semibold text-[#5A7264] mb-1.5">Telefon</Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-3.5 text-base text-[#1A2E23] border border-[#E8F0EC]"
            value={phone}
            onChangeText={setPhone}
            placeholder="Telefon"
            placeholderTextColor="#A8BFB2"
            keyboardType="phone-pad"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-semibold text-[#5A7264] mb-1.5">Doğum Tarihi</Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-3.5 text-base text-[#1A2E23] border border-[#E8F0EC]"
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="GG.AA.YYYY"
            placeholderTextColor="#A8BFB2"
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-semibold text-[#5A7264] mb-1.5">Cinsiyet</Text>
          <View className="flex-row gap-2">
            {genders.map((g) => (
              <TouchableOpacity
                key={g}
                className="flex-1 rounded-xl py-3 items-center border"
                style={{
                  backgroundColor: gender === g ? '#1A5C37' : '#FFFFFF',
                  borderColor: gender === g ? '#1A5C37' : '#E8F0EC',
                }}
                onPress={() => setGender(g)}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: gender === g ? '#FFFFFF' : '#5A7264' }}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity
          className="bg-[#1A5C37] rounded-xl py-4 items-center mb-4"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">Kaydet</Text>
        </TouchableOpacity>

        {/* Delete account */}
        <TouchableOpacity className="items-center mb-8" activeOpacity={0.6}>
          <Text className="text-sm text-[#EF4444]">Hesabı Sil</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
