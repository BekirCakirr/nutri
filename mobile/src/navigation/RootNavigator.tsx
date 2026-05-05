import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import type { RootStackParamList } from './types'
import { useAuthStore } from '../stores/authStore'
import { colors } from '../theme/colors'

import AuthStack from './AuthStack'
import OnboardingStack from './OnboardingStack'
import MainTabNavigator from './MainTabNavigator'

// Modal screens
import DietitianProfileScreen from '../screens/modals/DietitianProfileScreen'
import BookAppointmentScreen from '../screens/modals/BookAppointmentScreen'
import VideoCallScreen from '../screens/modals/VideoCallScreen'
import AIChatScreen from '../screens/modals/AIChatScreen'
import BadgesScreen from '../screens/modals/BadgesScreen'
import ChallengesScreen from '../screens/modals/ChallengesScreen'
import LeaderboardScreen from '../screens/modals/LeaderboardScreen'
import RecipeDetailScreen from '../screens/modals/RecipeDetailScreen'
import ShoppingListDetailScreen from '../screens/modals/ShoppingListDetailScreen'
import AllergenScannerScreen from '../screens/modals/AllergenScannerScreen'

const Stack = createStackNavigator<RootStackParamList>()

export default function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isOnboarded = useAuthStore((s) => s.isOnboarded)
  const checkAuth = useAuthStore((s) => s.checkAuth)
  const [bootstrapped, setBootstrapped] = useState(false)

  useEffect(() => {
    let mounted = true
    checkAuth()
      .catch(() => {})
      .finally(() => {
        if (mounted) setBootstrapped(true)
      })
    return () => {
      mounted = false
    }
  }, [checkAuth])

  if (!bootstrapped) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    )
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : !isOnboarded ? (
        <Stack.Screen name="Onboarding" component={OnboardingStack} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />

          {/* Modal screens */}
          <Stack.Group screenOptions={{ 
            presentation: 'modal',
            ...TransitionPresets.ModalPresentationIOS,
            gestureEnabled: true,
          }}>
            <Stack.Screen name="DietitianProfile" component={DietitianProfileScreen} />
            <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
            <Stack.Screen name="VideoCall" component={VideoCallScreen} />
            <Stack.Screen name="AIChat" component={AIChatScreen} />
            <Stack.Screen name="Badges" component={BadgesScreen} />
            <Stack.Screen name="Challenges" component={ChallengesScreen} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
            <Stack.Screen name="ShoppingListDetail" component={ShoppingListDetailScreen} />
            <Stack.Screen name="AllergenScanner" component={AllergenScannerScreen} />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.default,
  },
})
