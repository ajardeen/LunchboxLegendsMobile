import { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import CustomPressable from "../../../components/UI/CustomPressable";
import CustomBottomSheet from "../../../components/UI/CustomBottomSheet";
import AddressChangeSheet from "../../../components/AddressChangeSheet";
import { useBundleData } from "../../../context/BundleContext";
import { useCustomer } from "../../../context/CustomerContext";
import { useCustomerById } from "../../../hooks/Profile/useCustomerHook";
import { useCreateSubscription } from "../../../hooks/Order/useCreateSubscription";

export default function CreateSubscription() {
  const { mutateAsync: createSubscription, isPending } =
    useCreateSubscription();
  const router = useRouter();
  const { bundleId } = useLocalSearchParams();
  const { getBundleById } = useBundleData();
  const { customerId } = useCustomer();

  const bundle = getBundleById(bundleId);

  const addressSheetRef = useRef(null);

  const { data: customerData } = useCustomerById(customerId);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [deliveryInstruction, setDeliveryInstruction] = useState(
    "Leave outside the door"
  );
  const [reminder, setReminder] = useState("2 days before");
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);

  useEffect(() => {
    if (customerData?.customer?.deliveryAddress?.length) {
      const defaultAddr = customerData.customer.deliveryAddress.find(
        (a) => a.isDefault
      );
      if (defaultAddr) setSelectedAddress(defaultAddr);
    }
  }, [customerData]);

  if (!bundle) {
    return (
      <View style={styles.center}>
        <Text>Bundle not found</Text>
      </View>
    );
  }

  const totalAmount = useMemo(
    () => bundle.price * quantity,
    [bundle.price, quantity]
  );

const handleCreateSubscription = async () => {
  if (!selectedAddress) {
    alert("Please select delivery address");
    return;
  }

  const payload = {
    customerId,
    bundleId: bundle.id,

    // Always send ISO date (backend-safe)
    startDate: new Date().toISOString(),
 // ✅ REQUIRED: deliveryId
    deliveryId: selectedAddress._id,
    defaultAddress: {
      text: `${selectedAddress.street1}, ${selectedAddress.city}`,
      coordinates: selectedAddress.coordinates || {
        lat: selectedAddress.lat,
        lng: selectedAddress.lng,
      },
    },

    deliveryInstruction,

    // "2 days before" → 2
    reminderBeforeEndDays: Number(reminder?.match(/\d+/)?.[0] || 2),

    whatsappUpdates,
  };

  try {
    await createSubscription(payload);
    router.push("/paymentSuccessScreen");
  } catch (err) {
    console.log("Create subscription failed", err?.message);
  }
};


  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Create subscription" }} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Bundle summary */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.itemTitle}>{bundle.name}</Text>
            <Text style={styles.price}>₹ {bundle.price}</Text>
          </View>
          <Text style={styles.subText}>{bundle.description}</Text>
        </View>

        {/* Quantity */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Select quantity</Text>
          <View style={styles.qtyRow}>
            <Pressable
              onPress={() => quantity > 1 && setQuantity(quantity - 1)}
              style={styles.qtyBtn}
            >
              <Text>−</Text>
            </Pressable>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <Pressable
              onPress={() => setQuantity(quantity + 1)}
              style={styles.qtyBtn}
            >
              <Text>+</Text>
            </Pressable>
          </View>
        </View>

        {/* Meal */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Meal</Text>
          <View style={styles.deliveryRow}>
            <View style={[styles.deliveryBox, styles.deliveryActive]}>
              <Text>
                {bundle.bundleMealType.charAt(0).toUpperCase() +
                  bundle.bundleMealType.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Deliveries */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Select no. of Meal deliveries</Text>
          <View style={styles.deliveryRow}>
            <View style={[styles.deliveryBox, styles.deliveryActive]}>
              <Text>{bundle.totalMealsCount} Days</Text>
            </View>
          </View>
        </View>

        {/* Delivery instruction */}
        {/* <Pressable style={styles.listRow}>
          <Text>Delivery instructions</Text>
          <Text style={styles.subText}>{deliveryInstruction}</Text>
        </Pressable> */}

        {/* Reminder */}
        {/* <Pressable style={styles.listRow}>
          <Text>Remind before subscription ends</Text>
          <Text style={styles.subText}>{reminder}</Text>
        </Pressable> */}

        {/* WhatsApp */}
        {/* <View style={styles.switchRow}>
          <Text>Send daily menu updates on WhatsApp</Text>
          <Switch value={whatsappUpdates} onValueChange={setWhatsappUpdates} />
        </View> */}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Address */}
        <Pressable
          style={styles.addressRow}
          onPress={() => addressSheetRef.current?.open()}
        >
          <Ionicons name="location-outline" color={"red"} size={20} />
          <View style={{ flex: 1 }}>
            <Text style={styles.addressText}>Delivery Address</Text>
            {selectedAddress ? (
              <>
                <Text style={styles.addressText}>{selectedAddress.label}</Text>
                <Text style={styles.addressSub}>
                  {selectedAddress.street1}, {selectedAddress.city}
                </Text>
              </>
            ) : (
              <Text>Select delivery address</Text>
            )}
          </View>
          <Text style={styles.changeText}>Change</Text>
        </Pressable>

        <View style={styles.paymentFooter}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.total}>₹ {totalAmount}</Text>
          </View>
          <CustomPressable
            style={[styles.payBtn, isPending && styles.payBtnDisabled]}
            onPress={handleCreateSubscription}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payText}>Proceed to pay</Text>
            )}
          </CustomPressable>
        </View>
      </View>

      {/* Address Bottom Sheet */}
      <CustomBottomSheet
        ref={addressSheetRef}
        title="Change Delivery Address"
        snapPoints={["40%", "70%"]}
        initialIndex={-1}
      >
        <AddressChangeSheet
          addresses={customerData?.customer?.deliveryAddress || []}
          selectedAddressId={selectedAddress?._id}
          onSelectAddress={(id) => {
            const addr = customerData.customer.deliveryAddress.find(
              (a) => a._id === id
            );
            setSelectedAddress(addr);
            addressSheetRef.current?.close();
          }}
          onClose={() => addressSheetRef.current?.close()}
          router={router}
        />
      </CustomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    backgroundColor: "#fff",
  },

  headerTitle: { fontSize: 16, fontWeight: "600" },

  content: { padding: 16, paddingBottom: 120 },

  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    paddingVertical: 15,
    // borderRadius: 12,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  addressText: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  changeText: { color: "#004346", fontWeight: "600", fontSize: 12 },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  itemTitle: { fontSize: 15, fontWeight: "600" },
  price: { fontSize: 15, fontWeight: "600" },
  subText: { fontSize: 12, color: "#6B7280", marginTop: 4 },

  sectionTitle: { fontSize: 14, fontWeight: "600", marginBottom: 10 },

  qtyRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyValue: { fontSize: 14, fontWeight: "600" },

  mealRow: { flexDirection: "row", gap: 20 },
  mealOption: { flexDirection: "row", alignItems: "center", gap: 6 },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: "#004346" },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#004346",
  },

  deliveryRow: { flexDirection: "row", gap: 10 },
  deliveryBox: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    
  },
  deliveryActive: {
    borderColor: "#004346",
    backgroundColor: "#ECFDF5",
  },

  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
  },

  footer: {
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentFooter: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  totalLabel: { fontSize: 12, color: "#6B7280" },
  total: { fontSize: 18, fontWeight: "700" },

  payBtn: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  payBtnDisabled: {
    opacity: 0.7,
  },
  payText: { color: "#fff", fontWeight: "600" },
});
