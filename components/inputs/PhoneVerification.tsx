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
  setInputFocused 
}: PhoneVerificationProps) {
  const [step, setStep] = useState(VerificationSteps.fillPhone);
  const [title, setTitle] = useState("Nhập số điện thoại");
  const [subtitle, setSubtitle] = useState("Số điện thoại được dùng để xác minh tài khoản và sẽ không hiển thị trên hồ sơ của bạn.");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmation, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | undefined>();
  const [firebaseUserId, setFirebaseUserId] = useState("");

  const cleanPhoneNumber = (phone: string) => phone.replace(/\s/g, '');

  const nextStep = useCallback((passedFirebaseUserId?: string) => {
    switch (step) {
      case VerificationSteps.fillPhone:
        setTitle("Xác thực");
        const cleanedPhone = cleanPhoneNumber(phoneNumber);
        setSubtitle(`Mã xác thực đã được gửi đến: ${cleanedPhone} Nhập mã vào ô bên dưới để xác minh tài khoản.`);
        setStep(VerificationSteps.fillOTP);
        break;
      case VerificationSteps.fillOTP:
        const userId = passedFirebaseUserId || firebaseUserId;
        if (userId) {
          setFirebaseUserId(userId);
          const cleanedPhoneNumber = cleanPhoneNumber(phoneNumber);
          onVerificationComplete(cleanedPhoneNumber, userId);
        } else {
          console.error('No firebaseUserId available');
        }
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
        
        {step === VerificationSteps.fillPhone && (
          <PhoneInput
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            setInputFocused={setInputFocused}
            setConfirm={setConfirm}
            nextStep={nextStep} 
          />
        )}

        {step === VerificationSteps.fillOTP && (
          <OTPInput
            confirmation={confirmation}
            setFirebaseUserId={setFirebaseUserId}
            setInputFocused={setInputFocused}
            nextStep={nextStep} 
          />
        )}
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