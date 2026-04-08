import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { ProgressStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<ProgressStackParamList>

const stressLevels = [
  { level: 1, label: 'Çok Düşük', emoji: '😌', color: '#1A5C37' },
  { level: 2, label: 'Düşük', emoji: '😊', color: '#4AA564' },
  { level: 3, label: 'Hafif', emoji: '🙂', color: '#6FBE84' },
  { level: 4, label: 'Normal', emoji: '😐', color: '#E8A040' },
  { level: 5, label: 'Orta', emoji: '😕', color: '#F59E0B' },
  { level: 6, label: 'Biraz Yüksek', emoji: '😟', color: '#E8A040' },
  { level: 7, label: 'Yüksek', emoji: '😰', color: '#EF4444' },
  { level: 8, label: 'Çok Yüksek', emoji: '😫', color: '#EF4444' },
]

const mockHistory = [
  { date: '17 Mar', level: 4, note: 'İş yoğunluğu' },
  { date: '16 Mar', level: 3, note: '' },
  { date: '15 Mar', level: 6, note: 'Uyku eksikliği' },
  { date: '14 Mar', level: 2, note: 'Meditasyon yaptım' },
  { date: '13 Mar', level: 5, note: '' },
  { date: '12 Mar', level: 3, note: 'Egzersiz sonrası düştü' },
  { date: '11 Mar', level: 4, note: '' },
]

const tips = [
  { title: 'Nefes Egzersizi', desc: '4-7-8 tekniğiyle 5 dakika', icon: 'cloud-outline' as const },
  { title: 'Meditasyon', desc: '10 dakika farkındalık meditasyonu', icon: 'flower-outline' as const },
  { title: 'Yürüyüş', desc: '15 dakika doğada yürüyüş', icon: 'walk-outline' as const },
  { title: 'Müzik', desc: 'Sakinleştirici müzik dinle', icon: 'musical-notes-outline' as const },
]

export default function StressScreen() {
  const navigation = useNavigation<Nav>()
  const [selectedLevel, setSelectedLevel] = useState(4)

  const avgLevel = (mockHistory.reduce((s, d) => s + d.level, 0) / mockHistory.length).toFixed(1)
  const current = stressLevels.find(s => s.level === selectedLevel) || stressLevels[3]

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Stres Seviyesi (Demo)" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Current stress */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16, alignItems: 'center' }} /* TODO: bg-white */>
          <Text style={{ fontSize: 36, marginBottom: 8 }}>{current.emoji}</Text>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#1A2E23' }}>{current.label}</Text>
          <Text style={{ fontSize: 14, color: '#5A7264', marginTop: 2 }}>Seviye {current.level}/8</Text>

          {/* Level slider */}
          <View style={{ flexDirection: 'row', marginTop: 16, justifyContent: 'space-between' }} /* TODO: w-full */>
            {stressLevels.map((s) => (
              <TouchableOpacity
                key={s.level}
                style={{ alignItems: 'center' }}activeOpacity={0.7}
                onPress={() => setSelectedLevel(s.level)}
              >
                <View
                  style={{ width: 32, height: 32, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', backgroundColor: selectedLevel === s.level ? s.color + '30' : '#F8FAF9',
                    borderWidth: selectedLevel === s.level ? 2 : 1,
                    borderColor: selectedLevel === s.level ? s.color : '#E8F0EC', }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: s.color }}>{s.level}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={{ backgroundColor: '#1A5C37', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 }} /* TODO: w-full */activeOpacity={0.8}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>Kaydet</Text>
          </TouchableOpacity>
        </View>

        {/* Average */}
        <View style={{ flexDirection: 'row', marginBottom: 16, gap: 12 }}>
          <View style={{ flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' }} /* TODO: bg-white */>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>Ortalama</Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#1A2E23', marginTop: 4 }}>{avgLevel}/8</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' }} /* TODO: bg-white */>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>Bu hafta en düşük</Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#1A5C37', marginTop: 4 }}>
              {Math.min(...mockHistory.map(h => h.level))}
            </Text>
          </View>
        </View>

        {/* Tips */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Stres Azaltma Önerileri</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
          {tips.map((tip, i) => (
            <TouchableOpacity
              key={i}
              style={{ width: '48%', marginBottom: 10, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: mx-[1%] bg-white */activeOpacity={0.7}
            >
              <View style={{ width: 36, height: 36, borderRadius: 9999, backgroundColor: '#E8F5EC', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <Ionicons name={tip.icon} size={18} color="#1A5C37" />
              </View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A2E23' }}>{tip.title}</Text>
              <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 2 }}>{tip.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* History */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Geçmiş</Text>
        {mockHistory.map((d, i) => {
          const s = stressLevels.find(l => l.level === d.level) || stressLevels[3]
          return (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white */>
              <Text style={{ fontSize: 20, marginRight: 12 }}>{s.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A2E23' }}>{s.label} ({d.level}/8)</Text>
                {d.note ? <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 2 }}>{d.note}</Text> : null}
              </View>
              <Text style={{ fontSize: 12, color: '#5A7264' }}>{d.date}</Text>
            </View>
          )
        })}

        <View style={{ height: 32 }}/>
      </ScrollView>
    </ScreenWrapper>
  )
}
