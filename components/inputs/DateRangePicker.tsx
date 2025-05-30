import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import ThemedDatePicker from "@/components/ui/ThemedDatePicker";

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
  console.log(defaultStartDate, defaultEndDate);
  return (
    <View style={styles.container}>
      {/* Departure Date */}
      <View style={styles.row}>
        <View style={styles.radioContainer}>
          <View style={styles.radioIconFilled} />
          <View style={styles.dottedLine} />
        </View>
        <View style={[styles.textContainer, { borderBottomWidth: 1, borderBottomColor: "#8A8A8E" }]}>
          <ThemedDatePicker
            labelStyle={{
              color: "#8E8E8E",
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
      <View style={[styles.row, , { marginTop: 12 }]}>
        <View style={styles.radioContainer}>
          <View style={styles.radioIconEmpty} />
        </View>
        <View style={[styles.textContainer]}>
          <ThemedDatePicker
            labelStyle={{
              color: "#8E8E8E",
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
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEEEEF",
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
    backgroundColor: "#000",
  },
  radioIconEmpty: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#000",
  },
  dottedLine: {
    width: 1,
    height: 12,
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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

