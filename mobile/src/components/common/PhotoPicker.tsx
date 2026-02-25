import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { borderRadius, spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

interface PhotoPickerProps {
  onCamera?: () => void
  onGallery?: () => void
  onRemove?: () => void
  hasPhoto?: boolean
  previewUri?: string
  style?: ViewStyle
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({
  onCamera,
  onGallery,
  onRemove,
  hasPhoto = false,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {!hasPhoto ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>{'\u{1F4F7}'}</Text>
          <Text style={styles.placeholderText}>Fotograf Ekle</Text>
          <View style={styles.buttons}>
            {onCamera && (
              <TouchableOpacity
                onPress={onCamera}
                style={styles.button}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonIcon}>{'\u{1F4F8}'}</Text>
                <Text style={styles.buttonLabel}>Kamera</Text>
              </TouchableOpacity>
            )}
            {onGallery && (
              <TouchableOpacity
                onPress={onGallery}
                style={styles.button}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonIcon}>{'\u{1F5BC}'}</Text>
                <Text style={styles.buttonLabel}>Galeri</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.photoContainer}>
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>Fotograf</Text>
          </View>
          <View style={styles.photoActions}>
            {onCamera && (
              <TouchableOpacity
                onPress={onCamera}
                style={styles.photoActionButton}
                activeOpacity={0.7}
              >
                <Text style={styles.photoActionText}>Degistir</Text>
              </TouchableOpacity>
            )}
            {onRemove && (
              <TouchableOpacity
                onPress={onRemove}
                style={styles.photoActionButton}
                activeOpacity={0.7}
              >
                <Text style={[styles.photoActionText, styles.removeText]}>Kaldir</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
  },
  placeholderIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  placeholderText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  buttonIcon: {
    fontSize: fontSizes.h3,
    marginBottom: spacing.xs,
  },
  buttonLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.primary[800],
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: colors.background.default,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
  },
  photoPlaceholderText: {
    fontSize: fontSizes.lg,
    color: colors.text.disabled,
  },
  photoActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  photoActionButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  photoActionText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.primary.main,
  },
  removeText: {
    color: colors.error,
  },
})
