import React, { useState, useRef, useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { CameraStackParamList } from '../../navigation/types'
import { useCamera } from '../../hooks'
import { colors } from '../../theme/colors'

type Nav = StackNavigationProp<CameraStackParamList>

export default function CameraCaptureScreen() {
  const navigation = useNavigation<Nav>()
  const [mode, setMode] = useState<'photo' | 'barcode'>('photo')
  const { takePhoto, pickImage, isProcessing } = useCamera()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  // Web: start camera stream
  useEffect(() => {
    if (Platform.OS !== 'web') return

    let mounted = true
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false,
        })
        if (!mounted) { mediaStream.getTracks().forEach(t => t.stop()); return }
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          videoRef.current.onloadedmetadata = () => setCameraReady(true)
        }
      } catch (err: any) {
        if (mounted) setCameraError(err.message || 'Kamera açılamadı')
      }
    }
    startCamera()

    return () => {
      mounted = false
      stream?.getTracks().forEach(t => t.stop())
    }
  }, [])

  // Cleanup stream on unmount
  useEffect(() => {
    return () => { stream?.getTracks().forEach(t => t.stop()) }
  }, [stream])

  // Web: capture frame from video
  const handleWebCapture = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
    const base64 = dataUrl.split(',')[1]
    navigation.navigate('PhotoAnalysis', { photoUri: dataUrl, base64 })
  }, [navigation])

  const handleCapture = async () => {
    if (Platform.OS === 'web') {
      await handleWebCapture()
    } else {
      const result = await takePhoto()
      if (result?.uri) {
        navigation.navigate('PhotoAnalysis', { photoUri: result.uri, base64: result.base64 })
      }
    }
  }

  const handleGallery = async () => {
    const result = await pickImage()
    if (result?.uri) {
      navigation.navigate('PhotoAnalysis', { photoUri: result.uri, base64: result.base64 })
    }
  }

  return (
    <View style={s.root}>
      {/* Camera feed area */}
      <View style={s.cameraArea}>
        {Platform.OS === 'web' ? (
          <>
            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef as any} style={{ display: 'none' }} />
            {cameraError ? (
              <View style={s.errorWrap}>
                <Ionicons name="camera-outline" size={56} color="rgba(255,255,255,0.4)" />
                <Text style={s.errorText}>{cameraError}</Text>
                <TouchableOpacity style={s.fallbackBtn} onPress={handleGallery}>
                  <Ionicons name="images-outline" size={20} color="#FFF" />
                  <Text style={s.fallbackBtnText}>Galeriden Seç</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <video
                ref={videoRef as any}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 24,
                } as any}
              />
            )}
          </>
        ) : (
          <View style={s.placeholderWrap}>
            <Ionicons name="camera-outline" size={64} color="rgba(255,255,255,0.3)" />
            <Text style={s.placeholderText}>
              {mode === 'photo' ? 'Yemeğinizi çerçeveye alın' : 'Barkodu çerçeveye alın'}
            </Text>
          </View>
        )}

        {/* Viewfinder overlay */}
        <View style={s.viewfinderOverlay} pointerEvents="none">
          {/* Corner brackets */}
          <View style={[s.corner, s.cornerTL]} />
          <View style={[s.corner, s.cornerTR]} />
          <View style={[s.corner, s.cornerBL]} />
          <View style={[s.corner, s.cornerBR]} />
        </View>

        {/* Top bar */}
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.topBtn}>
            <Ionicons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={s.topBtn}>
            <Ionicons name="flash-outline" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Mode hint badge */}
        <View style={s.hintBadge}>
          <Ionicons name={mode === 'photo' ? 'restaurant' : 'barcode'} size={14} color="#FFF" />
          <Text style={s.hintText}>
            {mode === 'photo' ? 'Yemeğinizi çerçeveye alın' : 'Barkodu çerçeveye alın'}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={s.controls}>
        {/* Mode tabs */}
        <View style={s.modeTabs}>
          <TouchableOpacity onPress={() => setMode('photo')} style={[s.modeTab, mode === 'photo' && s.modeTabActive]}>
            <Ionicons name="camera" size={16} color={mode === 'photo' ? '#FFF' : 'rgba(255,255,255,0.5)'} />
            <Text style={[s.modeText, mode === 'photo' && s.modeTextActive]}>Fotoğraf</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode('barcode')} style={[s.modeTab, mode === 'barcode' && s.modeTabActive]}>
            <Ionicons name="barcode" size={16} color={mode === 'barcode' ? '#FFF' : 'rgba(255,255,255,0.5)'} />
            <Text style={[s.modeText, mode === 'barcode' && s.modeTextActive]}>Barkod</Text>
          </TouchableOpacity>
        </View>

        {/* Capture row */}
        <View style={s.captureRow}>
          <TouchableOpacity onPress={handleGallery} style={s.galleryBtn} disabled={isProcessing}>
            <Ionicons name="images" size={22} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCapture} style={s.captureBtn} activeOpacity={0.7} disabled={isProcessing}>
            {isProcessing ? (
              <ActivityIndicator color={colors.primary.main} size="large" />
            ) : (
              <View style={s.captureInner} />
            )}
          </TouchableOpacity>

          <View style={{ width: 52 }} />
        </View>

        {/* Bottom shortcuts */}
        <View style={s.shortcuts}>
          <TouchableOpacity style={s.shortcutBtn} onPress={() => navigation.navigate('TextInput')}>
            <View style={s.shortcutIcon}>
              <Ionicons name="text" size={18} color={colors.primary.main} />
            </View>
            <Text style={s.shortcutLabel}>Yazı ile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.shortcutBtn} onPress={() => navigation.navigate('Voice')}>
            <View style={s.shortcutIcon}>
              <Ionicons name="mic" size={18} color="#F59E0B" />
            </View>
            <Text style={s.shortcutLabel}>Sesli</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.shortcutBtn} onPress={() => navigation.navigate('MenuScan')}>
            <View style={s.shortcutIcon}>
              <Ionicons name="document-text" size={18} color="#8B5CF6" />
            </View>
            <Text style={s.shortcutLabel}>Menü</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const ACCENT = colors.primary.main

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#111',
  },
  /* ---- Camera area ---- */
  cameraArea: {
    flex: 1,
    margin: 12,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
  },
  placeholderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 15,
    marginTop: 12,
  },
  errorWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  errorText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  fallbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ACCENT,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    marginTop: 8,
  },
  fallbackBtnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  /* Viewfinder overlay corners */
  viewfinderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderColor: '#FFF',
  },
  cornerTL: { top: '20%' as any, left: '15%' as any, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 12 },
  cornerTR: { top: '20%' as any, right: '15%' as any, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 12 },
  cornerBL: { bottom: '20%' as any, left: '15%' as any, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 12 },
  cornerBR: { bottom: '20%' as any, right: '15%' as any, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 12 },
  /* Top bar */
  topBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* Hint badge */
  hintBadge: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  hintText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '500',
  },
  /* ---- Controls ---- */
  controls: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'web' ? 24 : 48,
    paddingTop: 20,
  },
  /* Mode tabs */
  modeTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  modeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  modeTabActive: {
    backgroundColor: ACCENT,
  },
  modeText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  modeTextActive: {
    color: '#FFF',
  },
  /* Capture row */
  captureRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    marginBottom: 24,
  },
  galleryBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  captureBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
  },
  /* Shortcuts */
  shortcuts: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
  },
  shortcutBtn: {
    alignItems: 'center',
    gap: 6,
  },
  shortcutIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '500',
  },
})
