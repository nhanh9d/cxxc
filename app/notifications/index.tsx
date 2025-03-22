import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { EventMember, EventStatistic } from "@/types/event";
import { MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { useApi } from "@/contexts/ApiContext";

export default function NotificationsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const axios = useApi();
  const { eventId } = useLocalSearchParams();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View>
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)")} style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name={router.canGoBack() ? "chevron-left" : "home"} size={24} color="#999" />
            <ThemedText>{router.canGoBack() ? "Quay lại" : "Về trang chủ"}</ThemedText>
          </TouchableOpacity>
        </View>
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

  //get event information
  const [members, setMembers] = useState<EventMember[]>();
  useEffect(() => {
    const getNotifications = async () => {
      const eventUri = `${Constants.expoConfig?.extra?.apiUrl}/event/${eventId}/statistic`;
      const response = await axios.get<EventStatistic>(eventUri);

      if (response?.data) {
        setMembers(response.data.members);
      }
    }

    getNotifications();
  }, []);

  return (
    <ThemedView lightColor="#FFFCEE" style={styles.container}>
      <ThemedText type="title">Thông báo</ThemedText>
      <ThemedScrollView lightColor="#FFFCEE">

      </ThemedScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "relative",
    marginBottom: 12,
  },
  container: {
    flex: 1,
    padding: 12,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  bannerButton: {
    position: "absolute",
    backgroundColor: "#fff",
    width: 120,
    bottom: 12,
    left: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bannerButtonText: {
    fontSize: 12,
    paddingRight: 0,
    textAlign: "left"
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEEEEF"
  },
  subtitle: {
    color: "#8A8A8E",
    fontSize: 14,
    borderBottomColor: "#EEEEEF",
    borderBottomWidth: 1,
    paddingBottom: 4,
    marginBottom: 12,
  },
  statistic: {
    flex: 1,
  }
});
