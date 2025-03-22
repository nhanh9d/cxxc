import * as SecureStore from 'expo-secure-store';

// Save Token
export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync('accessToken', token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY, // Extra security
  });
};

// Get Token
export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync('accessToken');
};

// Remove Token
export const removeToken = async () => {
  await SecureStore.deleteItemAsync('accessToken');
};
