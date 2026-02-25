import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface TabItem {
  key: string
  label: string
  icon?: string
  badge?: number
}

interface TabBarProps {
  tabs: TabItem[]
  activeTab: string
  onTabPress: (key: string) => void
  style?: ViewStyle
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            style={styles.tab}
            activeOpacity={0.7}
          >
            {tab.icon && (
              <View style={styles.iconContainer}>
                <Text style={[styles.icon, isActive && styles.iconActive]}>
                  {tab.icon}
                </Text>
                {tab.badge != null && tab.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </Text>
                  </View>
                )}
              </View>
            )}
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
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
    backgroundColor: colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: spacing.xs,
    paddingTop: spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 2,
  },
  icon: {
    fontSize: fontSizes.h3,
    color: colors.text.disabled,
  },
  iconActive: {
    color: colors.primary.main,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: '#FFFFFF',
  },
  label: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.text.disabled,
  },
  labelActive: {
    color: colors.primary.main,
    fontWeight: fontWeights.semibold,
  },
})
