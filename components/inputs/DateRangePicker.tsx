import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import ThemedDatePicker from "@/components/ui/ThemedDatePicker";
import { useThemeColor } from "@/hooks/useThemeColor";

type DateRangePickerProp = {
  setStartDate: (value: Date | undefined) => void,
  setEndDate: (value: Date | undefined) => void,
  minStartDate?: Date,
  minEndDate?: Date,
  maxStartDate?: Date,
  maxEndDate?: Date,
  defaultStartDate?: Date,
  defaultEndDate?: Date,
}
export function DateRangePicker({
  setEndDate,
  setStartDate,
  minEndDate,
  minStartDate,
  maxEndDate,
  maxStartDate,
  defaultStartDate,
  defaultEndDate
}: DateRangePickerProp) {
  // Theme colors
  const backgroundColor = useThemeColor({ light: "#fff", dark: "#3A3A3A" }, 'background');
  const borderColor = useThemeColor({ light: "#EEEEEF", dark: "#4A4A4A" }, 'border');
  const textColor = useThemeColor({ light: "#8E8E8E", dark: "#AAA" }, 'text');
  const iconColor = useThemeColor({ light: "#000", dark: "#FFF" }, 'text');
  const lineColor = useThemeColor({ light: "#ccc", dark: "#666" }, 'border');
  const separatorColor = useThemeColor({ light: "#8A8A8E", dark: "#666" }, 'border');
  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      {/* Departure Date */}
      <View style={styles.row}>
        <View style={styles.radioContainer}>
          <View style={[styles.radioIconFilled, { backgroundColor: iconColor }]} />
          <View style={[styles.dottedLine, { borderLeftColor: lineColor, borderBottomColor: lineColor }]} />
        </View>
        <View style={[styles.textContainer, { borderBottomWidth: 1, borderBottomColor: separatorColor }]}>
          <ThemedDatePicker
            labelStyle={{
              color: textColor,
              fontWeight: "normal",
              fontSize: 16,
              marginBottom: 0
            }}
            value={defaultStartDate}
            minDate={minStartDate}
            maxDate={maxStartDate}
            showLabel={true}
            style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, backgroundColor: "transparent" }}
            label="Ngày khởi hành"
            onValueChange={setStartDate} showCalendarIcon={false} />
        </View>
      </View>

      {/* Return Date */}
      <View style={[styles.row, { marginTop: 12 }]}>
        <View style={styles.radioContainer}>
          <View style={[styles.radioIconEmpty, { borderColor: iconColor }]} />
        </View>
        <View style={[styles.textContainer]}>
          <ThemedDatePicker
            labelStyle={{
              color: textColor,
              fontWeight: "normal",
              fontSize: 16,
              marginBottom: 0
            }}
            value={defaultEndDate}
            minDate={minEndDate}
            maxDate={maxEndDate}
            showLabel={true}
            style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: "transparent" }}
            label="Ngày trở về"
            onValueChange={setEndDate} showCalendarIcon={false} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioContainer: {
    alignItems: "center",
    marginRight: 10,
  },
  radioIconFilled: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioIconEmpty: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  dottedLine: {
    width: 1,
    height: 12,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
  },
  textContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between"
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

