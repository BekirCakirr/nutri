import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

export default function TextInputScreen() {
  const navigation = useNavigation()
  const [text, setText] = useState('')

  return (
    <ScreenWrapper scrollable={false} keyboardAvoiding padded={false}>
      <AppHeader title="Yazı ile Giriş" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 24 }}showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: '#E8F5EC', borderRadius: 16, padding: 16, marginBottom: 24, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C8E6CF66' }}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#1A5C37" />
          <Text style={{ fontSize: 14, color: '#1A5C37', marginLeft: 12, flex: 1 }}>
            Ne yediğinizi yazın, AI sizin için analiz etsin.
          </Text>
        </View>

        <TextInput
          style={{ borderRadius: 16, borderWidth: 1, borderColor: '#D4E2DA', paddingHorizontal: 16, paddingVertical: 16, fontSize: 16, color: '#1A2E23', marginBottom: 24 , backgroundColor: '#FFFFFF', minHeight: 120 }}placeholder="Örn: 1 kase mercimek çorbası, 2 dilim ekmek, 1 bardak ayran..."
          placeholderTextColor="#9CA8A1"
          value={text}
          onChangeText={setText}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[{ borderRadius: 12, paddingVertical: 16, alignItems: 'center', backgroundColor: text.trim() ? '#1A5C37' : '#D4E2DA' }, text.trim() ? { shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 } : {}]}
          disabled={!text.trim()}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: text.trim() ? '#FFFFFF' : '#9CA8A1' }}>
            Analiz Et 🔍
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
