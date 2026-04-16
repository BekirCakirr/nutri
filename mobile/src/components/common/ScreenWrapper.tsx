import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  ViewStyle,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

// Tab bar is position: absolute on native, height 70 + bottom 16-24 = ~100px overlay
// All screens need bottom padding so content doesn't hide behind it (not needed on web where tab bar is relative)
const TAB_BAR_SAFE_BOTTOM = Platform.OS === 'web' ? 16 : 110

interface ScreenWrapperProps {
  children: React.ReactNode
  scrollable?: boolean
  padded?: boolean
  backgroundColor?: string
  keyboardAvoiding?: boolean
  style?: ViewStyle
  contentStyle?: ViewStyle
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scrollable = true,
  padded = true,
  backgroundColor = colors.background.default,
  keyboardAvoiding = false,
  style,
  contentStyle,
}) => {
  const content = (
    <>
      {scrollable ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            padded && styles.padded,
            { paddingBottom: TAB_BAR_SAFE_BOTTOM },
            contentStyle,
          ]}
          showsVerticalScrollIndicator={Platform.OS === 'web'}
          keyboardShouldPersistTaps="handled"
          bounces={Platform.OS !== 'web'}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, padded && styles.padded, { paddingBottom: TAB_BAR_SAFE_BOTTOM }, contentStyle]}>
          {children}
        </View>
      )}
    </>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }, style]}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...(Platform.OS === 'web' ? { height: '100%' as any, overflow: 'hidden' as any } : {}),
  },
  flex: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
})
