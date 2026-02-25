import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'

type Status = 'online' | 'offline' | 'away' | 'busy'

interface StatusDotProps {
  status: Status
  size?: number
  style?: ViewStyle
}

const statusColors: Record<Status, string> = {
  online: colors.success,
  offline: colors.text.disabled,
  away: colors.warning,
  busy: colors.error,
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  size = 10,
  style,
}) => {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: statusColors[status],
        },
        style,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  dot: {
    borderWidth: 2,
    borderColor: colors.background.paper,
  },
})
