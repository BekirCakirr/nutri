import React from 'react'
import { View, Text, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { fontSizes, fontWeights } from '../../theme/typography'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  source?: string
  name?: string
  size?: AvatarSize
  style?: ViewStyle
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
}

const fontSizeMap: Record<AvatarSize, number> = {
  sm: fontSizes.sm,
  md: fontSizes.md,
  lg: fontSizes.xl,
  xl: fontSizes.h3,
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  style,
}) => {
  const dimension = sizeMap[size]

  const containerStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2,
  }

  if (source) {
    return (
      <Image
        source={{ uri: source }}
        style={[styles.image, containerStyle as ImageStyle, style as ImageStyle]}
      />
    )
  }

  return (
    <View style={[styles.fallback, containerStyle, style]}>
      <Text style={[styles.initials, { fontSize: fontSizeMap[size] }]}>
        {name ? getInitials(name) : '?'}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.border,
  },
  fallback: {
    backgroundColor: colors.primary[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.primary[800],
    fontWeight: fontWeights.semibold,
  },
})
