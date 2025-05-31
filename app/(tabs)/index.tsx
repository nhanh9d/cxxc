import Constants from "expo-constants";
import React, { useCallback, useEffect, useState } from "react";
import { ThemedView } from "@/components/layout/ThemedView";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import FloatingButton from "@/components/layout/FloatingButton";
import { useRouter } from "expo-router";
import { EventDto } from "@/types/event";
import { EventCard } from "@/components/cards/EventCard";
import { useApi } from "@/contexts/ApiContext";
import { Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/ThemedText";
import { useAuth } from "@/contexts/AuthContext";

export default function IndexScreen() {
  const baseEventUrl = `${Constants.expoConfig?.extra?.apiUrl}/event`;
  const [page, setPage] = useState(0);
  const [events, setEvents] = useState<EventDto[]>([]);
  const [noMoreData, setNoMoreData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [myRidesCount, setMyRidesCount] = useState(0);
  const router = useRouter();
  const api = useApi();
  const { token } = useAuth();

  const fetchData = async () => {
    const response = await api.get<EventDto[]>(`${baseEventUrl}?page=${page}&limit=4`);
    return response.data;
  }

  const fetchMyRidesCount = async () => {
    try {
      const response = await api.get<{ count: number }>(`${baseEventUrl}?page=${page}&limit=&mine=true&count=true`);
      setMyRidesCount(response.data.count);
    } catch (error) {
      console.log("🚀 ~ fetchMyRidesCount ~ error:", error);
    }
  }

  useEffect(() => {
    if (token) {
      console.log("🚀 ~ useEffect ~ token:", token)
      loadMoreEvents();
      fetchMyRidesCount();
    }
  }, [token]);

  // Fetch more trips when scrolling down
  const loadMoreEvents = async () => {
    if (loading || noMoreData) {
      return;
    }
    setLoading(true);

    try {
      const data = await fetchData();
      setNoMoreData(data.length === 0);

      if (data.length !== 0) {
        setPage((prevPage) => prevPage + 1);
        setEvents(prevEvents => [...prevEvents, ...data]);
      }
    } catch (error) {
      console.log("🚀 ~ loadMoreEvents ~ error:", error);
      setNoMoreData(true); // Nếu lỗi, chặn gọi tiếp
      Alert.alert("Lỗi hệ thống", "Lỗi hệ thống, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Refresh the list when pulling down
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(0); // Reset to page 1
    const data = await fetchData();
    setNoMoreData(data.length === 0);
    setEvents(data);
    setRefreshing(false);

    if (data.length !== 0) {
      setPage((prevPage) => prevPage + 1);
    }
  }, []);

  return (
    <ThemedView style={styles.container}>
      {myRidesCount > 0 && (
        <TouchableOpacity style={styles.myRideButton} onPress={() => router.push("/event/attempted-events")}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <MaterialCommunityIcons name="swap-vertical-variant" size={16} color="#FF9500" />
            <ThemedText>Chuyến đi của tôi ({myRidesCount})</ThemedText>
          </View>
          <Fontisto name="angle-right" size={16} color="#FF9500" />
        </TouchableOpacity>
      )}
      <FlatList
        data={events}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <EventCard item={item} showMemberNo={true} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 80 }}
        onEndReached={loadMoreEvents}
        onEndReachedThreshold={0.1} // Fetch when 50% to bottom
        ListFooterComponent={loading ? <ActivityIndicator size="small" color="#999" /> : null}
      />

      <FloatingButton onPress={() => router.push("/event/create")} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFCEE"
  },
  myRideButton: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#EEEEEF",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    justifyContent: "space-between"
  }
})