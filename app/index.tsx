import React, { useEffect } from "react";
import { StyleSheet, Image, useColorScheme } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { ThemedView } from "@/components/layout/ThemedView";
import { getToken, saveToken, removeToken } from "@/helpers/secureStore";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/contexts/ApiContext";
import Constants from "expo-constants";
import { jwtDecode } from "jwt-decode";
import messaging from "@react-native-firebase/messaging";
if (__DEV__) {
  require("../ReactotronConfig");
}
export default function LoginScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { setToken } = useAuth();
  const axios = useApi();
  const colorScheme = useColorScheme();

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

      if (!storedToken) {
        return;
      }

      try {
        const decoded: any = jwtDecode(storedToken);
        if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
          // Token hết hạn
          await Promise.all([removeToken(), removeToken("pushToken")]);
        } else {
          setToken(storedToken);
          isValid = true;
        }
      } catch (e) {
        // Token lỗi format
        await Promise.all([removeToken(), removeToken("pushToken")]);
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
    <ThemedView style={[styles.container, colorScheme === 'dark' ? styles.containerDark : styles.containerLight]}>
      <Image
        source={require("../assets/images/logo.png")} // Replace with your image
        style={styles.logo}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  containerLight: {
    backgroundColor: "#FFFCEE",
  },
  containerDark: {
    backgroundColor: "#2B2A27",
  },
  logo: {
    width: "75%",
    resizeMode: "contain"
  }
});
