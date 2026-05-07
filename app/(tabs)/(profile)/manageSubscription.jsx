import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router"; // To get the subscriptionId
import CustomBottomSheet from "../../../components/UI/CustomBottomSheet";
import RechargeSheet from "../../../components/RechargeSheet";
import PauseSheet from "../../../components/PauseSheet";
import { useSubscriptionById } from "../../../hooks/Order/useCustomerSubscriptions";
import { useCustomer } from "../../../context/CustomerContext"; // Assuming this is where you get customerId

const ManageSubscription = () => {
  // 1. Get dynamic IDs
  const { subscriptionId } = useLocalSearchParams();
  const { customerId } = useCustomer();
  console.log("subscriptionId",subscriptionId);
  console.log("customerId",customerId);
  

  // 2. Fetch dynamic data
  const { data: sub, isLoading } = useSubscriptionById(
    subscriptionId,
    customerId,
  );
  console.log("sub mag",sub);
  

  const rechargeRef = useRef(null);
  const pauseRef = useRef(null);

  // 3. Loading State
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // 4. Error/Null State
  if (!sub) {
    return (
      <View style={styles.container}>
        <Text>Subscription not found.</Text>
      </View>
    );
  }

  // Feature Toggle for Showcase (Set to true to disable buttons)
  const isShowcaseMode = true;

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
            disabled={isShowcaseMode} // Disabled for showcase
            style={[styles.pauseBtn, isShowcaseMode && styles.disabledBtn]}
            onPress={() => pauseRef.current?.open()}
          >
            <Ionicons name="pause" size={16} />
            <Text style={styles.pauseText}>Pause</Text>
          </Pressable>

          <Pressable
            disabled={isShowcaseMode} // Disabled for showcase
            style={[styles.rechargeBtn, isShowcaseMode && styles.disabledBtn]}
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

      {/* Disabled for showcase */}
      <Pressable
        disabled={isShowcaseMode}
        style={[styles.optionDanger, isShowcaseMode && { opacity: 0.5 }]}
      >
        <Ionicons name="close-circle-outline" size={18} color="#d32f2f" />
        <Text style={styles.dangerText}>
          Cancel subscription & refund balance
        </Text>
      </Pressable>

      {/* Bottom Sheets (Only open if not in showcase mode) */}
      {!isShowcaseMode && (
        <>
          <CustomBottomSheet ref={pauseRef} title="Select date">
            <PauseSheet onClose={() => pauseRef.current?.close()} />
          </CustomBottomSheet>

          <CustomBottomSheet ref={rechargeRef} title="Recharge">
            <RechargeSheet onClose={() => rechargeRef.current?.close()} />
          </CustomBottomSheet>
        </>
      )}
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
  disabledBtn: {
    opacity: 0.5,
    backgroundColor: "#ccc",
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
