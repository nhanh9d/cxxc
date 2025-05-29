import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ThemedView } from "@/components/layout/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { Image as ImageCompressor } from 'react-native-compressor';
import { useConfig } from "@/contexts/ConfigContext";
import { useLoading } from "@/contexts/LoadingContext";

export type ThemedImageUploadProps = {
  placeholderImage: any; // Placeholder image source
  numberOfImages: number; // Total number of placeholders
  imagesPerRow: number; // Number of images per row
  userId?: string;
  uploadedImages?: (string | undefined)[];
  onUpload?: (images: (string | undefined)[]) => void; // Callback with uploaded images
};

const DEFAULT_BUCKET = "general";

export const ThemedImageUpload: React.FC<ThemedImageUploadProps> = ({
  placeholderImage,
  numberOfImages,
  imagesPerRow,
  userId,
  uploadedImages,
  onUpload,
}) => {
  const [images, setImages] = useState<(string | undefined)[]>(
    uploadedImages || Array(numberOfImages).fill(null)
  ); // State for uploaded images

  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const config = useConfig();
  const { showLoading, hideLoading } = useLoading();

  const baseFileUrl = `${config?.fileUrl}/user/${userId ?? DEFAULT_BUCKET}`;

  const getUploadUrl = async (fileName: string, userId?: string) => {
    const url = `${Constants.expoConfig?.extra?.apiUrl}/file/get-upload-url/${userId ?? DEFAULT_BUCKET}/${fileName}`;
    const result = await axios.get(url);

    return result.data;
  }

  const compressImage = async (image: ImagePicker.ImagePickerAsset) => {
    const compressedImageUri = await ImageCompressor.compress(image.uri, {
      quality: 0.6,
      maxWidth: 720,
    });

    return compressedImageUri;
  }

  const handleImageSelect = async (index: number) => {
    try {
      if (status?.status !== ImagePicker.PermissionStatus.GRANTED) {
        const permission = await requestPermission();

        if (!permission.granted) {
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (result.canceled || !result.assets.length) {
        return; // User canceled the picker
      }

      showLoading();
      const image = result.assets[0];
      const compressedImageUri = await compressImage(image);
      const fileName = `${compressedImageUri.split("/").pop()}`;
      const uploadUrl = await getUploadUrl(fileName, userId);
      const fileData = await FileSystem.readAsStringAsync(compressedImageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const binaryData = atob(fileData);
      const buffer = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        buffer[i] = binaryData.charCodeAt(i);
      }

      await axios.put(
        uploadUrl, // MinIO endpoint
        buffer,
        {
          headers: {
            "Content-Type": "image/png",
            "Content-Length": buffer.length
          },
        }
      );

      const newImages = [...images];
      newImages[index] = `${baseFileUrl}/${fileName}`;
      setImages(newImages);

      if (onUpload) {
        onUpload(newImages);
      }
    } catch (error) {
      console.log("🚀 ~ handleImageSelect ~ error:", error);
      Alert.alert("Error", "An error occurred while selecting an image.");
    } finally {
      hideLoading();
    }
  };

  return (
    <ThemedView style={styles.container} lightColor="#FFFCEE" darkColor="#2B2A27">
      <ThemedView style={[styles.grid, { justifyContent: "space-between" }]} lightColor="#FFFCEE" darkColor="#2B2A27">
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImageSelect(index)}
            style={[
              styles.imageContainer,
              image ? styles.selectedImageContainer : {},
              { width: `${100 / imagesPerRow - 5}%` }, // Dynamic width
            ]}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={[styles.image, styles.selectedImage]}
              />
            ) : (
              <>
                <Image
                  source={placeholderImage}
                  style={[styles.image, image ? styles.selectedImage : {}]}
                />
                <ThemedText>Chọn ảnh</ThemedText>
              </>
            )}
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 28,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderColor: "#EEEEEF",
    borderWidth: 1,
    borderRadius: 8,
    display: "flex"
  },
  selectedImageContainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  image: {
    width: 24,
    height: 24, // Placeholder background
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: "contain"
  },
});
