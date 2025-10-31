import { useState, useMemo, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import CustomPressable from "../components/UI/CustomPressable";
import { bundleData } from "../services/data";
import CategoryIcon from "../components/CategoryIcon";
import { useCart } from "../context/CartContext";
// --- Import the new component ---
import AddOnSelector from "../components/AddOnSelector"; 
import CustomBottomSheet from "../components/UI/CustomBottomSheet";

// Utility function (kept here for consistency)
const getAddOnItemId = (bundleId, dayName) => `addon_bundle_${bundleId}_${dayName}`;

export default function ItemDetail() {
  const bottomSheetRef = useRef(null);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [bottomSheetTitle, setBottomSheetTitle] = useState("Add-on Products");
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { bundleId } = params;
  const { addToCart, cartItems } = useCart();

  const item = useMemo(
    () => bundleData.bundles.find((b) => b.id === bundleId),
    [bundleId]
  );

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Item not found!</Text>
      </View>
    );
  }

  const placeholderImage = require("../assets/lblplaceholder.jpg");
  const itemInCart = cartItems.find((cartItem) => cartItem.id === item.id);

  const handleAddToCart = () => {
    if (isAdding) return;

    setIsAdding(true);

    setTimeout(() => {
      // Add the main bundle to the cart
      addToCart(item); 
      setIsAdding(false);
      // Open the add-on sheet automatically after adding the bundle
      bottomSheetRef.current?.open(); 
    }, 800);
  };

  const handleFavirid = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    console.log(
      `Bundle ID ${item.id} is now ${newState ? "FAVORITED" : "UNFAVORITED"}.`
    );
  };

  const handleAddonSheetOpen = () => {
    if (!itemInCart) {
        alert("Please add the main bundle to the cart first.");
        return;
    }
    bottomSheetRef.current?.open();
  };

  // --- Conditional Footer Button Component ---
  const FooterButton = () => {
    const button = itemInCart ? (
      // RENDER: View in Cart Button (Outline style)
      <CustomPressable
        onPress={() => router.push("/myCart")}
        style={[styles.actionButton, styles.viewInCartBtn]} 
      >
        <Text style={[styles.subscribeText, styles.viewInCartText]}>
          VIEW IN CART
        </Text>
      </CustomPressable>
    ) : (
      // RENDER: Add to Cart Button (Solid style with spinner)
      <CustomPressable
        onPress={handleAddToCart}
        style={[styles.actionButton, isAdding && styles.addToCardBtnDisabled]} 
        disabled={isAdding}
      >
        {isAdding ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.subscribeText}>Add to Cart - ₹{item.price}</Text>
        )}
      </CustomPressable>
    );

    return (
      <View style={styles.footerButtonWrapper}>
        <CustomPressable
          onPress={handleFavirid}
          style={styles.favoriteFooterButton}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "red" : "#1E1E1E"}
          />
        </CustomPressable>

        <View style={{ flex: 1 }}>
          {button}
        </View>
      </View>
    );
  };
  // --- End of Conditional Footer Button Component ---

  return (
    <View style={styles.container}>
      <View style={styles.headerImageContainer}>
        <Image
          source={
            item.bundleImage ? { uri: item.bundleImage } : placeholderImage
          }
          style={styles.mainImage}
          contentFit="cover"
          transition={300}
        />

        <View style={styles.overlay}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </Text>
          </TouchableOpacity>

          <View style={styles.titleContent}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemSubtitle}>{item.description}</Text>
          </View>
          <View style={styles.categoryIcon}>
            <CategoryIcon type={"veg"} size={14} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollArea}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuHeaderText}>Daily Menu</Text>
        </View>

        {/* --- COMMON ADD-ON BUTTON --- */}
        {itemInCart && (
             <View style={styles.commonAddOnWrapper}>
                <Text style={styles.commonAddOnText}>
                    Enhance your order:
                </Text>
                <CustomPressable 
                    onPress={handleAddonSheetOpen} 
                    style={styles.commonAddonButton}
                >
                    <Text style={styles.commonAddonButtonText}>
                        + Add Extras
                    </Text>
                </CustomPressable>
             </View>
        )}
        {/* --------------------------- */}

        {item.days.map((dayObj, index) => {
            const addOnId = getAddOnItemId(item.id, dayObj.day);
            const appliedAddOnBundle = cartItems.find(cartItem => cartItem.id === addOnId);
            const totalAddOnPrice = appliedAddOnBundle?.price || 0;
            const totalAddOnItems = appliedAddOnBundle?.products?.length || 0;

            return (
                <CustomPressable
                  key={index}
                  style={styles.dayCard}
                  onPress={() =>
                    router.push({
                      pathname: "/dayMenuList",
                      params: { bundleId: item.id, day: dayObj.day },
                    })
                  }
                >
                  <View style={styles.dayCardLeft}>
                    <View>
                      <Text style={styles.dayCardDayText}>{dayObj.day}</Text>
                      <Text style={styles.dayCardMenuName}>{dayObj.menuName}</Text>
                      {totalAddOnItems > 0 && (
                          <Text style={styles.addOnSummary}>
                              + {totalAddOnItems} Extra Item(s) Added (₹{totalAddOnPrice})
                          </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.dayCardRight}>
                    <View style={styles.dayCardChevron}>
                      <Text style={styles.dayCardNutrition}>
                        {dayObj.totalNutrition.calories} Cal
                      </Text>
                    </View>
                  </View>
                </CustomPressable>
            );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <FooterButton />
      </View>

      <Stack.Screen options={{ headerShown: false }} />
      <CustomBottomSheet
        ref={bottomSheetRef}
        title={bottomSheetTitle}
        snapPoints={["35%", "60%"]}
        initialIndex={-1} 
      >
        {/* --- Pass Props to the new component --- */}
        <AddOnSelector 
            itemDays={item.days}
            bundleId={item.id}
            cartItems={cartItems}
            addToCart={addToCart}
            onClose={() => bottomSheetRef.current?.close()} // Pass close function
        />
        {/* -------------------------------------- */}
      </CustomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  // --- Main Styles ---
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  headerImageContainer: {
    height: 200,
    width: "100%",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 20,
    justifyContent: "space-between",
  },
  closeButton: {
    position: "absolute",
    top: 30,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 9999,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  closeText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
  },
  titleContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  itemTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  itemSubtitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  categoryIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#fff",
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
    marginBottom: 100, 
  },
  menuHeader: {
    marginBottom: 15,
  },
  menuHeaderText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    paddingVertical: 10,
  },
  dayCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dayCardLeft: {
    flex: 1,
    justifyContent: "space-between",
    paddingRight: 10,
  },
  dayCardDayText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    textTransform: "capitalize",
  },
  dayCardMenuName: {
    fontSize: 16,
    color: "#004346",
    textTransform: "capitalize",
    marginTop: 2,
  },
  dayCardRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayCardChevron: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  dayCardNutrition: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginRight: 8,
  },
  addOnSummary: {
    fontSize: 14,
    color: '#004346',
    fontWeight: 'bold',
    marginTop: 5,
  },
  // --- Main Footer Button Styles ---
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    width: "100%",
  },
  footerButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  favoriteFooterButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    minHeight: 50,
    backgroundColor: "#1E1E1E",
    justifyContent: "center",
    minWidth:"90%",
    minHeight: 60,
  },
  addToCardBtnDisabled: {
    opacity: 0.7,
  },
  viewInCartBtn: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#1E1E1E",
  },
  viewInCartText: {
    color: "#1E1E1E",
  },
  subscribeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  // --- COMMON ADD-ONS BUTTON STYLES (Kept here as it's part of ItemDetail UI) ---
  commonAddOnWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 10,
  },
  commonAddOnText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  commonAddonButton: {
    backgroundColor: '#004346',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  commonAddonButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});