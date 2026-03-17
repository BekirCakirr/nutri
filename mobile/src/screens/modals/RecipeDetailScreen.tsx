import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

const mockRecipe = {
  title: 'Quinoa Salatası',
  emoji: '🥗',
  prepTime: '15 dk',
  cookTime: '20 dk',
  servings: 2,
  calories: 420,
  difficulty: 'Kolay',
  tags: ['Vegan', 'Glutensiz', 'Yüksek Protein'],
  macros: { protein: 18, carbs: 52, fat: 14, fiber: 8 },
  ingredients: [
    { name: 'Quinoa', amount: '1 su bardağı' },
    { name: 'Salatalık', amount: '1 adet' },
    { name: 'Kiraz domates', amount: '10 adet' },
    { name: 'Avokado', amount: '1/2 adet' },
    { name: 'Kırmızı soğan', amount: '1/4 adet' },
    { name: 'Zeytinyağı', amount: '2 yemek kaşığı' },
    { name: 'Limon suyu', amount: '1 adet' },
    { name: 'Tuz, karabiber', amount: 'Az' },
    { name: 'Taze nane', amount: 'Bir tutam' },
  ],
  steps: [
    'Quinoa\'yı yıkayıp 2 bardak su ile haşlayın. 15 dakika pişirip soğumaya bırakın.',
    'Salatalığı küp küp doğrayın. Kiraz domatesleri ikiye kesin.',
    'Avokadoyu küp şeklinde kesin. Soğanı ince ince doğrayın.',
    'Soğumuş quinoa\'yı geniş bir kaseye alın.',
    'Tüm sebzeleri ekleyin. Zeytinyağı ve limon suyu ile sos hazırlayın.',
    'Sosu salatanın üzerine gezdirin. Tuz ve karabiber ekleyin.',
    'Taze nane ile süsleyip servis edin.',
  ],
}

export default function RecipeDetailScreen() {
  const navigation = useNavigation()
  const [liked, setLiked] = useState(false)

  return (
    <ScreenWrapper padded={false}>
      <AppHeader
        title="Tarif Detayı"
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity onPress={() => setLiked(!liked)}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? '#EF4444' : '#5A7264'} />
          </TouchableOpacity>
        }
      />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4 items-center">
          <Text className="text-5xl mb-3">{mockRecipe.emoji}</Text>
          <Text className="text-xl font-bold text-[#1A2E23]">{mockRecipe.title}</Text>
          <View className="flex-row flex-wrap justify-center mt-2">
            {mockRecipe.tags.map((t, i) => (
              <View key={i} className="bg-[#E8F5EC] rounded-full px-2.5 py-1 mx-1 mb-1">
                <Text className="text-[10px] font-bold text-[#1A5C37]">{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick stats */}
        <View className="flex-row mb-4 gap-2">
          <View className="flex-1 bg-white rounded-xl p-3 border border-[#E8F0EC] items-center">
            <Ionicons name="time-outline" size={16} color="#5A7264" />
            <Text className="text-xs text-[#5A7264] mt-0.5">{mockRecipe.prepTime} hazırlık</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-3 border border-[#E8F0EC] items-center">
            <Ionicons name="flame-outline" size={16} color="#E8A040" />
            <Text className="text-xs text-[#5A7264] mt-0.5">{mockRecipe.calories} kcal</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-3 border border-[#E8F0EC] items-center">
            <Ionicons name="people-outline" size={16} color="#5A7264" />
            <Text className="text-xs text-[#5A7264] mt-0.5">{mockRecipe.servings} kişilik</Text>
          </View>
        </View>

        {/* Macros */}
        <View className="bg-white rounded-2xl p-4 border border-[#E8F0EC] mb-4 flex-row justify-between">
          {([
            { label: 'Protein', val: mockRecipe.macros.protein, color: '#C75B4A' },
            { label: 'Karb', val: mockRecipe.macros.carbs, color: '#4A7FB5' },
            { label: 'Yağ', val: mockRecipe.macros.fat, color: '#D4A843' },
            { label: 'Lif', val: mockRecipe.macros.fiber, color: '#1A5C37' },
          ]).map((m, i) => (
            <View key={i} className="items-center">
              <Text className="text-lg font-bold" style={{ color: m.color }}>{m.val}g</Text>
              <Text className="text-[10px] text-[#5A7264]">{m.label}</Text>
            </View>
          ))}
        </View>

        {/* Ingredients */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-4">
          <Text className="text-base font-bold text-[#1A2E23] mb-3">Malzemeler ({mockRecipe.ingredients.length})</Text>
          {mockRecipe.ingredients.map((ing, i) => (
            <View key={i} className="flex-row items-center py-2 border-b border-[#E8F0EC]" style={i === mockRecipe.ingredients.length - 1 ? { borderBottomWidth: 0 } : {}}>
              <View className="w-2 h-2 rounded-full bg-[#1A5C37] mr-3" />
              <Text className="flex-1 text-sm text-[#1A2E23]">{ing.name}</Text>
              <Text className="text-sm text-[#5A7264]">{ing.amount}</Text>
            </View>
          ))}
        </View>

        {/* Steps */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-8">
          <Text className="text-base font-bold text-[#1A2E23] mb-3">Hazırlanışı</Text>
          {mockRecipe.steps.map((step, i) => (
            <View key={i} className="flex-row mb-3">
              <View className="w-6 h-6 rounded-full bg-[#1A5C37] items-center justify-center mr-3 mt-0.5">
                <Text className="text-xs font-bold text-white">{i + 1}</Text>
              </View>
              <Text className="flex-1 text-sm text-[#5A7264] leading-5">{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}
