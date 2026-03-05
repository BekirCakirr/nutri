import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'
import { Button } from '../ui/Button'

interface PairCodeInputProps {
  codeLength?: number
  onSubmit: (code: string) => void
  loading?: boolean
  error?: string
  style?: ViewStyle
}

export const PairCodeInput: React.FC<PairCodeInputProps> = ({
  codeLength = 6,
  onSubmit,
  loading = false,
  error,
  style,
}) => {
  const [code, setCode] = useState('')
  const inputRef = useRef<TextInput>(null)

  const handleChange = (text: string) => {
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (cleaned.length <= codeLength) {
      setCode(cleaned)
    }
  }

  const handleSubmit = () => {
    if (code.length === codeLength) {
      onSubmit(code)
    }
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Eslestirme Kodu</Text>
      <Text style={styles.description}>
        Diyetisyeninizin size verdigi kodu girerek hesaplarinizi eslestirin.
      </Text>
      <View style={styles.codeDisplay}>
        {Array.from({ length: codeLength }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.codeBox,
              index < code.length && styles.codeBoxFilled,
              error ? styles.codeBoxError : undefined,
            ]}
          >
            <Text style={styles.codeChar}>
              {code[index] || ''}
            </Text>
          </View>
        ))}
      </View>
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={code}
        onChangeText={handleChange}
        maxLength={codeLength}
        autoCapitalize="characters"
        autoCorrect={false}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        title="Hesabi Esle"
        onPress={handleSubmit}
        disabled={code.length !== codeLength}
        loading={loading}
        fullWidth
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  title: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: fontSizes.md * 1.5,
  },
  codeDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  codeBox: {
    width: 44,
    height: 52,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.paper,
  },
  codeBoxFilled: {
    borderColor: colors.primary.main,
  },
  codeBoxError: {
    borderColor: colors.error,
  },
  codeChar: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  error: {
    fontSize: fontSizes.sm,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
})
