import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Platform, Modal, View, ViewProps } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "@/components/ThemedText";
import { FontAwesome } from "@expo/vector-icons";
import { ThemedView } from "./ThemedView";
import { ThemedButton } from "./ThemedButton";

export type ThemedDatePickerProps = ViewProps & {
  showLabel?: boolean;
  onValueChange?: (value: Date | undefined) => void; // Callback for selection
};

export default function ThemedDatePicker({ showLabel, style,
  onValueChange, }: ThemedDatePickerProps) {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (Platform.OS !== "ios") setShowPicker(false); // Close picker for Android
    if (selectedDate) setDate(selectedDate); // Update the selected date
    onValueChange?.(selectedDate); 
  };

  return (
    <ThemedView style={style}>
      {showLabel && <ThemedText style={styles.label}>Ngày sinh</ThemedText>}
      <TouchableOpacity
        style={styles.pickerContainer}
        onPress={() => setShowPicker(true)}
      >
        <ThemedText style={styles.dateText}>
          {date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </ThemedText>
        <FontAwesome name="calendar" size={20} color="#FFA500" />
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
                maximumDate={new Date()}
              />
              <ThemedButton
                title="Xong"
                style={styles.modalCloseButton}
                onPress={() => setShowPicker(false)}
              />
            </ThemedView>
          </ThemedView>
        </Modal>
      )}

      {/* For Android: Inline Picker */}
      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
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
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFA500",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
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
