import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Image, Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/layout/ThemedView";
import { ThemedButton } from "@/components/ui/ThemedButton";
import { useImageUpload } from "@/contexts/UploadImageContext";
import { ThemedInput } from "@/components/inputs/ThemedInput";
import { DateRangePicker } from "@/components/inputs/DateRangePicker";
import { useEffect, useState } from "react";
import { EventDto } from "@/types/event";
import SelectableInput from "@/components/inputs/SelectableInput";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedScrollView } from "@/components/layout/ThemedScrollView";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApi } from "@/contexts/ApiContext";
import { useThemeColor } from "@/hooks/useThemeColor";
export default function CreateScreen() {
  const router = useRouter();
  const axios = useApi();
  const backgroundColor = useThemeColor({ light: "#FFFCEE", dark: "#2B2A27" }, 'background');
  const iconColor = useThemeColor({ light: "#999", dark: "#AAA" }, 'icon');
  const buttonBgColor = useThemeColor({ light: "#fff", dark: "#3A3A3A" }, 'background');
  const disabledBgColor = useThemeColor({ light: "#EEEEEF", dark: "#4A4A4A" }, 'background');
  const disabledTextColor = useThemeColor({ light: "#C4C4C4", dark: "#666" }, 'text');
  const borderColor = useThemeColor({ light: "#E5E5EA", dark: "#4A4A4A" }, 'border');

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)")} style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="chevron-left" size={24} color={iconColor} />
          <ThemedText>Quay lại</ThemedText>
        </TouchableOpacity>
      ),
      headerTitle: "",
      headerStyle: {
        backgroundColor,
        shadowOpacity: 0, // Remove shadow (iOS)
        elevation: 0, // Remove shadow (Android)
        borderBottomWidth: 0, // Remove bottom border
      }
    });
  }, [navigation, backgroundColor, iconColor, borderColor]);

  const { uploadImage } = useImageUpload();
  const chooseImage = async () => {
    const imageUrl = await uploadImage({ aspect: [3, 2] });
    if (imageUrl) {
      setEvent({ ...event, banner: imageUrl });
    }
  }

  const [event, setEvent] = useState<EventDto>({ startDate: new Date() });
  const [isValid, setIsValid] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { eventId } = useLocalSearchParams();

  useEffect(() => {
    if (eventId) {
      setIsEdit(true);

      const getEventFromApi = async () => {
        const eventUri = `${Constants.expoConfig?.extra?.apiUrl}/event/${eventId}`;
        const response = await axios.get<EventDto>(eventUri);

        if (response?.data) {
          setEvent(response.data);
        }
      }

      getEventFromApi();
    }
  }, []);

  useEffect(() => {
    setIsValid(!!event
      && !!event.banner
      && !!event.name
      && !!event.endDate
      && !!event.startDate
      && !!event.startLocation);
  }, [event]);

  const createEvent = async () => {
    if (!isValid) {
      return;
    }

    const eventUri = `${Constants.expoConfig?.extra?.apiUrl}/event`;
    const response = await axios.post(eventUri, event);
    await AsyncStorage.setItem("createdEvent", JSON.stringify(response?.data));

    if (response?.data) {
      router.replace({
        pathname: "/event/after-create",
        params: { eventId: response.data.id },
      })
    }
  }

  const editEvent = async () => {
    if (!isValid) {
      return;
    }

    const eventUri = `${Constants.expoConfig?.extra?.apiUrl}/event`;
    const response = await axios.put(eventUri, event);
    await AsyncStorage.setItem("createdEvent", JSON.stringify(response?.data));

    if (response?.data) {
      router.replace({
        pathname: "/event/after-create",
        params: { eventId: response.data.id },
      })
    }
  }

  const getNearestDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);

    return today;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container} lightColor="#FFFCEE" darkColor="#2B2A27">
        <ThemedText type="title" style={{ marginBottom: 24, marginTop: 12 }}>{isEdit ? "Chỉnh sửa thông tin" : "Hoạt động mới"}</ThemedText>

        <ThemedScrollView
          keyboardShouldPersistTaps="handled"
          lightColor="#FFFCEE" 
          darkColor="#2B2A27"
        >
          {/* banner */}
          <ThemedView style={styles.banner} lightColor="#FFFCEE" darkColor="#2B2A27">
            <Image
              source={
                event?.banner
                  ? { uri: `${event.banner}` }
                  : require("../../assets/images/banner-placeholder.png")}
              style={{ width: "100%", height: 200, resizeMode: "cover", borderRadius: 12 }} />
            <ThemedButton
              imageSource={require("../../assets/images/picture-icon.png")}
              imageStyle={{ width: 16, height: 16 }}
              style={[styles.bannerButton, { 
                backgroundColor: buttonBgColor,
                borderColor: borderColor,
                borderWidth: 1,
                borderRadius: 8
              }]} 
              title="Chọn hình ảnh"
              textStyle={[styles.bannerButtonText, { color: iconColor }]}
              onPress={() => { chooseImage() }} />
          </ThemedView>

          {/* name */}
          <ThemedView style={{ marginBottom: 12 }} lightColor="#FFFCEE" darkColor="#2B2A27">
            <ThemedInput
              style={{ fontSize: 20, paddingHorizontal: 12, paddingVertical: 16 }}
              placeholder="Tên chuyến đi"
              value={event?.name}
              onChangeText={(value) => setEvent({ ...event, name: value })} />
          </ThemedView>

          {/* time */}
          <ThemedView style={{ marginBottom: 12 }} lightColor="#FFFCEE" darkColor="#2B2A27">
            <DateRangePicker
              defaultEndDate={event?.endDate}
              defaultStartDate={event?.startDate}
              minStartDate={new Date()}
              setStartDate={(date) => setEvent({ ...event, startDate: date })}
              minEndDate={event?.startDate ? event.startDate : getNearestDate()}
              setEndDate={(date) => setEvent({ ...event, endDate: date })} />
          </ThemedView>

          <ThemedView style={{ marginBottom: 12 }} lightColor="#FFFCEE" darkColor="#2B2A27">
            <SelectableInput
              icon={<MaterialIcons name="add-location-alt" size={24} color={iconColor} />}
              label="Địa điểm khởi hành"
              value={event?.startLocation}
              onSave={(value) => setEvent({ ...event, startLocation: value as string })} />
          </ThemedView>

          <ThemedView style={{ marginBottom: 12 }} lightColor="#FFFCEE" darkColor="#2B2A27">
            <SelectableInput
              icon={<MaterialIcons name="menu-book" size={24} color={iconColor} />}
              label="Mô tả"
              value={event?.description}
              multiline={true}
              onSave={(value) => setEvent({ ...event, description: value as string })} />
          </ThemedView>

          <ThemedView style={{ marginBottom: 12 }} lightColor="#FFFCEE" darkColor="#2B2A27">
            <SelectableInput
              icon={<MaterialIcons name="people-outline" size={24} color={iconColor} />}
              label="Số lượng"
              value={event?.size}
              numeric={true}
              onSave={(value) => setEvent({ ...event, size: value as number })} />
          </ThemedView>
        </ThemedScrollView>

        <ThemedButton
          title={isEdit ? "Cập nhật" : "Tạo chuyến đi"}
          style={{ 
            backgroundColor: isValid ? "#FF9500" : disabledBgColor, 
            marginBottom: 24,
            borderRadius: 8,
            paddingVertical: 16,
            borderWidth: 1,
            borderColor: isValid ? "#FF9500" : borderColor
          }}
          textStyle={{ 
            color: isValid ? "#FFF" : disabledTextColor,
            fontSize: 16,
            fontWeight: "600"
          }}
          onPress={() => isEdit ? editEvent() : createEvent()} />
      </ThemedView>
    </TouchableWithoutFeedback>
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
