import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function Order() {
  const todayOrders = [
    {
      id: "#2134454",
      title: "Dal Fry + Rice Chapati",
      delivery: "Tue, Dec 3, 2018",
      status: "arrive in 15min",
      statusColor: "#16A34A",
      icon: "bicycle-outline",
    },
  ];

  const upcomingOrders = [
    {
      id: "#2143432",
      title: "Biriyani",
      delivery: "Tue, Dec 3, 2018",
      status: "Upcoming",
      statusColor: "#9CA3AF",
      icon: "bicycle-outline",
    },
  ];

  const renderOrderCard = (item) => (
    <Link
      key={item.id}
      href={{
        pathname: "/orderTracker",
        params: {
          id: item.id,
          title: item.title,
          delivery: item.delivery,
          status: item.status,
        },
      }}
      asChild
    >
      <Pressable style={styles.orderCard}>
        <View style={styles.orderLeft}>
          <Text style={styles.orderTitle}>Order Item</Text>
          <Text style={styles.orderSubtitle}>{item.title}</Text>

          <Text style={styles.deliveryLabel}>Estimate Delivery</Text>
          <Text style={styles.deliveryDate}>{item.delivery}</Text>
        </View>

        <View style={styles.orderRight}>
          <Text style={styles.orderId}>Order Id: {item.id}</Text>

          <View style={styles.statusRow}>
            <Text style={[styles.statusText, { color: item.statusColor }]}>
              {item.status}
            </Text>
            <Ionicons
              name={item.icon}
              size={16}
              color={item.statusColor}
              style={{ marginLeft: 4 }}
            />
          </View>

          <Ionicons
            name="arrow-forward-circle-outline"
            size={20}
            color="#4B5563"
            style={{ marginTop: 8, alignSelf: "flex-end" }}
          />
        </View>
      </Pressable>
    </Link>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Track Order</Text>

      {/* Today's Orders */}
      <Text style={styles.sectionTitle}>
        Today's Order ({todayOrders.length})
      </Text>
      {todayOrders.map(renderOrderCard)}

      {/* Upcoming Orders */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
        Upcoming Orders
      </Text>
      {upcomingOrders.map(renderOrderCard)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 10,
  },
  orderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  orderLeft: {
    flex: 1,
  },
  orderTitle: {
    fontWeight: "700",
    color: "#111827",
    fontSize: 14,
  },
  orderSubtitle: {
    color: "#374151",
    fontSize: 13,
    marginBottom: 6,
  },
  deliveryLabel: {
    color: "#6B7280",
    fontSize: 12,
  },
  deliveryDate: {
    fontSize: 12,
    color: "#111827",
  },
  orderRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  orderId: {
    color: "#6B7280",
    fontSize: 11,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
