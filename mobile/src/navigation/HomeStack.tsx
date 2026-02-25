import { createStackNavigator } from '@react-navigation/stack'
import type { HomeStackParamList } from './types'

import DashboardScreen from '../screens/home/DashboardScreen'
import NotificationsScreen from '../screens/home/NotificationsScreen'
import WeeklyReportScreen from '../screens/home/WeeklyReportScreen'
import MonthlyReportScreen from '../screens/home/MonthlyReportScreen'

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
    </Stack.Navigator>
  )
}
