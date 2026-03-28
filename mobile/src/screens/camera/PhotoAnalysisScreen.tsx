import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
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

  useEffect(() => {
    async function fetchAnalysis() {
      if (!route.params.base64) {
        setAnalyzing(false)
        return
      }
      try {
        const res = await analyzeImage(route.params.base64)
        setResult(res)
      } catch (error) {
        console.warn('AI analysis failed', error)
      } finally {
        setAnalyzing(false)
      }
    }
    fetchAnalysis()
  }, [route.params.base64])

  const totalCal = result?.foods.reduce((s, f) => s + f.calories, 0) ?? 0

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="AI Analizi" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Photo preview placeholder */}
        <View className="h-48 bg-[#1A2E23] rounded-2xl items-center justify-center mb-6 overflow-hidden">
          <Ionicons name="image-outline" size={48} color="rgba(255,255,255,0.4)" />
          <Text className="text-white/40 text-sm mt-2">Fotoğraf önizleme</Text>
        </View>

        {analyzing ? (
          <View className="items-center py-16">
            <ActivityIndicator size="large" color="#1A5C37" />
            <Text className="text-base font-semibold text-[#1A2E23] mt-4">Analiz ediliyor...</Text>
            <Text className="text-sm text-[#5A7264] mt-1">Gemini AI yemeğinizi tanımlıyor</Text>
          </View>
        ) : result ? (
          <>
            {/* Confidence */}
            <View className="bg-[#E8F5EC] rounded-2xl p-4 mb-4 flex-row items-center border border-[#C8E6CF]/40">
              <View className="w-10 h-10 rounded-full bg-[#1A5C37] items-center justify-center mr-3">
                <Ionicons name="checkmark" size={22} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-[#1A2E23]">
                  %{Math.round(result.confidence * 100)} güvenilirlik
                </Text>
                <Text className="text-xs text-[#5A7264]">{result.foods.length} besin tespit edildi</Text>
              </View>
              <Text className="text-xl font-extrabold text-[#1A5C37]">{totalCal} kcal</Text>
            </View>

            {/* Detected foods */}
            <Text className="text-lg font-bold text-[#1A2E23] mb-3">Tespit Edilen Besinler</Text>
            {result.foods.map((food, idx) => (
              <View key={idx} className="bg-white rounded-xl p-4 mb-2.5 border border-[#E8F0EC]">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-[#1A2E23]">{food.name}</Text>
                    <Text className="text-xs text-[#5A7264] mt-0.5">{food.portion}</Text>
                  </View>
                  <Text className="text-base font-bold text-[#1A5C37]">{food.calories} kcal</Text>
                </View>
                <View className="flex-row gap-4 mt-1">
                  <Text className="text-xs text-[#5A7264]">P: <Text className="font-semibold text-[#EF4444]">{food.protein}g</Text></Text>
                  <Text className="text-xs text-[#5A7264]">K: <Text className="font-semibold text-[#3B82F6]">{food.carbs}g</Text></Text>
                  <Text className="text-xs text-[#5A7264]">Y: <Text className="font-semibold text-[#F59E0B]">{food.fat}g</Text></Text>
                </View>
              </View>
            ))}

            {/* Action buttons */}
            <View className="mt-4 gap-3 mb-8">
              <TouchableOpacity
                className="bg-[#1A5C37] rounded-xl py-4 items-center"
                style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
                onPress={() => navigation.navigate('AdjustPortions', { analysisId: 'mock' })}
              >
                <Text className="text-base font-semibold text-white">Porsiyonları Düzenle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-white border-2 border-[#1A5C37] rounded-xl py-4 items-center"
                onPress={() => {
                  const mappedFoods = result.foods.map((f, i) => ({
                    food: {
                      id: `ai-${Date.now()}-${i}`,
                      name: f.name,
                      category: 'other' as const,
                      servingSize: 1,
                      servingUnit: f.portion,
                      nutrition: {
                        calories: f.calories,
                        protein: f.protein,
                        carbs: f.carbs,
                        fat: f.fat
                      }
                    },
                    quantity: 1,
                    unit: f.portion
                  }))
                  
                  // Cross tab navigation to MealsTab -> AddMeal
                  navigation.navigate('MealsTab' as any, {
                    screen: 'AddMeal',
                    params: { aiFoods: mappedFoods }
                  })
                }}
              >
                <Text className="text-base font-semibold text-[#1A5C37]">Öğüne Ekle ✅</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </ScrollView>
    </ScreenWrapper>
  )
}
