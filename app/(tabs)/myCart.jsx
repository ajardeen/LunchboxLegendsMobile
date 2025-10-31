import { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import CustomPressable from "../../components/UI/CustomPressable";
import { useRouter } from "expo-router";
import { useCart } from "../../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import CustomBottomSheet from "../../components/UI/CustomBottomSheet";
import AddressChangeSheet from "../../components/AddressChangeSheet";
import CartItemDetailSheet from "../../components/CartItemDetailSheet";

// --- MyCart Component ---
const MyCart = () => {
  const addressChangeSheetRef = useRef(null);
  const viewCartItemsSheetRef = useRef(null);

  const router = useRouter();

  const { cartItems, subtotal, updateQuantity, removeItem, emptyCart } =
    useCart();

  const [selectedAddress, setSelectedAddress] = useState("home");
  const [paymentMethod, setPaymentMethod] = useState("gpay");
  const [isProcessing, setIsProcessing] = useState(false);

  const taxes = 10.0;
  const delivery = 0;

  const total = subtotal + taxes + delivery;

  const addresses = [
    {
      id: "home",
      title: "Home",
      phone: "+91 888 888 8888",
      address: "Gaur City 1 Club",
    },
    {
      id: "office",
      title: "Office",
      phone: "(0261) 555-0115",
      address: "2588 Ratan lal sahdev marg",
    },
  ];

  const currentAddress = addresses.find((addr) => addr.id === selectedAddress);

  const paymentOptions = [
    {
      id: "gpay",
      title: "Google Pay",
      icon: require("../../assets/gpayicon.png"),
    },
    // { id: "paytm", title: "Paytm", icon: require("../../assets/paytmicon.jpg") },
  ];

  // 🎯 UPDATED: Checkout handler with console logging
  const handleCheckout = () => {
    try {
      if (cartItems.length === 0) return;

      setIsProcessing(true);

      const orderDetails = {
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price_per_unit: item.price,
        })),
        summary: {
          subtotal: subtotal.toFixed(2),
          taxes: taxes.toFixed(2),
          deliveryFee: delivery.toFixed(2),
          total: total.toFixed(2),
        },
        delivery: currentAddress,
        paymentMethod: paymentMethod,
      };

      console.log("--- FINAL ORDER DETAILS ---", orderDetails);

      // Simulate a network request or payment processing delay
    } catch (error) {
      console.log(error.message);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        router.push("/PaymentSuccessScreen");
        emptyCart();
      }, 2000);
    }
  };

  // --- Component for the Delivery Block ---
  const DeliveryBlock = () => (
    <View style={deliveryStyles.deliveryContainer}>
      <View style={deliveryStyles.leftContent}>
        <Ionicons
          name="location-outline"
          size={24}
          color={styles.primaryColor.color}
        />
        <View style={deliveryStyles.textBlock}>
          <Text style={deliveryStyles.titleText}>
            Deliver at : {currentAddress.title}
          </Text>
          <Text style={deliveryStyles.subtitleText}>
            {currentAddress.address}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => {
          console.log("change pressed");
          addressChangeSheetRef.current?.open();
        }}
      >
        <Text style={deliveryStyles.changeText}>CHANGE</Text>
      </Pressable>
    </View>
  );
  // --- End of Delivery Block Component ---

  // --- Empty Cart View ---
  const EmptyCartView = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyMessage}>Your cart is empty!</Text>
      <CustomPressable
        onPress={() => router.navigate("/home")} // 🎯 Navigate to /home
        style={styles.homeButton}
      >
        <Text style={styles.homeButtonText}>Browse Bundles</Text>
      </CustomPressable>
    </View>
  );
  const [selectedCartItem, setSelectedCartItem] = useState(null);
