import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const PauseSheet = ({ onClose }) => {
  const [startDate, setStartDate] = useState("Mon, 26");
  const [endDate, setEndDate] = useState("Fri, 30");

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Starting</Text>
          <Text style={styles.date}>{startDate}</Text>
        </View>

        <View>
          <Text style={styles.label}>Ending</Text>
          <Text style={styles.date}>{endDate}</Text>
        </View>
      </View>

      {/* Placeholder calendar */}
      <View style={styles.calendarPlaceholder}>
        <Text style={styles.calendarText}>
          Calendar UI goes here
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable onPress={onClose}>
          <Text style={styles.clear}>Clear</Text>
        </Pressable>

        <Pressable style={styles.pauseBtn}>
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
  },
  calendarPlaceholder: {
    height: 220,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  calendarText: {
    color: "#9CA3AF",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clear: {
    color: "#6B7280",
  },
  pauseBtn: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  pauseText: {
    color: "#fff",
    fontWeight: "600",
  },
});
