import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes } from '../../theme/typography'

interface RatingStarsProps {
  rating: number
  maxStars?: number
  size?: number
  interactive?: boolean
  onRate?: (rating: number) => void
  style?: ViewStyle
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 24,
  interactive = false,
  onRate,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {Array.from({ length: maxStars }).map((_, index) => {
        const starNumber = index + 1
        const isFilled = starNumber <= rating
        const isHalf = !isFilled && starNumber - 0.5 <= rating

        const star = (
          <Text
            key={index}
            style={[
              styles.star,
              { fontSize: size },
              isFilled && styles.filled,
              isHalf && styles.half,
            ]}
          >
            {isFilled ? '\u2605' : '\u2606'}
          </Text>
        )

        if (interactive && onRate) {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onRate(starNumber)}
              activeOpacity={0.7}
            >
              {star}
            </TouchableOpacity>
          )
        }

        return star
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  star: {
    color: colors.border,
  },
  filled: {
    color: '#FFD54F',
  },
  half: {
    color: '#FFE082',
  },
})
