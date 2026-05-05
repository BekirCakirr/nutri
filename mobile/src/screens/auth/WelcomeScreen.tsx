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
    <ScreenWrapper scrollable={false} padded={false}>
      <View style={styles.container}>
        {/* Top brand area */}
        <View style={styles.brandArea}>
          <View style={styles.logoBox}>
            <Image
              source={require('../../../assets/logo-icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.brandTitle}>
            Nutri<Text style={styles.brandAccent}>AI</Text>
          </Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>
            Akıllı Beslenme Asistanı
          </Text>
        </View>

        {/* Middle content */}
        <View style={styles.middleContent}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <Text style={styles.heroTitle}>
            Sağlıklı yaşam{'\n'}yolculuğunuz başlıyor
          </Text>
          <Text style={styles.heroDescription}>
            Diyetisyeninizle birlikte beslenme hedeflerinize ulaşın.
            AI destekli kişisel takip artık çok kolay.
          </Text>
        </View>

        {/* Bottom actions */}
        <View style={styles.actions}>
          <Button
            title="Giriş Yap"
            onPress={() => navigation.navigate('Login')}
            fullWidth
            size="lg"
            style={styles.loginBtn}
          />
          <Button
            title="Yeni Hesap Oluştur"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
            fullWidth
            size="lg"
            style={styles.registerBtn}
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
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 48,
    backgroundColor: colors.background.default,
  },
  brandArea: {
    alignItems: 'center',
    marginTop: 32,
  },
  logoBox: {
    width: 112,
    height: 112,
    borderRadius: 24,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: `${colors.primary[100]}50`,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoImage: {
    width: 64,
    height: 64,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: fontWeights.bold,
    color: colors.primary[800],
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: colors.secondary.main,
  },
  divider: {
    width: 40,
    height: 6,
    borderRadius: 100,
    backgroundColor: colors.primary[200],
    marginVertical: 20,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text.secondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  middleContent: {
    paddingHorizontal: 8,
    marginTop: 16,
  },
  heroImage: {
    width: '100%',
    height: 160,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: colors.primary[50],
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: fontWeights.bold,
    color: colors.text.primary,
    marginBottom: 16,
    lineHeight: 38,
  },
  heroDescription: {
    fontSize: 18,
    color: colors.text.secondary,
    lineHeight: 28,
  },
  actions: {
    gap: 16,
    marginTop: 32,
  },
  loginBtn: {
    shadowColor: colors.primary[700],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  registerBtn: {
    backgroundColor: 'white',
  },
})