const handleViewItemDetails = (item) => {
  console.log(item);
  
    // Check if item has details
    const isDetailedItem = item.days || item.isAddOnBundle;
    if (isDetailedItem) {
      setSelectedCartItem(item);
      viewCartItemsSheetRef.current?.open();
    } else {
      console.log("This item has no details to show.");
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 200 }}>
        <Text style={styles.title}>
          <Ionicons name="cart-outline" size={24} color="#004346" />
          Cart
        </Text>

        {/* 🎯 LOGIC: Render EmptyCartView or Cart Content */}
        {cartItems.length === 0 ? (
          <EmptyCartView />
        ) : (
          <>
            <View style={styles.cartItemsContainer}>
              <Text style={styles.sectionTitle}>My Cart</Text>
              {cartItems.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={{ flex: 1 }}>
                    <Pressable
                      onPress={() => {
                        console.log("change pressed");
                        handleViewItemDetails(item);
                        viewCartItemsSheetRef.current?.open();
                      }}
                    >
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemPrice}>
                        ₹{item.price.toFixed(2)}
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.quantityAndClearWrapper}>
                    <Pressable onPress={() => removeItem(item.id)}>
                      <Text style={styles.remove}>×</Text>
                    </Pressable>
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
                  </View>
                </View>
              ))}
            </View>

            <Text
              onPress={() => router.navigate("/home")}
              style={styles.addMore}
            >
              + Add more items
            </Text>

            {/* Payment Section */}
            <Text style={styles.sectionTitle}>Payment Method</Text>
            {paymentOptions.map((method) => (
              <Pressable
                key={method.id}
                style={styles.paymentRow}
                onPress={() => setPaymentMethod(method.id)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Image
                    source={method.icon}
                    style={{ width: 35, height: 35 }}
                    contentFit="contain"
                    transition={300}
                  />
                  <Text style={styles.paymentText}>{method.title}</Text>
                </View>
                <View style={styles.radioOuter}>
                  {paymentMethod === method.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </Pressable>
            ))}
            <View style={styles.scrollableFooterSummery}>
              <Text style={styles.sectionTitle}>Summery</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sub total</Text>
                <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Taxes & Fees</Text>
                <Text style={styles.summaryValue}>₹{taxes.toFixed(2)}</Text>
              </View>
              {delivery.toFixed(2) < 1 ? (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, styles.deliveryFreeText]}>
                    Delivery Fee
                  </Text>
                  <Text style={[styles.summaryValue, styles.deliveryFreeText]}>
                    Free
                  </Text>
                </View>
              ) : (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery Fee</Text>
                  <Text style={styles.summaryValue}>
                    ₹{delivery.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Footer: Only render if cart is NOT empty */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.summary}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
            </View>
            {/* Delivery Block is now correctly placed here */}
            <DeliveryBlock />
          </View>

          <CustomPressable
            onPress={handleCheckout}
            style={[
              styles.checkoutBtn,
              isProcessing && styles.checkoutBtnDisabled,
            ]}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.checkoutText}>Pay </Text>
            )}
          </CustomPressable>
        </View>
      )}
        <CustomBottomSheet
        ref={addressChangeSheetRef}
        title="Change Delivery Address"
        snapPoints={["45%", "60%"]}
        initialIndex={-1}
      >
        <AddressChangeSheet
          addresses={addresses}
          selectedAddressId={selectedAddress}
          onSelectAddress={(id) => {
            setSelectedAddress(id);
            addressChangeSheetRef.current?.close(); // Close on select
          }}
          onClose={() => addressChangeSheetRef.current?.close()}
          router={router}
        />
      </CustomBottomSheet>
     <CustomBottomSheet
        ref={viewCartItemsSheetRef}
        title={selectedCartItem ? selectedCartItem.name : "Item Details"}
        snapPoints={["45%", "75%"]}
        initialIndex={-1}
        // When sheet closes, clear the selected item
        onClose={() => setSelectedCartItem(null)}
      >
        <CartItemDetailSheet item={selectedCartItem} />
      </CustomBottomSheet>

    </View>
  );
};

export default MyCart;

// --- Delivery Block Styles (Separate for clarity) ---
const deliveryStyles = StyleSheet.create({
  deliveryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textBlock: {
    marginLeft: 10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  subtitleText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  changeText: {
    color: "#004346",
    fontSize: 14,
    fontWeight: "bold",
  },
});

// --- General Styles ---
const styles = StyleSheet.create({
  primaryColor: {
    color: "#111111",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,

    color: "#004346",
  },
  // 🎯 NEW: Empty cart styles
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
  },
  emptyMessage: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  homeButton: {
    backgroundColor: "#004346",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  homeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  // End new styles
  cartItemsContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    padding: 5,
    paddingTop: 5,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",

    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  quantityAndClearWrapper: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 1,
    marginHorizontal: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#f4f4f4",
    borderRadius: 10,
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
    marginHorizontal: 10,
  },
  addMore: {
    color: "#004346",
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
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: "500",
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#111111",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#111111",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  scrollableFooterSummery: {
    flex: 1,
    paddingVertical: 10,
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
    // borderTopWidth: 1,
    borderBottomWidth: 2,
    borderColor: "#eee",
    paddingVertical: 10,
  },
  summaryLabel: {
    color: "#666",
  },
  summaryValue: {
    color: "#333",
    fontWeight: "500",
  },
  deliveryFreeText: {
    color: "#26e265ff",
    fontWeight: "500",
    fontSize: 16,
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
    backgroundColor: "#004346",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  checkoutBtnDisabled: {
    opacity: 0.7,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
