import { View, Text, StyleSheet } from 'react-native'

export default function TermsOfServiceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terms of Service</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
})
