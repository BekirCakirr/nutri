import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProfileStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProfileStackParamList>

type Plan = {
  id: string
  name: string
  price: string
  period: string
  features: string[]
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Ücretsiz',
    price: '₺0',
    period: 'Süresiz',
    features: ['Temel besin takibi', 'Günde 3 AI analiz', 'Su takibi', 'Kilo kaydı'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₺79',
    period: '/ay',
    popular: true,
    features: [
      'Sınırsız AI analiz',
      'Kişisel beslenme planı',
      'Diyetisyen bağlantısı',
      'Aralıklı oruç takibi',
      'Detaylı raporlar',
      'Aile modu (3 kişiye kadar)',
      'Reklamsız deneyim',
    ],
  },
  {
    id: 'annual',
    name: 'Yıllık Premium',
    price: '₺599',
    period: '/yıl',
    features: [
      'Tüm Premium özellikler',
      '%37 indirim',
      'Öncelikli destek',
      'Aile modu (5 kişiye kadar)',
      'Veri dışa aktarma',
    ],
  },
]

export default function SubscriptionScreen() {
  const navigation = useNavigation<Nav>()
  const [currentPlan] = useState('premium')

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Abonelik" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Current plan badge */}
        <View className="bg-[#E8F5EC] rounded-2xl p-4 mb-5 flex-row items-center border border-[#C8E6CF]/40">
          <View className="w-10 h-10 rounded-full bg-[#1A5C37] items-center justify-center mr-3">
            <Ionicons name="diamond" size={20} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-[#1A2E23]">Mevcut Plan: Premium</Text>
            <Text className="text-xs text-[#5A7264]">Yenileme: 1 Nisan 2026</Text>
          </View>
        </View>

        {/* Plans */}
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan
          return (
            <View
              key={plan.id}
              className="bg-white rounded-2xl p-5 mb-4 border-2 overflow-hidden"
              style={{ borderColor: plan.popular ? '#1A5C37' : '#E8F0EC' }}
            >
              {plan.popular && (
                <View className="bg-[#1A5C37] rounded-full px-3 py-1 self-start mb-3">
                  <Text className="text-xs font-bold text-white">⭐ En Popüler</Text>
                </View>
              )}
              <Text className="text-lg font-bold text-[#1A2E23]">{plan.name}</Text>
              <View className="flex-row items-end mt-1 mb-3">
                <Text className="text-3xl font-extrabold text-[#1A2E23]">{plan.price}</Text>
                <Text className="text-sm text-[#5A7264] ml-1 mb-1">{plan.period}</Text>
              </View>

              {plan.features.map((f, i) => (
                <View key={i} className="flex-row items-center mb-1.5">
                  <Ionicons name="checkmark-circle" size={16} color="#1A5C37" />
                  <Text className="text-sm text-[#5A7264] ml-2">{f}</Text>
                </View>
              ))}

              <TouchableOpacity
                className="rounded-xl py-3.5 items-center mt-4"
                style={{
                  backgroundColor: isCurrent ? '#E8F5EC' : '#1A5C37',
                }}
                activeOpacity={0.8}
                disabled={isCurrent}
              >
                <Text
                  className="text-base font-semibold"
                  style={{ color: isCurrent ? '#1A5C37' : '#FFFFFF' }}
                >
                  {isCurrent ? '✓ Aktif Plan' : 'Bu Plana Geç'}
                </Text>
              </TouchableOpacity>
            </View>
          )
        })}

        {/* Cancel / restore */}
        <TouchableOpacity className="items-center mb-8" activeOpacity={0.6}>
          <Text className="text-sm text-[#EF4444]">Aboneliği İptal Et</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
