import React, { useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import CustomBottomSheet from "../../../components/UI/CustomBottomSheet";

// --- Helper Logic for Timeline ---
const getStepTime = (logs, targetStatuses) => {
  if (!logs || !Array.isArray(logs)) return "";
  // Find the LAST log that matches one of the target statuses
  const log = logs
    .slice()
    .reverse()
    .find((l) => targetStatuses.includes(l.status));
  
  if (!log) return "";
  return new Date(log.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const mapOrderToTimeline = (order) => {
  const kStatus = order.kitchenStatus;
  const dStatus = order.deliveryStatus;
  const logs = order.logs || [];

  // Step 1: Placed
  const placed = {
    id: 1,
    title: "Order Placed",
    subtitle: "We have received your order",
    time: getStepTime(logs, ['scheduled']),
    completed: true, // Always true if order exists
  };

  // Step 2: Preparing
  const isPrep = ['preparing', 'ready', 'completed'].includes(kStatus);
  const isPrepDone = kStatus === 'completed' || kStatus === 'ready' || dStatus !== 'pending';
  
  const preparing = {
    id: 2,
    title: "Preparing",
    subtitle: isPrepDone ? "Food is ready" : "Chef is cooking your meal",
    time: getStepTime(logs, ['preparing', 'ready', 'completed']),
    completed: isPrepDone,
    active: isPrep && !isPrepDone
  };

  // Step 3: Out for Delivery
  // Statuses: ready_for_pickup -> assigned -> picked_up -> en_route
  const isEnRoute = ['assigned', 'picked_up', 'en_route', 'delivered'].includes(dStatus);
  const isEnRouteDone = dStatus === 'delivered';

  const outForDelivery = {
    id: 3,
    title: "Out for Delivery",
    subtitle: isEnRouteDone ? "Arrived at location" : "Rider is on the way",
    time: getStepTime(logs, ['picked_up', 'en_route', 'assigned']),
    completed: isEnRouteDone,
    active: isEnRoute && !isEnRouteDone
  };

  // Step 4: Delivered
  const delivered = {
    id: 4,
    title: "Delivered",
    subtitle: "Enjoy your meal!",
    time: getStepTime(logs, ['delivered']),
    completed: dStatus === 'delivered',
  };

  return [placed, preparing, outForDelivery, delivered];
};

export default function OrderTracker() {
  const { orderData } = useLocalSearchParams();
  const order = JSON.parse(orderData || "{}");
  
  // Generate Timeline Steps
  const orderSteps = useMemo(() => mapOrderToTimeline(order), [order]);

  // UI Helpers
  const itemTitle = order.items?.map(i => `${i.name} x${i.qty}`).join(", ");
  const formattedDate = new Date(order.date).toDateString();
  const isDelivered = order.deliveryStatus === 'delivered';

  const bottomSheetRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleConfirmRating = () => {
    // API Call to submit rating here
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Order Info Header */}
        <View style={styles.headerSection}>
          <View style={styles.headerRow}>
             <View style={{flex: 1}}>
                <Text style={styles.orderIdLabel}>Order ID: #{order._id?.slice(-6).toUpperCase()}</Text>
                <Text style={styles.menuName}>{order.menuName || "Lunch Menu"}</Text>
                <Text style={styles.itemsText}>{itemTitle}</Text>
             </View>
             <View style={styles.dateBadge}>
                <Text style={styles.dateText}>{new Date(order.date).getDate()}</Text>
                <Text style={styles.monthText}>{new Date(order.date).toLocaleString('default', { month: 'short' })}</Text>
             </View>
          </View>
        </View>

        {/* Status Timeline */}
        <View style={styles.timelineContainer}>
           <Text style={styles.sectionHeader}>Order Status</Text>
           <View style={styles.timeline}>
            {orderSteps.map((step, index) => (
              <View key={step.id} style={styles.stepRow}>
                {/* Left Side: Time */}
                <View style={styles.timeLeft}>
                    <Text style={styles.timeText}>{step.time}</Text>
                </View>

                {/* Middle: Line & Dot */}
                <View style={styles.stepVisual}>
                  <View style={[styles.stepLine, index === 0 && { marginTop: 10 }]} /> 
                  <View
                    style={[
                      styles.stepCircle,
                      step.completed && styles.stepCircleCompleted,
                      step.active && styles.stepCircleActive
                    ]}
                  >
                    {step.completed && <Ionicons name="checkmark" size={10} color="#fff" />}
                  </View>
                  {index < orderSteps.length - 1 && (
                    <View style={[styles.stepConnector, (step.completed) && styles.stepConnectorActive]} />
                  )}
                </View>

                {/* Right: Content */}
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, step.completed && styles.textCompleted]}>
                    {step.title}
                  </Text>
                  <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Address Card */}
        <View style={styles.infoCard}>
           <View style={styles.cardHeaderRow}>
              <Ionicons name="location-sharp" size={20} color="#EF4444" />
              <Text style={styles.cardTitle}>Delivery Address</Text>
           </View>
           <Text style={styles.cardBody}>
             Block A, Industrial Estate,
             {"\n"}Sector 62, Noida, 201309
           </Text>
        </View>

        {/* Rating Section (Only show if delivered) */}
        {isDelivered && (
            <Pressable
            style={styles.ratingCard}
            onPress={() => bottomSheetRef.current?.open()}
            >
            <View style={styles.ratingContent}>
                <View>
                    <Text style={styles.ratingTitle}>Rate your meal</Text>
                    <Text style={styles.ratingSub}>Help us improve</Text>
                </View>
                <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Ionicons key={i} name={i <= rating ? "star" : "star-outline"} size={22} color={i <= rating ? "#FACC15" : "#D1D5DB"} />
                    ))}
                </View>
            </View>
            </Pressable>
        )}
        
        <View style={{height: 50}} />
      </ScrollView>

      {/* Bottom Sheet */}
      <CustomBottomSheet ref={bottomSheetRef} snapPoints={["50%"]}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>How was your food?</Text>
          <View style={styles.sheetStars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Pressable key={i} onPress={() => setRating(i)}>
                <Ionicons name={i <= rating ? "star" : "star-outline"} size={32} color={i <= rating ? "#FACC15" : "#D1D5DB"} />
              </Pressable>
            ))}
          </View>
          <TextInput
            style={styles.feedbackBox}
            placeholder="Tell us what you liked..."
            multiline
            value={feedback}
            onChangeText={setFeedback}
          />
          <Pressable style={styles.confirmButton} onPress={handleConfirmRating}>
            <Text style={styles.confirmText}>Submit Review</Text>
          </Pressable>
        </View>
      </CustomBottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  
  // Header
  headerSection: { backgroundColor: "#fff", padding: 20, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderIdLabel: { fontSize: 12, color: "#6B7280", marginBottom: 4, fontWeight: '600' },
  menuName: { fontSize: 20, fontWeight: "700", color: "#111827", marginBottom: 4 },
  itemsText: { fontSize: 14, color: "#4B5563" },
  dateBadge: { alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 8, padding: 8, minWidth: 50 },
  dateText: { fontSize: 18, fontWeight: '700', color: '#111827' },
  monthText: { fontSize: 10, color: '#6B7280', textTransform: 'uppercase' },

  // Timeline
  timelineContainer: { marginTop: 16, backgroundColor: '#fff', padding: 20, borderRadius: 0, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5E7EB' },
  sectionHeader: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 20 },
  timeline: { paddingLeft: 0 },
  stepRow: { flexDirection: "row", marginBottom: 0, height: 70 }, // Fixed height for alignment
  
  timeLeft: { width: 60, alignItems: 'flex-end', marginRight: 10, paddingTop: 2 },
  timeText: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },

  stepVisual: { alignItems: "center", width: 20, position: 'relative' },
  stepCircle: { width: 16, height: 16, borderRadius: 8, backgroundColor: "#E5E7EB", justifyContent: "center", alignItems: "center", zIndex: 2 },
  stepCircleCompleted: { backgroundColor: "#16A34A" },
  stepCircleActive: { backgroundColor: "#fff", borderWidth: 4, borderColor: "#2563EB", width: 18, height: 18 },
  stepConnector: { width: 2, position: 'absolute', top: 16, bottom: -10, backgroundColor: '#E5E7EB', zIndex: 1 },
  stepConnectorActive: { backgroundColor: '#16A34A' },

  stepContent: { flex: 1, marginLeft: 12 },
  stepTitle: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  textCompleted: { color: "#111827" },
  stepSubtitle: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },

  // Cards
  infoCard: { backgroundColor: "#fff", padding: 20, marginTop: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5E7EB' },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontWeight: "700", fontSize: 14, color: "#111827", marginLeft: 8 },
  cardBody: { fontSize: 14, color: "#4B5563", lineHeight: 20, marginLeft: 28 },

  ratingCard: { backgroundColor: "#fff", padding: 20, marginTop: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5E7EB' },
  ratingContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  ratingSub: { fontSize: 12, color: '#6B7280' },
  starsRow: { flexDirection: 'row', gap: 2 },

  // Bottom Sheet
  sheetContent: { padding: 20 },
  sheetTitle: { fontSize: 18, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  sheetStars: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 20 },
  feedbackBox: { height: 100, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 12, textAlignVertical: "top", fontSize: 14, marginBottom: 20, backgroundColor: '#F9FAFB' },
  confirmButton: { backgroundColor: "#16A34A", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  confirmText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});