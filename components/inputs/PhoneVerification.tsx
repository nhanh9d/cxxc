import React, { useState, useCallback } from "react";
import { ThemedView } from "@/components/layout/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import PhoneInput from "./PhoneInput";
import OTPInput from "./OTPInput";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

enum VerificationSteps {
  fillPhone,
  fillOTP,
}

interface PhoneVerificationProps {
  onVerificationComplete: (phoneNumber: string, firebaseUserId: string) => void;
  isInputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
}

export default function PhoneVerification({ 
  onVerificationComplete, 
  isInputFocused,
  setInputFocused 
}: PhoneVerificationProps) {
  const [step, setStep] = useState(VerificationSteps.fillPhone);
  const [title, setTitle] = useState("Nhập số điện thoại");
  const [subtitle, setSubtitle] = useState("Số điện thoại được dùng để xác minh tài khoản và sẽ không hiển thị trên hồ sơ của bạn.");

  // Phone
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmation, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | undefined>();

  // OTP
  const [firebaseUserId, setFirebaseUserId] = useState("");

  const nextStep = useCallback(() => {
    switch (step) {
      case VerificationSteps.fillPhone:
        setTitle("Xác thực");
        // Clean phone number for display
        const cleanedPhone = phoneNumber.replace(/\s/g, '');
        setSubtitle(`Mã xác thực đã được gửi đến: ${cleanedPhone} Nhập mã vào ô bên dưới để xác minh tài khoản.`);
        setStep(VerificationSteps.fillOTP);
        break;
      case VerificationSteps.fillOTP:
        // Pass cleaned phone number to completion handler
        const cleanedPhoneNumber = phoneNumber.replace(/\s/g, '');
        onVerificationComplete(cleanedPhoneNumber, firebaseUserId);
        break;
    }
  }, [step, phoneNumber, firebaseUserId, onVerificationComplete]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.content} lightColor="#FFFCEE" darkColor="#2B2A27">
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.subtitle}>
          {subtitle}
        </ThemedText>
        
        {step === VerificationSteps.fillPhone ? (
          <PhoneInput
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            setInputFocused={setInputFocused}
            setConfirm={setConfirm}
            nextStep={nextStep} 
          />
        ) : null}

        {step === VerificationSteps.fillOTP ? (
          <OTPInput
            confirmation={confirmation}
            setFirebaseUserId={setFirebaseUserId}
            setInputFocused={setInputFocused}
            nextStep={nextStep} 
          />
        ) : null}
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
  },
});