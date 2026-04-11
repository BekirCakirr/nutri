import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { CameraStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { useCamera } from '../../hooks'

type Nav = StackNavigationProp<CameraStackParamList>

export default function CameraCaptureScreen() {
  const navigation = useNavigation<Nav>()
  const [mode, setMode] = useState<'photo' | 'barcode'>('photo')
  const { takePhoto, pickImage, isProcessing } = useCamera()

  const handleCapture = async () => {
    const result = await takePhoto()
    if (result?.uri) {
      navigation.navigate('PhotoAnalysis', { photoUri: result.uri, base64: result.base64 })
    }
  }

  const handleGallery = async () => {
    const result = await pickImage()
    if (result?.uri) {
      navigation.navigate('PhotoAnalysis', { photoUri: result.uri, base64: result.base64 })
    }
  }

  return (
    <ScreenWrapper padded={false}>
      <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
        {/* Camera viewfinder area */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* Simulated camera viewport */}
          <View style={{ width: 288, height: 288, borderWidth: 2, borderRadius: 24, alignItems: 'center', justifyContent: 'center' , borderColor: 'rgba(255,255,255,0.3)' }}>
            <Ionicons name="scan-outline" size={80} color="rgba(255,255,255,0.4)" />
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 16, textAlign: 'center', paddingHorizontal: 32 }}>
              {mode === 'photo'
                ? 'Yemeğinizi çerçeveye alın'
                : 'Barkodu çerçeveye alın'}
            </Text>
          </View>

          {/* Top bar */}
          <View style={{ position: 'absolute', top: 48, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24 }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ width: 40, height: 40, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' , backgroundColor: 'rgba(0,0,0,0.4)' }}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: 40, height: 40, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' , backgroundColor: 'rgba(0,0,0,0.4)' }}>
              <Ionicons name="flash-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom controls */}
        <View style={{ paddingBottom: 48, paddingTop: 24, paddingHorizontal: 24, backgroundColor: '#0A0A0A' }}>
          {/* Mode tabs */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
            <TouchableOpacity onPress={() => setMode('photo')}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: mode === 'photo' ? '#4ECDC4' : 'rgba(255,255,255,0.5)' }}>
                📸 Fotoğraf
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMode('barcode')}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: mode === 'barcode' ? '#4ECDC4' : 'rgba(255,255,255,0.5)' }}>
                📦 Barkod
              </Text>
            </TouchableOpacity>
          </View>

          {/* Capture button */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
            <TouchableOpacity
              onPress={handleGallery}
              style={{ width: 56, height: 56, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' , backgroundColor: 'rgba(255,255,255,0.1)' }}disabled={isProcessing}
            >
              <Ionicons name="images-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCapture}
              style={{ width: 80, height: 80, borderRadius: 9999, alignItems: 'center', justifyContent: 'center' , borderWidth: 4, borderColor: '#FFFFFF' }}activeOpacity={0.7}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="white" />
              ) : (
                <View style={{ width: 64, height: 64, borderRadius: 9999 , backgroundColor: '#FFFFFF' }}/>
              )}
            </TouchableOpacity>
            
            <View style={{ width: 56, height: 56 }}/> {/* Spacer to center capture button */}
          </View>

          {/* Bottom shortcuts */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 32, marginTop: 24 }}>
            <TouchableOpacity
              style={{ alignItems: 'center' }}onPress={() => navigation.navigate('TextInput')}
            >
              <Ionicons name="text-outline" size={22} color="rgba(255,255,255,0.6)" />
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 }}>Yazı ile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: 'center' }}onPress={() => navigation.navigate('Voice')}
            >
              <Ionicons name="mic-outline" size={22} color="rgba(255,255,255,0.6)" />
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 }}>Sesli</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: 'center' }}onPress={() => navigation.navigate('MenuScan')}
            >
              <Ionicons name="document-text-outline" size={22} color="rgba(255,255,255,0.6)" />
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 }}>Menü</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}
