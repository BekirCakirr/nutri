import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { MealsStackParamList } from '../../navigation/types'
import type { Food } from '../../types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { FoodListItem } from '../../components/nutrition/FoodListItem'
import { useFoodStore } from '../../stores/foodStore'
import { colors } from '../../theme/colors'
import { spacing, borderRadius } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { shadows } from '../../theme/shadows'

type Nav = StackNavigationProp<MealsStackParamList, 'FoodSearch'>
type TabKey = 'search' | 'recent' | 'favorites'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'search', label: 'Arama' },
  { key: 'recent', label: 'Son Yenenler' },
  { key: 'favorites', label: 'Favoriler' },
]

export default function FoodSearchScreen() {
  const navigation = useNavigation<Nav>()
  const {
    searchResults,
    recentFoods,
    favoriteFoods,
    isSearching,
    searchFood,
    clearSearch,
    loadRecentFoods,
    loadFavoriteFoods,
  } = useFoodStore()

  const [activeTab, setActiveTab] = useState<TabKey>('search')
  const [query, setQuery] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    loadRecentFoods()
    loadFavoriteFoods()
  }, [])

  const handleQueryChange = useCallback(
    (text: string) => {
      setQuery(text)

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(() => {
        if (text.trim()) {
          searchFood(text.trim())
        } else {
          clearSearch()
        }
      }, 300)
    },
    [searchFood, clearSearch],
  )

  const handleClear = useCallback(() => {
    setQuery('')
    clearSearch()
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
  }, [clearSearch])

  const handleFoodPress = useCallback(
    (food: Food) => {
      navigation.navigate('FoodDetail', { foodId: food.id, returnTo: 'AddMeal' })
    },
    [navigation],
  )

  const getListData = (): Food[] => {
    switch (activeTab) {
      case 'search':
        return query.trim() ? searchResults : []
      case 'recent':
        return recentFoods
      case 'favorites':
        return favoriteFoods
    }
  }

  const getEmptyText = (): string => {
    switch (activeTab) {
      case 'search':
        return query.trim()
          ? 'Sonuc bulunamadi.'
          : 'Yiyecek aramak icin yazmaya baslayin.'
      case 'recent':
        return 'Henuz yiyecek eklemediniz.'
      case 'favorites':
        return 'Henuz favori yiyecek eklemediniz.'
    }
  }

  const data = getListData()

  const renderItem = useCallback(
    ({ item }: { item: Food }) => (
      <FoodListItem
        name={item.name}
        brand={item.brand}
        calories={item.nutrition.calories}
        servingSize={`${item.servingSize} ${item.servingUnit}`}
        onPress={() => handleFoodPress(item)}
        showThumbnail
        imageSeed={item.id}
      />
    ),
    [handleFoodPress],
  )

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name={activeTab === 'favorites' ? 'heart-outline' : 'search-outline'}
        size={48}
        color={colors.text.disabled}
      />
      <Text style={styles.emptyText}>{getEmptyText()}</Text>
    </View>
  )

  return (
    <ScreenWrapper scrollable={false}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.text.secondary} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={handleQueryChange}
          placeholder="Yiyecek ara..."
          placeholderTextColor={colors.text.disabled}
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Loading indicator */}
      {isSearching && activeTab === 'search' && (
        <ActivityIndicator
          size="small"
          color={colors.primary.main}
          style={styles.loader}
        />
      )}

      {/* Food List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={!isSearching ? renderEmpty : null}
        contentContainerStyle={data.length === 0 ? styles.emptyList : undefined}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSizes.lg,
    color: colors.text.primary,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
    paddingVertical: 0,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.paper,
    overflow: 'hidden',
    ...shadows.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary[100],
  },
  tabText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.primary.main,
    fontWeight: fontWeights.semibold,
  },
  loader: {
    marginVertical: spacing.md,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xxl * 2,
  },
  emptyText: {
    fontSize: fontSizes.lg,
    color: colors.text.disabled,
    marginTop: spacing.md,
    textAlign: 'center',
  },
})
