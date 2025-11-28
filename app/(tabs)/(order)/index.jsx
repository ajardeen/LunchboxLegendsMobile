import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const getStatusStyling = (status) => {
  switch (status) {
    case "arrive in 15min":
      return { color: "#16A34A", icon: "bicycle-outline" };
    case "Preparing":
      return { color: "#F59E0B", icon: "flame-outline" };
    case "Delivered":
      return { color: "#3B82F6", icon: "checkmark-circle-outline" };
    case "Upcoming":
      return { color: "#9CA3AF", icon: "time-outline" };
    default:
      return { color: "#4B5563", icon: "help-circle-outline" };
  }
};

// ✅ Simulated order data
const ALL_ORDERS_DATA = {
  today_orders: [
    {
      id: "#2134454",
      title: "Dal Fry + Rice Chapati",
      delivery: "Tue, Dec 3, 2025",
      status: "arrive in 15min",
      eta: "15 min",
    },
    {
      id: "#2155678",
      title: "Vada Pav & Chai",
      delivery: "Wed, Dec 4, 2025",
      status: "Preparing",
      eta: "25 min",
    },
    {
      id: "#2150000",
      title: "Smoothie Bowl",
      delivery: "Tue, Dec 3, 2025",
      status: "Delivered",
      eta: "Delivered",
    },
  ],
  upcoming_orders: [
    {
      id: "#2143432",
      title: "Biriyani",
      delivery: "Wed, Dec 4, 2025",
      status: "Upcoming",
      isDisabled: true,
      eta: "Tomorrow",
    },
  ],
};

const EmptyState = ({ message, iconName }) => (
  <View style={styles.emptyStateContainer}>
    <Ionicons name={iconName} size={48} color="#9CA3AF" />
    <Text style={styles.emptyStateText}>{message}</Text>
  </View>
);

export default function Order() {
  const router = useRouter();
  const [ordersData, setOrdersData] = useState({
    today_orders: [],
    upcoming_orders: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Simulate initial fetch
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = useCallback(() => {
    
    setIsLoading(true);
    // Simulate API fetch
    setTimeout(() => {
      setOrdersData(ALL_ORDERS_DATA);
      setIsLoading(false);
    }, 1500);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate re-fetch
    setTimeout(() => {
      
      fetchOrders();
      setOrdersData(ALL_ORDERS_DATA);
      setRefreshing(false);
    }, 1500);
  }, []);

  const todayOrders = ordersData.today_orders;
  const upcomingOrders = ordersData.upcoming_orders;

  const renderOrderCard = (item) => {
    const isOrderDisabled = item.isDisabled;
    const { color: statusColor, icon: iconName } = getStatusStyling(item.status);
    const finalArrowIcon = isOrderDisabled
      ? "lock-closed-outline"
      : "arrow-forward-circle-outline";
    const finalArrowColor = isOrderDisabled ? "#9CA3AF" : "#4B5563";

    const handlePress = () => {
      if (isOrderDisabled) return;
      router.push({
        pathname: "/orderTracker",
        params: { orderData: JSON.stringify(item) },
      });
    };

    return (
      <Pressable key={item.id} onPress={handlePress}>
        <View style={[styles.orderCard, isOrderDisabled && styles.disabledCard]}>
          <View style={styles.orderLeft}>
            <Text
              style={[styles.orderTitle, isOrderDisabled && styles.disabledText]}
            >
              Order Item
            </Text>
            <Text
              style={[
                styles.orderSubtitle,
                isOrderDisabled && styles.disabledText,
              ]}
            >
              {item.title}
            </Text>

            <Text
              style={[
                styles.deliveryLabel,
                isOrderDisabled && styles.disabledSmallText,
              ]}
            >
              Estimate Delivery
            </Text>
            <Text
              style={[styles.deliveryDate, isOrderDisabled && styles.disabledText]}
            >
              {item.delivery}
            </Text>
          </View>

          <View style={styles.orderRight}>
            <Text
              style={[styles.orderId, isOrderDisabled && styles.disabledSmallText]}
            >
              {`Order Id: ${item.id}`}
            </Text>

            <View style={styles.statusRow}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {item.status}
              </Text>
              <Ionicons
                name={iconName}
                size={16}
                color={statusColor}
                style={{ marginLeft: 4 }}
              />
            </View>

            <Ionicons
              name={finalArrowIcon}
              size={20}
              color={finalArrowColor}
              style={{ marginTop: 8, alignSelf: "flex-end" }}
            />
          </View>
        </View>
      </Pressable>
    );
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Fetching your latest orders...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#007AFF"]} />
      }
    >
      <Text style={styles.title}>Track Order</Text>

      <Text style={styles.sectionTitle}>
        {`Today's Orders (${todayOrders.length})`}
      </Text>
      {todayOrders.length > 0 ? (
        todayOrders.map(renderOrderCard)
      ) : (
        <EmptyState
          message="No deliveries scheduled for today."
          iconName="restaurant-outline"
        />
      )}

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
        {`Upcoming Orders (${upcomingOrders.length})`}
      </Text>
      {upcomingOrders.length > 0 ? (
        upcomingOrders.map(renderOrderCard)
      ) : (
        <EmptyState
          message="No future orders planned."
          iconName="calendar-outline"
        />
      )}

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  loadingText: { marginTop: 10, fontSize: 14, color: "#6B7280", fontWeight: "500" },
  title: { fontSize: 22, fontWeight: "700", color: "#000", marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#0f172a", marginBottom: 10 },
  orderCard: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#fff", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#E5E7EB", shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2, elevation: 2, marginBottom: 16 },
  disabledCard: { opacity: 0.7, backgroundColor: "#fff", borderColor: "#D1D5DB" },
  disabledText: { color: "#9CA3AF", fontWeight: "normal" },
  disabledSmallText: { color: "#BDBDBD" },
  orderLeft: { flex: 1 },
  orderTitle: { fontWeight: "700", color: "#111827", fontSize: 14 },
  orderSubtitle: { color: "#374151", fontSize: 13, marginBottom: 6 },
  deliveryLabel: { color: "#6B7280", fontSize: 12 },
  deliveryDate: { fontSize: 12, color: "#111827" },
  orderRight: { alignItems: "flex-end", justifyContent: "space-between" },
  orderId: { color: "#6B7280", fontSize: 11, marginBottom: 4 },
  statusRow: { flexDirection: "row", alignItems: "center" },
  statusText: { fontSize: 12, fontWeight: "600" },
  emptyStateContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 40, backgroundColor: "#F9FAFB", borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: "#E5E7EB" },
  emptyStateText: { marginTop: 8, fontSize: 14, color: "#6B7280", fontWeight: "500" },
});
