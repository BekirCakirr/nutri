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
          contentContainerStyle={[
            padded && styles.padded,
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, padded && styles.padded, contentStyle]}>
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
  },
  flex: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
})
