import { Providers } from "@/contexts/Providers";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar, Platform } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({ light: "#FFFCEE", dark: "#2B2A27" }, 'background');

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Providers>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={backgroundColor}
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
