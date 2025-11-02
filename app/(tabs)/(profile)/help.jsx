import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const Help = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="help-circle-outline" size={80} color="#FF6B00" />
      <Text style={styles.title}>Need Help?</Text>
      <Text style={styles.subtitle}>
        Feel free to ask! Our support team is always here to assist you.
      </Text>

      <TouchableOpacity style={styles.button}>
        <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Chat with Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondary]}>
        <Ionicons name="mail-outline" size={20} color="#FF6B00" />
        <Text style={[styles.buttonText, { color: "#FF6B00" }]}>Send Email</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
    color: "#222",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginVertical: 10,
    lineHeight: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B00",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  secondary: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#FF6B00",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
});
