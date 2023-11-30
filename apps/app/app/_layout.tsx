import { Tabs } from 'expo-router/tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeProvider, DarkTheme, useTheme } from '@react-navigation/native';
import Toast from 'react-native-toast-message'
import {Provider, DefaultTheme, ThemeProvider as RNThemeProvider} from 'react-native-paper'
  
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
            <Tabs
                initialRouteName='bid'
            >
                <Tabs.Screen 
                    name='index'
                    options={{
                        href: null
                    }}
                />
                <Tabs.Screen 
                    name='bid'
                    options={{
                        title: 'Balcão de Milhas',
                        tabBarIcon: (props) => {
                            return (
                            <MaterialCommunityIcons {...props} name="cash-multiple" />
                            )
                        }
                    }}
                />
                <Tabs.Screen 
                    name='news/index'
                    options={{
                        title: 'Milha News',
                        tabBarIcon: (props) => {
                            return (
                                <MaterialCommunityIcons {...props} name="newspaper" />
                            )
                        }
                    }}
                />
            </Tabs>
        </ThemeProvider>
    </Provider>
  );
}
