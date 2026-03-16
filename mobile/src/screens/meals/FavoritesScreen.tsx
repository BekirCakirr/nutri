import React from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { MealsStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { mockFoods } from '../../mock/foods'

type Nav = StackNavigationProp<MealsStackParamList>

// Simulate favorite foods
const favoriteFoods = mockFoods.filter((_, i) => [0, 3, 5, 8, 12].includes(i))

export default function FavoritesScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Favorilerim" onBack={() => navigation.goBack()} />
      <View className="flex-1 bg-[#F8FAF9] px-4 pt-4">
        {favoriteFoods.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="heart-outline" size={56} color="#D4E2DA" />
            <Text className="text-lg font-semibold text-[#1A2E23] mt-4">Favori yok</Text>
            <Text className="text-sm text-[#5A7264] mt-1 text-center px-8">
              Besinleri favori olarak işaretleyin ve buradan hızlıca erişin.
            </Text>
          </View>
        ) : (
          <FlatList
            data={favoriteFoods}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-2.5 border border-[#E8F0EC]"
                activeOpacity={0.7}
                onPress={() => navigation.navigate('FoodDetail', { foodId: item.id })}
              >
                <View className="w-10 h-10 rounded-full bg-[#FEF3C7] items-center justify-center mr-3">
                  <Ionicons name="heart" size={20} color="#F59E0B" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-[#1A2E23]">{item.name}</Text>
                  {item.brand ? (
                    <Text className="text-xs text-[#5A7264] mt-0.5">{item.brand}</Text>
                  ) : null}
                </View>
                <View className="items-end">
                  <Text className="text-sm font-bold text-[#1A5C37]">{Math.round(item.nutrition.calories)} kcal</Text>
                  <Text className="text-xs text-[#5A7264]">{item.servingSize} {item.servingUnit}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ScreenWrapper>
  )
}
