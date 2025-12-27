import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useCustomerOrders } from "../../../hooks/Order/useOrder";

const formatDateHeader = (isoDate) => {
  const date = new Date(isoDate);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });

  if (isToday) return `${day} ${month}, Today`;
  return `${day} ${month}, ${date.toLocaleString("default", {
    weekday: "long",
  })}`;
};

const getStatusBadge = (kitchenStatus, deliveryStatus) => {
  if (deliveryStatus === "delivered")
    return {
      text: "Delivered",
      color: "#16A34A",
      bg: "#DCFCE7",
      icon: "checkmark-circle",
    };
  if (["en_route", "picked_up", "assigned"].includes(deliveryStatus))
    return {
      text: "On the way",
      color: "#2563EB",
      bg: "#DBEAFE",
      icon: "bicycle",
    };
  if (["completed", "ready"].includes(kitchenStatus))
    return {
      text: "Food Ready",
      color: "#EA580C",
      bg: "#FFEDD5",
      icon: "restaurant",
    };

  return { text: "Preparing", color: "#EA580C", bg: "#FFEDD5", icon: "flame" };
};

export default function index() {
  const {
    data: customerOrderData,
    isLoading,
    refetch,
  } = useCustomerOrders("69282bc30a201c13d867523a");
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [groupedOrders, setGroupedOrders] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    console.log("customerOrderData", customerOrderData);

    if (customerOrderData?.data) {
      let apiOrders = customerOrderData.data;

      if (selectedDate) {
        apiOrders = apiOrders.filter(
          (o) => new Date(o.date).toDateString() === selectedDate.toDateString()
        );
      }

      // Grouping logic: Date -> Meal Type
      const grouped = apiOrders.reduce((acc, order) => {
        const dateKey = formatDateHeader(order.date);
        const mealType = order.menuName || "Other";

        if (!acc[dateKey]) acc[dateKey] = {};
        if (!acc[dateKey][mealType]) acc[dateKey][mealType] = [];

        acc[dateKey][mealType].push(order);
        return acc;
      }, {});

      setGroupedOrders(grouped);
    }
  }, [customerOrderData, selectedDate]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, []);

  const renderOrderCard = (order) => {
    const { text, color, bg, icon } = getStatusBadge(
      order.kitchenStatus,
      order.deliveryStatus
    );
    const itemString = order.items
      .map((item) => `${item.name} (${item.qty})`)
      .join(" + ");
    // Fallback for arriving time if not in API
    const arrivingTime = order.eta || "Standard Delivery Time";

    return (
      <TouchableOpacity
        key={order._id}
        style={styles.cardContainer}
        onPress={() =>
          router.push({
            pathname: "/orderTracker",
            params: { orderData: JSON.stringify(order) },
          })
        }
      >
        <View style={styles.cardMainRow}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.kitchenName}>
                {order.menuName || "Daily Meal"}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: bg }]}>
                <Ionicons name={icon} size={12} color={color} />
                <Text style={[styles.statusText, { color: color }]}>
                  {text}
                </Text>
              </View>
            </View>
            <Text style={styles.foodItemsText}>{itemString}</Text>
          </View>
          <View style={styles.arrowButton}>
            <Ionicons name="chevron-forward" size={18} color="#4B5563" />
          </View>
        </View>

        {/* Arriving Time Section based on your image_58ea1f.png */}
        <View style={styles.arrivingSection}>
          <Ionicons name="bicycle-outline" size={18} color="#6B7280" />
          <Text style={styles.arrivingText}>Arriving: {arrivingTime}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && !refreshing)
    return (
      <ActivityIndicator
        style={styles.loadingContainer}
        size="large"
        color="#007AFF"
      />
    );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>Active orders</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.iconBtn}
          >
            <Ionicons name="calendar-outline" size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/help")}
            style={styles.getHelpBtnHeader}
          >
            <Text style={styles.getHelpText}>Get help</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={(e, d) => {
            setShowDatePicker(false);
            if (d) setSelectedDate(d);
          }}
        />
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {Object.keys(groupedOrders).map((dateKey) => (
          <View key={dateKey}>
            <Text style={styles.dateHeader}>{dateKey}</Text>
            {Object.keys(groupedOrders[dateKey]).map((mealType) => (
              <View key={mealType} style={styles.mealSection}>
                {/* Meal Type Label (Breakfast, Lunch) as per image_57fd9c.png */}
                <Text style={styles.mealTypeLabel}>
                  {mealType}{" "}
                  <Text style={styles.itemCount}>
                    · {groupedOrders[dateKey][mealType].length} items
                  </Text>
                </Text>
                {groupedOrders[dateKey][mealType].map(renderOrderCard)}
              </View>
            ))}
          </View>
        ))}

        {Object.keys(groupedOrders).length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No orders found. Use the clear button to reset.
            </Text>
            {selectedDate && (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => setSelectedDate(null)}
              >
                <Text style={styles.clearBtnText}>Clear Filter</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDFDFF" },
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActions: { flexDirection: "row", alignItems: "center" },
  mainTitle: { fontSize: 22, fontWeight: "800", color: "#1A2E35" },
  getHelpBtnHeader: {
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  getHelpText: { color: "#008060", fontWeight: "600", fontSize: 13 },

  scrollContent: { paddingBottom: 40 },
  dateHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A2E35",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#F8FAFC",
  },
  mealSection: { paddingHorizontal: 16, marginBottom: 15 },
  mealTypeLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A2E35",
    marginBottom: 10,
    marginTop: 10,
  },
  itemCount: { fontWeight: "400", color: "#6B7280", fontSize: 14 },

  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
   
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 1,
  },
  cardMainRow: { flexDirection: "row", alignItems: "center", padding: 14, },
  cardContent: { flex: 1 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  kitchenName: { fontSize: 14, fontWeight: "600", color: "#64748B" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusText: { fontSize: 11, fontWeight: "700", marginLeft: 4 },
  foodItemsText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A2E35",
    lineHeight: 22,
  },
  arrowButton: { marginLeft: 10 },

  arrivingSection: {
    marginTop: 12,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f3f3ff",
  },
  arrivingText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
    marginLeft: 8,
  },

  emptyState: { alignItems: "center", marginTop: 100, padding: 20 },
  emptyText: { color: "#94A3B8", textAlign: "center", fontSize: 16 },
  clearBtn: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#008060",
    borderRadius: 8,
  },
  clearBtnText: { color: "#fff", fontWeight: "700" },
});
