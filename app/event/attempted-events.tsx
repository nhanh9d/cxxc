import { useNavigation, useRouter } from "expo-router";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState, useCallback } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { EventCard } from "@/components/EventCard";
import { EventDto } from "@/types/event";
import Constants from "expo-constants";
import { useApi } from "@/contexts/ApiContext";

export default function AttemptedEventsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const axios = useApi();
  const [page, setPage] = useState(0);
  const [events, setEvents] = useState<EventDto[]>([]);
  const [noMoreData, setNoMoreData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  const fetchData = async () => {
    const baseEventUrl = `${Constants.expoConfig?.extra?.apiUrl}/event`;
    const response = await axios.get<EventDto[]>(`${baseEventUrl}?page=${page}&limit=4&mine=true`);
    return response.data;
  }

  useEffect(() => {
    loadMoreEvents();

    return () => {
      setLoading(false);
    }
  }, []);

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(0);
    const data = await fetchData();
    setNoMoreData(data.length === 0);
    setEvents(data);
    setRefreshing(false);


    if (data.length !== 0) {
      setPage((prevPage) => prevPage + 1);
    }
  }, []);

  return (
    <ThemedView lightColor="#FFFCEE" style={styles.container}>
      <ThemedText type="title" style={{ marginTop: 12 }}>Chuyến đi của tôi</ThemedText>

      <FlatList
        data={events}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <EventCard item={item} showMemberNo={true} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReached={loadMoreEvents}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loading ? <ActivityIndicator size="small" color="#999" /> : null}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  }
});
