import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OnboardingStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'

type Nav = StackNavigationProp<OnboardingStackParamList, 'BasicInfo'>

const genders = [
  { id: 'female', label: 'Kadın', emoji: '👩' },
  { id: 'male', label: 'Erkek', emoji: '👨' },
  { id: 'other', label: 'Diğer', emoji: '🧑' },
]

export default function BasicInfoScreen() {
  const navigation = useNavigation<Nav>()
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')

  const canContinue = birthDate.trim() && gender && height.trim() && weight.trim()

  return (
    <ScreenWrapper keyboardAvoiding padded={false}>
      <OnboardingStep
        title="Temel Bilgiler"
        description="Size özel beslenme planı oluşturabilmemiz için bazı bilgilere ihtiyacımız var."
        currentStep={1}
        totalSteps={7}
      >
        <View className="gap-4">
          <Input
            label="Doğum Tarihi"
            placeholder="GG/AA/YYYY"
            value={birthDate}
            onChangeText={setBirthDate}
            keyboardType="number-pad"
          />

          <Text className="text-base font-medium text-[#1A2E23] mb-1">Cinsiyet</Text>
          <View className="flex-row gap-3 mb-4">
            {genders.map((g) => (
              <TouchableOpacity
                key={g.id}
                onPress={() => setGender(g.id)}
                className={`flex-1 py-4 rounded-xl border-2 items-center ${
                  gender === g.id
                    ? 'border-[#1A5C37] bg-[#E8F5EC]'
                    : 'border-[#D4E2DA] bg-white'
                }`}
                activeOpacity={0.7}
              >
                <Text className="text-xl mb-1">{g.emoji}</Text>
                <Text
                  className={`text-sm font-semibold ${
                    gender === g.id ? 'text-[#1A5C37]' : 'text-[#5A7264]'
                  }`}
                >
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Input
                label="Boy (cm)"
                placeholder="165"
                value={height}
                onChangeText={setHeight}
                keyboardType="number-pad"
              />
            </View>
            <View className="flex-1">
              <Input
                label="Kilo (kg)"
                placeholder="68"
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        <View className="flex-1" />
        <Button
          title="Devam Et"
          onPress={() => navigation.navigate('Goal')}
          disabled={!canContinue}
          fullWidth
          size="lg"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
        />
      </OnboardingStep>
    </ScreenWrapper>
  )
}
