import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

export default function VoiceScreen() {
  const navigation = useNavigation()
  const [recording, setRecording] = useState(false)

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Sesli Giriş" onBack={() => navigation.goBack()} />
      <View style={{ flex: 1, backgroundColor: '#F8FAF9', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <View style={{ backgroundColor: '#E8F5EC', borderRadius: 16, padding: 16, marginBottom: 40, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C8E6CF66' }} /* TODO: self-stretch */>
          <Ionicons name="mic-outline" size={20} color="#1A5C37" />
          <Text style={{ fontSize: 14, color: '#1A5C37', marginLeft: 12, flex: 1 }}>
            Ne yediğinizi söyleyin, AI sizin için analiz etsin.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setRecording(!recording)}
          style={{ width: 112, height: 112, borderRadius: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 24, backgroundColor: recording ? '#EF4444' : '#1A5C37', shadowColor: recording ? '#EF4444' : '#1A5C37', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 }}
        >
          <Ionicons name={recording ? 'stop' : 'mic'} size={40} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23' }}>
          {recording ? 'Dinleniyor...' : 'Konuşmaya başlayın'}
        </Text>
        <Text style={{ fontSize: 14, color: '#5A7264', marginTop: 8, textAlign: 'center' }}>
          {recording
            ? '"Öğle yemeğinde pilav ve tavuk yedim" gibi konuşun'
            : 'Mikrofon butonuna basarak kayıt başlatın'}
        </Text>
      </View>
    </ScreenWrapper>
  )
}
