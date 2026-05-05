import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, View, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { MainTabParamList } from './types'
import { colors } from '../theme/colors'
import { fontSizes, fontWeights } from '../theme/typography'

import HomeStack from './HomeStack'
import MealsStack from './MealsStack'
import CameraStack from './CameraStack'
import ProgressStack from './ProgressStack'
import ProfileStack from './ProfileStack'

const Tab = createBottomTabNavigator<MainTabParamList>()

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets()
  // Reserve the device's bottom safe-area as padding inside the tab bar so
  // the floating bar lifts above the home indicator on modern iPhones / Androids.
  const dynamicTabBar = {
    ...styles.tabBar,
    paddingBottom: Platform.OS === 'web' ? 10 : Math.max(insets.bottom, 10),
    height: Platform.OS === 'web' ? 70 : 70 + Math.max(insets.bottom - 10, 0),
  }
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[700],
        tabBarInactiveTintColor: colors.text.disabled,
        tabBarStyle: dynamicTabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconWrap}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="MealsTab"
        component={MealsStack}
        options={{
          tabBarLabel: 'Ogunler',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconWrap}>
              <Ionicons name={focused ? 'restaurant' : 'restaurant-outline'} size={22} color={color} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="CameraTab"
        component={CameraStack}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <View style={styles.cameraButton}>
              <View style={styles.cameraInner}>
                <Ionicons name="scan-outline" size={26} color="#FFFFFF" />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProgressTab"
        component={ProgressStack}
        options={{
          tabBarLabel: 'Ilerleme',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconWrap}>
              <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={22} color={color} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconWrap}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    position: Platform.OS === 'web' ? ('relative' as any) : 'absolute',
    bottom: Platform.OS === 'web' ? 0 : (Platform.OS === 'ios' ? 24 : 16),
    left: Platform.OS === 'web' ? 0 : 20,
    right: Platform.OS === 'web' ? 0 : 20,
    height: 70,
    backgroundColor: Platform.OS === 'web' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.95)',
    borderRadius: Platform.OS === 'web' ? 0 : 35,
    borderTopWidth: Platform.OS === 'web' ? 1 : 0,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: Platform.OS === 'web' ? -2 : 10 },
    shadowOpacity: 0.1,
    shadowRadius: Platform.OS === 'web' ? 4 : 20,
    elevation: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  tabBarLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    marginTop: -4,
  },
  tabBarItem: {
    paddingTop: 14,
  },
  iconWrap: {
    alignItems: 'center',
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary.main,
    marginTop: 3,
  },
  cameraButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
    borderWidth: 4,
    borderColor: '#F8F9FA',
    shadowColor: colors.primary[700],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cameraInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
