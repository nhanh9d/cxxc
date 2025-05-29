import React from "react";
import { ThemedView } from "@/components/layout/ThemedView";
import { ButtonType, ThemedButton } from "@/components/ui/ThemedButton";
import { StyleSheet } from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { CylinderCapacity } from "@/constants/CylinderCapacity";
import ThemedDropdown from "@/components/ui/ThemedDropdown";
import { ThemedImageUpload } from "@/components/ui/ThemedImageUpload";
import { BikeInfo } from "@/types/bikeInfo";
import { ThemedInput } from "@/components/inputs/ThemedInput";
import { useLoading } from "@/contexts/LoadingContext";

interface Props {
  userId: number | undefined;
  firebaseUserId: string;
  bikeInfomation: BikeInfo | undefined;
  setBikeInformation: (value: BikeInfo) => void;
  setInputFocused: (value: boolean) => void;
  nextStep: () => void;
}

const MyBikeInput: React.FC<Props> = ({ userId, firebaseUserId, bikeInfomation, setBikeInformation, setInputFocused, nextStep }) => {
  const baseVehicleUrl = `${Constants.expoConfig?.extra?.apiUrl}/vehicle`;
  const { showLoading, hideLoading } = useLoading();

  const handleBikeImagesUpload = (images: (string | undefined)[]) => {
    setBikeInformation({ ...bikeInfomation, images });
  };

  const saveBike = async () => {
    try {
      showLoading();
      const url = `${baseVehicleUrl}/create`;
      const response = await axios.post(url, {
        ...bikeInfomation,
        userId
      });

      if (response.data) {
        nextStep();
      }
    } catch (error) {
      console.error("Error create user: ", error);
    } finally {
      hideLoading();
    }
  };

  return (
    <>
      <ThemedView style={styles.halfWidth} lightColor="#FFFCEE" darkColor="#2B2A27">
        <ThemedInput
          onChangeText={(value: string) => { setBikeInformation({ ...bikeInfomation, fullname: value }) }}
          placeholder="Tên xe"
          keyboardType="default"
          style={styles.input}
          onFocus={() => setInputFocused(true)} // Set focus state
          onBlur={() => setInputFocused(false)} // Clear focus state
        />
        <ThemedDropdown
          options={CylinderCapacity}
          placeholder="Dung tích xi lanh"
          onValueChange={(value: string) => setBikeInformation({ ...bikeInfomation, cylinderCapacity: value })}
        />
      </ThemedView>

      <ThemedView style={styles.halfWidth} lightColor="#FFFCEE" darkColor="#2B2A27">
        <ThemedImageUpload
          placeholderImage={require("../../assets/images/upload-image-placeholder.png")}
          numberOfImages={3}
          imagesPerRow={3}
          onUpload={handleBikeImagesUpload}
          userId={firebaseUserId}
        />
      </ThemedView>

      <ThemedButton
        title="Tiếp tục"
        onPress={saveBike}
        buttonType={ButtonType.primary}
        style={{ marginBottom: 16}} />

      <ThemedButton
        title="Để sau"
        buttonType={ButtonType.secondary}
        onPress={nextStep} />
    </>
  );
};

export default MyBikeInput;

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
});
