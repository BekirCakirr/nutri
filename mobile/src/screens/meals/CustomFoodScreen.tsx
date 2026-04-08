import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
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
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={{ backgroundColor: '#E8F5EC', borderRadius: 16, padding: 16, marginBottom: 24, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C8E6CF66' }}>
          <Ionicons name="information-circle" size={22} color="#1A5C37" />
          <Text style={{ fontSize: 14, color: '#1A5C37', marginLeft: 12, flex: 1 }}>
            Veritabanımızda bulamadığınız besinleri manuel olarak ekleyebilirsiniz.
          </Text>
        </View>

        {/* Name & Brand */}
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A2E23', marginBottom: 8 }}>Besin Adı *</Text>
        <TextInput
          style={{ borderRadius: 12, borderWidth: 1, borderColor: '#D4E2DA', paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#1A2E23', marginBottom: 16 }} /* TODO: bg-white */placeholder="Örn: Ev yapımı granola"
          placeholderTextColor="#9CA8A1"
          value={name}
          onChangeText={setName}
        />

        <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A2E23', marginBottom: 8 }}>Marka (İsteğe bağlı)</Text>
        <TextInput
          style={{ borderRadius: 12, borderWidth: 1, borderColor: '#D4E2DA', paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#1A2E23', marginBottom: 16 }} /* TODO: bg-white */placeholder="Örn: Homemade"
          placeholderTextColor="#9CA8A1"
          value={brand}
          onChangeText={setBrand}
        />

        <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A2E23', marginBottom: 8 }}>Porsiyon</Text>
        <TextInput
          style={{ borderRadius: 12, borderWidth: 1, borderColor: '#D4E2DA', paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#1A2E23', marginBottom: 24 }} /* TODO: bg-white */placeholder="Örn: 100g / 1 kase"
          placeholderTextColor="#9CA8A1"
          value={serving}
          onChangeText={setServing}
        />

        {/* Macros */}
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A2E23', marginBottom: 16 }}>Besin Değerleri</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: '#5A7264', marginBottom: 4 }}>Kalori (kcal) *</Text>
            <TextInput
              style={{ borderRadius: 12, borderWidth: 1, borderColor: '#D4E2DA', paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#1A2E23', textAlign: 'center' }} /* TODO: bg-white */placeholder="0"
              placeholderTextColor="#9CA8A1"
              keyboardType="decimal-pad"
              value={calories}
              onChangeText={setCalories}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: '#5A7264', marginBottom: 4 }}>Protein (g)</Text>
            <TextInput
              style={{ borderRadius: 12, borderWidth: 1, borderColor: '#D4E2DA', paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#1A2E23', textAlign: 'center' }} /* TODO: bg-white */placeholder="0"
              placeholderTextColor="#9CA8A1"
              keyboardType="decimal-pad"
              value={protein}
              onChangeText={setProtein}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: '#5A7264', marginBottom: 4 }}>Karbonhidrat (g)</Text>
            <TextInput
              style={{ borderRadius: 12, borderWidth: 1, borderColor: '#D4E2DA', paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#1A2E23', textAlign: 'center' }} /* TODO: bg-white */placeholder="0"
              placeholderTextColor="#9CA8A1"
              keyboardType="decimal-pad"
              value={carbs}
              onChangeText={setCarbs}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: '#5A7264', marginBottom: 4 }}>Yağ (g)</Text>
            <TextInput
              style={{ borderRadius: 12, borderWidth: 1, borderColor: '#D4E2DA', paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#1A2E23', textAlign: 'center' }} /* TODO: bg-white */placeholder="0"
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
