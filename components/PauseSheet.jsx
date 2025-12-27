import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";

const PauseSheet = ({ onClose }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerType, setPickerType] = useState(null); // "start" | "end"

  const onChange = (_, selectedDate) => {
    setShowPicker(false);
    if (!selectedDate) return;

    if (pickerType === "start") {
      setStartDate(selectedDate);
      setEndDate(null); // reset end date if start changes
    } else {
      setEndDate(selectedDate);
    }
  };

  const openPicker = (type) => {
    setPickerType(type);
    setShowPicker(true);
  };

  return (
    <View style={styles.container}>
      {/* Date Row */}
      <View style={styles.row}>
        <Pressable onPress={() => openPicker("start")}>
          <Text style={styles.label}>Starting</Text>
          <Text style={styles.date}>
            {startDate ? dayjs(startDate).format("ddd, DD MMM") : "--"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => openPicker("end")}
          disabled={!startDate}
        >
          <Text style={styles.label}>Ending</Text>
          <Text style={styles.date}>
            {endDate ? dayjs(endDate).format("ddd, DD MMM") : "--"}
          </Text>
        </Pressable>
      </View>

      {/* Native Date Picker */}
      {showPicker && (
        <DateTimePicker
          value={
            pickerType === "start"
              ? startDate || new Date()
              : endDate || startDate || new Date()
          }
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          minimumDate={
            pickerType === "start"
              ? new Date()
              : startDate || new Date()
          }
          onChange={onChange}
        />
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          onPress={() => {
            setStartDate(null);
            setEndDate(null);
          }}
        >
          <Text style={styles.clear}>Clear</Text>
        </Pressable>

        <Pressable
          style={[
            styles.pauseBtn,
            !(startDate && endDate) && { opacity: 0.5 },
          ]}
          disabled={!(startDate && endDate)}
        >
          <Text style={styles.pauseText}>Pause</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PauseSheet;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
  },
  date: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  clear: {
    color: "#6B7280",
  },
  pauseBtn: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 26,
    paddingVertical: 10,
    borderRadius: 20,
  },
  pauseText: {
    color: "#fff",
    fontWeight: "600",
  },
});

