import { ThemedText } from "@/components/ui/ThemedText";
import UnderConstruction from "@/components/ui/UnderConstruction";
import { useApi } from "@/contexts/ApiContext";
import { EventDto } from "@/types/event";
import { MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, Image } from "react-native";

export default function CreateScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const axios = useApi();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)")} style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="chevron-left" size={24} color="#999" />
          <ThemedText>Quay lại</ThemedText>
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

  // const [event, setEvent] = useState<EventDto>({ startDate: new Date() });
  // const { eventId } = useLocalSearchParams();

  // useEffect(() => {
  //   if (eventId) {
  //     const getEventFromApi = async () => {
  //       const eventUri = `${Constants.expoConfig?.extra?.apiUrl}/event/${eventId}`;
  //       const response = await axios.get<EventDto>(eventUri);

  //       if (response?.data) {
  //         setEvent(response.data);
  //       }
  //     }

  //     getEventFromApi();
  //   }
  // }, []);

  return (
    <>
      <UnderConstruction />
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "relative",
    marginBottom: 12,
    borderRadius: 12,
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
  }
});
