import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

const mockDietitian = {
  name: 'Dr. Elif Özkan',
  specialty: 'Sporcu Beslenmesi & Kilo Yönetimi',
  rating: 4.9,
  reviews: 128,
  experience: '12 yıl',
  patients: 450,
  price: '₺250 / seans',
  bio: 'İstanbul Üniversitesi Beslenme ve Diyetetik bölümü mezunuyum. 12 yıldır sporcu beslenmesi ve kilo yönetimi alanında çalışıyorum. Kişiselleştirilmiş beslenme planları ile hedeflerinize ulaşmanıza yardımcı oluyorum.',
  education: [
    'İstanbul Üniversitesi - Beslenme ve Diyetetik (Lisans)',
    'Hacettepe Üniversitesi - Klinik Beslenme (Yüksek Lisans)',
  ],
  certifications: [
    'Sporcu Beslenmesi Uzmanı',
    'Diyabet Eğitmeni',
    'Obezite Tedavisi Sertifikası',
  ],
}

const availableTimes = ['09:00', '10:30', '13:00', '14:30', '16:00']

export default function DietitianProfileScreen() {
  const navigation = useNavigation()

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Diyetisyen Profili" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16, alignItems: 'center' , backgroundColor: '#FFFFFF' }}>
          <View style={{ width: 80, height: 80, borderRadius: 9999, backgroundColor: '#4ECDC433', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 30 }}>👩‍⚕️</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#1A2E23' }}>{mockDietitian.name}</Text>
          <Text style={{ fontSize: 14, color: '#5A7264', marginTop: 2 }}>{mockDietitian.specialty}</Text>

          {/* Stats row */}
          <View style={{ flexDirection: 'row', marginTop: 16, gap: 16 }}>
            <View style={{ alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A2E23', marginLeft: 4 }}>{mockDietitian.rating}</Text>
              </View>
              <Text style={{ fontSize: 10, color: '#5A7264' }}>{mockDietitian.reviews} değerlendirme</Text>
            </View>
            <View style={{ backgroundColor: '#E8F0EC' }} /* TODO: w-px *//>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A2E23' }}>{mockDietitian.experience}</Text>
              <Text style={{ fontSize: 10, color: '#5A7264' }}>Deneyim</Text>
            </View>
            <View style={{ backgroundColor: '#E8F0EC' }} /* TODO: w-px *//>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A2E23' }}>{mockDietitian.patients}+</Text>
              <Text style={{ fontSize: 10, color: '#5A7264' }}>Hasta</Text>
            </View>
          </View>
        </View>

        {/* Bio */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 , backgroundColor: '#FFFFFF' }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 8 }}>Hakkında</Text>
          <Text style={{ fontSize: 14, color: '#5A7264', lineHeight: 20 }}>{mockDietitian.bio}</Text>
        </View>

        {/* Education */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 , backgroundColor: '#FFFFFF' }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 8 }}>Eğitim</Text>
          {mockDietitian.education.map((e, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
              <Ionicons name="school-outline" size={14} color="#1A5C37" style={{ marginTop: 2 }} />
              <Text style={{ fontSize: 14, color: '#5A7264', marginLeft: 8, flex: 1 }}>{e}</Text>
            </View>
          ))}
        </View>

        {/* Certifications */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 , backgroundColor: '#FFFFFF' }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 8 }}>Sertifikalar</Text>
          {mockDietitian.certifications.map((c, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Ionicons name="ribbon-outline" size={14} color="#E8A040" />
              <Text style={{ fontSize: 14, color: '#5A7264', marginLeft: 8 }}>{c}</Text>
            </View>
          ))}
        </View>

        {/* Price & CTA */}
        <View style={{ backgroundColor: '#E8F5EC', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#C8E6CF66' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 14, color: '#5A7264' }}>Seans Ücreti</Text>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#1A2E23' }}>{mockDietitian.price}</Text>
          </View>
          <TouchableOpacity
            style={{ backgroundColor: '#1A5C37', borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>📅 Randevu Al</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 16 }}/>
      </ScrollView>
    </ScreenWrapper>
  )
}
