import React, { useRef, useState } from "react";
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

export default function orderTracker() {
  const { orderData } = useLocalSearchParams();
  const order = JSON.parse(orderData);
  console.log("order parse",order);
  

  const bottomSheetRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  // ✅ handle confirm
  const handleConfirmRating = () => {
    console.log("⭐ Rating:", rating);
    console.log("📝 Feedback:", feedback);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Order Info */}
        <View style={styles.orderInfo}>
          <View>
            <Text style={styles.orderId}>Order ID : {order.id}</Text>
            <Text style={styles.orderItem}>
              <Text style={styles.bold}>Order Item </Text> {order.title}
            </Text>
          </View>
          <Text style={styles.orderDate}>{order.delivery}</Text>
        </View>

        {/* ETA */}
        <Text style={styles.etaText}>
          ETA : <Text style={styles.etaHighlight}>{order.eta}</Text>
        </Text>

        {/* Order Status Timeline */}
        <View style={styles.timeline}>
            {order.orderSteps.map((step, index) => (
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
                    {index < order.orderSteps.length - 1 && (
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
                Home, 112, 2nd Floor, Sector 18,
                {"\n"}Gurugram, Haryana 122022
              </Text>
            </View>
          </View>
        </View>

        {/* Rating Card */}
        <Pressable
          style={styles.infoCard}
          onPress={() => bottomSheetRef.current?.open()}
        >
          <View style={styles.cardRow}>
            <Ionicons name="star-outline" size={22} color="#000" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.cardTitle}>Don’t forget to rate</Text>
              <Text style={styles.cardText}>Help your fellow foodies</Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons
                    key={i}
                    name={i <= rating ? "star" : "star-outline"}
                    size={20}
                    color={i <= rating ? "#FACC15" : "#9CA3AF"}
                  />
                ))}
              </View>
            </View>
          </View>
        </Pressable>
      </ScrollView>

      {/* ⭐ Rating Bottom Sheet */}
      <CustomBottomSheet ref={bottomSheetRef} snapPoints={["50%"]}>
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Rate Your Order</Text>

          {/* Rating Stars */}
          <View style={styles.sheetStars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Pressable key={i} onPress={() => setRating(i)}>
                <Ionicons
                  name={i <= rating ? "star" : "star-outline"}
                  size={28}
                  color={i <= rating ? "#FACC15" : "#9CA3AF"}
                />
              </Pressable>
            ))}
          </View>

          {/* Feedback Box */}
          <TextInput
            style={styles.feedbackBox}
            placeholder="Write your feedback..."
            multiline
            value={feedback}
            onChangeText={setFeedback}
          />

          {/* Confirm Button */}
          <Pressable style={styles.confirmButton} onPress={handleConfirmRating}>
            <Text style={styles.confirmText}>Confirm</Text>
          </Pressable>
        </View>
      </CustomBottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  orderId: { fontSize: 14, fontWeight: "600", color: "#111827" },
  orderItem: { fontSize: 13, color: "#374151", marginTop: 4 },
  orderDate: { fontSize: 12, color: "#6B7280" },
  bold: { fontWeight: "700" },
  etaText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
    color: "#111827",
  },
  etaHighlight: { color: "#16A34A" },
  timeline: { marginTop: 20, marginLeft: 4 },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 0,
  },
  stepLeft: { alignItems: "center", width: 24 },
  iconColumn: { alignItems: "center" },
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
  stepCircleCompleted: { backgroundColor: "#16A34A", borderColor: "#16A34A" },
  stepLine: {
    height: 30,
    width: 2,
    backgroundColor: "#D1D5DB",
    marginTop: 2,
  },
  stepLineActive: { backgroundColor: "#16A34A" },
  stepContent: { flex: 1, marginLeft: 8 },
  stepTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
  stepSubtitle: { fontSize: 12, color: "#6B7280" },
  stepTime: { fontSize: 12, color: "#6B7280", marginLeft: 8 },
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
  cardRow: { flexDirection: "row", alignItems: "flex-start" },
  cardTitle: {
    fontWeight: "700",
    fontSize: 14,
    color: "#111827",
    marginBottom: 4,
  },
  cardText: { fontSize: 12, color: "#6B7280" },
  ratingRow: { flexDirection: "row", marginTop: 6,width:"100%" },
  sheetContent: { padding: 10,width:"100%"  },
  sheetTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16,textAlign:"center" },
  sheetStars: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  feedbackBox: {
    height: 100,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
    fontSize: 14,
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
