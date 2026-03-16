import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { Button } from '../../components/ui/Button'

export default function CustomFoodScreen() {
  const navigation = useNavigation()
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [serving, setServing] = useState('')

  const canSave = name.trim() && calories.trim()

  const handleSave = () => {
    // TODO: Save to store
    navigation.goBack()
  }

  return (
    <ScreenWrapper keyboardAvoiding padded={false}>
      <AppHeader title="Özel Besin Ekle" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View className="bg-[#E8F5EC] rounded-2xl p-4 mb-6 flex-row items-center border border-[#C8E6CF]/40">
          <Ionicons name="information-circle" size={22} color="#1A5C37" />
          <Text className="text-sm text-[#1A5C37] ml-3 flex-1">
            Veritabanımızda bulamadığınız besinleri manuel olarak ekleyebilirsiniz.
          </Text>
        </View>

        {/* Name & Brand */}
        <Text className="text-sm font-semibold text-[#1A2E23] mb-2">Besin Adı *</Text>
        <TextInput
          className="bg-white rounded-xl border border-[#D4E2DA] px-4 py-3.5 text-base text-[#1A2E23] mb-4"
          placeholder="Örn: Ev yapımı granola"
          placeholderTextColor="#9CA8A1"
          value={name}
          onChangeText={setName}
        />

        <Text className="text-sm font-semibold text-[#1A2E23] mb-2">Marka (İsteğe bağlı)</Text>
        <TextInput
          className="bg-white rounded-xl border border-[#D4E2DA] px-4 py-3.5 text-base text-[#1A2E23] mb-4"
          placeholder="Örn: Homemade"
          placeholderTextColor="#9CA8A1"
          value={brand}
          onChangeText={setBrand}
        />

        <Text className="text-sm font-semibold text-[#1A2E23] mb-2">Porsiyon</Text>
        <TextInput
          className="bg-white rounded-xl border border-[#D4E2DA] px-4 py-3.5 text-base text-[#1A2E23] mb-6"
          placeholder="Örn: 100g / 1 kase"
          placeholderTextColor="#9CA8A1"
          value={serving}
          onChangeText={setServing}
        />

        {/* Macros */}
        <Text className="text-lg font-bold text-[#1A2E23] mb-4">Besin Değerleri</Text>
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text className="text-xs font-medium text-[#5A7264] mb-1">Kalori (kcal) *</Text>
            <TextInput
              className="bg-white rounded-xl border border-[#D4E2DA] px-4 py-3 text-base text-[#1A2E23] text-center"
              placeholder="0"
              placeholderTextColor="#9CA8A1"
              keyboardType="decimal-pad"
              value={calories}
              onChangeText={setCalories}
            />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-medium text-[#5A7264] mb-1">Protein (g)</Text>
            <TextInput
              className="bg-white rounded-xl border border-[#D4E2DA] px-4 py-3 text-base text-[#1A2E23] text-center"
              placeholder="0"
              placeholderTextColor="#9CA8A1"
              keyboardType="decimal-pad"
              value={protein}
              onChangeText={setProtein}
            />
          </View>
        </View>
        <View className="flex-row gap-3 mb-8">
          <View className="flex-1">
            <Text className="text-xs font-medium text-[#5A7264] mb-1">Karbonhidrat (g)</Text>
            <TextInput
              className="bg-white rounded-xl border border-[#D4E2DA] px-4 py-3 text-base text-[#1A2E23] text-center"
              placeholder="0"
              placeholderTextColor="#9CA8A1"
              keyboardType="decimal-pad"
              value={carbs}
              onChangeText={setCarbs}
            />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-medium text-[#5A7264] mb-1">Yağ (g)</Text>
            <TextInput
              className="bg-white rounded-xl border border-[#D4E2DA] px-4 py-3 text-base text-[#1A2E23] text-center"
              placeholder="0"
              placeholderTextColor="#9CA8A1"
              keyboardType="decimal-pad"
              value={fat}
              onChangeText={setFat}
            />
          </View>
        </View>

        <Button
          title="Kaydet"
          onPress={handleSave}
          disabled={!canSave}
          fullWidth
          size="lg"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4, marginBottom: 32 }}
        />
      </ScrollView>
    </ScreenWrapper>
  )
}
