import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
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

// ✅ All Orders JSON with orderSteps added
const ALL_ORDERS_DATA = {
  today_orders: [
    {
      id: "#2134454",
      title: "Dal Fry + Rice Chapati",
      delivery: "Tue, Dec 3, 2025",
      status: "arrive in 15min",
      eta: "15 min",
      orderSteps: [
        {
          id: 1,
          title: "Order Confirmed",
          subtitle: "We’ve received your order",
          time: "5:00 PM",
          completed: true,
        },
        {
          id: 2,
          title: "Preparing your meal",
          subtitle: "The chef started cooking",
          time: "5:10 PM",
          completed: true,
        },
        {
          id: 3,
          title: "Out for Delivery",
          subtitle: "Your food is on the way",
          time: "5:30 PM",
          completed: false,
        },
        {
          id: 4,
          title: "Delivered",
          subtitle: "Enjoy your meal!",
          time: "--",
          completed: false,
        },
      ],
    },
    {
      id: "#2155678",
      title: "Vada Pav & Chai",
      delivery: "Wed, Dec 4, 2025",
      status: "Preparing",
      eta: "25 min",
      orderSteps: [
        {
          id: 1,
          title: "Order Confirmed",
          subtitle: "We’ve received your order",
          time: "3:45 PM",
          completed: true,
        },
        {
          id: 2,
          title: "Preparing your meal",
          subtitle: "Your food is being cooked",
          time: "3:55 PM",
          completed: false,
        },
        {
          id: 3,
          title: "Out for Delivery",
          subtitle: "Your food will be dispatched soon",
          time: "--",
          completed: false,
        },
        {
          id: 4,
          title: "Delivered",
          subtitle: "Enjoy your meal!",
          time: "--",
          completed: false,
        },
      ],
    },
    {
      id: "#2150000",
      title: "Smoothie Bowl",
      delivery: "Tue, Dec 3, 2025",
      status: "Delivered",
      eta: "Delivered",
      orderSteps: [
        {
          id: 1,
          title: "Order Confirmed",
          subtitle: "We’ve received your order",
          time: "9:00 AM",
          completed: true,
        },
        {
          id: 2,
          title: "Preparing your meal",
          subtitle: "Blending your smoothie",
          time: "9:05 AM",
          completed: true,
        },
        {
          id: 3,
          title: "Out for Delivery",
          subtitle: "Your smoothie is on the way",
          time: "9:20 AM",
          completed: true,
        },
        {
          id: 4,
          title: "Delivered",
          subtitle: "Enjoy your healthy treat!",
          time: "9:35 AM",
          completed: true,
        },
      ],
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
      orderSteps: [
        {
          id: 1,
          title: "Order Confirmed",
          subtitle: "Your order is scheduled for tomorrow",
          time: "--",
          completed: false,
        },
        {
          id: 2,
          title: "Preparing your meal",
          subtitle: "Cooking will start tomorrow",
          time: "--",
          completed: false,
        },
        {
          id: 3,
          title: "Out for Delivery",
          subtitle: "Delivery expected tomorrow evening",
          time: "--",
          completed: false,
        },
        {
          id: 4,
          title: "Delivered",
          subtitle: "Order will be delivered soon",
          time: "--",
          completed: false,
        },
      ],
      details: {
        items: [
          { name: "Chicken Biriyani (Large)", quantity: 1, notes: "Extra spicy" },
          { name: "Raita", quantity: 1, notes: "No onions" },
        ],
        deliveryInstruction: "Call when arrive, apartment 4B. Use back gate.",
        totalAmount: 45.99,
      },
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

  // ✅ Simulate data fetch
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setOrdersData(ALL_ORDERS_DATA);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
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
      console.log("📦 Sending Order Data →", item);
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

            {item.details && (
              <View style={styles.detailIndicator}>
                <Ionicons name="document-text-outline" size={12} color="#4F46E5" />
                <Text style={styles.detailText}>Details attached</Text>
              </View>
            )}
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Fetching your latest orders...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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
  detailIndicator: { flexDirection: "row", alignItems: "center", marginTop: 8, paddingHorizontal: 6, paddingVertical: 3, backgroundColor: "#EEF2FF", borderRadius: 6, alignSelf: "flex-start" },
  detailText: { fontSize: 10, fontWeight: "700", color: "#4F46E5", marginLeft: 4 },
  orderRight: { alignItems: "flex-end", justifyContent: "space-between" },
  orderId: { color: "#6B7280", fontSize: 11, marginBottom: 4 },
  statusRow: { flexDirection: "row", alignItems: "center" },
  statusText: { fontSize: 12, fontWeight: "600" },
  emptyStateContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 40, backgroundColor: "#F9FAFB", borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: "#E5E7EB" },
  emptyStateText: { marginTop: 8, fontSize: 14, color: "#6B7280", fontWeight: "500" },
});
