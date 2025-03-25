import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { EventCard } from "@/components/EventCard";
import { EventDto } from "@/types/event";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useApi } from "@/contexts/ApiContext";

export default function AfterCreateScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const axios = useApi();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.replace("/(tabs)")} style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="home" size={24} color="#999" />
          <ThemedText>Về trang chủ</ThemedText>
        </TouchableOpacity>
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

  const { eventId } = useLocalSearchParams();
  const [event, setEvent] = useState<EventDto>();
  const [shouldGetFromApi, setShouldGetFromApi] = useState(false);

  useEffect(() => {
    const getEventFromLocalStorage = async () => {
      const json = await AsyncStorage.getItem("createdEvent");
      if (!json) {
        setShouldGetFromApi(true);
        return;
      }
      const createdEvent = JSON.parse(json) as EventDto;
      setEvent(createdEvent);
    }

    getEventFromLocalStorage();
  }, []);

  useEffect(() => {
    const getEventFromApi = async () => {
      const eventUri = `${Constants.expoConfig?.extra?.apiUrl}/event/${eventId}`;
      const response = await axios.get<EventDto>(eventUri)
      if (response?.data) {
        setEvent(response.data);
      }
    }

    if (shouldGetFromApi) {
      getEventFromApi();
      setShouldGetFromApi(false);
    }
  }, [shouldGetFromApi]);

  const invite = async () => { }
  const share = async () => { }
  const viewDetail = async () => {
    router.replace({
      pathname: "/event/detail",
      params: { eventId }
    });
  }

  return (
    <ThemedView lightColor="#FFFCEE" style={styles.container}>

      <ThemedText type="title" style={{ marginBottom: 24, marginTop: 12 }}>Chuyến đi đã được tạo!</ThemedText>
      <ThemedView lightColor="#FFFCEE" style={{ flex: 1 }}>
        {event && <EventCard item={event} />}
        <TouchableOpacity onPress={() => viewDetail()} style={[styles.viewDetailButton, {
          justifyContent: "space-between",
        }]}>
          <ThemedText type="default">Xem chi tiết chuyến đi</ThemedText>
          <MaterialIcons name="chevron-right" size={24} color="#000" />
        </TouchableOpacity>
      </ThemedView>

      <ThemedView lightColor="#FFFCEE" style={{ flexDirection: "row", marginBottom: 24, gap: 12 }}>
        <TouchableOpacity onPress={() => invite()} style={[styles.viewDetailButton, { flex: 1, borderRadius: 100, backgroundColor: "#FFA500" }]}>
          <ThemedText type="defaultSemiBold" style={{ color: "#FFF" }}>Mời bạn bè</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => share()} style={[styles.viewDetailButton, { flex: 1, borderRadius: 100 }]}>
          <ThemedText type="defaultSemiBold">Chia sẻ</ThemedText>
        </TouchableOpacity>
      </ThemedView>
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
  bannerButtonText: {
    fontSize: 12,
    paddingRight: 0,
    textAlign: "left"
  },
  viewDetailButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEEEEF",
    backgroundColor: "#FFF",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: "center"
  }
});
