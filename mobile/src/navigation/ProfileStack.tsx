import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import type { ProfileStackParamList } from './types'

import ProfileScreen from '../screens/profile/ProfileScreen'
import EditProfileScreen from '../screens/profile/EditProfileScreen'
import SettingsScreen from '../screens/profile/SettingsScreen'
import AllergyManagementScreen from '../screens/profile/AllergyManagementScreen'
import FamilyModeScreen from '../screens/profile/FamilyModeScreen'
import DataExportScreen from '../screens/profile/DataExportScreen'
import LanguageScreen from '../screens/profile/LanguageScreen'
import NotificationSettingsScreen from '../screens/profile/NotificationSettingsScreen'
import AboutScreen from '../screens/profile/AboutScreen'
import PrivacyPolicyScreen from '../screens/profile/PrivacyPolicyScreen'
import TermsOfServiceScreen from '../screens/profile/TermsOfServiceScreen'
import SubscriptionScreen from '../screens/profile/SubscriptionScreen'
import ConnectedDevicesScreen from '../screens/profile/ConnectedDevicesScreen'
import HelpSupportScreen from '../screens/profile/HelpSupportScreen'
import AchievementsScreen from '../screens/profile/AchievementsScreen'
import DietitianConnectionScreen from '../screens/profile/DietitianConnectionScreen'
import GoalsScreen from '../screens/profile/GoalsScreen'
import PersonalDataScreen from '../screens/profile/PersonalDataScreen'
import RemindersScreen from '../screens/profile/RemindersScreen'
import ThemeScreen from '../screens/profile/ThemeScreen'

const Stack = createStackNavigator<ProfileStackParamList>()

export default function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AllergyManagement" component={AllergyManagementScreen} />
      <Stack.Screen name="FamilyMode" component={FamilyModeScreen} />
      <Stack.Screen name="DataExport" component={DataExportScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="ConnectedDevices" component={ConnectedDevicesScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} />
      <Stack.Screen name="DietitianConnection" component={DietitianConnectionScreen} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
      <Stack.Screen name="PersonalData" component={PersonalDataScreen} />
      <Stack.Screen name="Reminders" component={RemindersScreen} />
      <Stack.Screen name="Theme" component={ThemeScreen} />
    </Stack.Navigator>
  )
}
