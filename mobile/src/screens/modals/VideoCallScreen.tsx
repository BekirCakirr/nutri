import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'

export default function VideoCallScreen() {
  const navigation = useNavigation()
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <View className="flex-1 bg-[#0F1A14]">
        {/* Remote video (mock) */}
        <View className="flex-1 items-center justify-center">
          <View className="w-24 h-24 rounded-full bg-[#4ECDC4]/20 items-center justify-center mb-4">
            <Text className="text-4xl">👩‍⚕️</Text>
          </View>
          <Text className="text-xl font-bold text-white">Dr. Elif Özkan</Text>
          <Text className="text-sm text-white/50 mt-1">Sporcu Beslenmesi Uzmanı</Text>
          <View className="flex-row items-center mt-3">
            <View className="w-2 h-2 rounded-full bg-[#4ECDC4] mr-2" />
            <Text className="text-sm text-[#4ECDC4]">Bağlanıyor...</Text>
          </View>
        </View>

        {/* Self video (mini) */}
        <View className="absolute top-16 right-5 w-24 h-32 rounded-xl bg-[#2D4A3A] items-center justify-center border-2 border-[#4ECDC4]/30">
          {isVideoOn ? (
            <View className="items-center">
              <Text className="text-lg">👨</Text>
              <Text className="text-[8px] text-white/50 mt-1">Ben</Text>
            </View>
          ) : (
            <Ionicons name="videocam-off" size={20} color="#5A7264" />
          )}
        </View>

        {/* Call info */}
        <View className="absolute top-16 left-5">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Timer */}
        <View className="absolute top-16 left-0 right-0 items-center">
          <Text className="text-sm text-white/50">00:00</Text>
        </View>

        {/* Controls */}
        <View className="bg-[#1A2E23] rounded-t-3xl px-8 py-6">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              className="items-center"
              onPress={() => setIsMuted(!isMuted)}
            >
              <View
                className="w-14 h-14 rounded-full items-center justify-center mb-1"
                style={{ backgroundColor: isMuted ? '#EF4444' : '#2D4A3A' }}
              >
                <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={22} color="#FFFFFF" />
              </View>
              <Text className="text-[10px] text-white/50">{isMuted ? 'Sessiz' : 'Mikrofon'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center"
              onPress={() => setIsVideoOn(!isVideoOn)}
            >
              <View
                className="w-14 h-14 rounded-full items-center justify-center mb-1"
                style={{ backgroundColor: !isVideoOn ? '#EF4444' : '#2D4A3A' }}
              >
                <Ionicons name={isVideoOn ? 'videocam' : 'videocam-off'} size={22} color="#FFFFFF" />
              </View>
              <Text className="text-[10px] text-white/50">{isVideoOn ? 'Kamera' : 'Kapalı'}</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <View className="w-14 h-14 rounded-full bg-[#2D4A3A] items-center justify-center mb-1">
                <Ionicons name="chatbubble-outline" size={22} color="#FFFFFF" />
              </View>
              <Text className="text-[10px] text-white/50">Mesaj</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center"
              onPress={() => navigation.goBack()}
            >
              <View className="w-14 h-14 rounded-full bg-[#EF4444] items-center justify-center mb-1">
                <Ionicons name="call" size={22} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
              </View>
              <Text className="text-[10px] text-white/50">Bitir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}
