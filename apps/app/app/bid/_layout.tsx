import { Link, Slot } from 'expo-router';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { FlatList, SafeAreaView, StyleSheet, Text, StatusBar } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
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