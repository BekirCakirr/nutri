import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

const moods = [
  { emoji: '😀', label: 'Harika', color: '#1A5C37' },
  { emoji: '😊', label: 'İyi', color: '#4ECDC4' },
  { emoji: '😐', label: 'Normal', color: '#E8A040' },
  { emoji: '😢', label: 'Üzgün', color: '#4A7FB5' },
  { emoji: '😡', label: 'Sinirli', color: '#EF4444' },
]

const mockHistory = [
  { date: '17 Mar', emoji: '😊', label: 'İyi', note: 'Güzel bir gün geçirdim.' },
  { date: '16 Mar', emoji: '😀', label: 'Harika', note: 'Egzersiz yaptım, enerjik hissediyorum!' },
  { date: '15 Mar', emoji: '😐', label: 'Normal', note: '' },
  { date: '14 Mar', emoji: '😊', label: 'İyi', note: 'Arkadaşlarla buluştum.' },
  { date: '13 Mar', emoji: '😢', label: 'Üzgün', note: 'İyi uyuyamadım.' },
  { date: '12 Mar', emoji: '😀', label: 'Harika', note: '' },
  { date: '11 Mar', emoji: '😊', label: 'İyi', note: 'Yeni bir tarif denedim.' },
]

export default function MoodScreen() {
  const navigation = useNavigation<Nav>()
  const [selected, setSelected] = useState<number | null>(1) // default: İyi

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Ruh Hali (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Today's mood picker */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 }} /* TODO: bg-white */>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 4 }}>Bugün nasıl hissediyorsun?</Text>
          <Text style={{ fontSize: 14, color: '#5A7264', marginBottom: 16 }}>Ruh halini seç</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {moods.map((mood, i) => (
              <TouchableOpacity
                key={i}
                style={{ alignItems: 'center' }}activeOpacity={0.7}
                onPress={() => setSelected(i)}
              >
                <View
                  style={{ width: 56, height: 56, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: 6, backgroundColor: selected === i ? mood.color + '20' : '#F8FAF9',
                    borderWidth: selected === i ? 2 : 1,
                    borderColor: selected === i ? mood.color : '#E8F0EC', }}
                >
                  <Text style={{ fontSize: 24 }}>{mood.emoji}</Text>
                </View>
                <Text
                  style={{ fontSize: 12, fontWeight: '600', color: selected === i ? mood.color : '#5A7264' }}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selected !== null && (
            <TouchableOpacity
              style={{ backgroundColor: '#1A5C37', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 }}activeOpacity={0.8}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>Kaydet ✓</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Weekly overview */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 }} /* TODO: bg-white */>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Bu Hafta</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {mockHistory.slice(0, 7).map((d, i) => (
              <View key={i} style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 24, marginBottom: 4 }}>{d.emoji}</Text>
                <Text style={{ fontSize: 10, color: '#5A7264' }}>{d.date.split(' ')[0]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* History list */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Geçmiş</Text>
        {mockHistory.map((d, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white */>
            <Text style={{ fontSize: 24, marginRight: 12 }}>{d.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23' }}>{d.label}</Text>
              {d.note ? (
                <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 2 }}>{d.note}</Text>
              ) : null}
            </View>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>{d.date}</Text>
          </View>
        ))}

        <View style={{ height: 32 }}/>
      </ScrollView>
    </ScreenWrapper>
  )
}
