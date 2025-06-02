import React, { useState } from "react";
import { StyleSheet, Platform, View, TouchableOpacity, Modal, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ButtonType, ThemedButton } from "./ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
export type ThemedDropdownProps = {
  options?: string[]; // Optional custom item options
  placeholder?: string;
  value?: string;
  lightColor?: string;
  darkColor?: string;
  onValueChange?: (value: string) => void; // Callback for selection
};

export default function ThemedDropdown({
  options = ["Nam", "Nữ", "Khác"], // Default options
  placeholder = "Chọn giới tính",
  onValueChange,
  value,
  lightColor = "#FFFCEE",
  darkColor = "#1C1A14",
}: ThemedDropdownProps) {
  const [selectedItem, setSelectedItem] = useState<string>(value || ""); // Selected value
  const [modalVisible, setModalVisible] = useState(false);
  const handleItemSelect = (item: string) => {
    setSelectedItem(item); // Update selected item
    onValueChange?.(item); // Call parent callback
    setModalVisible(false);
  };
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const textColor = useThemeColor({ light: "#000", dark: "#FFF" }, 'text');
  if (Platform.OS === 'ios') {
    return (
      <>
        <TouchableOpacity
          style={[styles.pickerContainer, { backgroundColor }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[selectedItem ? styles.value : styles.placeholder, { color: textColor }]}>
            {selectedItem || placeholder}
          </Text>
        </TouchableOpacity>
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor }]}>
              <Picker
                selectedValue={selectedItem}
                onValueChange={handleItemSelect}
                itemStyle={{ color: textColor, fontSize: 16 }}
              >
                <Picker.Item label={placeholder} value="" />
                {options.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
              <ThemedButton buttonType={ButtonType.primary} title="Đóng" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </>
    );
  }

  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedItem}
        onValueChange={handleItemSelect}
        style={styles.picker}
        dropdownIconColor="#FFA500"
      >
        <Picker.Item label={placeholder} value="" />
        {options.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#FFA500",
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  placeholder: {
    fontSize: 16,
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    borderColor: "#FFA500",
    borderWidth: 1,
  },
  closeButton: {
    color: "#FF9500",
    textAlign: "center",
    marginTop: 12,
    fontWeight: "bold",
    fontSize: 16,
  },
});
