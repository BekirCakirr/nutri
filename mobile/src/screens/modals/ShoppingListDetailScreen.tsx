import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'
import { getShoppingListById, toggleShoppingItem } from '../../services/api/shopping'

type ShoppingItem = {
  id: string
  name: string
  amount: string
  category: string
  checked: boolean
}

type Route = RouteProp<any, any>

export default function ShoppingListDetailScreen() {
  const navigation = useNavigation()
  const route = useRoute<Route>()
  const listId = route.params?.id || route.params?.listId
  
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (listId) {
      getShoppingListById(listId).then(list => {
        if (list) {
          const rawList = list as Record<string, any>
          const loadedItems = (list.items || rawList.items || []).map((i: any) => ({
            id: i.id || String(Math.random()),
            name: i.food_name || i.foodName || i.name || '',
            amount: i.amount || '',
            category: i.category || 'Diğer',
            checked: !!i.is_checked || !!i.isChecked || !!i.checked,
          }))
          setItems(loadedItems)
        }
        setLoading(false)
      }).catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [listId])

  const toggleItem = async (id: string) => {
    const item = items.find(i => i.id === id)
    if (!item) return
    
    // Optimistic UI update
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
    
    try {
      if (listId && id) {
        await toggleShoppingItem(listId, id)
      }
    } catch {
      // Revert on failure
      setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
    }
  }

  const categories = [...new Set(items.map(i => i.category))]
  const checkedCount = items.filter(i => i.checked).length

  if (loading) {
    return (
      <ScreenWrapper padded={false}>
        <AppHeader title="Alışveriş Listesi" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1A5C37" />
        </View>
      </ScreenWrapper>
    )
  }

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
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23' }}>Detaylı Liste</Text>
            <Text style={{ fontSize: 12, color: '#5A7264' }}>{checkedCount}/{items.length} alındı</Text>
          </View>
          <View style={{ height: 8, width: 80, backgroundColor: '#E8F0EC', borderRadius: 9999, overflow: 'hidden' }}>
            <View style={{ height: '100%', backgroundColor: '#1A5C37', borderRadius: 9999, width: items.length > 0 ? `${(checkedCount / items.length) * 100}%` : '0%' }} />
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

        {items.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ color: '#5A7264' }}>Bu listede ürün bulunmuyor.</Text>
          </View>
        )}

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
