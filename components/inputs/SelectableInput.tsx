import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { ButtonType, ThemedButton } from "../ui/ThemedButton";

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

  if (numeric && Platform.OS === 'ios') {
    return (
      <>
        <TouchableOpacity style={styles.container} onPress={() => setModalVisible(true)}>
          <View style={styles.icon}>{icon}</View>
          <View style={styles.textContainer}>
            <Text style={[styles.label, value !== undefined && styles.labelWithValue]}>
              {label}
            </Text>
            <Text style={styles.value}>
              {value ? value : "Không giới hạn"}
            </Text>
          </View>
          <AntDesign name="right" size={18} color="#999" />
        </TouchableOpacity>
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.3)"
          }}>
            <View style={{
              backgroundColor: "#FFF",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 16,
              paddingBottom: 48,
              minHeight: 200,
            }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 8 }}>
                {label}
              </Text>
              <Text style={{ fontSize: 16, color: "#333", textAlign: "center", marginBottom: 8 }}>
                Đang chọn: {inputValue || "Không giới hạn"}
              </Text>
              <Picker
                selectedValue={inputValue}
                onValueChange={(itemValue) => {
                  setInputValue(itemValue);
                  onSave(Number(itemValue));
                }}
                style={styles.picker}
              >
                <Picker.Item label="Không giới hạn" value="" />
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                  <Picker.Item key={num} label={num.toString()} value={num.toString()} />
                ))}
              </Picker>
              <ThemedButton buttonType={ButtonType.primary} title="Đóng" onPress={() => setModalVisible(false)}/>
            </View>
          </View>
        </Modal>
      </>
    );
  }

  if (numeric && Platform.OS === 'android') {
    return (
      <View style={styles.container}>
        <View style={styles.icon}>{icon}</View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, value !== undefined && styles.labelWithValue]}>
            {label}
          </Text>
        </View>
        <View>
          <Picker
            selectedValue={inputValue}
            onValueChange={(itemValue) => {
              setInputValue(itemValue);
              onSave(Number(itemValue));
            }}
            style={styles.picker}
            dropdownIconColor="#999"
          >
            <Picker.Item label="Không giới hạn" value="" />
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
              <Picker.Item key={num} label={num.toString()} value={num.toString()} />
            ))}
          </Picker>
        </View>
      </View>
    );
  }

  return (
    <>
      {/* Clickable Component */}
      <TouchableOpacity style={styles.container} onPress={() => setModalVisible(true)}>
        <View style={styles.icon}>{icon}</View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, value !== undefined && styles.labelWithValue]}>
            {label}
          </Text>
          {value !== undefined && <Text style={styles.value}>{truncateText(value)}</Text>}
        </View>
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
    borderWidth: 1,
    borderColor: "#EEEEEF",
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
  picker: {
    width: '100%',
  },
});

export default SelectableInput;
