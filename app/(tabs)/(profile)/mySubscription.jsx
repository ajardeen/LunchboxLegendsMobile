import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";

const SUBSCRIPTIONS = [
  {
    id: "1",
    kitchenName: "Kitchen 1",
    mealType: "Breakfast",
    balance: 300,
    remaining: "5/15",
    expiryDate: "15 August 2021",
    remainingDays: 2,
  },
  {
    id: "2",
    kitchenName: "Kitchen 2",
    mealType: "Lunch",
    balance: 2000,
    remaining: "20/30",
    expiryDate: "1 September 2021",
    remainingDays: null,
  },
];

const mySubscription = () => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.kitchen}>{item.kitchenName}</Text>
      <Text style={styles.mealType}>{item.mealType}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Subscription balance</Text>
        <Text style={styles.value}>₹{item.balance}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Tiffin remaining</Text>
        <Text style={styles.value}>{item.remaining}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Expiry on</Text>
        <View>
          <Text style={styles.value}>{item.expiryDate}</Text>
          {item.remainingDays && (
            <Text style={styles.expiryWarning}>
              {item.remainingDays} Day remaining
            </Text>
          )}
        </View>
      </View>

      <View style={styles.buttonRow}>
        <Pressable onPress={()=>router.push("/manageSubscription")} style={styles.manageBtn}>
          <Text style={styles.manageText}>Manage</Text>
        </Pressable>

        <Pressable style={styles.renewBtn}>
          <Text style={styles.renewText}>Renew</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default mySubscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#222",
  },
  card: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  kitchen: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  mealType: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    color: "#666",
  },
  value: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
  },
  expiryWarning: {
    fontSize: 11,
    color: "#d32f2f",
    textAlign: "right",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  manageBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    borderRadius: 6,
    marginRight: 10,
    alignItems: "center",
  },
  manageText: {
    fontSize: 14,
    color: "#111",
    fontWeight: "500",
  },
  renewBtn: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  renewText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
});
