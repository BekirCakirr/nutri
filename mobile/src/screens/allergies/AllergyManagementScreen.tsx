import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
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
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader
        title="Alerji Yönetimi"
        subtitle="Demo Verisi"
        onBack={() => navigation.goBack()}
      />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 16, paddingTop: 16 }}>
        
        {/* Banner */}
        <View style={{ borderRadius: 12, padding: 16, borderWidth: 1, marginBottom: 24, flexDirection: 'row', alignItems: 'flex-start' , backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
          <Ionicons name="information-circle-outline" size={24} color="#D97706" style={{ marginTop: 2 }}/>
          <View style={{ flex: 1, marginLeft: 12 }}>
             <Text style={{ fontWeight: '600', marginBottom: 4 , color: '#92400E' }}>Alerjilerinizi Kaydedin</Text>
             <Text style={{ fontSize: 12 , color: 'rgba(180,83,9,0.8)' }}>
               Kaydettiğiniz alerjenler "Alerjen Tarama" kamerasında ve otomatik öğün önerilerinde filtrelenerek sağlığınız korunur.
             </Text>
          </View>
        </View>

        {/* Existing Allergies */}
        <Text style={{ color: '#1A2E23', fontWeight: '700', fontSize: 18, marginBottom: 16 }}>Mevcut Alerjileriniz</Text>
        <View style={{ borderRadius: 16, borderWidth: 1, borderColor: '#E8F0EC', overflow: 'hidden', marginBottom: 24 , backgroundColor: '#FFFFFF' }}>
          {allergies.length > 0 ? allergies.map((item, index) => (
            <View 
              key={item.id} 
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, ...(index !== allergies.length - 1 ? { borderBottomWidth: 1, borderBottomColor: '#E8F0EC' } : {}) }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 9999, backgroundColor: '#F8FAF9', alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: '#E8F0EC' }}>
                <Ionicons name="leaf-outline" size={20} color="#1A5C37" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', color: '#1A2E23', fontSize: 16 }}>{item.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: item.severity === 'high' ? '#FEE2E2' : item.severity === 'medium' ? '#FEF3C7' : '#ECFDF5' }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: item.severity === 'high' ? '#DC2626' : item.severity === 'medium' ? '#D97706' : '#059669' }}>
                      {item.severity === 'high' ? 'Yüksek' : item.severity === 'medium' ? 'Orta' : 'Düşük'} Şiddet
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                style={{ padding: 8 }}onPress={() => handleRemove(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )) : (
            <View style={{ padding: 24, alignItems: 'center' , flexDirection: 'column' }}>
              <Ionicons name="shield-checkmark-outline" size={32} color="#4ECDC4" />
              <Text style={{ color: '#5A7264', fontSize: 14, marginTop: 12, textAlign: 'center' }}>Şu an kayıtlı bir alerjiniz bulunmuyor.</Text>
            </View>
          )}
        </View>

        {/* Add New */}
        <Text style={{ color: '#1A2E23', fontWeight: '700', fontSize: 18, marginBottom: 16 }}>Yeni Ekle</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <View style={{ flex: 1, borderWidth: 1, borderColor: '#E8F0EC', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 , backgroundColor: '#FFFFFF' }}>
            <TextInput
              value={newAllergy}
              onChangeText={setNewAllergy}
              placeholder="Örn: Soya, Deniz ürünleri..."
              placeholderTextColor="#A8BFB2"
              style={{ fontSize: 16, color: '#1A2E23' }}/>
          </View>
          <TouchableOpacity 
             style={{ backgroundColor: '#1A5C37', height: 52, width: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}onPress={handleAddAllergy}
          >
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ScreenWrapper>
  )
}
