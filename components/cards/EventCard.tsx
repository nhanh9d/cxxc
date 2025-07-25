import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { EventDto } from "@/types/event";
import { ThemedText } from "@/components/ui/ThemedText";
import { useRouter } from "expo-router";
import { formattedDate } from "@/helpers/date";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useConfig } from "@/contexts/ConfigContext";
import { useThemeColor } from "@/hooks/useThemeColor";

type EventCardProp = {
  item: EventDto,
  showMemberNo?: boolean
}
export function EventCard({ item, showMemberNo = false }: EventCardProp) {
  const router = useRouter();
  const config = useConfig();
  const cardBackgroundColor = useThemeColor({ light: "#FFF", dark: "#3A3A3A" }, 'background');
  const borderColor = useThemeColor({ light: "#EEEEEF", dark: "#4A4A4A" }, 'border');
  const iconColor = useThemeColor({ light: "#999", dark: "#AAA" }, 'icon');
  const memberNoBgColor = useThemeColor({ light: "#FFF", dark: "#2A2A2A" }, 'background');
  const memberNoBorderColor = useThemeColor({ light: "#999", dark: "#666" }, 'border');
  const iconSymbolColor = useThemeColor({ light: "#000", dark: "#FFF" }, 'text');

  const goDetail = (item: EventDto) => {
    router.push({
      pathname: "/event/detail",
      params: { eventId: item.id }
    })
  }

  return (
    <TouchableOpacity onPress={() => goDetail(item)}>
      <View style={[styles.card, { backgroundColor: cardBackgroundColor, borderColor }]}>
        <View style={{ position: "relative" }}>
          <Image source={{ uri: item.banner?.includes(config?.fileUrl) ? item.banner : `${config?.fileUrl}/${item.banner}` }} width={16} style={styles.image} />
          {showMemberNo && <View style={[styles.memberNo, { backgroundColor: memberNoBgColor, borderColor: memberNoBorderColor }]}>
            <IconSymbol name="person.2" color={iconSymbolColor} />
            <ThemedText type="small" style={{ color: iconSymbolColor }}>{item.members?.length}/{item.size ? item.size : "Không giới hạn"}</ThemedText>
          </View>}
        </View>
        <View style={styles.tripInfo}>
          <ThemedText style={styles.title}>{item.name}</ThemedText>
          <View style={{ flexDirection: "row" }}>
            {item.creator?.profileImages?.[0]
              ? <Image source={{ uri: item.creator?.profileImages[0].includes(config?.fileUrl) ? item.creator?.profileImages[0] : `${config?.fileUrl}/${item.creator?.profileImages[0]}` }} style={{ width: 16, height: 16, resizeMode: "center", borderRadius: 100, marginRight: 4 }} />
              : <IconSymbol size={16} name="person" color={iconColor} style={{ marginRight: 4 }} />}
            <ThemedText style={styles.subText}>Tổ chức bởi {item.creator?.fullname}</ThemedText>
          </View>
          <View style={{ flexDirection: "row" }}>
            <MaterialCommunityIcons size={16} name="calendar-blank-outline" color={iconColor} style={{ marginRight: 4 }} />
            <ThemedText style={styles.subText}>Từ {item.startDate ? formattedDate(item.startDate) : ""} - {item.endDate ? formattedDate(item.endDate) : ""}</ThemedText>
          </View>
          <View style={{ flexDirection: "row" }}>
            <MaterialCommunityIcons size={16} name="map-marker-radius-outline" color={iconColor} style={{ marginRight: 4 }} />
            <ThemedText style={styles.subText}>{item.startLocation}</ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tripInfo: {
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    marginBottom: 2,
  },
  memberNo: {
    position: "absolute",
    bottom: 12,
    left: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 1
  }
});

