import React from "react";
import { View, StyleSheet } from "react-native";

/**
 * CategoryIcon
 * Reusable veg/non-veg indicator component.
 *
 * Props:
 *  - type: "veg" | "nonveg"
 *  - size: number (optional, default = 14)
 */
export default function CategoryIcon({ type = "veg", size = 14 }) {
  const isVeg = type === "veg";

  const squareStyle = [
    styles.baseSquare,
    isVeg ? styles.vegSquare : styles.nonVegSquare,
    { width: size, height: size, borderRadius: size * 0.15 },
  ];

  const circleSize = size * 0.55;

  return (
    <View style={squareStyle}>
      <View
        style={[
          styles.baseCircle,
          isVeg ? styles.vegCircle : styles.nonVegCircle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  baseSquare: {
    justifyContent: "center",
    alignItems: "center",
  },
  baseCircle: {
    borderWidth: 1,
    borderColor: "#fff",
  },
  vegSquare: {
    borderWidth: 2,
    borderColor: "#00A86B",
  },
  nonVegSquare: {
    borderWidth: 1,
    borderColor: "#FF4500",
  },
  vegCircle: {
    backgroundColor: "#00A86B",
  },
  nonVegCircle: {
    backgroundColor: "#FF4500",
  },
});
