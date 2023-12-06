import { PropsWithChildren, useEffect } from 'react'
import { Text } from 'react-native-paper'
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export const Splash = () => {
    useEffect(() => {
        (async () => {
            setTimeout(SplashScreen.hideAsync, 10 * 1000)
        })();
      }, []);

    return null
}