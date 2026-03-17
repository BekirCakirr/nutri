import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type ShoppingItem = {
  id: string
  name: string
  amount: string
  category: string
  checked: boolean
}

const mockList = {
  id: '1',
  title: 'Haftalık Diyet Alışverişi',
  date: '24 Mart 2026',
  items: [
    { id: 'i1', name: 'Yulaf Ezmesi', amount: '500g', category: 'Tahıllar', checked: true },
    { id: 'i2', name: 'Süzme Peynir', amount: '1 Kutu', category: 'Süt Ürünleri', checked: false },
    { id: 'i3', name: 'Organik Yumurta', amount: '15 li', category: 'Süt Ürünleri', checked: false },
    { id: 'i4', name: 'Avokado', amount: '3 Adet', category: 'Sebze & Meyve', checked: false },
    { id: 'i5', name: 'Badem Sütü', amount: '1 Litre', category: 'İçecekler', checked: true },
    { id: 'i6', name: 'Tavuk Göğsü', amount: '1 kg', category: 'Et & Tavuk', checked: false },
  ] as ShoppingItem[]
}

export default function ShoppingListDetailScreen() {
  const navigation = useNavigation()
  const [items, setItems] = useState<ShoppingItem[]>(mockList.items)

  const toggleItem = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100)

  // Group by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ShoppingItem[]>)

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <AppHeader
        title={mockList.title}
        subtitle={`${items.filter(i => i.checked).length} / ${items.length} Tamamlandı`}
        onBack={() => navigation.goBack()}
        rightIcon="ellipsis-horizontal"
        onRightPress={() => {}}
      />
      
      <ScrollView className="flex-1 bg-[#F8FAF9] px-4 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Progress Card */}
        <View className="bg-white rounded-2xl p-5 border border-[#E8F0EC] mb-6 flex-row items-center">
           <View className="relative w-14 h-14 items-center justify-center mr-4">
              <View className="absolute inset-0 rounded-full border-4 border-[#E8F0EC]" />
              <View 
                className="absolute inset-0 rounded-full border-4 border-[#1A5C37]"
                style={{ 
                  borderTopColor: '#1A5C37', 
                  borderRightColor: progress > 25 ? '#1A5C37' : '#E8F0EC',
                  borderBottomColor: progress > 50 ? '#1A5C37' : '#E8F0EC',
                  borderLeftColor: progress > 75 ? '#1A5C37' : '#E8F0EC',
                  transform: [{ rotate: '-45deg' }] 
                }} 
              />
              <Text className="text-[#1A2E23] font-bold text-sm z-10">% {progress}</Text>
           </View>
           <View className="flex-1">
              <Text className="text-[#1A2E23] font-bold text-base mb-1">Alışveriş Durumu</Text>
              <Text className="text-[#5A7264] text-xs">Listenizde alınan ürünlere göre hesaplanır.</Text>
           </View>
        </View>

        {Object.entries(groupedItems).map(([category, catItems]) => (
           <View key={category} className="mb-6">
              <Text className="text-[#1A2E23] font-bold text-sm uppercase tracking-wider mb-3 ml-1">
                {category}
              </Text>
              <View className="bg-white rounded-2xl border border-[#E8F0EC] overflow-hidden">
                 {catItems.map((item, index) => (
                    <TouchableOpacity 
                      key={item.id}
                      className={`flex-row items-center p-4 ${index !== catItems.length - 1 ? 'border-b border-[#E8F0EC]' : ''}`}
                      onPress={() => toggleItem(item.id)}
                      activeOpacity={0.7}
                    >
                       <View className={`w-6 h-6 rounded border items-center justify-center mr-3 ${item.checked ? 'bg-[#1A5C37] border-[#1A5C37]' : 'bg-transparent border-[#A8BFB2]'}`}>
                          {item.checked && <Ionicons name="checkmark" size={16} color="#FFF" />}
                       </View>
                       <View className="flex-1">
                          <Text 
                            className={`font-semibold text-base ${item.checked ? 'text-[#A8BFB2] line-through' : 'text-[#1A2E23]'}`}
                          >
                            {item.name}
                          </Text>
                       </View>
                       <Text className={`font-medium ${item.checked ? 'text-[#A8BFB2]' : 'text-[#5A7264]'}`}>
                         {item.amount}
                       </Text>
                    </TouchableOpacity>
                 ))}
              </View>
           </View>
        ))}
        <View className="h-6" />
      </ScrollView>

      {/* Floating Action Button for Adding New Item */}
      <View className="absolute bottom-6 right-5">
         <TouchableOpacity 
           className="w-14 h-14 bg-[#1A5C37] rounded-full items-center justify-center shadow-lg shadow-[#1A5C37]/40"
         >
            <Ionicons name="add" size={32} color="#FFF" />
         </TouchableOpacity>
      </View>
    </ScreenWrapper>
  )
}
