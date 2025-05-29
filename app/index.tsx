import React, { useEffect } from "react";
import { StyleSheet, Image } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { ThemedView } from "@/components/layout/ThemedView";
import { getToken, saveToken, removeToken } from "@/helpers/secureStore";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/contexts/ApiContext";
import Constants from "expo-constants";
import { jwtDecode } from "jwt-decode";
import messaging from "@react-native-firebase/messaging";

export default function LoginScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { setToken } = useAuth();
  const axios = useApi();

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide header for this screen
  }, [navigation]);

  useEffect(() => {
    const checkPushToken = async (
    ) => {
      const status = await messaging().requestPermission();
      const enabled =
        status === messaging.AuthorizationStatus.AUTHORIZED ||
        status === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        return;
      }

      const token = await messaging().getToken();
      const storedPushToken = await getToken("pushToken");
      try {
        await axios.put(`${Constants.expoConfig?.extra?.apiUrl}/user/push-token`, { pushToken: token });
      } catch (error) {
        console.log("Lỗi khi cập nhật push token:", error);
      }

      if (!storedPushToken || storedPushToken !== token) {
        await saveToken("pushToken", token);
      }
    };

    checkPushToken();
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
            await removeToken("pushToken");
          } else {
            setToken(storedToken);
            isValid = true;
          }
        } catch (e) {
          // Token lỗi format
          await removeToken();
          await removeToken("pushToken");
        }
      }

      setTimeout(() => {
        if (isValid) {
          router.replace("/(tabs)");
        }
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
