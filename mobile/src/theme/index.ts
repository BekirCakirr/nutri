export { colors, nutritionColors } from './colors'
export { fontSizes, fontWeights, lineHeights, textStyles } from './typography'
export type { TextVariant } from './typography'
export { spacing, borderRadius, iconSizes } from './spacing'
export { shadows } from './shadows'
export { duration, spring, stagger } from './animations'
export { mealTypeConfig } from './icons'

import { colors } from './colors'
import { textStyles } from './typography'
import { spacing, borderRadius, iconSizes } from './spacing'

export interface AppTheme {
  colors: {
    primary: typeof colors.primary
    secondary: typeof colors.secondary
    accent: typeof colors.accent
    success: typeof colors.success
    warning: typeof colors.warning
    error: typeof colors.error
    info: typeof colors.info
    background: { default: string; paper: string }
    text: { primary: string; secondary: string; disabled: string }
    border: string
  }
  typography: typeof textStyles
  spacing: typeof spacing
  borderRadius: typeof borderRadius
  iconSizes: typeof iconSizes
}

export const lightTheme: AppTheme = {
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    background: colors.background,
    text: colors.text,
    border: colors.border,
  },
  typography: textStyles,
  spacing,
  borderRadius,
  iconSizes,
}

export const darkTheme: AppTheme = {
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    background: colors.dark.background,
    text: colors.dark.text,
    border: colors.dark.border,
  },
  typography: textStyles,
  spacing,
  borderRadius,
  iconSizes,
}
