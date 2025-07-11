import { Providers } from '@/contexts/Providers'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useThemeColor } from '@/hooks/useThemeColor'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect } from 'react'
import { StatusBar, Platform } from 'react-native'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
GoogleSignin.configure({
  iosClientId: '622023085823-46cm30rk1805ese8tlrne9eqch4nbk15.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
})
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const backgroundColor = useThemeColor(
    { light: '#FFFCEE', dark: '#2B2A27' },
    'background'
  )

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <Providers>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
        translucent={true}
      />
      <Stack
        screenOptions={{
          gestureEnabled: true, // đảm bảo cho phép gesture back
          headerTitleStyle: {
            fontFamily: Platform.select({
              ios: 'System',
              android: 'Roboto'
            })
          },
          headerBackTitleStyle: {
            fontFamily: Platform.select({
              ios: 'System',
              android: 'Roboto'
            })
          }
        }}
      />
    </Providers>
  )
}
