import { ThemedText } from "@/components/ui/ThemedText";
import React, { useEffect, useState } from "react";
import { UserDto } from "@/types/user";
import { useApi } from "@/contexts/ApiContext";
import { useLoading } from "@/contexts/LoadingContext";
import { ThemedScrollView } from "@/components/layout/ThemedScrollView";
import Constants from "expo-constants";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import UserProfile from "@/components/profile/UserProfile";

export default function ProfileScreen() {
  const axios = useApi();
  const { showLoading, hideLoading } = useLoading();
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({ light: "#FFFCEE", dark: "#2B2A27" }, 'background');

  const [user, setUser] = useState<UserDto | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      showLoading();
      const response = await axios.get<UserDto>(`${Constants.expoConfig?.extra?.apiUrl}/user/me`);
      setUser(response.data);
      hideLoading();
    }
    fetchUser();
  }, []);

  if (!user) {
    return <ThemedText>Không tìm thấy thông tin người dùng.</ThemedText>;
  }

  return (
    <ThemedScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 40, backgroundColor }]}>
      <UserProfile user={user} />
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
});