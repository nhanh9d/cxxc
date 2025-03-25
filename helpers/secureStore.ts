import * as SecureStore from 'expo-secure-store';

// Save Token
export const saveToken = async (key: string = 'accessToken', value: string) => {
  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY, // Extra security
  });
};

// Get Token
export const getToken = async (key: string = 'accessToken'): Promise<string | null> => {
  return await SecureStore.getItemAsync(key);
};

// Remove Token
export const removeToken = async (key: string = 'accessToken') => {
  await SecureStore.deleteItemAsync(key);
};
