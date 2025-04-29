import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/layout/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { ButtonType, ThemedButton } from "@/components/ui/ThemedButton";
import { useNavigation, useRouter } from "expo-router";
import {
  StyleSheet,
  Keyboard,
  // KeyboardAvoidingView,
  // Platform,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from 'axios';
import { ThemedScrollView } from "@/components/layout/ThemedScrollView";
import Constants from 'expo-constants';
import { ThemedImageUpload } from "@/components/ui/ThemedImageUpload";
import PhoneInput from "@/components/inputs/PhoneInput";
import OTPInput from "@/components/inputs/OTPInput";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import KnowYourCustomer from "@/components/forms/KnowYourCustomer";
import MyBikeInput from "@/components/inputs/MyBikeInput";
import { BikeInfo } from "@/types/bikeInfo";
import { MaterialIcons } from "@expo/vector-icons";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

enum accountSteps {
  fillPhone,
  fillOTP,
  fillPersonalInfomation,
  fillImages,
  fillVerification,
  fillBike,
  finish
}

type PersonalInformation = {
  userId?: number,
  fullname?: string,
  birthday?: Date | undefined,
  gender?: string,
  firebaseId?: string
};

export default function PhoneScreen() {
  const baseUserUrl = `${Constants.expoConfig?.extra?.apiUrl}/user/firebase`;

  const [step, setStep] = useState(accountSteps.fillPhone);
  const [title, setTitle] = useState("Nhập số điện thoại");
  const [subtitle, setSubtitle] = useState("Số điện thoại được dùng để xác minh tài khoản và sẽ không hiển thị trên hồ sơ của bạn.");
  const [isInputFocused, setInputFocused] = useState(false);

  //phone
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmation, setConfirm] = useState<FirebaseAuthTypes.ConfirmationResult | undefined>();

  //otp
  const [firebaseUserId, setFirebaseUserId] = useState("");

  //personal information
  const [personalInformation, setPersonalInformation] = useState<PersonalInformation>({});

  //user profile images
  const [images, setImages] = useState<(string | undefined)[]>([]);

  //user verification images
  const [verificationImages, setVerificationImages] = useState<(string | undefined)[]>([]);

  //bike
  const [bikeInfomation, setBikeInformation] = useState<BikeInfo>();

  const router = useRouter();

  const handleUpload = (images: (string | undefined)[]) => {
    setImages(images);
  };

  const saveUserImages = async () => {
    try {
      const url = `${baseUserUrl}/${personalInformation.userId}`;
      const response = await axios.put(url, {
        profileImages: images.filter(x => !!x)
      });

      if (response.data) {
        nextStep();
      }
    } catch (error) {
      console.error("Error create user: ", error);
    }
  }

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => previousStep()} style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="chevron-left" size={24} color="#999" />
          <ThemedText>Quay lại</ThemedText>
        </TouchableOpacity>
      ),
      headerTitle: "",
      headerStyle: {
        backgroundColor: "#FFFCEE",
        shadowOpacity: 0, // Remove shadow (iOS)
        elevation: 0, // Remove shadow (Android)
        borderBottomWidth: 0, // Remove bottom border
      }
    });
  }, [navigation]);

  const previousStep = () => {
    switch (step) {
      default:
      case accountSteps.fillPhone:
        router.back();
        break;
      case accountSteps.fillOTP:
        setTitle("Nhập số điện thoại");
        setSubtitle(`Số điện thoại được dùng để xác minh tài khoản và sẽ không hiển thị trên hồ sơ của bạn.`);
        setStep(accountSteps.fillPhone);
        break;
      case accountSteps.fillPersonalInfomation:
        setTitle("Xác thực");
        setSubtitle(`Mã xác thực đã được gửi đến: ${phoneNumber} Nhập mã vào ô bên dưới để xác minh tài khoản.`);
        setStep(accountSteps.fillOTP);
        break;
      case accountSteps.fillImages:
        setTitle("Nhập thông tin cá nhân");
        setSubtitle("Hãy cung cấp một số thông tin để mọi người hiểu rõ hơn về bạn nhé!");
        setStep(accountSteps.fillPersonalInfomation);
        break;
      case accountSteps.fillVerification:
        setTitle("Thêm ảnh của bạn");
        setSubtitle("Thêm ít nhất 3 ảnh vào hồ sơ sẽ giúp tăng tỉ lệ tìm được người đồng hành!");
        setStep(accountSteps.fillImages);
        break;
      case accountSteps.fillBike:
        setTitle("Gần xong rồi!");
        setSubtitle("Hãy thực hiện chụp ảnh selfie theo 2 ảnh mẫu bên dưới để xác minh bạn là chính chủ!");
        setStep(accountSteps.fillVerification);
        break;
      case accountSteps.finish:
        setTitle("My Bike");
        setSubtitle("Hãy chia sẻ chiếc xe yêu quý mà bạn đang sử dụng!");
        setStep(accountSteps.fillBike);
        break;
    }
  }

  const nextStep = () => {
    switch (step) {
      case accountSteps.fillPhone:
        setTitle("Xác thực");
        setSubtitle(`Mã xác thực đã được gửi đến: ${phoneNumber} Nhập mã vào ô bên dưới để xác minh tài khoản.`);
        setStep(accountSteps.fillOTP);
        break;
      case accountSteps.fillOTP:
        setTitle("Nhập thông tin cá nhân");
        setSubtitle("Hãy cung cấp một số thông tin để mọi người hiểu rõ hơn về bạn nhé!");
        setStep(accountSteps.fillPersonalInfomation);
        break;
      case accountSteps.fillPersonalInfomation:
        setTitle("Thêm ảnh của bạn");
        setSubtitle("Thêm ít nhất 3 ảnh vào hồ sơ sẽ giúp tăng tỉ lệ tìm được người đồng hành!");
        setStep(accountSteps.fillImages);
        break;
      case accountSteps.fillImages:
        setTitle("Gần xong rồi!");
        setSubtitle("Hãy thực hiện chụp ảnh selfie theo 2 ảnh mẫu bên dưới để xác minh bạn là chính chủ!");
        setStep(accountSteps.fillVerification);
        break;
      case accountSteps.fillVerification:
        setTitle("My Bike");
        setSubtitle("Hãy chia sẻ chiếc xe yêu quý mà bạn đang sử dụng!");
        setStep(accountSteps.fillBike);
        break;
      case accountSteps.fillBike:
        setTitle("Hồ sơ đã tạo thành công!");
        setSubtitle("Hãy khám phá những tính năng của CXXC nhé!");
        setStep(accountSteps.finish);
        break;
      default:
        router.push("/(tabs)");
        break;
    }
  }

  return (
    // <KeyboardAvoidingView
    //   style={{ flex: 1 }}
    //   behavior={Platform.OS === "ios" ? "padding" : undefined}
    // >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedScrollView
        contentContainerStyle={[
          styles.container,
          isInputFocused && { paddingBottom: 150 }, // Adjust when input is focused
        ]}
        keyboardShouldPersistTaps="handled"
        lightColor="#FFFCEE" darkColor="#2B2A27"
      >
        <ThemedView style={[styles.content, step === accountSteps.finish ? { alignItems: "center" } : {}]} lightColor="#FFFCEE" darkColor="#2B2A27">
          {step === accountSteps.finish && <>
            <Image source={require("../../assets/images/success-icon.png")} style={{ marginBottom: 24 }} />
          </>}
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={[styles.subtitle, step === accountSteps.finish ? { flex: 1 } : {}]}>
            {subtitle} {step}
          </ThemedText>
          {step === accountSteps.fillPhone ? (
            <PhoneInput
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              setInputFocused={setInputFocused}
              setConfirm={setConfirm}
              nextStep={nextStep} />
          ) : null}

          {step === accountSteps.fillOTP ? (
            <OTPInput
              confirmation={confirmation}
              setFirebaseUserId={setFirebaseUserId}
              setInputFocused={setInputFocused}
              previousStep={previousStep}
              nextStep={nextStep} />
          ) : null}

          {step === accountSteps.fillPersonalInfomation ? (
            <PersonalInfoForm
              personalInformation={personalInformation}
              setPersonalInformation={setPersonalInformation}
              phoneNumber={phoneNumber}
              firebaseUserId={firebaseUserId}
              setInputFocused={setInputFocused}
              nextStep={nextStep} />
          ) : null}

          {step === accountSteps.fillImages ? (
            <>
              <ThemedView style={styles.halfWidth} lightColor="#FFFCEE" darkColor="#2B2A27">
                <ThemedImageUpload
                  placeholderImage={require("../../assets/images/upload-image-placeholder.png")}
                  numberOfImages={6}
                  imagesPerRow={3}
                  onUpload={handleUpload}
                  userId={firebaseUserId}
                />
              </ThemedView>

              <ThemedButton
                title="Tiếp tục"
                onPress={saveUserImages}
                style={[styles.button, images.filter(x => !!x).length > 2 ? {} : styles.disabledButton]}
                disabled={images.filter(x => !!x).length < 3} />
            </>
          ) : null}

          {step === accountSteps.fillVerification ? (
            <KnowYourCustomer
              verificationImages={verificationImages}
              setVerificationImages={setVerificationImages}
              userId={personalInformation.userId}
              nextStep={nextStep} />
          ) : null}

          {step === accountSteps.fillBike ? (
            <MyBikeInput
              userId={personalInformation.userId}
              firebaseUserId={firebaseUserId}
              bikeInfomation={bikeInfomation}
              setBikeInformation={setBikeInformation}
              setInputFocused={setInputFocused}
              nextStep={nextStep} />
          ) : null}

          {step === accountSteps.finish ? (
            <>
              <ThemedButton
                title="Đi đến Trang chủ"
                onPress={nextStep}
                buttonType={ButtonType.primary}
                style={{ marginBottom: 24 }} />
            </>
          ) : null}
        </ThemedView>
      </ThemedScrollView>
    </TouchableWithoutFeedback>
    // </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  halfWidth: {
    flex: 1, // Take up equal space
  },
  container: {
    flex: 1,
    padding: 20,
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
  disabledButton: {
    color: "#C4C4C4",
    backgroundColor: "#EEEEEF",
  },
});
