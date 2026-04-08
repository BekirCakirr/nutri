import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'

export default function VideoCallScreen() {
  const navigation = useNavigation()
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <View style={{ flex: 1, backgroundColor: '#0F1A14' }}>
        {/* Remote video (mock) */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 96, height: 96, borderRadius: 9999, backgroundColor: '#4ECDC433', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 36 }}>👩‍⚕️</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#FFFFFF' }}>Dr. Elif Özkan</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Sporcu Beslenmesi Uzmanı</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <View style={{ width: 8, height: 8, borderRadius: 9999, backgroundColor: '#4ECDC4', marginRight: 8 }}/>
            <Text style={{ fontSize: 14, color: '#4ECDC4' }}>Bağlanıyor...</Text>
          </View>
        </View>

        {/* Self video (mini) */}
        <View style={{ position: 'absolute', top: 64, right: 20, width: 96, height: 128, borderRadius: 12, backgroundColor: '#2D4A3A', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#4ECDC44d' }}>
          {isVideoOn ? (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18 }}>👨</Text>
              <Text style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Ben</Text>
            </View>
          ) : (
            <Ionicons name="videocam-off" size={20} color="#5A7264" />
          )}
        </View>

        {/* Call info */}
        <View style={{ position: 'absolute', top: 64, left: 20 }}>
          <TouchableOpacity
            style={{ width: 40, height: 40, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' }} /* TODO: bg-white/10 */onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Timer */}
        <View style={{ position: 'absolute', top: 64, left: 0, right: 0, alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>00:00</Text>
        </View>

        {/* Controls */}
        <View style={{ backgroundColor: '#1A2E23', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 32, paddingVertical: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity
              style={{ alignItems: 'center' }}onPress={() => setIsMuted(!isMuted)}
            >
              <View
                style={{ width: 56, height: 56, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: 4, backgroundColor: isMuted ? '#EF4444' : '#2D4A3A' }}
              >
                <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={22} color="#FFFFFF" />
              </View>
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{isMuted ? 'Sessiz' : 'Mikrofon'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignItems: 'center' }}onPress={() => setIsVideoOn(!isVideoOn)}
            >
              <View
                style={{ width: 56, height: 56, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', marginBottom: 4, backgroundColor: !isVideoOn ? '#EF4444' : '#2D4A3A' }}
              >
                <Ionicons name={isVideoOn ? 'videocam' : 'videocam-off'} size={22} color="#FFFFFF" />
              </View>
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{isVideoOn ? 'Kamera' : 'Kapalı'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ alignItems: 'center' }}>
              <View style={{ width: 56, height: 56, borderRadius: 9999, backgroundColor: '#2D4A3A', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                <Ionicons name="chatbubble-outline" size={22} color="#FFFFFF" />
              </View>
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Mesaj</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignItems: 'center' }}onPress={() => navigation.goBack()}
            >
              <View style={{ width: 56, height: 56, borderRadius: 9999, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                <Ionicons name="call" size={22} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
              </View>
              <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Bitir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}
