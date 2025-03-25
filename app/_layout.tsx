import { Providers } from "@/contexts/Providers";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar, Platform } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Providers>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFCEE"
        translucent={true}
      />
      <Stack
        screenOptions={{
          gestureEnabled: true, // đảm bảo cho phép gesture back
          headerTitleStyle: {
            fontFamily: Platform.select({
              ios: 'System',
              android: 'Roboto',
            }),
          },
          headerBackTitleStyle: {
            fontFamily: Platform.select({
              ios: 'System',
              android: 'Roboto',
            }),
          },
        }}
      />
    </Providers>
  );
}
