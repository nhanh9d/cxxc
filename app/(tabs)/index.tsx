import Constants from "expo-constants";
import React, { useCallback, useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import FloatingButton from "@/components/FloatingButton";
import { useRouter } from "expo-router";
import { EventDto } from "@/types/event";
import { EventCard } from "@/components/EventCard";
import { useApi } from "@/contexts/ApiContext";
import { Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";

export default function IndexScreen() {
  const baseEventUrl = `${Constants.expoConfig?.extra?.apiUrl}/event`;
  const [page, setPage] = useState(0);
  const [events, setEvents] = useState<EventDto[]>([]);
  const [noMoreData, setNoMoreData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const axios = useApi();
  const router = useRouter();

  const fetchData = async () => {
    const response = await axios.get<EventDto[]>(`${baseEventUrl}?page=${page}&limit=4`);

    return response.data;
  }

  useEffect(() => {
    loadMoreEvents();

    return () => {
      setLoading(false);
    }
  }, []);

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
        setEvents([...events, ...data]);
      }
    } catch (error) {
      console.log("🚀 ~ loadMoreEvents ~ error:", error)

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
  }, []);

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.myRideButton} onPress={() => router.push("/event/attempted-events")}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <MaterialCommunityIcons name="swap-vertical-variant" size={16} color="#FF9500" />
          <ThemedText>Chuyến đi của tôi</ThemedText>
        </View>
        <Fontisto name="angle-right" size={16} color="#FF9500" />
      </TouchableOpacity>
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
    padding: 18,
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