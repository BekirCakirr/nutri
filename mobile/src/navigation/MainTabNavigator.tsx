import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, View, Platform } from 'react-native'
import type { MainTabParamList } from './types'
import { colors } from '../theme/colors'
import { fontSizes, fontWeights } from '../theme/typography'
import { borderRadius } from '../theme/spacing'

import HomeStack from './HomeStack'
import MealsStack from './MealsStack'
import CameraStack from './CameraStack'
import ProgressStack from './ProgressStack'
import ProfileStack from './ProfileStack'

const Tab = createBottomTabNavigator<MainTabParamList>()

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[700],
        tabBarInactiveTintColor: colors.text.disabled,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
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
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
    height: 64,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.xl,
    borderTopWidth: 0,
    shadowColor: colors.primary[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 6,
    paddingBottom: 0,
  },
  tabBarLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    marginTop: -2,
  },
  tabBarItem: {
    paddingTop: 8,
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
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: colors.primary[700],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cameraInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
