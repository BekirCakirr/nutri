import { createStackNavigator } from '@react-navigation/stack'
import type { ProgressStackParamList } from './types'

import OverviewScreen from '../screens/progress/OverviewScreen'
import WeightScreen from '../screens/progress/WeightScreen'
import WaterScreen from '../screens/progress/WaterScreen'
import ExerciseScreen from '../screens/progress/ExerciseScreen'
import SleepScreen from '../screens/progress/SleepScreen'
import MoodScreen from '../screens/progress/MoodScreen'
import BloodValuesScreen from '../screens/progress/BloodValuesScreen'
import VitaminsScreen from '../screens/progress/VitaminsScreen'
import ProgressPhotosScreen from '../screens/progress/ProgressPhotosScreen'
import IntermittentFastingScreen from '../screens/progress/IntermittentFastingScreen'
import CustomGoalsScreen from '../screens/progress/CustomGoalsScreen'
import MeasurementsScreen from '../screens/progress/MeasurementsScreen'
import NutrientBreakdownScreen from '../screens/progress/NutrientBreakdownScreen'
import CalorieHistoryScreen from '../screens/progress/CalorieHistoryScreen'
import MacroTrackingScreen from '../screens/progress/MacroTrackingScreen'
import StepsScreen from '../screens/progress/StepsScreen'
import HeartRateScreen from '../screens/progress/HeartRateScreen'
import StressScreen from '../screens/progress/StressScreen'

const Stack = createStackNavigator<ProgressStackParamList>()

export default function ProgressStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Overview" component={OverviewScreen} />
      <Stack.Screen name="Weight" component={WeightScreen} />
      <Stack.Screen name="Water" component={WaterScreen} />
      <Stack.Screen name="Exercise" component={ExerciseScreen} />
      <Stack.Screen name="Sleep" component={SleepScreen} />
      <Stack.Screen name="Mood" component={MoodScreen} />
      <Stack.Screen name="BloodValues" component={BloodValuesScreen} />
      <Stack.Screen name="Vitamins" component={VitaminsScreen} />
      <Stack.Screen name="ProgressPhotos" component={ProgressPhotosScreen} />
      <Stack.Screen name="IntermittentFasting" component={IntermittentFastingScreen} />
      <Stack.Screen name="CustomGoals" component={CustomGoalsScreen} />
      <Stack.Screen name="Measurements" component={MeasurementsScreen} />
      <Stack.Screen name="NutrientBreakdown" component={NutrientBreakdownScreen} />
      <Stack.Screen name="CalorieHistory" component={CalorieHistoryScreen} />
      <Stack.Screen name="MacroTracking" component={MacroTrackingScreen} />
      <Stack.Screen name="Steps" component={StepsScreen} />
      <Stack.Screen name="HeartRate" component={HeartRateScreen} />
      <Stack.Screen name="Stress" component={StressScreen} />
    </Stack.Navigator>
  )
}
