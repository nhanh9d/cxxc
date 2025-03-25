import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { ThemedText } from "./ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import { Notification } from "@/app/notifications";
import { NotificationType } from "@/app/notifications";
import { formattedDate } from "@/helpers/date";
import { useRouter } from "expo-router";

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const router = useRouter();
  const onPress = () => {
    if (notification.type === NotificationType.EVENT_INVITATION) {
      router.push({
        pathname: "/event/detail",
        params: {
          eventId: notification.metadata.eventId,
        },
      });
    }
  }

  const imageUrl = notification.metadata.avatar || notification.metadata.eventImage || "https://via.placeholder.com/150";

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, !notification.isRead && styles.unreadContainer]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.iconImage} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          {notification.type === NotificationType.EVENT_INVITATION && (
            <ThemedText type="default" style={styles.contentText}>{notification.content}</ThemedText>
          )}
          {notification.type === NotificationType.EVENT_UPDATE && (
            <ThemedText type="default" style={styles.contentText}>{notification.content}</ThemedText>
          )}
          {notification.type === NotificationType.EVENT_CANCEL && (
            <ThemedText type="default" style={styles.contentText}>{notification.content}</ThemedText>
          )}
          {notification.type === NotificationType.EVENT_MEMBER_JOINED && (
            <ThemedText type="default" style={styles.contentText}>
              <ThemedText type="defaultSemiBold" style={styles.contentText}>{notification.metadata.name}</ThemedText> đã tham gia sự kiện
              <ThemedText type="default" style={styles.contentText}>{notification.content}</ThemedText>
            </ThemedText>
          )}
        </View>
        <ThemedText type="body2Regular" style={styles.time}>{notification.createdAt.toLocaleDateString()}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEEEEF",
    marginBottom: 12,
  },
  unreadContainer: {
    backgroundColor: "#FFF9E6",
    borderColor: "#FFE5B4",
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
  },
  time: {
    color: "#8A8A8E",
    fontSize: 12,
    lineHeight: 16,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#8A8A8E",
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 12,
  },
  iconImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
    overflow: "hidden",
  },
}); 