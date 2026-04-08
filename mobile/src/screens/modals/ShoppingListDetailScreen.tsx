import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
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
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9', paddingHorizontal: 20, paddingTop: 16 }}showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={{ borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E8F0EC', flexDirection: 'row', alignItems: 'center' }} /* TODO: bg-white */>
          <View style={{ width: 40, height: 40, borderRadius: 9999, backgroundColor: '#E8F5EC', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Ionicons name="cart-outline" size={20} color="#1A5C37" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23' }}>Haftalık Plan</Text>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>{checkedCount}/{items.length} alındı</Text>
          </View>
          <View style={{ height: 8, width: 80, backgroundColor: '#E8F0EC', borderRadius: 9999, overflow: 'hidden' }}>
            <View style={{ height: '100%', backgroundColor: '#1A5C37', borderRadius: 9999, width: `${(checkedCount / items.length) * 100}%` }} />
          </View>
        </View>

        {/* Items by category */}
        {categories.map((cat) => {
          const catItems = items.filter(i => i.category === cat)
          return (
            <View key={cat} style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#5A7264', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>
                {cat} ({catItems.length})
              </Text>
              <View style={{ borderRadius: 16, borderWidth: 1, borderColor: '#E8F0EC', overflow: 'hidden' }} /* TODO: bg-white */>
                {catItems.map((item, ii) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#E8F0EC' }, ii === catItems.length - 1 ? { borderBottomWidth: 0 } : {}]}
                    activeOpacity={0.6}
                    onPress={() => toggleItem(item.id)}
                  >
                    <View
                      style={{ width: 20, height: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: item.checked ? '#1A5C37' : '#FFFFFF',
                        borderColor: item.checked ? '#1A5C37' : '#D4E2DA', }} /* TODO: rounded */
                    >
                      {item.checked && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                    </View>
                    <Text
                      style={{ flex: 1, fontSize: 15, textDecorationLine: item.checked ? 'line-through' : 'none',
                        color: item.checked ? '#A8BFB2' : '#1A2E23',
                        fontWeight: item.checked ? '400' : '500', }}
                    >
                      {item.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#5A7264' }}>{item.amount}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )
        })}

        {/* Add item */}
        <TouchableOpacity
          style={{ backgroundColor: '#1A5C37', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 32, shadowColor: '#1A5C37', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>+ Ürün Ekle</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  )
}
