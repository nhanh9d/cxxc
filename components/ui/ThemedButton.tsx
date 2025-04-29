import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacityProps,
  StyleProp,
  TextStyle,
  ViewStyle,
  ImageStyle,
} from "react-native";
// import { useThemeColor } from "@/hooks/useThemeColor";

export enum ButtonType {
  primary,
  secondary
}

export type ThemedButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  title: string; // Button text
  textStyle?: StyleProp<TextStyle>; // Custom text style
  icon?: React.ReactNode; // Icon component
  imageSource?: any; // Image source for symbols
  imageStyle?: StyleProp<ImageStyle>; // Style for the image
  iconStyle?: StyleProp<ViewStyle>; // Style for the icon wrapper
  buttonType?: ButtonType
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  title,
  textStyle,
  icon,
  imageSource,
  imageStyle,
  iconStyle,
  disabled,
  buttonType,
  ...otherProps
}: ThemedButtonProps) {
  // const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
  // const textColor = useThemeColor({}, "text"); // Text color changes with theme
  const textPaddingRight = imageStyle ? StyleSheet.flatten(imageStyle).width : iconStyle ? StyleSheet.flatten(iconStyle).width : 0;
  const prefillButtonStyle = buttonType === ButtonType.primary ? styles.buttonPrimary : buttonType === ButtonType.secondary ? styles.buttonSecondary : {};
  const prefillButtonText = buttonType === ButtonType.primary ? styles.textPrimary : buttonType === ButtonType.secondary ? styles.textSecondary : {};

  return (
    <TouchableOpacity
      style={[styles.button, style, prefillButtonStyle]} // Apply button styles and custom background
      {...otherProps}
      disabled={disabled}
    >
      <View style={styles.content}>
        {/* Render image if provided */}
        {imageSource && <Image source={imageSource} style={[styles.image, imageStyle]} />}
        {/* Render icon if provided */}
        {icon && <View style={[styles.icon, iconStyle]}>{icon}</View>}
        {/* Button text */}
        <Text style={[styles.text, { paddingRight: textPaddingRight }, textStyle, prefillButtonText]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row", // Icon/image and text are laid out horizontally
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8, // Space between the icon and the text
    width: 20,
    height: 20,
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 8, // Space between the image and the text
    resizeMode: "contain",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    textAlign: "center"
  },
  buttonPrimary: {
    backgroundColor: "#FFA500",
  },
  buttonSecondary: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EEEEEF",
    borderWidth: 1
  },
  textPrimary: {
    color: "#FFF"
  },
  textSecondary: {
    color: "#000"
  }
});
