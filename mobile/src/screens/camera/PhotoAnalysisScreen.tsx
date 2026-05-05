import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { RouteProp } from '@react-navigation/native'
import type { CameraStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type Nav = StackNavigationProp<CameraStackParamList>
type Route = RouteProp<CameraStackParamList, 'PhotoAnalysis'>

import { analyzeImage } from '../../services/api/ai'

export default function PhotoAnalysisScreen() {
  const navigation = useNavigation<Nav>()
  const route = useRoute<Route>()
  const [analyzing, setAnalyzing] = useState(true)
  const [result, setResult] = useState<Awaited<ReturnType<typeof analyzeImage>> | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalysis() {
      const base64 = route.params?.base64
      if (!base64) {
        setErrorMsg('Fotoğraf bulunamadı. Lütfen tekrar deneyin.')
        setAnalyzing(false)
        return
      }
      try {
        const res = await analyzeImage(base64)
        // Filtre: Geçerli isim VE kalori > 0 olan besinleri al
        const validFoods = (res?.foods || []).filter(
          (f) => (f?.name || '').trim() && (f?.name || '') !== 'Bilinmeyen Besin' && Number(f?.calories) > 0
        )

        if (validFoods.length === 0) {
          setErrorMsg('Bu fotoğrafta yemek tespit edilemedi. Lütfen daha net bir fotoğraf çekmeyi deneyin.')
        } else {
          setResult({ foods: validFoods, confidence: res.confidence })
        }
      } catch (error: any) {
        const detail = error?.message || 'Bilinmeyen hata'
        // eslint-disable-next-line no-console
        console.error('AI analiz hatası:', detail)
        setErrorMsg(`AI analiz başarısız: ${detail}`)
      } finally {
        setAnalyzing(false)
      }
    }
    fetchAnalysis()
  }, [route.params?.base64])

  const totalCal = (result?.foods ?? []).reduce((s, f) => s + (Number(f?.calories) || 0), 0)

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="AI Analizi" onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        {/* Photo preview */}
        <View style={{ height: 192, backgroundColor: '#1A2E23', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 24, overflow: 'hidden' }}>
          {route.params?.photoUri ? (
            <Image source={{ uri: route.params.photoUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          ) : (
            <>
              <Ionicons name="image-outline" size={48} color="rgba(255,255,255,0.4)" />
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>Fotoğraf önizleme</Text>
            </>
          )}
        </View>

        {analyzing ? (
          <View style={{ alignItems: 'center', paddingVertical: 64 }}>
            <ActivityIndicator size="large" color="#1A5C37" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23', marginTop: 16 }}>Analiz ediliyor...</Text>
            <Text style={{ fontSize: 14, color: '#5A7264', marginTop: 4 }}>Gemini AI yemeğinizi tanımlıyor</Text>
          </View>
        ) : errorMsg ? (
          <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 16 }}>
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23', marginTop: 16, textAlign: 'center' }}>{errorMsg}</Text>
            <TouchableOpacity
              style={{ marginTop: 24, backgroundColor: '#1A5C37', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32 }}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>Tekrar Dene</Text>
            </TouchableOpacity>
          </View>
        ) : result ? (
          <>
            {/* Confidence */}
            <View style={{ backgroundColor: '#E8F5EC', borderRadius: 16, padding: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C8E6CF66' }}>
              <View style={{ width: 40, height: 40, borderRadius: 9999, backgroundColor: '#1A5C37', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Ionicons name="checkmark" size={22} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A2E23' }}>
                  %{Math.round((result?.confidence ?? 0) * 100)} güvenilirlik
                </Text>
                <Text style={{ fontSize: 12, color: '#5A7264' }}>{result?.foods?.length ?? 0} besin tespit edildi</Text>
              </View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#1A5C37' }}>{totalCal} kcal</Text>
            </View>

            {/* Detected foods */}
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Tespit Edilen Besinler</Text>
            {result.foods.map((food, idx) => (
              <View key={idx} style={{ borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' , backgroundColor: '#FFFFFF' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23' }}>{food.name}</Text>
                    <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 2 }}>{food.portion}</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A5C37' }}>{food.calories} kcal</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 16, marginTop: 4 }}>
                  <Text style={{ fontSize: 12, color: '#5A7264' }}>P: <Text style={{ fontWeight: '600', color: '#EF4444' }}>{food.protein}g</Text></Text>
                  <Text style={{ fontSize: 12, color: '#5A7264' }}>K: <Text style={{ fontWeight: '600', color: '#3B82F6' }}>{food.carbs}g</Text></Text>
                  <Text style={{ fontSize: 12, color: '#5A7264' }}>Y: <Text style={{ fontWeight: '600', color: '#F59E0B' }}>{food.fat}g</Text></Text>
                </View>
              </View>
            ))}

            {/* Action buttons */}
            <View style={{ marginTop: 16, gap: 12, marginBottom: 32 }}>
              <TouchableOpacity
                style={{ backgroundColor: '#1A5C37', borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
                onPress={() => {
                  const ts = Date.now()
                  const mappedFoods = result.foods
                    .filter((f) => (f?.name || '').trim() && (Number(f?.calories) || 0) > 0)
                    .map((f, i) => {
                      const grams = parseFloat(String(f?.portion || '').replace(/[^\d.]/g, '')) || 100
                      return {
                        food: {
                          id: `ai-${ts}-${i}`,
                          name: f?.name || 'Bilinmeyen',
                          category: 'other' as const,
                          servingSize: grams,
                          servingUnit: 'g',
                          nutrition: {
                            calories: Number(f?.calories) || 0,
                            protein: Number(f?.protein) || 0,
                            carbs: Number(f?.carbs) || 0,
                            fat: Number(f?.fat) || 0,
                          },
                        },
                        quantity: grams,
                        unit: 'g',
                      }
                    })

                  // Cross tab navigation to MealsTab -> AddMeal
                  // @ts-expect-error - cross-stack navigation param typing
                  navigation.navigate('MealsTab', {
                    screen: 'AddMeal',
                    params: { aiFoods: mappedFoods },
                  })
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>Öğüne Ekle ✓</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ borderWidth: 2, borderColor: '#1A5C37', borderRadius: 12, paddingVertical: 14, alignItems: 'center', backgroundColor: '#FFFFFF' }}
                onPress={() => navigation.goBack()}
              >
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A5C37' }}>Yeni Fotoğraf Çek</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </ScrollView>
    </ScreenWrapper>
  )
}
