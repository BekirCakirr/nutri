export const duration = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const

export const spring = {
  default: { damping: 15, stiffness: 150, useNativeDriver: true },
  bouncy: { damping: 10, stiffness: 180, useNativeDriver: true },
  gentle: { damping: 20, stiffness: 120, useNativeDriver: true },
} as const

export const stagger = {
  fast: 40,
  normal: 60,
  slow: 80,
} as const
