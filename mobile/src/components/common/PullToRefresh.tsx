import React from 'react'
import { ScrollView, RefreshControl, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'

interface PullToRefreshProps {
  children: React.ReactNode
  refreshing: boolean
  onRefresh: () => void
  style?: ViewStyle
  contentStyle?: ViewStyle
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  refreshing,
  onRefresh,
  style,
  contentStyle,
}) => {
  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={contentStyle}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary.main}
          colors={[colors.primary.main]}
        />
      }
    >
      {children}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
