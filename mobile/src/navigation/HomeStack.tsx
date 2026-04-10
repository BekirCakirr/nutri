import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import type { HomeStackParamList } from './types'

import DashboardScreen from '../screens/home/DashboardScreen'
import NotificationsScreen from '../screens/notifications/NotificationsScreen'
import WeeklyReportScreen from '../screens/home/WeeklyReportScreen'
import MonthlyReportScreen from '../screens/home/MonthlyReportScreen'
import ConversationListScreen from '../screens/messages/ConversationListScreen'
import ChatScreen from '../screens/messages/ChatScreen'

const Stack = createStackNavigator<HomeStackParamList>()

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="WeeklyReport" component={WeeklyReportScreen} />
      <Stack.Screen name="MonthlyReport" component={MonthlyReportScreen} />
      <Stack.Screen name="ConversationList" component={ConversationListScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  )
}
