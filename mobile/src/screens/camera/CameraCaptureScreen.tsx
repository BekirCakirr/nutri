import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { CameraStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'

type Nav = StackNavigationProp<CameraStackParamList>

export default function CameraCaptureScreen() {
  const navigation = useNavigation<Nav>()
  const [mode, setMode] = useState<'photo' | 'barcode'>('photo')

  const handleCapture = () => {
    // Simulate photo capture
    navigation.navigate('PhotoAnalysis', { photoUri: 'mock://photo.jpg' })
  }

  return (
    <ScreenWrapper padded={false}>
      <View className="flex-1 bg-[#0A0A0A]">
        {/* Camera viewfinder area */}
        <View className="flex-1 items-center justify-center relative">
          {/* Simulated camera viewport */}
          <View className="w-72 h-72 border-2 border-white/30 rounded-3xl items-center justify-center">
            <Ionicons name="scan-outline" size={80} color="rgba(255,255,255,0.4)" />
            <Text className="text-white/50 text-sm mt-4 text-center px-8">
              {mode === 'photo'
                ? 'Yemeğinizi çerçeveye alın'
                : 'Barkodu çerçeveye alın'}
            </Text>
          </View>

          {/* Top bar */}
          <View className="absolute top-12 left-0 right-0 flex-row justify-between px-6">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 rounded-full bg-black/40 items-center justify-center"
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-black/40 items-center justify-center"
            >
              <Ionicons name="flash-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom controls */}
        <View className="pb-12 pt-6 px-6 bg-[#0A0A0A]">
          {/* Mode tabs */}
          <View className="flex-row justify-center gap-6 mb-8">
            <TouchableOpacity onPress={() => setMode('photo')}>
              <Text className={`text-sm font-semibold ${mode === 'photo' ? 'text-[#4ECDC4]' : 'text-white/50'}`}>
                📸 Fotoğraf
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMode('barcode')}>
              <Text className={`text-sm font-semibold ${mode === 'barcode' ? 'text-[#4ECDC4]' : 'text-white/50'}`}>
                📦 Barkod
              </Text>
            </TouchableOpacity>
          </View>

          {/* Capture button */}
          <View className="items-center">
            <TouchableOpacity
              onPress={handleCapture}
              className="w-20 h-20 rounded-full border-4 border-white items-center justify-center"
              activeOpacity={0.7}
            >
              <View className="w-16 h-16 rounded-full bg-white" />
            </TouchableOpacity>
          </View>

          {/* Bottom shortcuts */}
          <View className="flex-row justify-center gap-8 mt-6">
            <TouchableOpacity
              className="items-center"
              onPress={() => navigation.navigate('TextInput')}
            >
              <Ionicons name="text-outline" size={22} color="rgba(255,255,255,0.6)" />
              <Text className="text-white/50 text-xs mt-1">Yazı ile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="items-center"
              onPress={() => navigation.navigate('Voice')}
            >
              <Ionicons name="mic-outline" size={22} color="rgba(255,255,255,0.6)" />
              <Text className="text-white/50 text-xs mt-1">Sesli</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="items-center"
              onPress={() => navigation.navigate('MenuScan')}
            >
              <Ionicons name="document-text-outline" size={22} color="rgba(255,255,255,0.6)" />
              <Text className="text-white/50 text-xs mt-1">Menü</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}
