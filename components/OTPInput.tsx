import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedInput } from "@/components/ThemedInput";
import { ButtonType, ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { saveToken } from "@/helpers/secureStore";
import { useAuth } from "@/contexts/AuthContext";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface Props {
  confirmation: FirebaseAuthTypes.ConfirmationResult | undefined;
  setFirebaseUserId: (value: string) => void;
  setInputFocused: (value: boolean) => void;
  previousStep: () => void;
  nextStep: () => void;
}

const OTPInput: React.FC<Props> = ({ confirmation, setFirebaseUserId, setInputFocused, previousStep, nextStep }) => {
  const baseUserUrl = `${Constants.expoConfig?.extra?.apiUrl}/user/firebase`;
  const [errorOTP, setErrorOTP] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();
  const { setToken } = useAuth();

  const handleSignIn = async (user: FirebaseAuthTypes.User) => {
    setFirebaseUserId(user.uid);
    const url = `${baseUserUrl}/${user.uid}`;
    const response = await axios.get(url);

    if (response.data) {
      await saveToken(response.data.accessToken);
      setToken(response.data.accessToken);

      router.push("/(tabs)");
    } else {
      nextStep();
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (user) => {
      if (user) {
        await handleSignIn(user);
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  const confirmCode = async () => {
    try {
      if (!confirmation) {
        throw new Error("Couldn't retrieve confirmation from previous step");
      }

      const userCredential = await confirmation.confirm(verificationCode);

      if (!userCredential) {
        throw new Error("Couldn't get user credentail on confirm code");
      }

      await handleSignIn(userCredential.user);
    } catch (error) {
      console.error("Error verifying code: ", error);
      setErrorOTP(true);
      setVerificationCode("");
    }
  };

  return (
    <>
      <ThemedView style={styles.halfWidth} lightColor="#FFFCEE" darkColor="#2B2A27">
        <ThemedInput
          value={verificationCode}
          onChangeText={setVerificationCode}
          placeholder="123456"
          keyboardType="number-pad"
          style={styles.input}
          onFocus={() => {
            setInputFocused(true);
            setErrorOTP(false);
          }} // Set focus state
          onChange={() => {
            setErrorOTP(false);
          }}
          onBlur={() => setInputFocused(false)} // Clear focus state
        />
        {errorOTP ? <ThemedText style={[styles.subtitle, styles.error]}>
          Mã xác thực không đúng, vui lòng thử lại!
        </ThemedText> : null}
      </ThemedView>
      <ThemedButton
        title="Tiếp tục"
        onPress={confirmCode}
        buttonType={ButtonType.primary}
        style={{ marginBottom: 24 }}
      />
    </>
  );
};

export default OTPInput;

const styles = StyleSheet.create({
  halfWidth: {
    flex: 1, // Take up equal space
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
  },
  error: {
    color: "#FF3B30"
  },
  input: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFA500",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  button: {
    backgroundColor: "#FFA500",
    borderRadius: 8,
    paddingVertical: 12,
  },
});

