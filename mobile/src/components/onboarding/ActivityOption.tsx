import React from 'react'
import { Text, TouchableOpacity, StyleSheet, ViewStyle, View } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface ActivityOptionProps {
  title: string
  description: string
  level: string
  selected: boolean
  onPress: () => void
  style?: ViewStyle
}

export const ActivityOption: React.FC<ActivityOptionProps> = ({
  title,
  description,
  level,
  selected,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, selected && styles.selected, style]}
    >
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, selected && styles.selectedTitle]}>
            {title}
          </Text>
          <Text style={styles.level}>{level}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View
        style={[styles.radio, selected && styles.radioSelected]}
      >
        {selected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  selected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary[50],
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  selectedTitle: {
    color: colors.primary.main,
  },
  level: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  description: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    lineHeight: fontSizes.md * 1.4,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  radioSelected: {
    borderColor: colors.primary.main,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary.main,
  },
})
