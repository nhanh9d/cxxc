import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";

export default function UnderConstruction() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/under-construction.jpg")}
        style={styles.image}
        resizeMode="contain"
      />
      <ThemedText type="title" style={styles.text}>
        Tính năng đang phát triển!
      </ThemedText>
      <ThemedText style={styles.subText}>
        Vui lòng quay lại sau nhé.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFCEE",
    padding: 24,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
}); 