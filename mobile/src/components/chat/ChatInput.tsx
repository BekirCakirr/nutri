import React, { useState } from 'react'
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface ChatInputProps {
  onSend: (message: string) => void
  onAttachment?: () => void
  onVoice?: () => void
  placeholder?: string
  disabled?: boolean
  style?: ViewStyle
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onAttachment,
  onVoice,
  placeholder = 'Mesaj yaz\u0131n...',
  disabled = false,
  style,
}) => {
  const [text, setText] = useState('')

  const handleSend = () => {
    const trimmed = text.trim()
    if (trimmed.length > 0) {
      onSend(trimmed)
      setText('')
    }
  }

  return (
    <View style={[styles.container, style]}>
      {onAttachment && (
        <TouchableOpacity
          onPress={onAttachment}
          style={styles.iconButton}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <Text style={styles.iconText}>+</Text>
        </TouchableOpacity>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.disabled}
          multiline
          maxLength={1000}
          editable={!disabled}
        />
      </View>
      {text.trim().length > 0 ? (
        <TouchableOpacity
          onPress={handleSend}
          style={[styles.sendButton, disabled && styles.sendButtonDisabled]}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <Text style={styles.sendIcon}>{'\u2191'}</Text>
        </TouchableOpacity>
      ) : onVoice ? (
        <TouchableOpacity
          onPress={onVoice}
          style={styles.iconButton}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <Text style={styles.micIcon}>{'\u{1F3A4}'}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  iconText: {
    fontSize: fontSizes.h3,
    color: colors.primary.main,
    fontWeight: fontWeights.medium,
  },
  micIcon: {
    fontSize: fontSizes.xl,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    maxHeight: 120,
  },
  input: {
    fontSize: fontSizes.lg,
    color: colors.text.primary,
    paddingVertical: spacing.xs,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  sendButtonDisabled: {
    backgroundColor: colors.text.disabled,
  },
  sendIcon: {
    fontSize: fontSizes.xl,
    color: '#FFFFFF',
    fontWeight: fontWeights.bold,
  },
})
