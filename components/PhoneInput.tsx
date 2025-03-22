import React, { useEffect } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedInput } from "@/components/ThemedInput";
import { ButtonType, ThemedButton } from "@/components/ThemedButton";
import { StyleSheet } from "react-native";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface Props {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  setConfirm: (value: FirebaseAuthTypes.ConfirmationResult) => void;
  setInputFocused: (value: boolean) => void;
  nextStep: () => void;
}

const PhoneInput: React.FC<Props> = ({ phoneNumber, setPhoneNumber, setInputFocused, setConfirm, nextStep }) => {
  // useEffect(() => {
  //   if (__DEV__) {
  //     auth().settings.appVerificationDisabledForTesting = true;
  //   }
  // }, []);

  const sendVerification = async () => {
    try {
      const correctedPhoneNumber = phoneNumber.startsWith("0") ? "+84" + phoneNumber.substring(1) : phoneNumber;
      const confirm = await auth().signInWithPhoneNumber(correctedPhoneNumber);

      setConfirm(confirm);
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
