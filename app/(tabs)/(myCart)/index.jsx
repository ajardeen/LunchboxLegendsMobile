import { useState, useRef, useCallback, useMemo, memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import CustomPressable from "../../../components/UI/CustomPressable";
import { useRouter } from "expo-router";
import { useCart } from "../../../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import CustomBottomSheet from "../../../components/UI/CustomBottomSheet";
import AddressChangeSheet from "../../../components/AddressChangeSheet";
import CartItemDetailSheet from "../../../components/CartItemDetailSheet";
import { SwipeListView } from "react-native-swipe-list-view";

// --- CRITICAL: Extract actions to avoid re-renders ---
const useCartActions = () => {
  const { updateQuantity, removeItem } = useCart();

  // These refs keep the same function reference across renders
  const updateQuantityRef = useRef(updateQuantity);
  const removeItemRef = useRef(removeItem);

  // Update refs when functions change
  updateQuantityRef.current = updateQuantity;
  removeItemRef.current = removeItem;

  // Return stable callbacks
  return useMemo(
    () => ({
      updateQuantity: (id, type) => updateQuantityRef.current(id, type),
      removeItem: (id) => removeItemRef.current(id),
    }),
    []
  );
};

// --- Memoized Cart Item Component ---
const CartItem = memo(
  ({ item, onUpdateQuantity, onViewDetails }) => {
    const handleIncrement = useCallback(() => {
      onUpdateQuantity(item.id, "inc");
    }, [item.id, onUpdateQuantity]);

    const handleDecrement = useCallback(() => {
      onUpdateQuantity(item.id, "dec");
    }, [item.id, onUpdateQuantity]);

    const handlePress = useCallback(() => {
      onViewDetails(item);
    }, [item, onViewDetails]);

    return (
      <View style={styles.rowFront}>
        <View style={styles.itemRow}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={handlePress}>
              <Text style={styles.itemName}>{item.name}</Text>
            </TouchableOpacity>
            <Text style={styles.itemPrice}>
              ₹{(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
          <View style={styles.quantityAndClearWrapper}>
            <View style={styles.quantityContainer}>
              <Pressable onPress={handleDecrement} style={styles.qtyButton}>
                <Text style={styles.qtyText}>−</Text>
              </Pressable>
              <Text style={styles.qtyNumber}>{item.quantity}</Text>
              <Pressable onPress={handleIncrement} style={styles.qtyButton}>
                <Text style={styles.qtyText}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if THIS specific item changed
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.quantity === nextProps.item.quantity &&
      prevProps.item.price === nextProps.item.price &&
      prevProps.item.name === nextProps.item.name
    );
  }
);

CartItem.displayName = "CartItem";

// --- Memoized Hidden Item (Delete Button) ---
const HiddenItem = memo(
  ({ item, onRemove }) => {
    const handleRemove = useCallback(() => {
      onRemove(item.id);
    }, [item.id, onRemove]);

    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backBtn, styles.deleteBtn]}
          onPress={handleRemove}
        >
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <Text style={styles.backText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  },
  (prevProps, nextProps) => prevProps.item.id === nextProps.item.id
);

HiddenItem.displayName = "HiddenItem";

// --- SEPARATE COMPONENT FOR CART LIST ---
// This component will re-render, but CartItem components won't
const CartList = memo(
  ({
    cartItems,
    onUpdateQuantity,
    onRemoveItem,
    onViewDetails,
    ListFooterComponent,
  }) => {
    const renderItem = useCallback(
      ({ item }) => (
        <CartItem
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onViewDetails={onViewDetails}
        />
      ),
      [onUpdateQuantity, onViewDetails]
    );

    const renderHiddenItem = useCallback(
      ({ item }) => <HiddenItem item={item} onRemove={onRemoveItem} />,
      [onRemoveItem]
    );

    const keyExtractor = useCallback((item) => item.id, []);

    return (
      <SwipeListView
        data={cartItems}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        disableRightSwipe={true}
        keyExtractor={keyExtractor}
        style={{ flex: 1 }}
        useFlatList={true}
        ListFooterComponent={ListFooterComponent}
        contentContainerStyle={{ paddingBottom: 200, paddingHorizontal: 20 }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={5}
      />
    );
  }
);

CartList.displayName = "CartList";

// --- MyCart Component ---
const MyCart = () => {
  const addressChangeSheetRef = useRef(null);
  const viewCartItemsSheetRef = useRef(null);

  const router = useRouter();

  // Get cart data
  const { cartItems, subtotal, emptyCart } = useCart();

  // Get stable action functions
  const { updateQuantity, removeItem } = useCartActions();

  const [selectedAddress, setSelectedAddress] = useState("home");
  const [paymentMethod, setPaymentMethod] = useState("gpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState(null);

  const taxes = 10.0;
  const delivery = 0;

  const total = subtotal + taxes + delivery;

  const addresses = useMemo(
    () => [
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
    ],
    []
  );

  const currentAddress = useMemo(
    () => addresses.find((addr) => addr.id === selectedAddress),
    [addresses, selectedAddress]
  );

  const paymentOptions = useMemo(
    () => [
      {
        id: "gpay",
        title: "Google Pay",
        icon: require("../../../assets/gpayicon.png"),
      },
    ],
    []
  );

  const handleViewItemDetails = useCallback((item) => {
    const isDetailedItem = item.days || item.isAddOnBundle;
    if (isDetailedItem) {
      setSelectedCartItem(item);
      viewCartItemsSheetRef.current?.open();
    }
  }, []);

  const handleCheckout = useCallback(() => {
    try {
      if (cartItems.length === 0) return;
      setIsProcessing(true);
      const orderDetails = {};
      console.log("--- FINAL ORDER DETAILS ---", orderDetails);
    } catch (error) {
      console.log(error.message);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        router.push("/PaymentSuccessScreen");
        emptyCart();
      }, 2000);
    }
  }, [cartItems.length, router, emptyCart]);

  const handleNavigateHome = useCallback(() => {
    router.navigate("(tabs)/(home)");
  }, [router]);

  const handleSelectAddress = useCallback((id) => {
    setSelectedAddress(id);
    addressChangeSheetRef.current?.close();
  }, []);

  const handleOpenAddressSheet = useCallback(() => {
    addressChangeSheetRef.current?.open();
  }, []);

  const handleCloseAddressSheet = useCallback(() => {
    addressChangeSheetRef.current?.close();
  }, []);

  const handleCloseItemSheet = useCallback(() => {
    setSelectedCartItem(null);
  }, []);

  // Main render
  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <EmptyCartView onNavigateHome={handleNavigateHome} />
      ) : (
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>
              <Ionicons name="cart-outline" size={24} color="#004346" />
              Cart
            </Text>
            <View style={styles.cartItemsContainer}>
              <Text style={styles.sectionTitle}>My Cart</Text>
            </View>
          </View>

          {/* Scrollable Content Area */}
          <View style={{ flex: 1 }}>
            <CartList
              cartItems={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onViewDetails={handleViewItemDetails}
              ListFooterComponent={
                <View style={styles.scrollableFooterContent}>
                  
                  <Text onPress={handleNavigateHome} style={styles.addMore}>
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

                  {/* Summary Section */}
                  <View style={styles.scrollableFooterSummery}>
                    <Text style={styles.sectionTitle}>Summary</Text>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Sub total</Text>
                      <Text style={styles.summaryValue}>
                        ₹{subtotal.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Taxes & Fees</Text>
                      <Text style={styles.summaryValue}>
                        ₹{taxes.toFixed(2)}
                      </Text>
                    </View>
                    {delivery.toFixed(2) < 1 ? (
                      <View style={styles.summaryRow}>
                        <Text
                          style={[styles.summaryLabel, styles.deliveryFreeText]}
                        >
                          Delivery Fee
                        </Text>
                        <Text
                          style={[styles.summaryValue, styles.deliveryFreeText]}
                        >
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
                </View>
              }
            />
          </View>
        </View>
      )}

      {/* Footer: Stays fixed at the bottom */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.summary}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
            </View>
            <DeliveryBlock
              currentAddress={currentAddress}
              onOpenAddressSheet={handleOpenAddressSheet}
            />
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

      {/* Bottom Sheets */}
      <CustomBottomSheet
        ref={addressChangeSheetRef}
        title="Change Delivery Address"
        snapPoints={["45%", "60%"]}
        initialIndex={-1}
      >
        <AddressChangeSheet
          addresses={addresses}
          selectedAddressId={selectedAddress}
          onSelectAddress={handleSelectAddress}
          onClose={handleCloseAddressSheet}
          router={router}
        />
      </CustomBottomSheet>
      <CustomBottomSheet
        ref={viewCartItemsSheetRef}
        title={selectedCartItem ? selectedCartItem.name : "Item Details"}
        snapPoints={["45%", "75%"]}
        initialIndex={-1}
        onClose={handleCloseItemSheet}
      >
        <CartItemDetailSheet item={selectedCartItem} />
      </CustomBottomSheet>
    </View>
  );
};

// --- Memoized Delivery Block Component ---
const DeliveryBlock = memo(({ currentAddress, onOpenAddressSheet }) => (
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
    <Pressable onPress={onOpenAddressSheet}>
      <Text style={deliveryStyles.changeText}>CHANGE</Text>
    </Pressable>
  </View>
));

DeliveryBlock.displayName = "DeliveryBlock";

// --- Memoized Empty Cart View ---
const EmptyCartView = memo(({ onNavigateHome }) => (
  <View style={styles.emptyContainer}>
    <Image
      source={require("../../../assets/empty_cart.jpg")}
      style={{ width: 200, height: 200 }}
      contentFit="contain"
      transition={300}
    />
    <Text style={styles.emptyMessage}>ohh... Your cart is empty</Text>
    <Text style={styles.emptySubMessage}>but it doesn't have to be.</Text>
    <CustomPressable onPress={onNavigateHome} style={styles.homeButton}>
      <Text style={styles.homeButtonText}>Shop Now</Text>
    </CustomPressable>
  </View>
));

EmptyCartView.displayName = "EmptyCartView";

export default MyCart;

// --- Delivery Block Styles ---
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
    paddingTop: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#004346",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
  },
  emptyMessage: {
    fontSize: 18,
    color: "#666",
    marginBottom: 3,
  },
  emptySubMessage: {
    fontSize: 17,
    color: "#9b9b9bff",
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
  cartItemsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  rowFront: {
    backgroundColor: "#fff",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 70,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "red",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  backBtn: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 75,
    backgroundColor: "red",
    right: 0,
  },
  backText: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
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
    color: "#000",
    fontWeight: "bold",
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    paddingHorizontal: 5,
    marginTop: 8,
  },
  qtyButton: {
    paddingHorizontal: 5,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    width: 35,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "500",
  },
  qtyNumber: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 10,
  },
  footerContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  addMore: {
    color: "#004346",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
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
