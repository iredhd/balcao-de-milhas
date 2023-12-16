import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, Platform } from 'react-native';
import { ExpoRoot } from 'expo-router';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useEffect, useRef } from 'react';
import { useAPI } from './hooks';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#55bf0a',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return null;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
    
  } else {
    return null
  }

  return token.data;
}

export default function App() {
  const ctx = require.context('./app')
  const [registeredApp, registerApp] = useAPI({
    url: '/device',
    method: 'POST'
  }, {
    manual: true
  })

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      registerApp({
        data: {
          build_id: Device.osBuildId,
          push_token: token,
          device_info: Device
        }
      })
    });
  }, []);

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
