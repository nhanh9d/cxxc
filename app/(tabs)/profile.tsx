import { ThemedText } from "@/components/ui/ThemedText";
import React, { useEffect, useState } from "react";
import { UserDto } from "@/types/user";
import Constants from "expo-constants";
import { useApi } from "@/contexts/ApiContext";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
export default function ProfileScreen() {
  const axios = useApi();
  const router = useRouter();
  const navigation = useNavigation();

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
    }

    fetchUser();
  }, []);

  return <>
    <ThemedText>Profile</ThemedText>
  </>;
}