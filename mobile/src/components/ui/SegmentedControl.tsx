import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface SegmentedControlProps {
  segments: string[]
  selectedIndex: number
  onSelect: (index: number) => void
  style?: ViewStyle
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  selectedIndex,
  onSelect,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {segments.map((segment, index) => {
        const isSelected = index === selectedIndex
        return (
          <TouchableOpacity
            key={segment}
            onPress={() => onSelect(index)}
            activeOpacity={0.7}
            style={[styles.segment, isSelected && styles.selectedSegment]}
          >
            <Text
              style={[styles.segmentText, isSelected && styles.selectedText]}
            >
              {segment}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.md,
    padding: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
  },
  selectedSegment: {
    backgroundColor: colors.background.paper,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
  },
  selectedText: {
    color: colors.primary.main,
    fontWeight: fontWeights.semibold,
  },
})
