import { Link, Redirect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <Redirect href="bid" />
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
