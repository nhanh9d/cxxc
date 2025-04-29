import React, { useEffect } from "react";
import { StyleSheet, Image } from "react-native";
import signInWithGoogle from "./google";
import { useNavigation, useRouter } from "expo-router";
import { ThemedView } from "@/components/layout/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedButton } from "@/components/ui/ThemedButton";
import * as Notifications from 'expo-notifications';

export default function LoginScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async (
    ) => {
      const token = await Notifications.getDevicePushTokenAsync();
      console.log("🚀 ~ useEffect ~ token:", token)
    };

    checkToken();
  }, []);

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide header for this screen
  }, [navigation]);

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require("../../assets/images/bg-login.png")} // Replace with your image
        style={styles.backgroundImage}
      />
      <ThemedView style={styles.loginTypes} lightColor="#FFFCEE" darkColor="#2B2A27">
        <ThemedText style={styles.title}>Xin chào!</ThemedText>
        <ThemedText style={styles.normal}>
          Hãy chọn các hình thức dưới đây để tiếp tục
        </ThemedText>
        <ThemedView style={{ marginVertical: 10 }} />
        <ThemedButton
          style={{ backgroundColor: "#FFF", borderWidth: 1, borderColor: "#EEEEEF", borderRadius: 100 }}
          title="Google"
          onPress={() => signInWithGoogle()}
          imageSource={require("../../assets/images/google-icon.png")}
          imageStyle={{ width: 36, height: 36 }}
        />
        <ThemedView style={{ marginVertical: 10 }} />
        <ThemedButton
          style={{ backgroundColor: "#FFF", borderWidth: 1, borderColor: "#EEEEEF", borderRadius: 100 }}
          title="Apple"
          // onPress={() => signInWithApple(auth)}
          imageSource={require("../../assets/images/apple-icon.png")}
          imageStyle={{ width: 36, height: 36 }}
        />
        <ThemedView style={{ marginVertical: 10 }} />
        <ThemedButton
          style={{ backgroundColor: "#FFF", borderWidth: 1, borderColor: "#EEEEEF", borderRadius: 100 }}
          title="Facebook"
          // onPress={() => signInWithFacebook(auth)}
          imageSource={require("../../assets/images/facebook-icon.png")}
          imageStyle={{ width: 36, height: 36 }}
        />
        <ThemedView style={{ marginVertical: 10 }} />
        <ThemedButton
          style={{ backgroundColor: "#FFF", borderWidth: 1, borderColor: "#EEEEEF", borderRadius: 100 }}
          title="Số điện thoại"
          onPress={() => router.push("/auth/phone")}
          imageSource={require("../../assets/images/phone-icon.png")}
          imageStyle={{ width: 36, height: 36 }}
        />
        <ThemedView style={{ marginVertical: 10 }} />
        <ThemedText style={styles.normal}>
          Bằng việc đăng ký tài khoản, bạn đã hiểu và đồng ý với Điều khoản,
          điều kiện của chúng tôi. Tìm hiểu thêm về cách chúng tôi sử dụng
          thông tin của bạn tại Chính sách riêng tư.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start", // Positions the content towards the bottom
  },
  backgroundImage: {
    width: "100%",
    height: "45%", // Adjust height of image
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  loginTypes: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    width: "100%",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  normal: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
});
