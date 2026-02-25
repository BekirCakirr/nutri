import { createStackNavigator } from '@react-navigation/stack'
import type { OnboardingStackParamList } from './types'

import BasicInfoScreen from '../screens/onboarding/BasicInfoScreen'
import GoalScreen from '../screens/onboarding/GoalScreen'
import AllergyScreen from '../screens/onboarding/AllergyScreen'
import DietPreferenceScreen from '../screens/onboarding/DietPreferenceScreen'
import LifestyleScreen from '../screens/onboarding/LifestyleScreen'
import DietitianCodeScreen from '../screens/onboarding/DietitianCodeScreen'
import CalculationResultScreen from '../screens/onboarding/CalculationResultScreen'

const Stack = createStackNavigator<OnboardingStackParamList>()

export default function OnboardingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BasicInfo" component={BasicInfoScreen} />
      <Stack.Screen name="Goal" component={GoalScreen} />
      <Stack.Screen name="Allergy" component={AllergyScreen} />
      <Stack.Screen name="DietPreference" component={DietPreferenceScreen} />
      <Stack.Screen name="Lifestyle" component={LifestyleScreen} />
      <Stack.Screen name="DietitianCode" component={DietitianCodeScreen} />
      <Stack.Screen name="CalculationResult" component={CalculationResultScreen} />
    </Stack.Navigator>
  )
}
