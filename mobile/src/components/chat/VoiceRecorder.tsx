import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface VoiceRecorderProps {
  onSend: (durationMs: number) => void
  onCancel: () => void
  style?: ViewStyle
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onSend,
  onCancel,
  style,
}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
    } else {
      setIsRecording(true)
      setDuration(0)
    }
  }

  const handleSend = () => {
    setIsRecording(false)
    onSend(duration * 1000)
  }

  const handleCancel = () => {
    setIsRecording(false)
    setDuration(0)
    onCancel()
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={handleCancel} style={styles.cancelButton} activeOpacity={0.7}>
        <Text style={styles.cancelText}>Iptal</Text>
      </TouchableOpacity>
      <View style={styles.center}>
        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.durationText}>{formatDuration(duration)}</Text>
          </View>
        )}
        {!isRecording && duration > 0 && (
          <Text style={styles.durationText}>{formatDuration(duration)}</Text>
        )}
        {!isRecording && duration === 0 && (
          <Text style={styles.hintText}>Kaydetmek icin bastin</Text>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handleToggleRecording}
          style={[styles.recordButton, isRecording && styles.recordButtonActive]}
          activeOpacity={0.7}
        >
          <View style={[styles.recordIcon, isRecording && styles.recordIconActive]} />
        </TouchableOpacity>
        {!isRecording && duration > 0 && (
          <TouchableOpacity onPress={handleSend} style={styles.sendButton} activeOpacity={0.7}>
            <Text style={styles.sendIcon}>{'\u2191'}</Text>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    padding: spacing.sm,
  },
  cancelText: {
    fontSize: fontSizes.md,
    color: colors.error,
    fontWeight: fontWeights.medium,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
    marginRight: spacing.sm,
  },
  durationText: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.text.primary,
  },
  hintText: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  recordButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonActive: {
    borderColor: colors.error,
  },
  recordIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.error,
  },
  recordIconActive: {
    width: 16,
    height: 16,
    borderRadius: borderRadius.xs,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    fontSize: fontSizes.xl,
    color: '#FFFFFF',
    fontWeight: fontWeights.bold,
  },
})
