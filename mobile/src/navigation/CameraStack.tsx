import { createStackNavigator } from '@react-navigation/stack'
import type { CameraStackParamList } from './types'

import CameraCaptureScreen from '../screens/camera/CameraCaptureScreen'
import PhotoAnalysisScreen from '../screens/camera/PhotoAnalysisScreen'
import AdjustPortionsScreen from '../screens/camera/AdjustPortionsScreen'
import BarcodeScreen from '../screens/camera/BarcodeScreen'
import OCRScreen from '../screens/camera/OCRScreen'
import VoiceScreen from '../screens/camera/VoiceScreen'
import TextInputScreen from '../screens/camera/TextInputScreen'
import MenuScanScreen from '../screens/camera/MenuScanScreen'

const Stack = createStackNavigator<CameraStackParamList>()

export default function CameraStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CameraCapture" component={CameraCaptureScreen} />
      <Stack.Screen name="PhotoAnalysis" component={PhotoAnalysisScreen} />
      <Stack.Screen name="AdjustPortions" component={AdjustPortionsScreen} />
      <Stack.Screen name="Barcode" component={BarcodeScreen} />
      <Stack.Screen name="OCR" component={OCRScreen} />
      <Stack.Screen name="Voice" component={VoiceScreen} />
      <Stack.Screen name="TextInput" component={TextInputScreen} />
      <Stack.Screen name="MenuScan" component={MenuScanScreen} />
    </Stack.Navigator>
  )
}
