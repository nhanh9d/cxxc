import React from "react";
import { ThemedText } from "@/components/ui/ThemedText";
import { UserDto, UserStatus } from "@/types/user";
import { Dimensions, Image, StyleSheet, View } from "react-native";

interface UserProfileProps {
  user: UserDto;
}

export default function UserProfile({ user }: UserProfileProps) {
  const screenWidth = Dimensions.get("window").width;
  const imageMargin = 16;
  const numColumns = 3;
  const imageSize = (screenWidth - 2 * 20 - (numColumns - 1) * imageMargin) / numColumns;

  const getAge = (birthday: string) => {
    const today = new Date();
    const age = today.getFullYear() - new Date(birthday).getFullYear();
    return age;
  };

  const getUserStatus = (status: UserStatus) => {
    switch (status) {
      case UserStatus.NEW:
        return "Chưa xác thực";
      case UserStatus.VERIFIED:
        return "Đã xác thực";
      case UserStatus.LOCKED:
        return "Đã khóa";
      case UserStatus.BANNED:
        return "Đã cấm";
    }
  };

  return (
    <>
      {/* User Header */}
      <View style={styles.row}>
        <Image 
          source={user.profileImages?.[0] ? { uri: user.profileImages[0] } : undefined} 
          style={styles.avatar} 
        />
        <View>
          <ThemedText type="subtitleSemiBold">{user.fullname}, {getAge(user.birthday)}</ThemedText>
          <ThemedText>{getUserStatus(user.status)}</ThemedText>
        </View>
      </View>

      {/* Profile Images */}
      {user.profileImages?.length > 0 && (
        <>
          <ThemedText type="subtitle" style={styles.subtitle}>Ảnh Profile</ThemedText>
          {Array.from({ length: Math.ceil(user.profileImages.length / numColumns) }).map((_, rowIdx) => (
            <View key={rowIdx} style={styles.profileImageRow}>
              {user.profileImages.slice(rowIdx * numColumns, (rowIdx + 1) * numColumns).map((item, colIdx) => (
                <View key={item + colIdx} style={[styles.profileImageContainer, { width: imageSize, height: imageSize }]}>
                  <Image source={{ uri: item }} style={styles.profileImage} />
                </View>
              ))}
            </View>
          ))}
        </>
      )}

      {/* Bio */}
      {user.bio?.length > 0 && (
        <>
          <ThemedText type="subtitle" style={styles.subtitle}>Bio</ThemedText>
          <ThemedText>{user.bio}</ThemedText>
        </>
      )}

      {/* Vehicles */}
      {user.vehicles?.length > 0 && (
        <>
          <ThemedText type="subtitle" style={styles.subtitle}>Phương tiện</ThemedText>
          {user.vehicles.map((vehicle, index) => (
            <View key={index}>
              <ThemedText type="subtitleSemiBold">- Tên xe: {vehicle.fullname}</ThemedText>
              <ThemedText type="subtitleSemiBold" style={{ marginBottom: 8 }}>
                - Dung tích xylanh: {vehicle.cylinderCapacity}
              </ThemedText>
              {Array.from({ length: Math.ceil(vehicle.images.length / numColumns) }).map((_, rowIdx) => (
                <View key={rowIdx} style={styles.profileImageRow}>
                  {vehicle.images.slice(rowIdx * numColumns, (rowIdx + 1) * numColumns).map((item, colIdx) => (
                    <View key={item + colIdx} style={[styles.profileImageContainer, { width: imageSize, height: imageSize }]}>
                      <Image source={{ uri: item }} style={styles.profileImage} />
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </>
      )}

      {/* Interests */}
      {user.interests?.length > 0 && (
        <>
          <ThemedText type="subtitleSemiBold" style={styles.subtitle}>Sở thích</ThemedText>
          {user.interests.map((interest, index) => (
            <ThemedText key={index}>- {interest}</ThemedText>
          ))}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 16
  },
  avatar: {
    width: 72,
    height: 72,
    borderColor: "#EEEEEF",
    backgroundColor: "#EEEEEF",
    borderWidth: 5,
    borderRadius: 100
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover"
  },
  profileImageRow: {
    gap: 16,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  subtitle: {
    marginTop: 16,
    marginBottom: 8
  }
});