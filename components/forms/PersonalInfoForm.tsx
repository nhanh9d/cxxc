import React from "react";
import { ThemedView } from "@/components/layout/ThemedView";
import { ButtonType, ThemedButton } from "@/components/ui/ThemedButton";
import ThemedDropdown from "@/components/ui/ThemedDropdown";
import ThemedDatePicker from "@/components/ui/ThemedDatePicker";
import axios, { AxiosResponse } from "axios";
import Constants from "expo-constants";
import { StyleSheet, Keyboard } from "react-native";
import { ThemedInput } from "../inputs/ThemedInput";
import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { PersonalInformation } from "@/types/user";

interface Props {
  personalInformation: PersonalInformation;
  phoneNumber: string;
  setPersonalInformation: (info: PersonalInformation) => void;
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

const PersonalInfoForm: React.FC<Props> = ({ personalInformation, phoneNumber, setPersonalInformation, setInputFocused, nextStep }) => {
  const { token } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const baseUserUrl = `${Constants.expoConfig?.extra?.apiUrl}/user/firebase`;
  const backgroundColor = useThemeColor({ light: "#FFFCEE", dark: "#1C1A14" }, 'background');

  const createOrUpdateUser = async () => {
    try {
      showLoading();
      let response: AxiosResponse<UserResponseDto, any>;

      if (token) {
        // Nếu đã có token, update user
        const url = `${baseUserUrl}/${personalInformation.firebaseId}`;
        response = await axios.put<UserResponseDto>(url, {
          ...personalInformation,
          phone: phoneNumber,
          isActive: true
        });
      } else {
        // Nếu chưa có token, tạo user mới
        const url = `${baseUserUrl}`;
        response = await axios.post<UserResponseDto>(url, {
          ...personalInformation,
          phone: phoneNumber,
          isActive: true
        });
      }

      if (response?.data) {
        setPersonalInformation({ 
          ...personalInformation, 
          userId: response.data.id,
          accessToken: response.data.accessToken 
        });
        // Don't set token immediately to avoid auto-redirect, let the registration flow complete first
        nextStep();
      }
    } catch (error) {
      console.error("Error create/update user: ", error);
    } finally {
      hideLoading();
    }
  };

  return (
    <>
      <ThemedView style={styles.halfWidth}>
        <ThemedInput
          onChangeText={(value: string) => { setPersonalInformation({ ...personalInformation, fullname: value }) }}
          placeholder="Tên đầy đủ"
          keyboardType="default"
          style={styles.input}
          value={personalInformation.fullname}
          onFocus={() => setInputFocused(true)} // Set focus state
          onBlur={() => {
            setInputFocused(false); // Clear focus state
            Keyboard.dismiss(); // Close keyboard
          }}
        />

        <ThemedView style={styles.rowContainer}>
          <ThemedDatePicker
            buttonStyle={{
              backgroundColor,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#FFA500",
              borderRadius: 8,
              paddingHorizontal: 10,
              height: 50,
            }}
            value={personalInformation.birthday}
            style={[styles.twoThirdWidth]}
            maxDate={new Date()}
            onValueChange={(value) => setPersonalInformation({ ...personalInformation, birthday: value })} />
          <ThemedView style={styles.oneThirdWidth}>
            <ThemedDropdown
              value={personalInformation.gender}
              onValueChange={(value) => setPersonalInformation({ ...personalInformation, gender: value })}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedButton
        title="Tiếp tục"
        onPress={createOrUpdateUser}
        buttonType={(personalInformation.gender
          && personalInformation.birthday
          && personalInformation.fullname) ? ButtonType.primary : undefined}
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
  twoThirdWidth: {
    flex: 2, // Take up 2/3 of space
  },
  oneThirdWidth: {
    flex: 1, // Take up 1/3 of space
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
