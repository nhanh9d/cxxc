import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { EventDto, EventMember, EventStatistic } from "@/types/event";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { formattedDate } from "@/helpers/date";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import React from "react";
import { useApi } from "@/contexts/ApiContext";
import { useAuth } from "@/contexts/AuthContext";

export default function DetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const axios = useApi();
  const { userId } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)")} style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name={router.canGoBack() ? "chevron-left" : "home"} size={24} color="#999" />
          <ThemedText>{router.canGoBack() ? "Quay lại" : "Về trang chủ"}</ThemedText>
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

  //get event information
  const [event, setEvent] = useState<EventDto>();
  const [invitedNo, setInvitedNo] = useState<number>(0);
  const [rejectedNo, setRejectedNo] = useState<number>(0);
  const [members, setMembers] = useState<EventMember[]>();
  useEffect(() => {
    const getEventFromApi = async () => {
      const eventUri = `${Constants.expoConfig?.extra?.apiUrl}/event/${eventId}/statistic`;
      const response = await axios.get<EventStatistic>(eventUri);

      if (response?.data) {
        setEvent(response.data.event);
        setInvitedNo(response.data.invitedNo);
        setRejectedNo(response.data.rejectedNo);
        setMembers(response.data.members);
      }
    }

    getEventFromApi();
  }, []);

  //check is creator
  const [isCreator, setIsCreator] = useState(false);
  useEffect(() => {
    setIsCreator(event?.creator?.id === userId);
  }, [event]);

  const register = async () => {
    const eventUri = `${Constants.expoConfig?.extra?.apiUrl}/event/${eventId}/register`;
    const response = await axios.post(eventUri, { id: eventId });

    if (response?.data) {
      router.replace("/(tabs)");
    }
  };
  const invite = () => { };
  const share = () => { };
  const notify = () => { };
  const edit = () => {
    router.push({
      pathname: "/event/create",
      params: { eventId }
    })
  };
  const chat = () => { };
  const remove = async () => {
    const eventUri = `${Constants.expoConfig?.extra?.apiUrl}/event/${eventId}`;
    const response = await axios.delete<EventStatistic>(eventUri);

    if (response?.data) {
      router.back();
    }
  };

  return (
    <ThemedScrollView lightColor="#FFFCEE" style={styles.container}>
      <Image source={event?.banner ? { uri: event.banner } : require("../../assets/images/banner-placeholder.png")} style={{ width: "100%", height: 150, resizeMode: "cover", borderRadius: 12, marginBottom: 24 }} />

      <View style={{ marginBottom: 24 }}>
        <ThemedText type="title" style={{ marginBottom: 12 }}>{event?.name}</ThemedText>
        <View style={{ flexDirection: "row" }}>
          <MaterialCommunityIcons size={16} name="calendar-blank-outline" color="#999" style={{ marginRight: 4 }} />
          <ThemedText>Từ {event?.startDate ? formattedDate(event.startDate) : ""} - {event?.endDate ? formattedDate(event.endDate) : ""}</ThemedText>
        </View>
        <View style={{ flexDirection: "row" }}>
          <MaterialCommunityIcons size={16} name="map-marker-radius-outline" color="#999" style={{ marginRight: 4 }} />
          <ThemedText>{event?.startLocation}</ThemedText>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8, marginBottom: 24 }}>
        {isCreator && <TouchableOpacity onPress={() => invite()} style={styles.actionButton}>
          <MaterialIcons style={{ marginBottom: 4 }} name="person-add-alt" size={24} color="#999" />
          <ThemedText>Mời bạn bè</ThemedText>
        </TouchableOpacity>}
        {isCreator && <TouchableOpacity onPress={() => notify()} style={styles.actionButton}>
          <MaterialIcons style={{ marginBottom: 4 }} name="notifications" size={24} color="#999" />
          <ThemedText>Thông báo</ThemedText>
        </TouchableOpacity>}
        {!isCreator && <TouchableOpacity onPress={() => register()} style={styles.actionButton}>
          <MaterialIcons style={{ marginBottom: 4 }} name="group-add" size={24} color="#999" />
          <ThemedText>Đăng ký</ThemedText>
        </TouchableOpacity>}
        <TouchableOpacity onPress={() => share()} style={styles.actionButton}>
          <MaterialIcons style={{ marginBottom: 4 }} name="share" size={24} color="#999" />
          <ThemedText>Chia sẻ</ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedText style={styles.subtitle}>Thống kê thành viên</ThemedText>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8, marginBottom: 24 }}>
        <View style={styles.statistic}>
          <ThemedText style={{ fontSize: 20, fontWeight: "bold" }}>{members?.length}</ThemedText>
          <ThemedText style={{ fontSize: 14 }}>Thành viên</ThemedText>
        </View>
        <View style={styles.statistic}>
          <ThemedText style={{ fontSize: 20, fontWeight: "bold" }}>{invitedNo}</ThemedText>
          <ThemedText style={{ fontSize: 14 }}>Đã mời</ThemedText>
        </View>
        <View style={styles.statistic}>
          <ThemedText style={{ fontSize: 20, fontWeight: "bold" }}>{rejectedNo}</ThemedText>
          <ThemedText style={{ fontSize: 14 }}>Không tham gia</ThemedText>
        </View>
      </View>

      <ThemedText style={styles.subtitle}>Tổ chức bởi</ThemedText>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
        <Image source={event?.creator ? { uri: event?.creator.profileImages[0] } : require("../../assets/images/banner-placeholder.png")} style={{ width: 32, height: 32, resizeMode: "cover", borderRadius: 100, marginRight: 8 }} />
        <ThemedText>{event?.creator?.fullname}</ThemedText>
      </View>

      <ThemedText style={styles.subtitle}>{members?.length} thành viên tham gia</ThemedText>
      <View style={{ marginBottom: 24 }}>
        <View>
          {members?.map((member, index) =>
          (
            <Image
              key={index}
              source={member.user.profileImages[0] ? { uri: member.user.profileImages[0] } : require("../../assets/images/banner-placeholder.png")}
              style={[{ width: 32, height: 32, resizeMode: "cover", borderRadius: 100, marginRight: 8 }, index > 1 ? { position: "absolute", left: 16 * index } : {}]} />)
          )}
          <ThemedText style={{ marginTop: 8 }}>{members?.map(member => member.user.fullname).join(",")}</ThemedText>
        </View>
      </View>

      <ThemedText style={styles.subtitle}>Mô tả</ThemedText>
      <View style={{ marginBottom: 24 }}>
        <ThemedText type="default">{event?.description}</ThemedText>
      </View>

      {isCreator && (
        <>
          <ThemedText style={styles.subtitle}>Quản lý</ThemedText>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8, marginBottom: 24 }}>
            <TouchableOpacity onPress={() => edit()} style={styles.actionButton}>
              <MaterialIcons style={{ marginBottom: 4 }} name="mode-edit" size={24} color="#999" />
              <ThemedText>Chỉnh sửa thông tin</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => chat()} style={styles.actionButton}>
              <MaterialIcons style={{ marginBottom: 4 }} name="chat-bubble-outline" size={24} color="#999" />
              <ThemedText>Hội thoại chung</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => remove()} style={styles.actionButton}>
              <MaterialIcons style={{ marginBottom: 4 }} name="delete-outline" size={24} color="#999" />
              <ThemedText>Huỷ chuyến đi</ThemedText>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ThemedScrollView>
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
