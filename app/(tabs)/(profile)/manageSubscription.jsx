import React, { useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomBottomSheet from "../../../components/UI/CustomBottomSheet";
import RechargeSheet from "../../../components/RechargeSheet";
import PauseSheet from "../../../components/PauseSheet";

const SUBSCRIPTION_DETAIL = {
  id: "sub_1",
  title: "Lunch Box",
  subtitle: "Lunch · Halka fulka thali",
  deliveriesUsed: "22/30",
  balance: 1220,
  expiryDate: "02 Oct 2020",
  reminder: "2 Days before",
  deliveryInstruction: "Hand it to me",
};

const ManageSubscription = () => {
  const rechargeRef = useRef(null);
  const pauseRef = useRef(null);
  const sub = SUBSCRIPTION_DETAIL;

  return (
    <View style={styles.container}>
      {/* Subscription Card */}
      <View style={styles.card}>
        <Text style={styles.title}>{sub.title}</Text>
        <Text style={styles.subtitle}>{sub.subtitle}</Text>

        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statValue}>{sub.deliveriesUsed}</Text>
            <Text style={styles.statLabel}>Deliveries left</Text>
          </View>

          <View>
            <Text style={styles.statValue}>₹ {sub.balance}</Text>
            <Text style={styles.statLabel}>Subscription balance</Text>
          </View>

          <View>
            <Text style={styles.statValue}>{sub.expiryDate}</Text>
            <Text style={styles.statLabel}>Expiring on</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            style={styles.pauseBtn}
            onPress={() => pauseRef.current?.open()}
          >
            <Ionicons name="pause" size={16} />
            <Text style={styles.pauseText}>Pause</Text>
          </Pressable>

          <Pressable
            style={styles.rechargeBtn}
            onPress={() => rechargeRef.current?.open()}
          >
            <Text style={styles.rechargeText}>Recharge</Text>
          </Pressable>
        </View>
      </View>

      {/* Options */}
      <View style={styles.option}>
        <Ionicons name="document-text-outline" size={18} />
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>Delivery instructions</Text>
          <Text style={styles.optionSub}>{sub.deliveryInstruction}</Text>
        </View>
      </View>

      <View style={styles.option}>
        <Ionicons name="notifications-outline" size={18} />
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>
            Remind me before subscription ends
          </Text>
          <Text style={styles.optionSub}>{sub.reminder}</Text>
        </View>
      </View>

      <View style={styles.optionDanger}>
        <Ionicons name="close-circle-outline" size={18} color="#d32f2f" />
        <Text style={styles.dangerText}>
          Cancel subscription & refund balance
        </Text>
      </View>
      {/* Pause Bottom Sheet */}
      <CustomBottomSheet ref={pauseRef} title="Select date">
        <PauseSheet onClose={() => pauseRef.current?.close()} />
      </CustomBottomSheet>

      {/* Recharge Bottom Sheet */}
      <CustomBottomSheet ref={rechargeRef} title="Recharge">
        <RechargeSheet onClose={() => rechargeRef.current?.close()} />
      </CustomBottomSheet>
    </View>
  );
};

export default ManageSubscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },

  card: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  statLabel: {
    fontSize: 11,
    color: "#777",
    textAlign: "center",
  },

  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  pauseBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  pauseText: {
    fontWeight: "500",
  },
  rechargeBtn: {
    flex: 1,
    backgroundColor: "#22c55e",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  rechargeText: {
    color: "#fff",
    fontWeight: "600",
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  optionText: {
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  optionSub: {
    fontSize: 12,
    color: "#777",
  },

  optionDanger: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  dangerText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#d32f2f",
    fontWeight: "500",
  },
});
