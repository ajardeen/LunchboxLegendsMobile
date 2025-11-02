import { View, Text, StyleSheet } from "react-native";
import React from "react";

const mySubscription = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Subscription</Text>
      <Text style={styles.text}>
        You don't have any active subscriptions yet. Explore our meal plans and
        start your subscription today!
      </Text>
    </View>
  );
};

export default mySubscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});
