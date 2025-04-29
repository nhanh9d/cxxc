import React, { useState } from "react";
import { Modal, Alert, Image, StyleSheet } from "react-native";
import { useCameraPermissions, CameraView } from "expo-camera";
import { ThemedView } from "@/components/layout/ThemedView";
import { ButtonType, ThemedButton } from "@/components/ui/ThemedButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import Constants from "expo-constants";
import axios from "axios";

interface Props {
  verificationImages: (string | undefined)[];
  setVerificationImages: (images: (string | undefined)[]) => void;
  userId?: number;
  nextStep: () => void;
}

const KnowYourCustomer: React.FC<Props> = ({ verificationImages, setVerificationImages, userId, nextStep }) => {
  const referenceImage1 = require("../assets/images/verify-placeholder.png");
  const referenceImage2 = require("../assets/images/verify-placeholder.png");
  const baseUserUrl = `${Constants.expoConfig?.extra?.apiUrl}/user/firebase`;

  const [isCameraVisible, setCameraVisible] = useState(false);
  const [isConfirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [capturedImage1, setCapturedImage1] = useState<string | null>(null);
  const [capturedImage2, setCapturedImage2] = useState<string | null>(null);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const takePicture = async () => {
    if (!cameraRef) {
      return
    }
    try {
      const photo = await cameraRef.takePictureAsync();
      if (!photo?.uri) {
        return
      }

      console.log("Captured Image URI: ", photo.uri);
      if (capturedImage1) {
        setCapturedImage2(photo.uri);
      } else {
        setCapturedImage1(photo.uri);
      }

      // Ensure modal state updates after setting image
      setConfirmDialogVisible(true);
    } catch (error) {
      console.error("Lỗi khi chụp ảnh: ", error);
    }
  };

  const saveVerificationImages = async () => {
    const url = `${baseUserUrl}/${userId}`;
    const response = await axios.put(url, {
      ...verificationImages
    });

    console.log(response);
  }

  const confirmPicture = async () => {
    if (capturedImage1) {
      setVerificationImages([...verificationImages, capturedImage1]);
    }
    if (capturedImage2) {
      setVerificationImages([...verificationImages, capturedImage2]);
    }
    if (capturedImage1 && capturedImage2) {
      await saveVerificationImages();
      closeCamera();
    }

    if (isConfirmDialogVisible) {
      setConfirmDialogVisible(false);
    }
  };

  const retakePicture = () => {
    setCapturedImage1(null);
    setConfirmDialogVisible(false);
  };

  const closeCamera = () => {
    setCameraVisible(false);
    setConfirmDialogVisible(false);
    setCapturedImage1(null);

    nextStep();
  };

  const startVerifyImages = async () => {
    if (!permission?.granted) {
      const newPermission = await requestPermission();
      if (!newPermission.granted) {
        Alert.alert("Yêu cầu quyền truy cập", "Bạn cần cấp quyền truy cập camera để xác minh danh tính.");
        return;
      }
    }
    setCameraVisible(true);
  };

  return (
    <>
      <ThemedView style={[styles.halfWidth, styles.container]} lightColor="#FFFCEE" darkColor="#2B2A27">
        <Image source={referenceImage1} style={[styles.halfWidth, styles.image]} />
        <Image source={referenceImage2} style={[styles.halfWidth, styles.image]} />
      </ThemedView>

      <ThemedButton
        buttonType={ButtonType.primary}
        style={{ marginBottom: 16 }}
        title="Xác minh ảnh ngay"
        onPress={startVerifyImages}
      />

      <ThemedButton
        title="Để sau"
        onPress={nextStep}
        buttonType={ButtonType.secondary}
      />

      {/* Camera Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isCameraVisible}
        onRequestClose={closeCamera}
      >
        <ThemedView style={{ flex: 1 }}>
          {/* Close Button (Upper Left) */}
          <ThemedButton
            title=""
            style={styles.closeButton}
            onPress={closeCamera}
            icon={<IconSymbol name="xmark.circle" color={"#FFF"} size={32} />}
          />

          {/* Reference Image (Upper Right) */}
          <Image source={capturedImage1 ? referenceImage2 : referenceImage1} style={styles.referenceImage} />

          {/* Camera View */}
          <CameraView
            style={{ flex: 1 }}
            facing="front"
            ref={(ref) => setCameraRef(ref)}
          />

          <Modal
            animationType="fade"
            transparent={true}
            visible={isConfirmDialogVisible}
            onRequestClose={retakePicture}
          >
            <ThemedView style={styles.confirmDialogWrapper}>
              <ThemedView style={styles.confirmDialog}>
                <ThemedText style={styles.confirmTextHeader}>Kiểm tra hình ảnh</ThemedText>
                <ThemedText style={styles.confirmText}>Hãy đảm bảm hình chụp của bạn giống với ảnh mẫu của chúng tôi.</ThemedText>
                {capturedImage1 && !capturedImage2 && <ThemedView style={styles.compareImages}>
                  <Image source={{ uri: capturedImage1 }} style={styles.previewImage} />
                  <Image source={referenceImage1} style={styles.previewImage} />
                </ThemedView>}

                {capturedImage2 && <ThemedView style={styles.compareImages}>
                  <Image source={{ uri: capturedImage2 }} style={styles.previewImage} />
                  <Image source={referenceImage2} style={styles.previewImage} />
                </ThemedView>}

                <ThemedButton
                  title="Chụp lại"
                  textStyle={{ color: "#FF9500" }}
                  onPress={retakePicture}
                  style={[styles.retakeButton]} />
                <ThemedButton
                  title="Tiếp tục"
                  onPress={confirmPicture}
                  buttonType={ButtonType.primary}
                  style={{ marginBottom: 16 }} />
                <ThemedButton
                  title="Bỏ qua xác minh"
                  onPress={closeCamera}
                  buttonType={ButtonType.secondary} />
              </ThemedView>
            </ThemedView>
          </Modal>

          {/* Capture Button */}
          <ThemedView style={styles.captureContainer}>
            <ThemedButton title="📸 Chụp ảnh" onPress={takePicture} />
          </ThemedView>
        </ThemedView>
      </Modal>
    </>
  );
};

export default KnowYourCustomer;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1, // Take up equal space
  },
  image: {
    width: "100%",
    height: "auto",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10, // Ensures it's above everything else
    backgroundColor: "transparent",
  },
  referenceImage: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 80,
    height: 80,
    borderRadius: 8,
    zIndex: 10,
  },
  captureContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 50,
  },
  compareImages: {
    flexDirection: "row",
    backgroundColor: "transparent",
    gap: 4
  },
  confirmDialogWrapper: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  confirmDialog: {
    padding: 24,
    maxHeight: 550,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20
  },
  previewImage: {
    width: 120,
    height: 150,
    marginBottom: 20,
  },
  confirmTextHeader: {
    fontSize: 24,
    marginTop: 24,
    textAlign: "center",
    fontWeight: "bold"
  },
  confirmText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center"
  },
  retakeButton: {
    marginBottom: 50
  }
});
