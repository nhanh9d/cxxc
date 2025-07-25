import React, { createContext, useContext } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import { useAuth } from './AuthContext';
import { Buffer } from 'buffer';
import { Image as ImageCompressor } from 'react-native-compressor';
import { useLoading } from './LoadingContext';
import { useConfig } from './ConfigContext';

type uploadImageParams = {
  aspect: [number, number]
}

interface UploadImageType {
  uploadImage: (props: uploadImageParams) => Promise<string | undefined>;
}

const UploadImage = createContext<UploadImageType | undefined>(undefined);

export const ImageUploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const DEFAULT_BUCKET = "general";
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const { userId } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const config = useConfig();
  const baseFileUrl = `${config?.fileUrl}/user/${userId ?? DEFAULT_BUCKET}`;

  const getUploadUrl = async (fileName: string, userId?: string) => {
    const result = await axios.get(`${Constants.expoConfig?.extra?.apiUrl}/file/get-upload-url/${userId ?? DEFAULT_BUCKET}/${fileName}`);

    return result.data;
  }

  const uploadImage = async (props: uploadImageParams) => {
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
        aspect: props.aspect,
        quality: 1,
      });

      if (result.canceled || !result.assets.length) {
        return; // User canceled the picker
      }

      showLoading();
      const image = result.assets[0];

      // Compress image trước khi upload
      const compressedImageUri = await ImageCompressor.compress(image.uri, {
        quality: 0.6,
        maxWidth: 720,
      });

      const fileName = `${compressedImageUri.split("/").pop()}`;
      const uploadUrl = await getUploadUrl(fileName, `${userId}`);
      const fileData = await FileSystem.readAsStringAsync(compressedImageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const buffer = Buffer.from(fileData, 'base64');

      await axios.put(
        uploadUrl, // MinIO endpoint
        buffer,
        {
          headers: {
            "Content-Type": "image/jpg",
            "Content-Length": buffer.length
          },
        }
      );

      return `${baseFileUrl}/${fileName}`;
    } catch (error) {
      console.error('Upload image error:', error);
    } finally {
      hideLoading(); // Always hide loading, even on error
    }
  }

  return (
    <UploadImage.Provider value={{ uploadImage }}>
      {children}
    </UploadImage.Provider>
  );
};

export const useImageUpload = () => {
  const context = useContext(UploadImage);
  if (!context) {
    throw new Error('useImageUpload must be used within an ImageUploadProvider');
  }
  return context;
};
