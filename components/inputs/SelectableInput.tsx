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
import { useThemeColor } from "@/hooks/useThemeColor";

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
  
  // Theme colors
  const backgroundColor = useThemeColor({ light: "white", dark: "#3A3A3A" }, 'background');
  const borderColor = useThemeColor({ light: "#EEEEEF", dark: "#4A4A4A" }, 'border');
  const textColor = useThemeColor({ light: "#333", dark: "#FFF" }, 'text');
  const labelColor = useThemeColor({ light: "#999", dark: "#AAA" }, 'text');
  const labelWithValueColor = useThemeColor({ light: "#666", dark: "#CCC" }, 'text');
  const iconColor = useThemeColor({ light: "#999", dark: "#AAA" }, 'icon');
  const modalBgColor = useThemeColor({ light: "white", dark: "#2A2A2A" }, 'background');
  const inputBorderColor = useThemeColor({ light: "#ccc", dark: "#666" }, 'border');
  const overlayColor = useThemeColor({ light: "rgba(0,0,0,0.5)", dark: "rgba(0,0,0,0.7)" }, 'background');

  const handleSave = () => {
    const newValue = numeric ? Number(inputValue) : inputValue;
    onSave(newValue);
    setModalVisible(false);
  };

  if (numeric && Platform.OS === 'ios') {
    return (
      <>
        <TouchableOpacity style={[styles.container, { backgroundColor, borderColor }]} onPress={() => setModalVisible(true)}>
          <View style={styles.icon}>{icon}</View>
          <View style={styles.textContainer}>
            <Text style={[styles.label, { color: labelColor }, value !== undefined && { color: labelWithValueColor }]}>
              {label}
            </Text>
            <Text style={[styles.value, { color: textColor }]}>
              {value ? value : "Không giới hạn"}
            </Text>
          </View>
          <AntDesign name="right" size={18} color={iconColor} />
        </TouchableOpacity>
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: overlayColor
          }}>
            <View style={{
              backgroundColor: modalBgColor,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 16,
              paddingBottom: 48,
              minHeight: 200,
            }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 8, color: textColor }}>
                {label}
              </Text>
              <Text style={{ fontSize: 16, color: textColor, textAlign: "center", marginBottom: 8 }}>
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
      <View style={[styles.container, { backgroundColor, borderColor }]}>
        <View style={styles.icon}>{icon}</View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: labelColor }, value !== undefined && { color: labelWithValueColor }]}>
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
            style={[styles.picker, { color: textColor }]}
            dropdownIconColor={iconColor}
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
      <TouchableOpacity style={[styles.container, { backgroundColor, borderColor }]} onPress={() => setModalVisible(true)}>
        <View style={styles.icon}>{icon}</View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: labelColor }, value !== undefined && { color: labelWithValueColor }]}>
            {label}
          </Text>
          {value !== undefined && <Text style={[styles.value, { color: textColor }]}>{truncateText(value)}</Text>}
        </View>
        <AntDesign name="right" size={18} color={iconColor} />
      </TouchableOpacity>

      {/* Modal with Input/Textarea */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={[styles.modalContainer, { backgroundColor: overlayColor }]}>
          <View style={[styles.modalContent, { backgroundColor: modalBgColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>{label}</Text>
            <TextInput
              style={[
                styles.input, 
                multiline && styles.textarea,
                { 
                  borderColor: inputBorderColor,
                  backgroundColor: backgroundColor,
                  color: textColor
                }
              ]}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType={numeric ? "numeric" : "default"}
              multiline={multiline}
              placeholder={numeric ? "Nhập số hoặc để trống" : "Nhập thông tin..."}
              placeholderTextColor={labelColor}
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
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
  },
  labelWithValue: {
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
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
