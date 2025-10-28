import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const orderTracker = () => {
    const router = useRouter();

  const orderSteps = [
    {
      id: 1,
      title: "Order Preparing",
      subtitle: "We are preparing your order",
      time: "11:00",
      completed: true,
    },
    {
      id: 2,
      title: "Order Dispatched",
      subtitle: "Your order is on packed",
      time: "11:30",
      completed: false,
    },
    {
      id: 3,
      title: "Ready to Pickup",
      subtitle: "Order ID : #1234454 from store",
      time: "12:15",
      completed: false,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.navigate('/order')}>
          <Ionicons name="arrow-back-outline" size={22} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>

      {/* Order Info */}
      <View style={styles.orderInfo}>
        <View>
          <Text style={styles.orderId}>Order ID : #1234454</Text>
          <Text style={styles.orderItem}>
            <Text style={styles.bold}>Order Item </Text> Dal Fry + Rice Chapati
          </Text>
        </View>
        <Text style={styles.orderDate}>Tus, Dec 3, 2018</Text>
      </View>

      {/* ETA */}
      <Text style={styles.etaText}>
        ETA : <Text style={styles.etaHighlight}>15 Min</Text>
      </Text>

      {/* Order Status Timeline */}
      <View style={styles.timeline}>
        {orderSteps.map((step, index) => (
          <View key={step.id} style={styles.stepRow}>
            <View style={styles.stepLeft}>
              <View style={styles.iconColumn}>
                <View
                  style={[
                    styles.stepCircle,
                    step.completed && styles.stepCircleCompleted,
                  ]}
                >
                  {step.completed && (
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  )}
                </View>
                {index < orderSteps.length - 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      step.completed && styles.stepLineActive,
                    ]}
                  />
                )}
              </View>
            </View>

            <View style={styles.stepContent}>
              <Text
                style={[
                  styles.stepTitle,
                  step.completed && { color: "#16A34A" },
                ]}
              >
                {step.title}
              </Text>
              <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
            </View>

            <Text style={styles.stepTime}>{step.time}</Text>
          </View>
        ))}
      </View>

      {/* Delivery Address Card */}
      <View style={styles.infoCard}>
        <View style={styles.cardRow}>
          <Ionicons name="home-outline" size={22} color="#000" />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.cardTitle}>Delivery Address</Text>
            <Text style={styles.cardText}>
              Home Work & Other address {"\n"}House No:112, 2nd Floor Sector 18,
              {"\n"}Gurugram, Haryana 122022, India , near, Next to LIC
            </Text>
          </View>
        </View>
      </View>

      {/* Rating Card */}
      <View style={styles.infoCard}>
        <View style={styles.cardRow}>
          <Ionicons name="star-outline" size={22} color="#000" />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.cardTitle}>Don’t forget to rate</Text>
            <Text style={styles.cardText}>help your fellow foodies</Text>

            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons
                  key={i}
                  name="star-outline"
                  size={20}
                  color="#9CA3AF"
                />
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default orderTracker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginLeft: 12,
  },
  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  orderId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  orderItem: {
    fontSize: 13,
    color: "#374151",
    marginTop: 4,
  },
  orderDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  bold: {
    fontWeight: "700",
  },
  etaText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
    color: "#111827",
  },
  etaHighlight: {
    color: "#16A34A",
  },
  timeline: {
    marginTop: 20,
    marginLeft: 4,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  stepLeft: {
    alignItems: "center",
    width: 24,
  },
  iconColumn: {
    alignItems: "center",
  },
  stepCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  stepCircleCompleted: {
    backgroundColor: "#16A34A",
    borderColor: "#16A34A",
  },
  stepLine: {
    height: 30,
    width: 2,
    backgroundColor: "#D1D5DB",
    marginTop: 2,
  },
  stepLineActive: {
    backgroundColor: "#16A34A",
  },
  stepContent: {
    flex: 1,
    marginLeft: 8,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  stepSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  stepTime: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 14,
    color: "#111827",
    marginBottom: 4,
  },
  cardText: {
    fontSize: 12,
    color: "#6B7280",
  },
  ratingRow: {
    flexDirection: "row",
    marginTop: 6,
  },
});
