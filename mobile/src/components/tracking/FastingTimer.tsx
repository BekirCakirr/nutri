import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface FastingTimerProps {
  targetHours?: number
  onStart?: () => void
  onStop?: (elapsedMs: number) => void
  style?: ViewStyle
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export const FastingTimer: React.FC<FastingTimerProps> = ({
  targetHours = 16,
  onStart,
  onStop,
  style,
}) => {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startTimeRef = useRef<number>(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const targetMs = targetHours * 60 * 60 * 1000
  const progress = Math.min(elapsed / targetMs, 1)

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsed
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - startTimeRef.current)
      }, 1000)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const handleToggle = () => {
    if (isRunning) {
      setIsRunning(false)
      onStop?.(elapsed)
    } else {
      setElapsed(0)
      setIsRunning(true)
      onStart?.()
    }
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Intermittent Fasting</Text>
      <Text style={styles.targetLabel}>
        {targetHours}:{(24 - targetHours).toString().padStart(2, '0')} Protocol
      </Text>
      <View style={styles.timerCircle}>
        <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
        <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <TouchableOpacity
        onPress={handleToggle}
        style={[styles.button, isRunning && styles.buttonStop]}
      >
        <Text style={styles.buttonText}>
          {isRunning ? 'End Fast' : 'Start Fast'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  targetLabel: {
    fontSize: fontSizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  timerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    borderColor: colors.primary[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  timerText: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  progressText: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: colors.primary[100],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.full,
  },
  button: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
  },
  buttonStop: {
    backgroundColor: colors.error,
  },
  buttonText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: '#FFFFFF',
  },
})
