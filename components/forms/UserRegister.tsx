import React, { useState, useCallback } from "react";
import { ThemedView } from "@/components/layout/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { ButtonType, ThemedButton } from "@/components/ui/ThemedButton";
import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import axios from 'axios';
import Constants from 'expo-constants';
import { ThemedImageUpload } from "@/components/ui/ThemedImageUpload";
import PersonalInfoForm from "./PersonalInfoForm";
import KnowYourCustomer from "./KnowYourCustomer";
import MyBikeInput from "@/components/inputs/MyBikeInput";
import { BikeInfo } from "@/types/bikeInfo";
import { useAuth } from "@/contexts/AuthContext";
import { saveToken } from "@/helpers/secureStore";
import { PersonalInformation } from "@/types/user";

enum RegistrationSteps {
  fillPersonalInfomation,
  fillImages,
  fillVerification,
  fillBike,
  finish
}

interface UserRegisterProps {
  phoneNumber: string;
  firebaseUserId: string;
  isInputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
  onRegistrationComplete: () => void;
}

export default function UserRegister({
  phoneNumber,
  firebaseUserId,
  isInputFocused,
  setInputFocused,
  onRegistrationComplete
}: UserRegisterProps) {
  const baseUserUrl = `${Constants.expoConfig?.extra?.apiUrl}/user/firebase`;
  const { setToken } = useAuth();

  const [step, setStep] = useState(RegistrationSteps.fillPersonalInfomation);
  const [title, setTitle] = useState("Nhập thông tin cá nhân");
  const [subtitle, setSubtitle] = useState("Hãy cung cấp một số thông tin để mọi người hiểu rõ hơn về bạn nhé!");

  // Personal information
  const [personalInformation, setPersonalInformation] = useState<PersonalInformation>({ firebaseId: firebaseUserId });
  console.log("🚀 ~ personalInformation:", personalInformation)

  // User profile images
  const [images, setImages] = useState<(string | undefined)[]>([]);

  // User verification images
  const [verificationImages, setVerificationImages] = useState<(string | undefined)[]>([]);

  // Bike
  const [bikeInfomation, setBikeInformation] = useState<BikeInfo>();

  const handleUpload = (images: (string | undefined)[]) => {
    setImages(images);
  };

  const nextStep = useCallback(async () => {
    switch (step) {
      case RegistrationSteps.fillPersonalInfomation:
        setTitle("Thêm ảnh của bạn");
        setSubtitle("Thêm ít nhất 3 ảnh vào hồ sơ sẽ giúp tăng tỉ lệ tìm được người đồng hành!");
        setStep(RegistrationSteps.fillImages);
        break;
      case RegistrationSteps.fillImages:
        setTitle("Gần xong rồi!");
        setSubtitle("Hãy thực hiện chụp ảnh selfie theo 2 ảnh mẫu bên dưới để xác minh bạn là chính chủ!");
        setStep(RegistrationSteps.fillVerification);
        break;
      case RegistrationSteps.fillVerification:
        setTitle("My Bike");
        setSubtitle("Hãy chia sẻ chiếc xe yêu quý mà bạn đang sử dụng!");
        setStep(RegistrationSteps.fillBike);
        break;
      case RegistrationSteps.fillBike:
        setTitle("Hồ sơ đã tạo thành công!");
        setSubtitle("Hãy khám phá những tính năng của CXXC nhé!");
        setStep(RegistrationSteps.finish);
        break;
      default:
        // Set the token when registration is complete
        if (personalInformation.accessToken) {
          await saveToken("accessToken", personalInformation.accessToken);
          setToken(personalInformation.accessToken);
        }
        onRegistrationComplete();
        break;
    }
  }, [step, onRegistrationComplete, personalInformation.accessToken, setToken]);

  const saveUserImages = useCallback(async () => {
    try {
      const url = `${baseUserUrl}/${firebaseUserId}`;
      const response = await axios.put(url, {
        profileImages: images.filter(x => !!x)
      });

      if (response.data) {
        nextStep();
      }
    } catch (error) {
      console.error("Error create user: ", error);
    }
  }, [firebaseUserId, images, nextStep, baseUserUrl]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={[styles.content, step === RegistrationSteps.finish ? { alignItems: "center" } : {}]} lightColor="#FFFCEE" darkColor="#2B2A27">
        {step === RegistrationSteps.finish && <>
          <Image source={require("../../assets/images/success-icon.png")} style={{ marginBottom: 24 }} />
        </>}
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={[styles.subtitle, step === RegistrationSteps.finish ? { flex: 1 } : {}]}>
          {subtitle}
        </ThemedText>

        {step === RegistrationSteps.fillPersonalInfomation ? (
          <PersonalInfoForm
            personalInformation={personalInformation}
            setPersonalInformation={setPersonalInformation}
            phoneNumber={phoneNumber}
            setInputFocused={setInputFocused}
            nextStep={nextStep} />
        ) : null}

        {step === RegistrationSteps.fillImages ? (
          <>
            <ThemedView style={styles.halfWidth} lightColor="#FFFCEE" darkColor="#2B2A27">
              <ThemedImageUpload
                placeholderImage={require("../../assets/images/upload-image-placeholder.png")}
                numberOfImages={6}
                imagesPerRow={3}
                onUpload={handleUpload}
                userId={firebaseUserId}
                uploadedImages={images}
              />
            </ThemedView>

            <ThemedButton
              title="Tiếp tục"
              onPress={saveUserImages}
              style={styles.button}
              buttonType={ButtonType.primary} />
          </>
        ) : null}

        {step === RegistrationSteps.fillVerification ? (
          <KnowYourCustomer
            verificationImages={verificationImages}
            setVerificationImages={setVerificationImages}
            userId={personalInformation.userId}
            nextStep={nextStep} />
        ) : null}

        {step === RegistrationSteps.fillBike ? (
          <MyBikeInput
            userId={personalInformation.userId}
            firebaseUserId={personalInformation.firebaseId}
            bikeInfomation={bikeInfomation}
            setBikeInformation={setBikeInformation}
            setInputFocused={setInputFocused}
            nextStep={nextStep} />
        ) : null}

        {step === RegistrationSteps.finish ? (
          <>
            <ThemedButton
              title="Đi đến Trang chủ"
              onPress={nextStep}
              buttonType={ButtonType.primary}
              style={{ marginBottom: 24 }} />
          </>
        ) : null}
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  halfWidth: {
    flex: 1,
  },
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
  button: {
    marginBottom: 20,
    backgroundColor: "#FFA500",
    borderRadius: 8,
    paddingVertical: 12,
  },
});