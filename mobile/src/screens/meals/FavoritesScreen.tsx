import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { MealsStackParamList } from '../../navigation/types'
import type { Food } from '../../types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { getFavoriteFoods } from '../../services/api/food'
import { colors } from '../../theme/colors'

type Nav = StackNavigationProp<MealsStackParamList>

export default function FavoritesScreen() {
  const navigation = useNavigation<Nav>()
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFavoriteFoods()
      .then(setFoods)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <ScreenWrapper scrollable={false} padded={false}>
        <AppHeader title="Favorilerim" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper scrollable={false} padded={false}>
      <AppHeader title="Favorilerim" onBack={() => navigation.goBack()} />
      <View style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 16, paddingTop: 16 }}>
        {foods.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="heart-outline" size={56} color="#D4E2DA" />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A2E23', marginTop: 16 }}>Favori yok</Text>
            <Text style={{ fontSize: 14, color: '#5A7264', marginTop: 4, textAlign: 'center', paddingHorizontal: 32 }}>
              Besinleri favori olarak işaretleyin ve buradan hızlıca erişin.
            </Text>
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
                <View style={{ marginRight: 12 }}>
                  <Image
                    source={{ uri: `https://picsum.photos/seed/food-${item.id}/120/120` }}
                    style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FEF3C7' }}
                  />
                  <View style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: '#F59E0B', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="heart" size={10} color="#FFFFFF" />
                  </View>
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
