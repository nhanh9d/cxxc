import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Modal, FlatList, StyleProp, ViewStyle } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { FontAwesome } from "@expo/vector-icons";
import { ThemedView } from "./ThemedView";
import { ButtonType, ThemedButton } from "./ThemedButton";

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
  const [isPickerVisible, setPickerVisible] = useState(false); // Modal visibility

  const handleItemSelect = (item: string) => {
    setSelectedItem(item); // Update selected item
    setPickerVisible(false); // Close modal
    onValueChange?.(item); // Call parent callback
  };

  return (
    <>
      {/* Item Picker Button */}
      <TouchableOpacity
        style={styles.pickerContainer}
        onPress={() => setPickerVisible(true)}
      >
        <ThemedText style={styles.itemText}>
          {selectedItem || placeholder} {/* Placeholder or selected value */}
        </ThemedText>
        <FontAwesome name="angle-down" size={20} color="#FFA500" />
      </TouchableOpacity>

      {/* Modal for Item Options */}
      {isPickerVisible && (
        <Modal transparent={true} animationType="fade" visible={isPickerVisible}>
          <ThemedView style={styles.modalOverlay}>
            <ThemedView style={styles.modalContent} lightColor="#FFFCEE" darkColor="#2B2A27">
              {/* Item Options */}
              <FlatList
                data={options}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <ThemedButton
                    title={item}
                    onPress={() => handleItemSelect(item)}
                    style={[styles.option]}
                    buttonType={item === selectedItem ? ButtonType.primary : undefined}
                  />
                )}
              />
              {/* Close Button */}
              <ThemedButton
                title="Đóng"
                onPress={() => setPickerVisible(false)}
                buttonType={ButtonType.primary}
                style={{ marginTop: 20 }}
              />
            </ThemedView>
          </ThemedView>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFA500",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  itemText: {
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
    width: "80%",
    padding: 20,
    maxHeight: 500
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  optionText: {
    fontSize: 16,
    color: "#FFA500",
  },
  selected: {
    backgroundColor: "#FFA500",
  },
  selectedText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  }
});
