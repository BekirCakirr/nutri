import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface SleepEntryProps {
  bedtime: string
  wakeTime: string
  onBedtimePress: () => void
  onWakeTimePress: () => void
  style?: ViewStyle
}

function calculateDuration(bedtime: string, wakeTime: string): string {
  const [bh, bm] = bedtime.split(':').map(Number)
  const [wh, wm] = wakeTime.split(':').map(Number)
  let totalMinutes = (wh * 60 + wm) - (bh * 60 + bm)
  if (totalMinutes < 0) totalMinutes += 24 * 60
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes}m`
}

export const SleepEntry: React.FC<SleepEntryProps> = ({
  bedtime,
  wakeTime,
  onBedtimePress,
  onWakeTimePress,
  style,
}) => {
  const duration = calculateDuration(bedtime, wakeTime)

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Sleep Log</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={onBedtimePress} style={styles.timeBox}>
          <Text style={styles.timeLabel}>Bedtime</Text>
          <Text style={styles.timeValue}>{bedtime}</Text>
        </TouchableOpacity>
        <View style={styles.durationContainer}>
          <Text style={styles.durationValue}>{duration}</Text>
          <Text style={styles.durationLabel}>Duration</Text>
        </View>
        <TouchableOpacity onPress={onWakeTimePress} style={styles.timeBox}>
          <Text style={styles.timeLabel}>Wake up</Text>
          <Text style={styles.timeValue}>{wakeTime}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeBox: {
    flex: 1,
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  timeValue: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  durationContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  durationValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.primary.main,
  },
  durationLabel: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
  },
})
