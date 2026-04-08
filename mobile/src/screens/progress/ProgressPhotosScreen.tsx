import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

const mockPhotos = [
  { id: '1', date: '17 Mar 2026', label: 'Önden' },
  { id: '2', date: '17 Mar 2026', label: 'Yandan' },
  { id: '3', date: '10 Mar 2026', label: 'Önden' },
  { id: '4', date: '10 Mar 2026', label: 'Yandan' },
  { id: '5', date: '3 Mar 2026', label: 'Önden' },
  { id: '6', date: '3 Mar 2026', label: 'Arkadan' },
  { id: '7', date: '24 Şub 2026', label: 'Önden' },
  { id: '8', date: '24 Şub 2026', label: 'Yandan' },
]

export default function ProgressPhotosScreen() {
  const navigation = useNavigation<Nav>()

  // Group photos by date
  const grouped: { [date: string]: typeof mockPhotos } = {}
  mockPhotos.forEach(p => {
    if (!grouped[p.date]) grouped[p.date] = []
    grouped[p.date].push(p)
  })

  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        title="İlerleme Fotoğrafları (Demo)"
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity style={{ padding: 4 }}>
            <Ionicons name="grid-outline" size={20} color="#1A2E23" />
          </TouchableOpacity>
        }
      />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={{ flexDirection: 'row', marginBottom: 16, gap: 12 }}>
          <View style={{ flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' }} /* TODO: bg-white */>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#1A2E23' }}>{mockPhotos.length}</Text>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>Toplam Fotoğraf</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' }} /* TODO: bg-white */>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#1A2E23' }}>{Object.keys(grouped).length}</Text>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>Kayıt Günü</Text>
          </View>
        </View>

        {/* Photos grouped by date */}
        {Object.entries(grouped).map(([date, photos]) => (
          <View key={date} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#5A7264', marginBottom: 8 }}>{date}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {photos.map((photo) => (
                <TouchableOpacity
                  key={photo.id}
                  style={{ width: '48%', marginBottom: 10 }} /* TODO: mx-[1%] */activeOpacity={0.8}
                >
                  <View style={{ backgroundColor: '#1A2E23', borderRadius: 16, height: 176, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <Ionicons name="person-outline" size={40} color="rgba(255,255,255,0.3)" />
                    <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 8 }}>{photo.label}</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 4, textAlign: 'center' }}>{photo.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Compare button */}
        <TouchableOpacity
          style={{ borderWidth: 2, borderColor: '#1A5C37', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 12 }} /* TODO: bg-white */activeOpacity={0.8}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A5C37' }}>📸 Fotoğrafları Karşılaştır</Text>
        </TouchableOpacity>

        {/* Add photo button */}
        <TouchableOpacity
          style={{ backgroundColor: '#1A5C37', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 32, shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>+ Yeni Fotoğraf Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
