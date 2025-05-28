import React from "react";
import { ThemedView } from "@/components/layout/ThemedView";
import { ThemedButton } from "@/components/ui/ThemedButton";
import ThemedDropdown from "@/components/ui/ThemedDropdown";
import ThemedDatePicker from "@/components/ui/ThemedDatePicker";
import axios from "axios";
import Constants from "expo-constants";
import { StyleSheet } from "react-native";
import { ThemedInput } from "../inputs/ThemedInput";
import { useAuth } from "@/contexts/AuthContext";
interface Props {
  personalInformation: any;
  phoneNumber: string;
  firebaseUserId: string;
  setPersonalInformation: (info: any) => void;
  setInputFocused: (state: boolean) => void;
  nextStep: () => void;
}

type UserDto = {
  id: number;
  fullname: string;
  birthday: Date;
  gender: string;
  phone: string;
  isActive: boolean;
  firebaseId: string;
}

type UserResponseDto = UserDto & {
  accessToken: string;
}

const PersonalInfoForm: React.FC<Props> = ({ personalInformation, phoneNumber, firebaseUserId, setPersonalInformation, setInputFocused, nextStep }) => {
  const { setToken } = useAuth();
  const baseUserUrl = `${Constants.expoConfig?.extra?.apiUrl}/user/firebase`;

  const createUser = async () => {
    try {
      const url = `${baseUserUrl}`;
      const response = await axios.post<UserResponseDto>(url, {
        ...personalInformation,
        phone: phoneNumber, firebaseId: firebaseUserId, isActive: true
      });

      if (response.data) {
        setPersonalInformation({ ...personalInformation, userId: response.data.id });
        setToken(response.data.accessToken);
        nextStep();
      }
    } catch (error) {
      console.error("Error create user: ", error);
    }
  };

  return (
    <>
      <ThemedView style={styles.halfWidth} lightColor="#FFFCEE" darkColor="#2B2A27">
        <ThemedInput
          onChangeText={(value: string) => { setPersonalInformation({ ...personalInformation, fullname: value }) }}
          placeholder="Tên đầy đủ"
          keyboardType="default"
          style={styles.input}
          onFocus={() => setInputFocused(true)} // Set focus state
          onBlur={() => setInputFocused(false)} // Clear focus state
        />

        <ThemedView style={styles.rowContainer}>
          <ThemedDatePicker
            buttonStyle={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#FFA500",
              borderRadius: 8,
              paddingHorizontal: 10,
              height: 50,
            }}
            style={styles.halfWidth}
            maxDate={new Date()}
            onValueChange={(value) => setPersonalInformation({ ...personalInformation, birthday: value })} />
          <ThemedDropdown
            onValueChange={(value) => setPersonalInformation({ ...personalInformation, gender: value })}
          />
        </ThemedView>
      </ThemedView>

      <ThemedButton
        title="Tiếp tục"
        onPress={createUser}
        style={[styles.button, personalInformation.gender
          && personalInformation.birthday
          && personalInformation.fullname ? {} : styles.disabledButton]}
        disabled={!(personalInformation.gender
          && personalInformation.birthday
          && personalInformation.fullname)}
      />
    </>
  );
};

export default PersonalInfoForm;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row", // Arrange children horizontally
    justifyContent: "space-between", // Add space between children
    alignItems: "center", // Align items vertically in the center
    marginBottom: 20,
    gap: 10
  },
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
    marginBottom: 20,
    backgroundColor: "#FFA500",
    borderRadius: 8,
    paddingVertical: 12,
  },
  disabledButton: {
    color: "#C4C4C4",
    backgroundColor: "#EEEEEF",
  },
});
