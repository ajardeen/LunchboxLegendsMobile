import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";
import { useCustomer } from "../../../context/CustomerContext";
import { useCustomerSubscriptions } from "../../../hooks/Order/useCustomerSubscriptions";


const mySubscription = () => {
  const { customerId } = useCustomer();
  const { data = [], isLoading } = useCustomerSubscriptions(customerId);
  // console.log("sub data",data);


  const getStatusStyles = (status) => {
  switch (status) {
    case "active":
      return { text: "Active", color: "#16A34A", bg: "#DCFCE7" };
    case "pending_approval":
      return { text: "Pending", color: "#EA580C", bg: "#FFEDD5" };
    case "paused":
      return { text: "Paused", color: "#2563EB", bg: "#DBEAFE" };
    case "completed":
      return { text: "Completed", color: "#4B5563", bg: "#F3F4F6" };
    case "cancelled":
      return { text: "Cancelled", color: "#DC2626", bg: "#FEE2E2" };
    default:
      return { text: status, color: "#4B5563", bg: "#F3F4F6" };
  }
};
  

  const renderItem = ({ item }) => {
    const statusConfig = getStatusStyles(item.status);
    // SAFE FALLBACKS
    const deliveries = item.deliveriesUsed || "0/0";
    const balance = item.balance ?? 0;
    const expiryDate = item.expiryDate || "--";

    // Remaining days (optional)
    const remainingDays =
      expiryDate !== "--"
        ? Math.max(
            Math.ceil(
              (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
            ),
            0
          )
        : null;

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kitchen}>{item.title || "Subscription"}</Text>
          <Text style={styles.mealType}>{item.subtitle || "Meal Plan"}</Text>
        </View>
        
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.text}
          </Text>
        </View>
      </View>
        <View style={styles.row}>
          <Text style={styles.label}>Subscription balance</Text>
          <Text style={styles.value}>₹{balance}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tiffin remaining</Text>
          <Text style={styles.value}>{deliveries}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Expiry on</Text>
          <View>
            <Text style={styles.value}>{expiryDate}</Text>
            {remainingDays !== null && remainingDays <= 3 && (
              <Text style={styles.expiryWarning}>
                {remainingDays} Day remaining
              </Text>
            )}
          </View>
        </View>
        {item.status==="pending_approval"&&
        <View style={styles.pendingRow}>
          <Text style={styles.pendingMessage}>Soon Your Order well Placed</Text>

        </View>
        }
        <View style={styles.buttonRow}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/manageSubscription",
                params: { subscriptionId: item.id },
              })
            }
            style={styles.manageBtn}
          >
            <Text style={styles.manageText}>Manage</Text>
          </Pressable>

          {/* <Pressable style={styles.renewBtn}>
            <Text style={styles.renewText}>Renew</Text>
          </Pressable> */}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading subscriptions...</Text>
      </View>
    );
  }

  if (!data.length) {
    return (
      <View style={styles.container}>
        <Text>No active subscriptions</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#fff", // Added for elevation contrast
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12, // Slightly more rounded looks modern
    padding: 16,
    marginBottom: 16,
    // Add minor shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pendingRow:{
  backgroundColor:"#ccc",
  padding:1,
  textAlign:"center",
  justifyContent:"center",
  alignItems:"center",
  borderRadius:8
  },
  pendingMessage:{
    fontSize:12
  }
});
