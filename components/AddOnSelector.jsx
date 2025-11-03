// AddOnSelector.js

import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomPressable from "./UI/CustomPressable";

// --- UNIVERSAL ADD-ON DATA ---
const addOnData = [
  {
    id: "addon_juice",
    name: "Fresh Juice (300ml)",
    price: 50,
    description: "Freshly squeezed juice.",
    category: "veg",
  },
  {
    id: "addon_protein_bar",
    name: "High Protein Bar",
    price: 90,
    description: "Energy and protein supplement.",
    category: "veg",
  },
  {
    id: "addon_extra_rice",
    name: "Extra Steamed Rice",
    price: 30,
    description: "A small portion of steamed rice.",
    category: "veg",
  },
  {
    id: "addon_chicken_slice",
    name: "Grilled Chicken Slice",
    price: 150,
    description: "Lean, grilled chicken breast slice.",
    category: "non-veg",
  },
  {
    id: "addon_extra_roti",
    name: "Extra 2 Chapatis",
    price: 20,
    description: "Two whole wheat chapatis.",
    category: "veg",
  },
];
// -----------------------------

// Utility function to generate a unique ID for the add-on item in the cart
const getAddOnItemId = (bundleId, dayName) =>
  `addon_bundle_${bundleId}_${dayName}`;

