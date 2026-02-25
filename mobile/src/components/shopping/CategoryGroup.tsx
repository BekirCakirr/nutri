import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface CategoryItem {
  id: string
  name: string
  quantity?: string
  checked: boolean
}

interface CategoryGroupProps {
  category: string
  items: CategoryItem[]
  onToggleItem: (id: string) => void
  collapsible?: boolean
  style?: ViewStyle
}

export const CategoryGroup: React.FC<CategoryGroupProps> = ({
  category,
  items,
  onToggleItem,
  collapsible = true,
  style,
}) => {
  const [expanded, setExpanded] = useState(true)
  const checkedCount = items.filter((i) => i.checked).length

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() => collapsible && setExpanded(!expanded)}
        activeOpacity={collapsible ? 0.7 : 1}
        style={styles.header}
      >
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.count}>
          {checkedCount}/{items.length}
        </Text>
        {collapsible && (
          <Text style={styles.arrow}>{expanded ? '\u25B2' : '\u25BC'}</Text>
        )}
      </TouchableOpacity>
      {expanded &&
        items.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onToggleItem(item.id)}
            activeOpacity={0.7}
            style={styles.item}
          >
            <View
              style={[
                styles.checkbox,
                item.checked && styles.checkboxChecked,
              ]}
            >
              {item.checked && <Text style={styles.checkmark}>{'\u2713'}</Text>}
            </View>
            <Text
              style={[styles.itemName, item.checked && styles.itemChecked]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            {item.quantity && (
              <Text style={styles.quantity}>{item.quantity}</Text>
            )}
          </TouchableOpacity>
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  category: {
    flex: 1,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  count: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  arrow: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.xs,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
  },
  itemName: {
    flex: 1,
    fontSize: fontSizes.lg,
    color: colors.text.primary,
  },
  itemChecked: {
    textDecorationLine: 'line-through',
    color: colors.text.disabled,
  },
  quantity: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
})
