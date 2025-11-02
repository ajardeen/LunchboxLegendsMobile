import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const OrderHistory = () => {
  const orders = [
    {
      id: "#ORD1001",
      title: "Paneer Butter Masala + Naan",
      date: "Oct 21, 2025",
      amount: "₹249",
      status: "Delivered",
    },
    {
      id: "#ORD1002",
      title: "Veg Thali Combo",
      date: "Oct 18, 2025",
      amount: "₹199",
      status: "Cancelled",
    },
    {
      id: "#ORD1003",
      title: "Dal Fry + Jeera Rice",
      date: "Oct 15, 2025",
      amount: "₹179",
      status: "Delivered",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#22C55E";
      case "Cancelled":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order History</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {orders.map((item) => (
          <Pressable key={item.id} style={styles.card}>
            <View style={styles.leftSection}>
              <Text style={styles.orderId}>{item.id}</Text>
              <Text style={styles.orderTitle}>{item.title}</Text>
              <Text style={styles.orderDate}>{item.date}</Text>
            </View>

            <View style={styles.rightSection}>
              <Text style={styles.amount}>{item.amount}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
              {/* <Ionicons
                name="chevron-forward"
                size={18}
                color="#6B7280"
                style={{ marginTop: 4 }}
              /> */}
            </View>
          </Pressable>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default OrderHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 14,
  },
  leftSection: {
    flex: 1,
  },
  orderId: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  orderTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  orderDate: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
