import Header from "@/components/Header";
import { ApiProvider } from "@/contexts/ApiContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Providers } from "@/contexts/Providers";
import { ImageUploadProvider } from "@/contexts/UploadImageContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Providers>
      <StatusBar barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"} />
      <Stack />
    </Providers>
  );
}
