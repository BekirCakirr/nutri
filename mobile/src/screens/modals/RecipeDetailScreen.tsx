import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { MealsStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { getRecipeById } from '../../services/api/recipe'
import type { Recipe } from '../../types'

type Route = RouteProp<any, any>



export default function RecipeDetailScreen() {
  const navigation = useNavigation()
  const route = useRoute<Route>()
  const recipeId = route.params?.id || route.params?.recipeId
  const [liked, setLiked] = useState(false)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (recipeId) {
      getRecipeById(recipeId).then(data => {
        setRecipe(data)
        setLoading(false)
      }).catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [recipeId])

  if (loading || !recipe) {
    return (
      <ScreenWrapper scrollable={false} padded={false}>
        <AppHeader title="Tarif Detayı" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {loading ? <ActivityIndicator size="large" color="#1A5C37" /> : <Text>Tarif bulunamadı.</Text>}
        </View>
      </ScreenWrapper>
    )
  }

  // Handle Backend parsing for mobile type
  const rawData = recipe as Record<string, any>
  const instructionsRaw: string = String(rawData.instructions ?? recipe.instructions ?? '')
  const steps: string[] = Array.isArray(rawData.instructions) ? rawData.instructions : instructionsRaw.split('\n').filter((s) => s.trim().length > 0)

  // Convert standard types
  const title = recipe.name || rawData.title || ''
  const prepTime = Number(rawData.prep_time_min || recipe.prepTime) || 0
  const cookTime = Number(rawData.cook_time_min || recipe.cookTime) || 0
  const calories = Number(rawData.calories_per_serving || (recipe.nutrition as any)?.calories) || 0
  const servings = recipe.servings || 1
  const macros = {
    protein: Number(rawData.protein_per_serving || (recipe.nutrition as any)?.protein) || 0,
    carbs: Number(rawData.carbs_per_serving || (recipe.nutrition as any)?.carbs) || 0,
    fat: Number(rawData.fat_per_serving || (recipe.nutrition as any)?.fat) || 0,
    fiber: Number(rawData.fiber_per_serving || (recipe.nutrition as any)?.fiber) || 0,
  }
  const tags: string[] = Array.isArray(recipe.tags) ? recipe.tags : []
  const ingredients: any[] = Array.isArray(recipe.ingredients) ? recipe.ingredients : []

  return (
    <ScreenWrapper scrollable={false} padded={false}>
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
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16, alignItems: 'center' , backgroundColor: '#FFFFFF' }}>
          <Text style={{ marginBottom: 12, fontSize: 40 }}>{recipe.image ? '🍲' : '🥗'}</Text>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#1A2E23' }}>{title}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            {tags.map((t, i) => (
              <View key={i} style={{ backgroundColor: '#E8F5EC', borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 4, marginHorizontal: 4, marginBottom: 4 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#1A5C37' }}>{String(t)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick stats */}
        <View style={{ flexDirection: 'row', marginBottom: 16, gap: 8 }}>
          <View style={{ flex: 1, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' , backgroundColor: '#FFFFFF' }}>
            <Ionicons name="time-outline" size={16} color="#5A7264" />
            <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 2 }}>{prepTime} dk</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' , backgroundColor: '#FFFFFF' }}>
            <Ionicons name="flame-outline" size={16} color="#E8A040" />
            <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 2 }}>{calories} kcal</Text>
          </View>
          <View style={{ flex: 1, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E8F0EC', alignItems: 'center' , backgroundColor: '#FFFFFF' }}>
            <Ionicons name="people-outline" size={16} color="#5A7264" />
            <Text style={{ fontSize: 12, color: '#5A7264', marginTop: 2 }}>{servings} kişilik</Text>
          </View>
        </View>

        {/* Macros */}
        <View style={{ borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between' , backgroundColor: '#FFFFFF' }}>
          {([
            { label: 'Protein', val: macros.protein, color: '#C75B4A' },
            { label: 'Karb', val: macros.carbs, color: '#4A7FB5' },
            { label: 'Yağ', val: macros.fat, color: '#D4A843' },
            { label: 'Lif', val: macros.fiber, color: '#1A5C37' },
          ]).map((m, i) => (
            <View key={i} style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: m.color }}>{m.val}g</Text>
              <Text style={{ fontSize: 10, color: '#5A7264' }}>{m.label}</Text>
            </View>
          ))}
        </View>

        {/* Ingredients */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 16 , backgroundColor: '#FFFFFF' }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Malzemeler ({ingredients.length})</Text>
          {ingredients.map((ing: any, i) => (
            <View key={i} style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#E8F0EC' }, i === ingredients.length - 1 ? { borderBottomWidth: 0 } : {}]}>
              <View style={{ width: 8, height: 8, borderRadius: 9999, backgroundColor: '#1A5C37', marginRight: 12 }}/>
              <Text style={{ flex: 1, fontSize: 14, color: '#1A2E23' }}>{ing.name}</Text>
              <Text style={{ fontSize: 14, color: '#5A7264' }}>{ing.amount}</Text>
            </View>
          ))}
        </View>

        {/* Steps */}
        <View style={{ borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#E8F0EC', marginBottom: 32 , backgroundColor: '#FFFFFF' }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23', marginBottom: 12 }}>Hazırlanışı</Text>
          {steps.map((step, i) => (
            <View key={i} style={{ flexDirection: 'row', marginBottom: 12 }}>
              <View style={{ width: 24, height: 24, borderRadius: 9999, backgroundColor: '#1A5C37', alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>{i + 1}</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: '#5A7264', lineHeight: 20 }}>{step.replace(/^\d+\.\s*/, '')}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}
