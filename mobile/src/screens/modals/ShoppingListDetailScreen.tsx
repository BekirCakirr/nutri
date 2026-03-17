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

const mockItems: ShoppingItem[] = [
  // Sebze & Meyve
  { id: '1', name: 'Brokoli', amount: '1 demet', category: 'Sebze & Meyve', checked: false },
  { id: '2', name: 'Ispanak', amount: '500g', category: 'Sebze & Meyve', checked: true },
  { id: '3', name: 'Muz', amount: '6 adet', category: 'Sebze & Meyve', checked: false },
  { id: '4', name: 'Avokado', amount: '2 adet', category: 'Sebze & Meyve', checked: false },
  { id: '5', name: 'Kiraz domates', amount: '250g', category: 'Sebze & Meyve', checked: true },
  // Protein
  { id: '6', name: 'Tavuk göğsü', amount: '500g', category: 'Protein', checked: false },
  { id: '7', name: 'Yumurta', amount: '10 adet', category: 'Protein', checked: false },
  { id: '8', name: 'Yunan yoğurdu', amount: '500g', category: 'Protein', checked: true },
  // Tahıl & Baklagil
  { id: '9', name: 'Quinoa', amount: '500g', category: 'Tahıl & Baklagil', checked: false },
  { id: '10', name: 'Yulaf ezmesi', amount: '1 paket', category: 'Tahıl & Baklagil', checked: false },
  { id: '11', name: 'Kırmızı mercimek', amount: '500g', category: 'Tahıl & Baklagil', checked: true },
  // Diğer
  { id: '12', name: 'Zeytinyağı', amount: '500ml', category: 'Diğer', checked: true },
  { id: '13', name: 'Bal', amount: '250g', category: 'Diğer', checked: false },
]

export default function ShoppingListDetailScreen() {
  const navigation = useNavigation()
  const [items, setItems] = useState(mockItems)

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item))
  }

  const checkedCount = items.filter(i => i.checked).length
  const categories = [...new Set(items.map(i => i.category))]

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Alışveriş Listesi" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9] px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View className="bg-white rounded-2xl p-4 mb-4 border border-[#E8F0EC] flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-[#E8F5EC] items-center justify-center mr-3">
            <Ionicons name="cart-outline" size={20} color="#1A5C37" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-[#1A2E23]">Haftalık Plan</Text>
            <Text className="text-xs text-[#5A7264]">{checkedCount}/{items.length} alındı</Text>
          </View>
          <View className="h-2 w-20 bg-[#E8F0EC] rounded-full overflow-hidden">
            <View className="h-full bg-[#1A5C37] rounded-full" style={{ width: `${(checkedCount / items.length) * 100}%` }} />
          </View>
        </View>

        {/* Items by category */}
        {categories.map((cat) => {
          const catItems = items.filter(i => i.category === cat)
          return (
            <View key={cat} className="mb-4">
              <Text className="text-xs font-bold text-[#5A7264] uppercase tracking-wide mb-2 ml-1">
                {cat} ({catItems.length})
              </Text>
              <View className="bg-white rounded-2xl border border-[#E8F0EC] overflow-hidden">
                {catItems.map((item, ii) => (
                  <TouchableOpacity
                    key={item.id}
                    className="flex-row items-center px-4 py-3 border-b border-[#E8F0EC]"
                    style={ii === catItems.length - 1 ? { borderBottomWidth: 0 } : {}}
                    activeOpacity={0.6}
                    onPress={() => toggleItem(item.id)}
                  >
                    <View
                      className="w-5 h-5 rounded border items-center justify-center mr-3"
                      style={{
                        backgroundColor: item.checked ? '#1A5C37' : '#FFFFFF',
                        borderColor: item.checked ? '#1A5C37' : '#D4E2DA',
                      }}
                    >
                      {item.checked && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                    </View>
                    <Text
                      className="flex-1 text-[15px]"
                      style={{
                        textDecorationLine: item.checked ? 'line-through' : 'none',
                        color: item.checked ? '#A8BFB2' : '#1A2E23',
                        fontWeight: item.checked ? '400' : '500',
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text className="text-sm text-[#5A7264]">{item.amount}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )
        })}

        {/* Add item */}
        <TouchableOpacity
          className="bg-[#1A5C37] rounded-xl py-4 items-center mb-8"
          style={{ shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">+ Ürün Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
