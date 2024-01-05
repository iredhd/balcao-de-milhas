import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, Platform, View } from 'react-native';
import { ExpoRoot } from 'expo-router';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useEffect, useRef } from 'react';
import { useAPI } from './hooks';
import { ActivityIndicator } from 'react-native-paper';

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
