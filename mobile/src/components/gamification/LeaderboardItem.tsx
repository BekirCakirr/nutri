import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { Avatar } from '../ui/Avatar'

interface LeaderboardItemProps {
  rank: number
  name: string
  avatar?: string
  score: number
  unit?: string
  isCurrentUser?: boolean
  style?: ViewStyle
}

const rankColors: Record<number, string> = {
  1: '#FFD54F',
  2: '#B0BEC5',
  3: '#A1887F',
}

export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  rank,
  name,
  avatar,
  score,
  unit = 'pts',
  isCurrentUser = false,
  style,
}) => {
  const rankColor = rankColors[rank]

  return (
    <View
      style={[
        styles.container,
        isCurrentUser && styles.currentUser,
        style,
      ]}
    >
      <View
        style={[
          styles.rankContainer,
          rankColor ? { backgroundColor: rankColor + '30' } : undefined,
        ]}
      >
        <Text
          style={[
            styles.rank,
            rankColor ? { color: rankColor } : undefined,
          ]}
        >
          {rank}
        </Text>
      </View>
      <Avatar source={avatar} name={name} size="sm" />
      <Text
        style={[styles.name, isCurrentUser && styles.currentUserText]}
        numberOfLines={1}
      >
        {name}
        {isCurrentUser ? ' (You)' : ''}
      </Text>
      <Text style={styles.score}>
        {score.toLocaleString()} {unit}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  currentUser: {
    backgroundColor: colors.primary[50],
  },
  rankContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  rank: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text.secondary,
  },
  name: {
    flex: 1,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  currentUserText: {
    fontWeight: fontWeights.semibold,
    color: colors.primary.main,
  },
  score: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
})
