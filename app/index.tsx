import React, { useEffect } from "react";
import { StyleSheet, Image } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { ThemedView } from "@/components/layout/ThemedView";
import * as Notifications from 'expo-notifications';
import { getToken, saveToken, removeToken } from "@/helpers/secureStore";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/contexts/ApiContext";
import Constants from "expo-constants";
import { jwtDecode } from "jwt-decode";

export default function LoginScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { setToken } = useAuth();
  const axios = useApi();

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide header for this screen
  }, [navigation]);

  useEffect(() => {
    const checkToken = async (
    ) => {
      const settings = await Notifications.getPermissionsAsync();
      if (!settings.granted) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Permission not granted for notifications');
        }
      }

      const token = await Notifications.getDevicePushTokenAsync();
      const storedPushToken = await getToken("pushToken");
      
      if (!storedPushToken || storedPushToken !== token.data) {
        await saveToken("pushToken", token.data);
        try {
          await axios.put(`${Constants.expoConfig?.extra?.apiUrl}/user/push-token`, { pushToken: token.data });
        } catch (error) {
          console.log("Lỗi khi cập nhật push token:", error);
        }
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await getToken();
      let isValid = false;

      if (storedToken) {
        try {
          const decoded: any = jwtDecode(storedToken);
          if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
            // Token hết hạn
            await removeToken();
          } else {
            setToken(storedToken);
            isValid = true;
          }
        } catch (e) {
          // Token lỗi format
          await removeToken();
        }
      }

      setTimeout(() => {
        router.replace(isValid ? "/(tabs)" : "/auth");
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
