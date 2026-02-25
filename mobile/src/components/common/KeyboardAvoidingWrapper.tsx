import React from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
  ScrollView,
} from 'react-native'

interface KeyboardAvoidingWrapperProps {
  children: React.ReactNode
  scrollable?: boolean
  keyboardVerticalOffset?: number
  style?: ViewStyle
  contentStyle?: ViewStyle
}

export const KeyboardAvoidingWrapper: React.FC<KeyboardAvoidingWrapperProps> = ({
  children,
  scrollable = true,
  keyboardVerticalOffset = 0,
  style,
  contentStyle,
}) => {
  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {scrollable ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
})
