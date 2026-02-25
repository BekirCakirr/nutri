import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'

interface SafeViewProps {
  children: React.ReactNode
  backgroundColor?: string
  edges?: ('top' | 'bottom' | 'left' | 'right')[]
  statusBarStyle?: 'default' | 'light-content' | 'dark-content'
  style?: ViewStyle
}

export const SafeView: React.FC<SafeViewProps> = ({
  children,
  backgroundColor = colors.background.default,
  statusBarStyle = 'dark-content',
  style,
}) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }, style]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={backgroundColor} />
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