const AddOnSelector = ({
  itemDays,
  bundleId,
  cartItems,
  addToCart,
  onClose,
}) => {
  const [selectedAddOnDay, setSelectedAddOnDay] = useState(
    itemDays[0]?.day || null
  );

  const [selectedAddOns, setSelectedAddOns] = useState({});
  const [isApplyingAddons, setIsApplyingAddons] = useState(false);

  const initializeAddOnStateForDay = useCallback(
    (day) => {
      setSelectedAddOnDay(day);

      const dayAddOnBundle = cartItems.find(
        (cartItem) => cartItem.id === getAddOnItemId(bundleId, day)
      );

      const initialAddOns =
        dayAddOnBundle?.products?.reduce((acc, p) => {
          acc[p.id] = p.quantity;
          return acc;
        }, {}) || {};

      setSelectedAddOns(initialAddOns);
    },
    [cartItems, bundleId]
  );

  const addOnsTotal = useMemo(() => {
    let total = 0;
    let count = 0;
    addOnData.forEach((addOn) => {
      const quantity = selectedAddOns[addOn.id] || 0;
      total += quantity * addOn.price;
      count += quantity;
    });
    return { total, count };
  }, [selectedAddOns]);

  const handleUpdateAddOn = (addOnId, delta) => {
    setSelectedAddOns((prev) => {
      const currentQty = prev[addOnId] || 0;
      const newQty = Math.max(0, currentQty + delta);

      if (newQty === 0) {
        const newState = { ...prev };
        delete newState[addOnId];
        return newState;
      }

      return { ...prev, [addOnId]: newQty };
    });
  };

  const handleApplyAddOns = () => {
    if (!selectedAddOnDay) {
      setIsApplyingAddons(false);
      return;
    }

    setIsApplyingAddons(true);

    let totalProductPrice = 0;
    const products = addOnData
      .filter((addOn) => selectedAddOns[addOn.id] > 0)
      .map((addOn) => {
        const quantity = selectedAddOns[addOn.id];
        const price = addOn.price * quantity;
        totalProductPrice += price;
        return {
          id: addOn.id,
          name: addOn.name,
          price: addOn.price,
          quantity: quantity,
        };
      });

    const addOnBundleItem = {
      id: getAddOnItemId(bundleId, selectedAddOnDay),
      name: `Add-ons for ${selectedAddOnDay}`,
      price: totalProductPrice,
      quantity: 1,
      isAddOnBundle: true,
      parentBundleId: bundleId,
      day: selectedAddOnDay,
      products: products,
    };

    addToCart(addOnBundleItem);

    console.log("--- Add-On Bundle Added/Updated ---");
    console.log("Day:", addOnBundleItem.day);
    console.log("Total Price:", addOnBundleItem.price);
    console.log("Products:", addOnBundleItem.products);
    console.log("----------------------------------");

    setTimeout(() => {
      setIsApplyingAddons(false);
      onClose();
    }, 500);
  };

  const renderAddOnItem = ({ item: addOn }) => {
    const quantity = selectedAddOns[addOn.id] || 0;

    return (
      <View style={styles.addOnItem}>
        <View style={styles.addOnDetails}>
          <Text style={styles.addOnName}>{addOn.name}</Text>
          <Text style={styles.addOnPrice}>+ ₹{addOn.price}</Text>
        </View>
        <View style={styles.addOnControls}>
          <CustomPressable
            onPress={() => handleUpdateAddOn(addOn.id, -1)}
            style={[
              styles.quantityButton,
              quantity === 0 && { borderColor: "#D1D5DB" },
            ]}
            disabled={quantity === 0}
          >
            <Ionicons
              name="remove-outline"
              size={20}
              color={quantity > 0 ? "#1E1E1E" : "#D1D5DB"}
            />
          </CustomPressable>

          <Text style={styles.addOnQuantity}>{quantity}</Text>

          <CustomPressable
            onPress={() => handleUpdateAddOn(addOn.id, 1)}
            style={styles.quantityButton}
          >
            <Ionicons name="add-outline" size={20} color="#1E1E1E" />
          </CustomPressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.addOnsContainer}>
      {/* Horizontal Day Selector - Using FlatList */}
      <FlatList
        horizontal
        data={itemDays}
        keyExtractor={(item) => item.day}
        renderItem={({ item: dayObj }) => (
          <CustomPressable
            onPress={() => initializeAddOnStateForDay(dayObj.day)}
            style={[
              styles.dayTag,
              selectedAddOnDay === dayObj.day && styles.dayTagSelected,
            ]}
          >
            <Text
              style={[
                styles.dayTagText,
                selectedAddOnDay === dayObj.day && styles.dayTagTextSelected,
              ]}
            >
              {dayObj.day}
            </Text>
          </CustomPressable>
        )}
        showsHorizontalScrollIndicator={false}
        style={styles.daySelectorScroll}
        contentContainerStyle={styles.daySelectorContainer}
      />

      {/* Add-on Items List - Using FlatList */}
      <FlatList
        data={addOnData}
        keyExtractor={(item) => item.id}
        renderItem={renderAddOnItem}
        style={styles.addOnsListContainer}
        contentContainerStyle={styles.addOnsListContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      />

      {/* Absolute Footer Button */}
      <View style={styles.addOnFooter}>
        <CustomPressable
          onPress={handleApplyAddOns}
          style={styles.addOnApplyButton}
          disabled={isApplyingAddons || addOnsTotal.count === 0}
        >
          {isApplyingAddons ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.addOnApplyButtonText}>
              Add {selectedAddOnDay} - ₹{addOnsTotal.total}
            </Text>
          )}
        </CustomPressable>
      </View>
    </View>
  );
};

export default AddOnSelector;

const styles = StyleSheet.create({
  addOnsContainer: {
    flex: 1,
    width: "100%",
    marginTop:10
  },
  daySelectorScroll: {
    maxHeight: 50,
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 15,
  },
  daySelectorContainer: {
    paddingHorizontal: 15,
  },
  dayTag: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginRight: 10,
    backgroundColor: "#F9FAFB",
  },
  dayTagSelected: {
    backgroundColor: "#004346",
    borderColor: "#004346",
  },
  dayTagText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  dayTagTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  addOnsListContainer: {
    flex: 1,
  },
  addOnsListContent: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  addOnItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  addOnDetails: {
    flex: 1,
    paddingRight: 10,
  },
  addOnName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  addOnPrice: {
    fontSize: 14,
    color: "#374151",
    marginTop: 2,
  },
  addOnControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#1E1E1E",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  addOnQuantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E1E1E",
    minWidth: 20,
    textAlign: "center",
  },
  addOnFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },
  addOnApplyButton: {
    backgroundColor: "#000",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: "100%",
  },
  addOnApplyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});