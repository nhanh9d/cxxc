import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

type SelectableInputProps = {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
  multiline?: boolean; // Determines if textarea or input
  numeric?: boolean; // Determines if input is number
  onSave: (newValue: string | number) => void;
};

// Function to truncate text (first line only, max 20 characters)
const truncateText = (text?: string | number, maxLength = 20) => {
  if (text === undefined || text === null) return "";
  const textStr = text.toString(); // Convert number to string if needed
  const firstLine = textStr.split("\n")[0]; // Get first line only
  return firstLine.length > maxLength ? firstLine.slice(0, maxLength) + "..." : firstLine;
};

const SelectableInput: React.FC<SelectableInputProps> = ({
  icon,
  label,
  value,
  multiline = false,
  numeric = false,
  onSave,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState(value ? value.toString() : ""); // Store as string for input

  const handleSave = () => {
    const newValue = numeric ? Number(inputValue) : inputValue;
    onSave(newValue);
    setModalVisible(false);
  };

  return (
    <>
      {/* Clickable Component */}
      <TouchableOpacity style={styles.container} onPress={() => setModalVisible(true)}>
        <View style={styles.icon}>{icon}</View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, value !== undefined && styles.labelWithValue]}>
            {label}
          </Text>
          {!numeric && value !== undefined && <Text style={styles.value}>{truncateText(value)}</Text>}
        </View>

        {/* Show number or "Không giới hạn" next to chevron */}
        {numeric && (
          <Text style={styles.numericValue}>
            {value ? value : "Không giới hạn"}
          </Text>
        )}

        <AntDesign name="right" size={18} color="#999" />
      </TouchableOpacity>

      {/* Modal with Input/Textarea */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            <TextInput
              style={[styles.input, multiline && styles.textarea]}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType={numeric ? "numeric" : "default"}
              multiline={multiline}
              placeholder={numeric ? "Nhập số hoặc để trống" : "Nhập thông tin..."}
            />
            <View style={styles.buttonContainer}>
              <Button title="Hủy" onPress={() => setModalVisible(false)} color="gray" />
              <Button title="Lưu" onPress={handleSave} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: "#999",
  },
  labelWithValue: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  numericValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginRight: 8, // Adds spacing before the chevron
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
});

export default SelectableInput;
