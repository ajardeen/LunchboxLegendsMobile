    import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const RechargeSheet = ({ onClose }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Choose payment method</Text>

      <Pressable style={styles.option}>
        <Text>UPI</Text>
      </Pressable>

      <Pressable style={styles.option}>
        <Text>Credit / Debit Card</Text>
      </Pressable>

      <Pressable style={styles.option}>
        <Text>Wallet</Text>
      </Pressable>

      <Pressable style={styles.payBtn}>
        <Text style={styles.payText}>Proceed to Pay</Text>
      </Pressable>
    </View>
  );
};

export default RechargeSheet;
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  payBtn: {
    backgroundColor: "#22C55E",
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: "center",
  },
  payText: {
    color: "#fff",
    fontWeight: "600",
  },
});
