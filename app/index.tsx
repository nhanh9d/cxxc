import React from "react";
import { StyleSheet, ImageBackground } from "react-native";
import { auth } from "../firebase";
import signInWithGoogle from "./auth/google";
import signInWithFacebook from "./auth/facebook";
import signInWithApple from "./auth/apple";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/images/bg-login.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.loginTypes} lightColor="#FFFCEE" darkColor="#2B2A27">
          <ThemedText style={styles.title}>Xin chào!</ThemedText>
          <ThemedText style={styles.normal}>
            Hãy chọn các hình thức dưới đây để tiếp tục
          </ThemedText>
          <ThemedView style={{ marginVertical: 10 }} />
          <ThemedButton
            style={{borderWidth:1, borderColor: "#EEEEEF", borderRadius: 100}}
            title="Google"
            onPress={() => signInWithGoogle(auth)}
            imageSource={require("../assets/images/google-icon.png")}
            imageStyle={{ width: 56, height: 56 }}
          />
          <ThemedView style={{ marginVertical: 10 }} />
          <ThemedButton
            style={{borderWidth:1, borderColor: "#EEEEEF", borderRadius: 100}}
            title="Apple"
            onPress={() => signInWithApple(auth)}
            imageSource={require("../assets/images/apple-icon.png")}
            imageStyle={{ width: 56, height: 56 }}
          />
          <ThemedView style={{ marginVertical: 10 }} />
          <ThemedButton
            style={{borderWidth:1, borderColor: "#EEEEEF", borderRadius: 100}}
            title="Facebook"
            onPress={() => signInWithFacebook(auth)}
            imageSource={require("../assets/images/facebook-icon.png")}
            imageStyle={{ width: 56, height: 56 }}
          />
          <ThemedView style={{ marginVertical: 10 }} />
          <ThemedButton
            style={{borderWidth:1, borderColor: "#EEEEEF", borderRadius: 100}}
            title="Số điện thoại"
            onPress={() => router.replace("/account/phone")}
            imageSource={require("../assets/images/phone-icon.png")}
            imageStyle={{ width: 56, height: 56 }}
          />
          <ThemedView style={{ marginVertical: 10 }} />
          <ThemedText style={styles.normal}>
            Bằng việc đăng ký tài khoản, bạn đã hiểu và đồng ý với Điều khoản,
            điều kiện của chúng tôi. Tìm hiểu thêm về cách chúng tôi sử dụng
            thông tin của bạn tại Chính sách riêng tư.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start", // Positions the content towards the bottom
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
