import React from "react";
import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface HeaderIconBtnProps {
  iconName: string;
  color: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const HeaderIconBtn: React.FC<HeaderIconBtnProps> = ({ iconName, color, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <MaterialIcons name={iconName as any} size={24} color={color} />
    </TouchableOpacity>
  );
};

export default HeaderIconBtn; 