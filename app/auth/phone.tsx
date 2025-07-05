import React, { useEffect, useState, useCallback } from "react";
import { ThemedView } from "@/components/layout/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { useNavigation, useRouter } from "expo-router";
import {
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ThemedScrollView } from "@/components/layout/ThemedScrollView";
import PhoneVerification from "@/components/inputs/PhoneVerification";
import UserRegister from "@/components/forms/UserRegister";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

enum AuthSteps {
  phoneVerification,
  userRegistration
}

export default function PhoneScreen() {
  const backgroundColor = useThemeColor({ light: "#FFFCEE", dark: "#2B2A27" }, 'background');
  const router = useRouter();

  const [step, setStep] = useState(AuthSteps.phoneVerification);
  const [isInputFocused, setInputFocused] = useState(false);

  // Data to pass between steps
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firebaseUserId, setFirebaseUserId] = useState("");

  const handleVerificationComplete = useCallback((phone: string, userId: string) => {
    setPhoneNumber(phone);
    setFirebaseUserId(userId);
    setStep(AuthSteps.userRegistration);
  }, []);

  const handleRegistrationComplete = useCallback(() => {
    router.replace("/(tabs)");
  }, [router]);

  const previousStep = useCallback(() => {
    if (step === AuthSteps.phoneVerification) {
      router.back();
    } else {
      setStep(AuthSteps.phoneVerification);
    }
  }, [step, router]);

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={previousStep} style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="chevron-left" size={24} color="#999" />
          <ThemedText>Quay lại</ThemedText>
        </TouchableOpacity>
      ),
      headerTitle: "",
      headerStyle: {
        backgroundColor,
        shadowOpacity: 0, // Remove shadow (iOS)
        elevation: 0, // Remove shadow (Android)
        borderBottomWidth: 0, // Remove bottom border
      }
    });
  }, [navigation, previousStep]);

  return (
    <ThemedScrollView
      contentContainerStyle={[
        styles.container,
        isInputFocused && { paddingBottom: 150 },
      ]}
      keyboardShouldPersistTaps="handled"
      lightColor="#FFFCEE" 
      darkColor="#2B2A27"
    >
      {step === AuthSteps.phoneVerification ? (
        <PhoneVerification
          onVerificationComplete={handleVerificationComplete}
          isInputFocused={isInputFocused}
          setInputFocused={setInputFocused}
        />
      ) : (
        <UserRegister
          phoneNumber={phoneNumber}
          firebaseUserId={firebaseUserId}
          isInputFocused={isInputFocused}
          setInputFocused={setInputFocused}
          onRegistrationComplete={handleRegistrationComplete}
        />
      )}
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
