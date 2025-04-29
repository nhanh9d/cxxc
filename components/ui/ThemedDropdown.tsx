import React, { useState } from "react";
import { StyleSheet, Platform, View } from "react-native";
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

  const handleItemSelect = (item: string) => {
    setSelectedItem(item); // Update selected item
    onValueChange?.(item); // Call parent callback
  };

  if (Platform.OS === 'ios') {
    return (
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedItem}
          onValueChange={handleItemSelect}
          style={styles.picker}
        >
          <Picker.Item label={placeholder} value="" />
          {options.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </View>
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
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
