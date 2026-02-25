import { View, Text, StyleSheet } from 'react-native'

export default function MacroTrackingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Macro Tracking</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
})
