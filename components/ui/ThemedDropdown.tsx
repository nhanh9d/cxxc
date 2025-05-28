import React, { useState } from "react";
import { StyleSheet, Platform, View, TouchableOpacity, Modal, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

export type ThemedDropdownProps = {
  options?: string[]; // Optional custom item options
  placeholder?: string;
  onValueChange?: (value: string) => void; // Callback for selection
};

export default function ThemedDropdown({
  options = ["Nam", "Nữ", "Khác"], // Default options
  placeholder = "Chọn giới tính",
  onValueChange
}: ThemedDropdownProps) {
  const [selectedItem, setSelectedItem] = useState<string>(""); // Selected value
  const [modalVisible, setModalVisible] = useState(false);

  const handleItemSelect = (item: string) => {
    setSelectedItem(item); // Update selected item
    onValueChange?.(item); // Call parent callback
    setModalVisible(false);
  };

  if (Platform.OS === 'ios') {
    return (
      <>
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={() => setModalVisible(true)}
        >
          <Text style={selectedItem ? styles.value : styles.placeholder}>
            {selectedItem || placeholder}
          </Text>
        </TouchableOpacity>
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Picker
                selectedValue={selectedItem}
                onValueChange={handleItemSelect}
              >
                <Picker.Item label={placeholder} value="" />
                {options.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>Đóng</Text>
              </TouchableOpacity>
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
    backgroundColor: "#FFF",
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
    backgroundColor: "#FFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  closeButton: {
    color: "#FF9500",
    textAlign: "center",
    marginTop: 12,
    fontWeight: "bold",
    fontSize: 16,
  },
});
