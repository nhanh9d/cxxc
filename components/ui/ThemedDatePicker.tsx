import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Platform, Modal, ViewProps, StyleProp, ViewStyle, TextStyle } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "@/components/ui/ThemedText";
import { FontAwesome } from "@expo/vector-icons";
import { ThemedView } from "@/components/layout/ThemedView";
import { ThemedButton } from "@/components/ui/ThemedButton";

export type ThemedDatePickerProps = ViewProps & {
  showLabel?: boolean;
  label?: string;
  labelStyle?: StyleProp<TextStyle>
  showCalendarIcon?: boolean;
  buttonStyle?: StyleProp<ViewStyle>
  minDate?: Date,
  maxDate?: Date,
  defaultValue?: Date,
  onValueChange?: (value: Date | undefined) => void; // Callback for selection
};

export default function ThemedDatePicker({
  showLabel,
  label = "Ngày sinh",
  labelStyle,
  showCalendarIcon = true,
  style,
  buttonStyle,
  minDate,
  maxDate,
  defaultValue,
  onValueChange
}: ThemedDatePickerProps) {
  const [date, setDate] = useState<Date>(defaultValue || new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (Platform.OS !== "ios") setShowPicker(false); // Close picker for Android
    if (selectedDate) setDate(selectedDate); // Update the selected date
    onValueChange?.(selectedDate);
  };

  return (
    <ThemedView style={style}>
      {showLabel && <ThemedText style={[styles.label, labelStyle]}>{label}</ThemedText>}
      <TouchableOpacity
        style={buttonStyle}
        onPress={() => setShowPicker(true)}
      >
        <ThemedText style={styles.dateText}>
          {date ? date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }) : "Chọn ngày"}
        </ThemedText>
        {showCalendarIcon && <FontAwesome name="calendar" size={20} color="#FFA500" />}
      </TouchableOpacity>

      {/* For iOS: Use a Modal for better control */}
      {Platform.OS === "ios" && showPicker && (
        <Modal transparent={true} animationType="slide" visible={showPicker}>
          <ThemedView style={styles.modalOverlay}>
            <ThemedView style={styles.modalContent} lightColor="#FFFCEE" darkColor="#2B2A27">
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  handleDateChange(event, selectedDate);
                }}
                maximumDate={maxDate}
                minimumDate={minDate}
              />
              <ThemedButton
                title="Xong"
                textStyle={{ color: "#FFF" }}
                style={styles.modalCloseButton}
                onPress={() => {
                  onValueChange?.(date);
                  setShowPicker(false);
                }}
              />
            </ThemedView>
          </ThemedView>
        </Modal>
      )}

      {/* For Android: Inline Picker */}
      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={maxDate}
          minimumDate={minDate}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FFA500",
    borderRadius: 8
  },
  modalCloseText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
