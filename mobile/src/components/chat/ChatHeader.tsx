import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface ChatHeaderProps {
  name: string
  subtitle?: string
  isOnline?: boolean
  avatar?: React.ReactNode
  onBack?: () => void
  onCall?: () => void
  onVideoCall?: () => void
  onProfile?: () => void
  style?: ViewStyle
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  subtitle,
  isOnline = false,
  avatar,
  onBack,
  onCall,
  onVideoCall,
  onProfile,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backArrow}>{'\u2190'}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onProfile}
          activeOpacity={onProfile ? 0.7 : 1}
          disabled={!onProfile}
          style={styles.profileSection}
        >
          {avatar && <View style={styles.avatarContainer}>{avatar}</View>}
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
            ) : (
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, isOnline ? styles.online : styles.offline]} />
                <Text style={styles.statusText}>
                  {isOnline ? 'Cevrimici' : 'Cevrimdisi'}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.actions}>
        {onVideoCall && (
          <TouchableOpacity onPress={onVideoCall} style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>{'\u{1F4F9}'}</Text>
          </TouchableOpacity>
        )}
        {onCall && (
          <TouchableOpacity onPress={onCall} style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>{'\u{1F4DE}'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.xs,
  },
  backArrow: {
    fontSize: fontSizes.h3,
    color: colors.text.primary,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: spacing.sm,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginTop: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  online: {
    backgroundColor: colors.success,
  },
  offline: {
    backgroundColor: colors.text.disabled,
  },
  statusText: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
  actionIcon: {
    fontSize: fontSizes.xl,
  },
})
