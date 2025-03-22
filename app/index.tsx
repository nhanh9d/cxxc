import React, { useEffect } from "react";
import { StyleSheet, Image } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import * as Notifications from 'expo-notifications';
import { getToken } from "@/helpers/secureStore";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { setToken } = useAuth();

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide header for this screen
  }, [navigation]);

  useEffect(() => {
    const checkToken = async (
    ) => {
      const token = await Notifications.getDevicePushTokenAsync();
      console.log("🚀 ~ useEffect ~ token:", token)
    };

    checkToken();
  }, []);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await getToken();
      if (storedToken) setToken(storedToken);

      setTimeout(() => {
        router.replace(storedToken ? "/(tabs)" : "/auth");
      }, 1500);
    };

    loadToken();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")} // Replace with your image
        style={styles.logo}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFCEE",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: "75%",
    resizeMode: "contain"
  }
});
