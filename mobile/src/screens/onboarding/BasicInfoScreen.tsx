import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import type { OnboardingStackParamList } from '../../navigation/types'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { OnboardingStep } from '../../components/onboarding/OnboardingStep'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { fontWeights } from '../../theme/typography'

type Nav = StackNavigationProp<OnboardingStackParamList, 'BasicInfo'>

const genders = [
  { id: 'female', label: 'Kadın', emoji: '👩' },
  { id: 'male', label: 'Erkek', emoji: '👨' },
  { id: 'other', label: 'Diğer', emoji: '🧑' },
]

export default function BasicInfoScreen() {
  const navigation = useNavigation<Nav>()
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')

  const canContinue = birthDate.trim() && gender && height.trim() && weight.trim()

  return (
    <ScreenWrapper keyboardAvoiding padded={false}>
      <OnboardingStep
        title="Temel Bilgiler"
        description="Size özel beslenme planı oluşturabilmemiz için bazı bilgilere ihtiyacımız var."
        currentStep={1}
        totalSteps={7}
      >
        <View style={styles.inputGroup}>
          <Input label="Doğum Tarihi" placeholder="GG/AA/YYYY" value={birthDate} onChangeText={setBirthDate} keyboardType="number-pad" />

          <Text style={styles.sectionLabel}>Cinsiyet</Text>
          <View style={styles.genderRow}>
            {genders.map((g) => (
              <TouchableOpacity
                key={g.id}
                onPress={() => setGender(g.id)}
                style={[styles.genderCard, gender === g.id && styles.genderCardSelected]}
                activeOpacity={0.7}
              >
                <Text style={styles.genderEmoji}>{g.emoji}</Text>
                <Text style={[styles.genderLabel, gender === g.id && styles.genderLabelSelected]}>{g.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.bodyRow}>
            <View style={styles.bodyCol}>
              <Input label="Boy (cm)" placeholder="165" value={height} onChangeText={setHeight} keyboardType="number-pad" />
            </View>
            <View style={styles.bodyCol}>
              <Input label="Kilo (kg)" placeholder="68" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
            </View>
          </View>
        </View>

        <View style={styles.spacer} />
        <Button title="Devam Et" onPress={() => navigation.navigate('Goal')} disabled={!canContinue} fullWidth size="lg" style={styles.btn} />
      </OnboardingStep>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  inputGroup: { gap: 16 },
  sectionLabel: { fontSize: 16, fontWeight: fontWeights.medium, color: colors.text.primary, marginBottom: 4 },
  genderRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  genderCard: { flex: 1, paddingVertical: 16, borderRadius: 12, borderWidth: 2, borderColor: colors.border, backgroundColor: '#fff', alignItems: 'center' },
  genderCardSelected: { borderColor: colors.primary.main, backgroundColor: colors.primary[50] },
  genderEmoji: { fontSize: 20, marginBottom: 4 },
  genderLabel: { fontSize: 14, fontWeight: fontWeights.semibold, color: colors.text.secondary },
  genderLabelSelected: { color: colors.primary.main },
  bodyRow: { flexDirection: 'row', gap: 16 },
  bodyCol: { flex: 1 },
  spacer: { flex: 1 },
  btn: { shadowColor: colors.primary.main, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
})
