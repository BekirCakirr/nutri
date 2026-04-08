import React from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
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
      <View style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 16, paddingTop: 16 }}>
        {favoriteFoods.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="heart-outline" size={56} color="#D4E2DA" />
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A2E23', marginTop: 16 }}>Favori yok</Text>
            <Text style={{ fontSize: 14, color: '#5A7264', marginTop: 4, textAlign: 'center', paddingHorizontal: 32 }}>
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
                style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E8F0EC' }} /* TODO: bg-white */activeOpacity={0.7}
                onPress={() => navigation.navigate('FoodDetail', { foodId: item.id })}
              >
                <View style={{ width: 40, height: 40, borderRadius: 9999, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Ionicons name="heart" size={20} color="#F59E0B" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A2E23' }}>{item.name}</Text>
                  {item.brand ? (
                    <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 2 }}>{item.brand}</Text>
                  ) : null}
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
