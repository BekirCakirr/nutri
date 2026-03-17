import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'

export default function RecipeDetailScreen() {
  const navigation = useNavigation()
  const route = useRoute<any>()
  
  // This would usually be fetched based on route.params.recipeId
  const recipe = {
    title: 'Avokadolu Poşe Yumurta',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1480&auto=format&fit=crop',
    time: '15 dk',
    calories: 320,
    difficulty: 'Kolay',
    macros: { protein: 18, carbs: 22, fat: 16 },
    ingredients: [
      { name: 'Tam buğday ekmeği', amount: '2 dilim' },
      { name: 'Yumurta', amount: '2 adet' },
      { name: 'Avokado', amount: '1/2 adet' },
      { name: 'Limon suyu', amount: '1 tatlı kaşığı' },
      { name: 'Pul biber, Karabiber, Tuz', amount: 'Göz kararı' },
    ],
    instructions: [
      'Avokadoyu soyun ve bir kasede limon suyu, tuz, karabiber ile ezin.',
      'Ekmekleri kızartın ve üzerine ezilmiş avokadoyu sürün.',
      'Küçük bir tencerede suyu kaynatın, içine biraz sirke damlatın.',
      'Suyu bir kaşıkla girdap oluşturacak şekilde karıştırın ve yumurtaları kırın.',
      'Yumurtaları 3 dakika pişirip (poşe) çıkarın ve avokadolu ekmeklerin üzerine yerleştirin.',
      'Üzerine pul biber serpip servis yapın.'
    ]
  }

  return (
    <View className="flex-1 bg-[#F8FAF9]">
      {/* Header Image */}
      <View className="h-72 w-full relative">
        <Image source={{ uri: recipe.image }} className="w-full h-full" resizeMode="cover" />
        <View className="absolute inset-0 bg-black/30" />
        
        {/* Back Button */}
        <TouchableOpacity 
          className="absolute top-14 left-5 w-10 h-10 rounded-full bg-black/40 items-center justify-center backdrop-blur-sm"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#FFF" />
        </TouchableOpacity>

        {/* Action Buttons */}
        <View className="absolute top-14 right-5 flex-row gap-3">
          <TouchableOpacity className="w-10 h-10 rounded-full bg-black/40 items-center justify-center backdrop-blur-sm">
            <Ionicons name="share-social" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-lg shadow-black/20">
            <Ionicons name="heart" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 -mt-6 bg-[#F8FAF9] rounded-t-3xl" showsVerticalScrollIndicator={false}>
        {/* Title & Quick Info */}
        <View className="px-5 pt-6 pb-4">
           <Text className="text-2xl font-extrabold text-[#1A2E23] mb-4">{recipe.title}</Text>
           
           <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="time-outline" size={18} color="#5A7264" />
                <Text className="text-[#5A7264] font-medium">{recipe.time}</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="flame-outline" size={18} color="#F59E0B" />
                <Text className="text-[#5A7264] font-medium">{recipe.calories} kcal</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="restaurant-outline" size={18} color="#4A7FB5" />
                <Text className="text-[#5A7264] font-medium">{recipe.difficulty}</Text>
              </View>
           </View>

           {/* Macros */}
           <View className="flex-row bg-white rounded-2xl p-4 border border-[#E8F0EC] justify-between items-center mb-6">
              <View className="items-center">
                 <Text className="text-[#4A7FB5] font-bold text-lg">{recipe.macros.protein}g</Text>
                 <Text className="text-[10px] text-[#A8BFB2] uppercase tracking-wider">Protein</Text>
              </View>
              <View className="h-8 w-px bg-[#E8F0EC]" />
               <View className="items-center">
                 <Text className="text-[#F59E0B] font-bold text-lg">{recipe.macros.carbs}g</Text>
                 <Text className="text-[10px] text-[#A8BFB2] uppercase tracking-wider">Karb</Text>
              </View>
              <View className="h-8 w-px bg-[#E8F0EC]" />
               <View className="items-center">
                 <Text className="text-[#EF4444] font-bold text-lg">{recipe.macros.fat}g</Text>
                 <Text className="text-[10px] text-[#A8BFB2] uppercase tracking-wider">Yağ</Text>
              </View>
           </View>
        </View>

        {/* Ingredients */}
        <View className="px-5 pb-6">
           <Text className="text-[#1A2E23] font-bold text-xl mb-4">Malzemeler</Text>
           <View className="bg-white rounded-2xl p-4 border border-[#E8F0EC] space-y-3">
              {recipe.ingredients.map((ing, i) => (
                 <View key={i} className="flex-row justify-between items-center py-1">
                    <View className="flex-row items-center flex-1">
                       <View className="w-2 h-2 rounded-full bg-[#4ECDC4] mr-3" />
                       <Text className="text-[#1A2E23] font-medium">{ing.name}</Text>
                    </View>
                    <Text className="text-[#5A7264] font-semibold">{ing.amount}</Text>
                 </View>
              ))}
           </View>
        </View>

        {/* Instructions */}
        <View className="px-5 pb-12">
           <Text className="text-[#1A2E23] font-bold text-xl mb-4">Hazırlanışı</Text>
           <View className="space-y-4">
              {recipe.instructions.map((step, i) => (
                 <View key={i} className="flex-row items-start">
                    <View className="w-6 h-6 rounded-full bg-[#1A5C37] items-center justify-center mr-3 mt-1">
                       <Text className="text-white text-xs font-bold">{i + 1}</Text>
                    </View>
                    <Text className="flex-1 text-[#5A7264] leading-relaxed pt-1.5">{step}</Text>
                 </View>
              ))}
           </View>
        </View>
      </ScrollView>

      {/* Floating Action Button for Logging */}
      <View className="absolute bottom-6 w-full px-5">
         <TouchableOpacity className="bg-[#1A5C37] w-full h-14 rounded-full flex-row items-center justify-center shadow-lg shadow-[#1A5C37]/40">
            <Ionicons name="add-circle-outline" size={24} color="#FFF" />
            <Text className="text-white font-bold text-base ml-2">Bugünün Öğününe Ekle</Text>
         </TouchableOpacity>
      </View>
    </View>
  )
}
