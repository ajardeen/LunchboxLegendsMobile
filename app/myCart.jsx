import { useState, useMemo } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import CustomPressable from "../components/UI/CustomPressable";
import { useRouter } from "expo-router";

const myCart = () => {
  const router = useRouter();

  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Cheese Hot Hamburger", price: 189.99, quantity: 2 },
    { id: 2, name: "Italian Hot Pizza", price: 139.99, quantity: 2 },
  ]);

  const [selectedAddress, setSelectedAddress] = useState("home");
  const [paymentMethod, setPaymentMethod] = useState("gpay");

  const taxes = 100.0;
  const delivery = 50.0;

  // calculate totals
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );
  const total = subtotal + taxes + delivery;

  const updateQuantity = (id, type) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === "inc"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addresses = [
    {
      id: "home",
      title: "Home",
      phone: "+91 888 888 8888",
      address: "1749 Chaudhray Dhaba Delhi",
    },
    {
      id: "office",
      title: "Office",
      phone: "(0261) 555-0115",
      address: "2588 Ratan lal sahdev marg",
    },
  ];

  const paymentOptions = [
    { id: "gpay", title: "Google Pay" },
    { id: "paytm", title: "Paytm" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 220 }}>
        <Text style={styles.title}>My Cart</Text>

        {/* Cart Items */}
        {cartItems.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
            </View>

            <View style={styles.quantityContainer}>
              <Pressable
                onPress={() => updateQuantity(item.id, "dec")}
                style={styles.qtyButton}
              >
                <Text style={styles.qtyText}>−</Text>
              </Pressable>
              <Text style={styles.qtyNumber}>{item.quantity}</Text>
              <Pressable
                onPress={() => updateQuantity(item.id, "inc")}
                style={styles.qtyButton}
              >
                <Text style={styles.qtyText}>+</Text>
              </Pressable>
            </View>

            <Pressable onPress={() => removeItem(item.id)}>
              <Text style={styles.remove}>×</Text>
            </Pressable>
          </View>
        ))}

        <Text style={styles.addMore}>+ Add more items</Text>

        {/* Delivery Section */}
        <Text style={styles.sectionTitle}>Delivery to</Text>
        {addresses.map((addr) => (
          <Pressable
            key={addr.id}
            style={[
              styles.addressCard,
              selectedAddress === addr.id && styles.activeCard,
            ]}
            onPress={() => setSelectedAddress(addr.id)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.radioWrapper}>
                <View style={styles.radioOuter}>
                  {selectedAddress === addr.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.addressTitle}>{addr.title}</Text>
              </View>
            </View>
            <Text style={styles.addressPhone}>{addr.phone}</Text>
            <Text style={styles.addressText}>{addr.address}</Text>
          </Pressable>
        ))}

        {/* Payment Section */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        {paymentOptions.map((method) => (
          <Pressable
            key={method.id}
            style={styles.paymentRow}
            onPress={() => setPaymentMethod(method.id)}
          >
            <Text style={styles.paymentText}>{method.title}</Text>
            <View style={styles.radioOuter}>
              {paymentMethod === method.id && (
                <View style={styles.radioInner} />
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sub total</Text>
            <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxes & Fees</Text>
            <Text style={styles.summaryValue}>₹{taxes.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>₹{delivery.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
          </View>
        </View>

        <CustomPressable
          onPress={() => router.push("/PaymentSuccessScreen")}
          style={styles.checkoutBtn}
        >
          <Text style={styles.checkoutText}>Pay </Text>
        </CustomPressable>
      </View>
    </View>
  );
};

export default myCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 25,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemPrice: {
    color: "#777",
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  qtyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "500",
  },
  qtyNumber: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 6,
  },
  remove: {
    fontSize: 22,
    fontWeight: "600",
    color: "#999",
  },
  addMore: {
    color: "#2ecc71",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 20,
  },
  addressCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
  },
  activeCard: {
    borderWidth: 2,
    borderColor: "#2ecc71",
    backgroundColor: "#eaf8ef",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2ecc71",
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  addressPhone: {
    color: "#666",
    marginTop: 4,
  },
  addressText: {
    color: "#666",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  summary: {
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10,
  },
  summaryLabel: {
    color: "#666",
  },
  summaryValue: {
    color: "#333",
    fontWeight: "500",
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 17,
    fontWeight: "700",
  },
  checkoutBtn: {
    backgroundColor: "#2ecc71",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
