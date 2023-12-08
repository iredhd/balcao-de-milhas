import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import { ExpoRoot } from 'expo-router';

export default function App() {
  const ctx = require.context('./app')

  return (
    <ExpoRoot context={ctx} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
