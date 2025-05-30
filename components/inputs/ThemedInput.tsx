import React from "react";
import { TextInput, StyleSheet, TextInputProps, Keyboard } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  borderColor?: string; // Optional border color for focus
};

export function ThemedInput({
  style,
  lightColor,
  darkColor,
  borderColor,
  ...otherProps
}: ThemedInputProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const textColor = useThemeColor({}, "text");
  const borderDefaultColor = useThemeColor({}, "border");

  return (
    <TextInput
      style={[
        styles.input,
        { backgroundColor: "#FFF", color: "#000", borderColor: borderColor || borderDefaultColor },
        style,
      ]}
      placeholderTextColor={useThemeColor({}, "placeholder")}
      onBlur={Keyboard.dismiss}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 5,
  },
});
