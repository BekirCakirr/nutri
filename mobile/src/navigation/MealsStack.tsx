import { createStackNavigator } from '@react-navigation/stack'
import type { MealsStackParamList } from './types'

import MealLogScreen from '../screens/meals/MealLogScreen'
import AddMealScreen from '../screens/meals/AddMealScreen'
import FoodSearchScreen from '../screens/meals/FoodSearchScreen'
import FoodDetailScreen from '../screens/meals/FoodDetailScreen'
import MealDetailScreen from '../screens/meals/MealDetailScreen'
import MealPlanViewScreen from '../screens/meals/MealPlanViewScreen'
import MealPlanDayDetailScreen from '../screens/meals/MealPlanDayDetailScreen'
import RecentFoodsScreen from '../screens/meals/RecentFoodsScreen'
import FavoritesScreen from '../screens/meals/FavoritesScreen'
import CustomFoodScreen from '../screens/meals/CustomFoodScreen'

const Stack = createStackNavigator<MealsStackParamList>()

export default function MealsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MealLog" component={MealLogScreen} />
      <Stack.Screen name="AddMeal" component={AddMealScreen} />
      <Stack.Screen name="FoodSearch" component={FoodSearchScreen} />
      <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
      <Stack.Screen name="MealDetail" component={MealDetailScreen} />
      <Stack.Screen name="MealPlanView" component={MealPlanViewScreen} />
      <Stack.Screen name="MealPlanDayDetail" component={MealPlanDayDetailScreen} />
      <Stack.Screen name="RecentFoods" component={RecentFoodsScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="CustomFood" component={CustomFoodScreen} />
    </Stack.Navigator>
  )
}
