import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/ThemedText";

const Header = ({ title, backText, onBackClick }: { title: string, backText: string | undefined, onBackClick: () => void }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => onBackClick} style={styles.backButton}>
          <MaterialIcons name="chevron-left" size={24} color="#999" />
          <ThemedText>{backText || "Quay lại"}</ThemedText>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Placeholder for right icon */}
        <View style={styles.rightPlaceholder} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FFFCEE",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFCEE",
  },
  backButton: {
    padding: 5,
    flexDirection: "row"
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  rightPlaceholder: {
    width: 24, // Keeps balance with back button
  },
});

export default Header;
