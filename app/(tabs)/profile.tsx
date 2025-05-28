import { ThemedText } from "@/components/ui/ThemedText";
import React, { useEffect, useState } from "react";
import { UserDto } from "@/types/user";
import Constants from "expo-constants";
import { useApi } from "@/contexts/ApiContext";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Image, View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useConfig } from "@/contexts/ConfigContext";

export default function ProfileScreen() {
  const axios = useApi();
  const router = useRouter();
  const navigation = useNavigation();
  const config = useConfig();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="chevron-left" size={24} color="#999" />
          <ThemedText>Quay lại</ThemedText>
        </TouchableOpacity>
      ),
      headerTitle: "",
      headerStyle: {
        backgroundColor: "#FFFCEE",
        shadowOpacity: 0,
        elevation: 0,
        borderBottomWidth: 0,
      }
    });
  }, [navigation]);

  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get<UserDto>(`${Constants.expoConfig?.extra?.apiUrl}/user/me`);
      setUser(response.data);
      setLoading(false);
    }

    fetchUser();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  if (!user) {
    return <ThemedText>Không tìm thấy thông tin người dùng.</ThemedText>;
  }

  return (
    <View style={styles.container}>
      {user.profileImages && user.profileImages[0] ? (
        <Image
          source={{ uri: `${config?.fileUrl}/${user.profileImages[0]}` }}
          style={styles.avatar}
        />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <MaterialIcons name="person" size={64} color="#ccc" />
        </View>
      )}
      <ThemedText type="title" style={{ marginTop: 16 }}>{user.fullname}</ThemedText>
      <ThemedText>ID: {user.id}</ThemedText>
      {/* Có thể thêm các trường khác nếu muốn */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFCEE",
    flex: 1,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EEE",
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
  },
});