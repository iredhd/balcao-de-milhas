import { Slot } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function Layout() {
  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" />     
        <Slot />
    </SafeAreaView>
  );
}