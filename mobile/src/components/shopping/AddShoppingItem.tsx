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

interface AddShoppingItemProps {
  onAdd: (name: string, quantity?: string) => void
  placeholder?: string
  style?: ViewStyle
}

export const AddShoppingItem: React.FC<AddShoppingItemProps> = ({
  onAdd,
  placeholder = 'Urun ekle...',
  style,
}) => {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')

  const handleAdd = () => {
    const trimmedName = name.trim()
    if (trimmedName.length > 0) {
      onAdd(trimmedName, quantity.trim() || undefined)
      setName('')
      setQuantity('')
    }
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.nameInput}
          value={name}
          onChangeText={setName}
          placeholder={placeholder}
          placeholderTextColor={colors.text.disabled}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
        <TextInput
          style={styles.quantityInput}
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Miktar"
          placeholderTextColor={colors.text.disabled}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
        <TouchableOpacity
          onPress={handleAdd}
          style={[
            styles.addButton,
            name.trim().length === 0 && styles.addButtonDisabled,
          ]}
          activeOpacity={0.7}
          disabled={name.trim().length === 0}
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nameInput: {
    flex: 1,
    height: 44,
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: fontSizes.lg,
    color: colors.text.primary,
  },
  quantityInput: {
    width: 80,
    height: 44,
    backgroundColor: colors.background.default,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    fontSize: fontSizes.lg,
    color: colors.text.primary,
    textAlign: 'center',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: colors.text.disabled,
  },
  addIcon: {
    fontSize: fontSizes.h3,
    color: '#FFFFFF',
    fontWeight: fontWeights.bold,
  },
})
