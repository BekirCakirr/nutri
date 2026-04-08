import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
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
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16, alignItems: 'center' }} /* TODO: bg-white */>
          <Text style={{ marginBottom: 12 }} /* TODO: text-5xl */>{mockRecipe.emoji}</Text>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#1A2E23' }}>{mockRecipe.title}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            {mockRecipe.tags.map((t, i) => (
              <View key={i} style={{ backgroundColor: '#E8F5EC', borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 4, marginHorizontal: 4, marginBottom: 4 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#1A5C37' }}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick stats */}
        <View style={{ flexDirection: 'row', marginBottom: 16, gap: 8 }}>
          <View style={{ flex: 1, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' }} /* TODO: bg-white */>
            <Ionicons name="time-outline" size={16} color="#5A7264" />
            <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 2 }}>{mockRecipe.prepTime} hazırlık</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' }} /* TODO: bg-white */>
            <Ionicons name="flame-outline" size={16} color="#E8A040" />
            <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 2 }}>{mockRecipe.calories} kcal</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' }} /* TODO: bg-white */>
            <Ionicons name="people-outline" size={16} color="#5A7264" />
            <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 2 }}>{mockRecipe.servings} kişilik</Text>
          </View>
        </View>

        {/* Macros */}
        <View style={{ borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between' }} /* TODO: bg-white */>
          {([
            { label: 'Protein', val: mockRecipe.macros.protein, color: '#C75B4A' },
            { label: 'Karb', val: mockRecipe.macros.carbs, color: '#4A7FB5' },
            { label: 'Yağ', val: mockRecipe.macros.fat, color: '#D4A843' },
            { label: 'Lif', val: mockRecipe.macros.fiber, color: '#1A5C37' },
          ]).map((m, i) => (
            <View key={i} style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: m.color }}>{m.val}g</Text>
              <Text style={{ fontSize: 10, color: '#5A7264' }}>{m.label}</Text>
            </View>
          ))}
        </View>

        {/* Ingredients */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 }} /* TODO: bg-white */>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Malzemeler ({mockRecipe.ingredients.length})</Text>
          {mockRecipe.ingredients.map((ing, i) => (
            <View key={i} style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#E8F0EC' }, i === mockRecipe.ingredients.length - 1 ? { borderBottomWidth: 0 } : {}]}>
              <View style={{ width: 8, height: 8, borderRadius: 9999, backgroundColor: '#1A5C37', marginRight: 12 }}/>
              <Text style={{ flex: 1, fontSize: 14, color: '#1A2E23' }}>{ing.name}</Text>
              <Text style={{ fontSize: 14, color: '#5A7264' }}>{ing.amount}</Text>
            </View>
          ))}
        </View>

        {/* Steps */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 32 }} /* TODO: bg-white */>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Hazırlanışı</Text>
          {mockRecipe.steps.map((step, i) => (
            <View key={i} style={{ flexDirection: 'row', marginBottom: 12 }}>
              <View style={{ width: 24, height: 24, borderRadius: 9999, backgroundColor: '#1A5C37', alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>{i + 1}</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: '#5A7264', lineHeight: 20 }}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}
