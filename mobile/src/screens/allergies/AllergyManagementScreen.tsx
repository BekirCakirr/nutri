import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Allergy = {
  id: string
  name: string
  severity: 'high' | 'medium' | 'low'
}

const mockAllergies: Allergy[] = [
  { id: '1', name: 'Yer Fıstığı', severity: 'high' },
  { id: '2', name: 'Laktoz', severity: 'medium' },
  { id: '3', name: 'Gluten', severity: 'low' },
]

export default function AllergyManagementScreen() {
  const navigation = useNavigation()
  const [allergies, setAllergies] = useState<Allergy[]>(mockAllergies)
  const [newAllergy, setNewAllergy] = useState('')

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, { id: Date.now().toString(), name: newAllergy, severity: 'medium' }])
      setNewAllergy('')
    }
  }

  const handleRemove = (id: string) => {
    setAllergies(allergies.filter(a => a.id !== id))
  }

  const severityColors = {
    high: 'text-red-600 bg-red-100',
    medium: 'text-amber-600 bg-amber-100',
    low: 'text-emerald-600 bg-emerald-100',
  }

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <AppHeader
        title="Alerji Yönetimi"
        onBack={() => navigation.goBack()}
      />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-4 pt-4">
        
        {/* Banner */}
        <View className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-6 flex-row items-start">
          <Ionicons name="information-circle-outline" size={24} color="#D97706" className="mt-0.5" />
          <View className="flex-1 ml-3">
             <Text className="text-amber-800 font-semibold mb-1">Alerjilerinizi Kaydedin</Text>
             <Text className="text-amber-700/80 text-xs">
               Kaydettiğiniz alerjenler "Alerjen Tarama" kamerasında ve otomatik öğün önerilerinde filtrelenerek sağlığınız korunur.
             </Text>
          </View>
        </View>

        {/* Existing Allergies */}
        <Text className="text-[#1A2E23] font-bold text-lg mb-4">Mevcut Alerjileriniz</Text>
        <View className="bg-white rounded-2xl border border-[#E8F0EC] overflow-hidden mb-6">
          {allergies.length > 0 ? allergies.map((item, index) => (
            <View 
              key={item.id} 
              className={`flex-row items-center p-4 ${index !== allergies.length - 1 ? 'border-b border-[#E8F0EC]' : ''}`}
            >
              <View className="w-10 h-10 rounded-full bg-[#F8FAF9] items-center justify-center mr-3 border border-[#E8F0EC]">
                <Ionicons name="leaf-outline" size={20} color="#1A5C37" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-[#1A2E23] text-base">{item.name}</Text>
                <View className="flex-row items-center mt-1">
                  <View className={`px-2 py-0.5 rounded ${severityColors[item.severity].split(' ')[1]}`}>
                    <Text className={`text-[10px] font-bold uppercase tracking-wider ${severityColors[item.severity].split(' ')[0]}`}>
                      {item.severity === 'high' ? 'Yüksek' : item.severity === 'medium' ? 'Orta' : 'Düşük'} Şiddet
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                className="p-2"
                onPress={() => handleRemove(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )) : (
            <View className="p-6 items-center flex-col">
              <Ionicons name="shield-checkmark-outline" size={32} color="#4ECDC4" />
              <Text className="text-[#5A7264] text-sm mt-3 text-center">Şu an kayıtlı bir alerjiniz bulunmuyor.</Text>
            </View>
          )}
        </View>

        {/* Add New */}
        <Text className="text-[#1A2E23] font-bold text-lg mb-4">Yeni Ekle</Text>
        <View className="flex-row items-center gap-3 mb-8">
          <View className="flex-1 bg-white border border-[#E8F0EC] rounded-xl px-4 py-3">
            <TextInput
              value={newAllergy}
              onChangeText={setNewAllergy}
              placeholder="Örn: Soya, Deniz ürünleri..."
              placeholderTextColor="#A8BFB2"
              className="text-base text-[#1A2E23]"
            />
          </View>
          <TouchableOpacity 
             className="bg-[#1A5C37] h-[52px] w-[52px] rounded-xl items-center justify-center"
             onPress={handleAddAllergy}
          >
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ScreenWrapper>
  )
}
