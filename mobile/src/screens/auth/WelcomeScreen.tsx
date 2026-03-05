import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { AuthStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { Button } from '../../components/ui/Button'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontSizes, fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<AuthStackParamList, 'Welcome'>

export default function WelcomeScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <ScreenWrapper scrollable={false} padded={false} backgroundColor={colors.background.paper}>
      <View style={styles.container}>
        {/* Top brand area */}
        <View style={styles.hero}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/logo-icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.brand}>
            Nutri<Text style={styles.brandAccent}>AI</Text>
          </Text>
          <View style={styles.divider} />
          <Text style={styles.tagline}>Akilli Beslenme Asistani</Text>
        </View>

        {/* Middle content */}
        <View style={styles.content}>
          <Text style={styles.title}>Saglikli yasam{'\n'}yolculugunuz basliyor</Text>
          <Text style={styles.description}>
            Diyetisyeninizle birlikte beslenme hedeflerinize ulasin.
            AI destekli kisisel beslenme takibi.
          </Text>
        </View>

        {/* Bottom actions */}
        <View style={styles.actions}>
          <Button
            title="Giris Yap"
            onPress={() => navigation.navigate('Login')}
            fullWidth
            size="lg"
          />
          <Button
            title="Yeni Hesap Olustur"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
            fullWidth
            size="lg"
          />
        </View>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl * 1.5,
    paddingBottom: spacing.xxl,
  },
  hero: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 64,
    height: 64,
  },
  brand: {
    fontSize: fontSizes.h1,
    fontWeight: fontWeights.bold,
    color: colors.primary[800],
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: colors.secondary.main,
  },
  divider: {
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary[200],
    marginVertical: spacing.md,
  },
  tagline: {
    fontSize: fontSizes.md,
    color: colors.text.secondary,
    fontWeight: fontWeights.medium,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  content: {
    paddingHorizontal: spacing.sm,
  },
  title: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    lineHeight: fontSizes.h2 * 1.3,
  },
  description: {
    fontSize: fontSizes.lg,
    color: colors.text.secondary,
    lineHeight: fontSizes.lg * 1.7,
  },
  actions: {
    gap: spacing.sm,
  },
})
