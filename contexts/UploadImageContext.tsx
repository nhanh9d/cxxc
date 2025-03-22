import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import { useAuth } from './AuthContext';

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

  const getUploadUrl = async (fileName: string, userId?: string) => {
    const result = await axios.get(`${Constants.expoConfig?.extra?.apiUrl}/file/get-upload-url/${userId ?? DEFAULT_BUCKET}/${fileName}`);

    return result.data;
  }

  const uploadImage = async (props: uploadImageParams) => {
    if (status?.status !== ImagePicker.PermissionStatus.GRANTED) {
      const permission = await requestPermission();

      if (!permission.granted) {
        return;
      }
    }

    const baseFileUrl = `${Constants.expoConfig?.extra?.fileUrl}/user/${userId ?? DEFAULT_BUCKET}`;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: props.aspect,
      quality: 1,
    });

    if (result.canceled || !result.assets.length) {
      return; // User canceled the picker
    }

    const image = result.assets[0];
    const fileName = `${image.uri.split("/").pop()}`;
    const uploadUrl = await getUploadUrl(fileName, `${userId}`);
    const fileData = await FileSystem.readAsStringAsync(image.uri, {
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

    return `${baseFileUrl}/${fileName}`;
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
