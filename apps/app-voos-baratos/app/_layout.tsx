import { Tabs } from 'expo-router/tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeProvider, DarkTheme, useTheme } from '@react-navigation/native';
import Toast from 'react-native-toast-message'
import {Provider, DefaultTheme, ThemeProvider as RNThemeProvider} from 'react-native-paper'
import { Splash } from '../components';

export default function Layout() {
  return (
      <Provider theme={{
          ...DefaultTheme,
          colors: {
              ...DefaultTheme.colors,
              primary: '#55bf0a'
          }
      }}>
        <Toast autoHide position='top' />
        <ThemeProvider value={{
            ...DarkTheme,
            colors: {
                ...DarkTheme.colors,
                primary: '#55bf0a'
            }
        }}>
            <Splash />
            <Tabs
                initialRouteName='index'
                detachInactiveScreens
                screenOptions={{
                    unmountOnBlur: true,
                }}
            >
                <Tabs.Screen 
                    name='index'
                    options={{
                        href: null,
                        headerShown: false,
                    }}
                />
                <Tabs.Screen 
                    name='home'
                    options={{
                        title: 'Voos Baratos',
                        tabBarIcon: (props) => {
                            return (
                                <MaterialCommunityIcons {...props} name="airplane" />
                            )
                        }
                    }}
                />
            </Tabs>
        </ThemeProvider>
    </Provider>
  );
}
