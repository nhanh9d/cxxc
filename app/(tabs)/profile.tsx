import { ThemedText } from "@/components/ui/ThemedText";
import React, { useEffect, useState } from "react";
import { UserDto } from "@/types/user";
import Constants from "expo-constants";
import { useApi } from "@/contexts/ApiContext";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Image, View, StyleSheet, TextInput, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useConfig } from "@/contexts/ConfigContext";
import { useLoading } from "@/contexts/LoadingContext";

const DEFAULT_PROFILE_IMAGES = [null, null, null, null, null, null];
const DEFAULT_BIKE_IMAGES = [null, null, null, null, null, null];

export default function ProfileScreen() {
  const axios = useApi();
  const router = useRouter();
  const navigation = useNavigation();
  const config = useConfig();
  const { showLoading, hideLoading } = useLoading();

  const [user, setUser] = useState<UserDto | null>(null);
  const [profileImages, setProfileImages] = useState<(string|null)[]>(DEFAULT_PROFILE_IMAGES);
  const [bikeImages, setBikeImages] = useState<(string|null)[]>(DEFAULT_BIKE_IMAGES);
  const [bio, setBio] = useState("");
  const [bikeName, setBikeName] = useState("");
  const [bikeCapacity, setBikeCapacity] = useState("");
  const [interests, setInterests] = useState<string[]>(["Xem phim", "Đọc sách"]);
  const [newInterest, setNewInterest] = useState("");
  const [photoVerified, setPhotoVerified] = useState(false);

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

  useEffect(() => {
    const fetchUser = async () => {
      showLoading();
      const response = await axios.get<UserDto>(`${Constants.expoConfig?.extra?.apiUrl}/user/me`);
      setUser(response.data);
      // setProfileImages, setBikeImages, setBio, ... nếu có dữ liệu thực tế
      hideLoading();
    }
    fetchUser();
  }, []);

  if (!user) {
    return <ThemedText>Không tìm thấy thông tin người dùng.</ThemedText>;
  }

  // Xử lý thêm/xóa ảnh, sở thích (demo, chưa có upload thực)
  const handleRemoveProfileImage = (idx: number) => {
    setProfileImages(imgs => imgs.map((img, i) => i === idx ? null : img));
  };
  const handleRemoveBikeImage = (idx: number) => {
    setBikeImages(imgs => imgs.map((img, i) => i === idx ? null : img));
  };
  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };
  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  // List data cho FlatList chính
  const data = [{ key: "dummy" }];

  // Header cho FlatList chính
  const renderHeader = () => (
    <View style={{ padding: 16 }}>
      {/* Nút Xem trước */}
      <TouchableOpacity style={styles.previewBtn}>
        <ThemedText style={{ color: "#fff", fontWeight: "bold" }}>Xem trước</ThemedText>
      </TouchableOpacity>

      <ThemedText type="title" style={{ fontWeight: "bold", fontSize: 26, marginBottom: 8 }}>Hồ sơ cá nhân</ThemedText>

      {/* Ảnh Profile */}
      <ThemedText style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>Ảnh Profile</ThemedText>
      <FlatList
        data={profileImages}
        horizontal
        keyExtractor={(_, idx) => `profile-img-${idx}`}
        renderItem={({ item }) => (
          <View style={styles.imageBox}>
            {item ? (
              <Image source={{ uri: `${config?.fileUrl}/${item}` }} style={styles.profileImg} />
            ) : null}
          </View>
        )}
        style={{ marginBottom: 8 }}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.verifyRow}>
        <View style={[styles.verifyBtn, photoVerified ? styles.verified : styles.notVerified]}>
          <MaterialIcons name="verified-user" size={18} color={photoVerified ? "#fff" : "#FFA500"} />
          <ThemedText style={{ marginLeft: 6, color: photoVerified ? "#fff" : "#FFA500" }}>{photoVerified ? "Xác thực ảnh" : "Chưa xác thực"}</ThemedText>
        </View>
      </View>
      <ThemedText style={{ color: "#999", fontSize: 12, marginBottom: 12 }}>Xác thực ảnh của bạn để tăng khả năng ghép đôi thành công</ThemedText>

      {/* Bio */}
      <ThemedText style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>Bio</ThemedText>
      <ThemedText style={styles.bioInput}>{bio || "Chưa có thông tin"}</ThemedText>

      {/* My Bike */}
      <ThemedText style={{ fontWeight: "bold", fontSize: 16, marginTop: 16, marginBottom: 4 }}>My Bike</ThemedText>
      <ThemedText style={styles.bikeInput}>{bikeName || "Chưa có thông tin"}</ThemedText>
      <ThemedText style={styles.bikeInput}>{bikeCapacity || "Chưa có thông tin"}</ThemedText>
      <FlatList
        data={bikeImages}
        horizontal
        keyExtractor={(_, idx) => `bike-img-${idx}`}
        renderItem={({ item }) => (
          <View style={styles.imageBox}>
            {item ? (
              <Image source={{ uri: `${config?.fileUrl}/${item}` }} style={styles.profileImg} />
            ) : null}
          </View>
        )}
        style={{ marginBottom: 8 }}
        showsHorizontalScrollIndicator={false}
      />
      <ThemedText style={{ color: "#999", fontSize: 12, marginBottom: 12 }}>Hãy khoe chiếc xe yêu quý của bạn</ThemedText>

      {/* Sở thích */}
      <ThemedText style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>Sở Thích</ThemedText>
      {interests.map((interest, idx) => (
        <View key={idx} style={styles.interestRow}>
          <ThemedText style={styles.interestText}>{interest}</ThemedText>
        </View>
      ))}
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={null}
      keyExtractor={item => item.key}
      ListHeaderComponent={renderHeader}
      style={{ backgroundColor: "#FFFCEE" }}
    />
  );
}

const styles = StyleSheet.create({
  previewBtn: {
    position: "absolute",
    right: 16,
    top: 16,
    backgroundColor: "#FFA500",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    zIndex: 10,
  },
  imageBox: {
    width: 90,
    height: 90,
    margin: 4,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  profileImg: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  removeImgBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#FFA500",
    borderRadius: 10,
    padding: 2,
    zIndex: 2,
  },
  addImgBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 90,
  },
  verifyRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  verifyBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#FFA500",
  },
  verified: {
    backgroundColor: "#FFA500",
  },
  notVerified: {
    backgroundColor: "#FFF",
  },
  bioInput: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFA500",
    padding: 12,
    minHeight: 60,
    marginBottom: 8,
  },
  bikeInput: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFA500",
    padding: 12,
    marginBottom: 8,
  },
  interestRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFA500",
    padding: 12,
    marginBottom: 8,
    justifyContent: "space-between",
  },
  interestText: {
    fontSize: 16,
  },
  addInterestRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  addInterestInput: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFA500",
    padding: 12,
    marginRight: 8,
  },
  addInterestBtn: {
    backgroundColor: "#FFA500",
    borderRadius: 8,
    padding: 8,
  },
});