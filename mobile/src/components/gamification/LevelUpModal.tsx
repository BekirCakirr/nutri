import React from 'react'
import { View, Text, Modal, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { Button } from '../ui/Button'

interface LevelUpModalProps {
  visible: boolean
  level: number
  reward?: string
  onClose: () => void
  style?: ViewStyle
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  visible,
  level,
  reward,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.starContainer}>
            <Text style={styles.star}>{'*'}</Text>
          </View>
          <Text style={styles.title}>Level Up!</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Level {level}</Text>
          </View>
          <Text style={styles.congrats}>
            Congratulations! You've reached a new level.
          </Text>
          {reward && (
            <View style={styles.rewardRow}>
              <Text style={styles.rewardLabel}>Reward unlocked:</Text>
              <Text style={styles.rewardValue}>{reward}</Text>
            </View>
          )}
          <Button
            title="Continue"
            onPress={onClose}
            variant="primary"
            size="lg"
            fullWidth
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  container: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  starContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  star: {
    fontSize: 40,
    color: '#FFD54F',
    fontWeight: fontWeights.bold,
  },
  title: {
    fontSize: fontSizes.h1,
    fontWeight: fontWeights.extrabold,
    color: colors.primary.main,
    marginBottom: spacing.md,
  },
  levelBadge: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  levelText: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.bold,
    color: '#FFFFFF',
  },
  congrats: {
    fontSize: fontSizes.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: fontSizes.lg * 1.5,
  },
  rewardRow: {
    backgroundColor: '#FFF8E1',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  rewardLabel: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
  },
  rewardValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.secondary.main,
    marginTop: spacing.xs,
  },
})
