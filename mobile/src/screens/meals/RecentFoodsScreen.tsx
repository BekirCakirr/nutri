import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { MealsStackParamList } from '../../navigation/types'
import type { Food } from '../../types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { getRecentFoods } from '../../services/api/food'
import { colors } from '../../theme/colors'

type Nav = StackNavigationProp<MealsStackParamList>

export default function RecentFoodsScreen() {
  const navigation = useNavigation<Nav>()
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRecentFoods()
      .then(setFoods)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <ScreenWrapper scrollable={false} padded={false}>
        <AppHeader title="Son Kullanılanlar" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Son Kullanılanlar" onBack={() => navigation.goBack()} />
      <View style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 16, paddingTop: 16 }}>
        {foods.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="time-outline" size={56} color="#D4E2DA" />
            <Text style={{ fontSize: 16, color: '#5A7264', marginTop: 16 }}>Henüz kayıt yok</Text>
          </View>
        ) : (
          <FlatList
            data={foods}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC', backgroundColor: '#FFFFFF' }}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('FoodDetail', { foodId: item.id })}
              >
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F5EC', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Ionicons name="nutrition-outline" size={20} color="#1A5C37" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23' }}>{item.name}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A5C37' }}>{Math.round(item.nutrition.calories)} kcal</Text>
                  <Text style={{ fontSize: 12, color: '#5A7264' }}>{item.servingSize} {item.servingUnit}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ScreenWrapper>
  )
}
