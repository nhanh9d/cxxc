import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { useApi } from "@/contexts/ApiContext";
import { NotificationCard } from "@/components/NotificationCard";

export enum NotificationType {
  EVENT_INVITATION = "EVENT_INVITATION",
  EVENT_UPDATE = "EVENT_UPDATE",
  EVENT_CANCEL = "EVENT_CANCEL",
  EVENT_MEMBER_JOINED = 'EVENT_MEMBER_JOINED',
  EVENT_MEMBER_LEFT = 'EVENT_MEMBER_LEFT',
  EVENT_FINISHED = 'EVENT_FINISHED',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  metadata: Record<string, any>;
  isRead: boolean;
  isPushed: boolean;
  userId: number;
  createdAt: Date;
}


export default function NotificationsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const axios = useApi();

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

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: NotificationType.EVENT_INVITATION,
      title: "Event Invitation",
      content: "You have been invited to an event",
      metadata: {},
      isRead: false,
      isPushed: true,
      userId: 1,
      createdAt: new Date(),
    },
  ]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Constants.expoConfig?.extra?.apiUrl}/notifications/my`);
      // setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    getNotifications();
    setRefreshing(false);
  }

  const loadMoreNotifications = () => {
    setLoading(true);
    getNotifications();
    setLoading(false);
  }

  return (
    <ThemedView lightColor="#FFFCEE" style={styles.container}>
      <ThemedText type="title">Thông báo</ThemedText>
      <ThemedScrollView lightColor="#FFFCEE">
        <FlatList
          data={notifications}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => (
            <NotificationCard notification={item} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 80 }}
          onEndReached={loadMoreNotifications}
          onEndReachedThreshold={0.1} // Fetch when 50% to bottom
          ListFooterComponent={loading ? <ActivityIndicator size="small" color="#999" /> : null}
        />
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
    paddingHorizontal: 20,
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
