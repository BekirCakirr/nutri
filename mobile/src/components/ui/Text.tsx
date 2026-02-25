import React from 'react'
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native'
import { colors } from '../../theme/colors'
import { textStyles, TextVariant } from '../../theme/typography'

interface TextProps extends RNTextProps {
  variant?: TextVariant
  color?: string
  align?: 'left' | 'center' | 'right'
  children: React.ReactNode
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = colors.text.primary,
  align = 'left',
  style,
  children,
  ...rest
}) => {
  return (
    <RNText
      style={[
        textStyles[variant],
        { color, textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  )
}
