import { View, Text, StyleSheet } from 'react-native'

export default function MenuScanScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Scan</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
})
