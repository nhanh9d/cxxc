import React, { useRef } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedInput } from "@/components/ThemedInput";
import { ButtonType, ThemedButton } from "@/components/ThemedButton";
import { StyleSheet } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import RecaptchaModal from "./Recaptcha";
import { PhoneAuthProvider } from "firebase/auth";
import { auth } from "@/firebase";

interface Props {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  setVerificationId: (value: string) => void;
  setInputFocused: (value: boolean) => void;
  nextStep: () => void;
}

const PhoneInput: React.FC<Props> = ({ phoneNumber, setPhoneNumber, setInputFocused, setVerificationId, nextStep }) => {
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  const sendVerification = async () => {
    if (!recaptchaVerifier.current) {
      console.error("RecaptchaVerifier is not initialized.");
      return;
    }

    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const id = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      setVerificationId(id);

      nextStep();
    } catch (error) {
      console.error("Error during sign-in: ", error);
    }
  };

  return (
    <>
      <ThemedView style={styles.halfWidth} lightColor="#FFFCEE" darkColor="#2B2A27">
        <ThemedInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Số điện thoại"
          keyboardType="phone-pad"
          style={styles.input}
          onFocus={() => setInputFocused(true)} // Set focus state
          onBlur={() => setInputFocused(false)} // Clear focus state
        />
      </ThemedView>
      <ThemedButton
        title="Tiếp tục"
        onPress={sendVerification}
        buttonType={ButtonType.primary}
        style={{ marginBottom: 24 }}
        disabled={!phoneNumber} // Disable if phone number is empty
      />

      <RecaptchaModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
      />
    </>
  );
};

const styles = StyleSheet.create({
  halfWidth: {
    flex: 1, // Take up equal space
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

export default PhoneInput;
