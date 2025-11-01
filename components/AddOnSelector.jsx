// AddOnSelector.js

import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomPressable from "./UI/CustomPressable"; // Adjust path as necessary

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
  // State to track the currently selected day for add-ons (default to the first day)
  const [selectedAddOnDay, setSelectedAddOnDay] = useState(
    itemDays[0]?.day || null
  );

  // State to track the quantity of each add-on being selected
  const [selectedAddOns, setSelectedAddOns] = useState({});
  const [isApplyingAddons, setIsApplyingAddons] = useState(false);

  // Effect to re-initialize add-on state whenever the selected day changes
  const initializeAddOnStateForDay = useCallback(
    (day) => {
      setSelectedAddOnDay(day);

      // Find the specific add-on bundle for this day in the cart
      const dayAddOnBundle = cartItems.find(
        (cartItem) => cartItem.id === getAddOnItemId(bundleId, day)
      );

      // Initialize state based on the bundle's current products
      const initialAddOns =
        dayAddOnBundle?.products?.reduce((acc, p) => {
          acc[p.id] = p.quantity;
          return acc;
        }, {}) || {};

      setSelectedAddOns(initialAddOns);
    },
    [cartItems, bundleId]
  );

  // Calculate total price and item count for the Add-on button in the sheet
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

  // Function to update the quantity of a specific add-on
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

  // Function to apply the selected add-ons by creating a single bundled item in the cart
  const handleApplyAddOns = () => {
    if (!selectedAddOnDay) {
      setIsApplyingAddons(false);
      return;
    }

    setIsApplyingAddons(true);

    // 1. Build the array of products and calculate total price
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

    // 2. Create the unified Add-On Bundle item
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

    // 3. Add to cart
    addToCart(addOnBundleItem);

    // 4. Console log the data
    console.log("--- Add-On Bundle Added/Updated ---");
    console.log("Day:", addOnBundleItem.day);
    console.log("Total Price:", addOnBundleItem.price);
    console.log("Products:", addOnBundleItem.products);
    console.log("----------------------------------");

    setTimeout(() => {
      setIsApplyingAddons(false);
      onClose(); // Close the sheet after applying
    }, 500);
  };

  return (
    <View style={styles.addOnsContainer}>
      {/* Horizontal Day Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.daySelectorScroll} // This will now scroll correctly
        contentContainerStyle={styles.daySelectorContainer}
      >
        {itemDays.map((dayObj) => (
          <CustomPressable
            key={dayObj.day}
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
        ))}
      </ScrollView>

      <ScrollView
        style={styles.addOnsScrollArea}
        contentContainerStyle={styles.addOnsScrollContent}
      >
        {addOnData.map((addOn) => {
          const quantity = selectedAddOns[addOn.id] || 0;

          return (
            <View key={addOn.id} style={styles.addOnItem}>
              <View style={styles.addOnDetails}>
                <Text style={styles.addOnName}>{addOn.name}</Text>
                <Text style={styles.addOnPrice}>+ ₹{addOn.price}</Text>
              </View>
              <View style={styles.addOnControls}>
                {/* Minus Button */}
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

                {/* Quantity */}
                <Text style={styles.addOnQuantity}>{quantity}</Text>

                {/* Plus Button */}
                <CustomPressable
                  onPress={() => handleUpdateAddOn(addOn.id, 1)}
                  style={styles.quantityButton}
                >
                  <Ionicons name="add-outline" size={20} color="#1E1E1E" />
                </CustomPressable>
              </View>
            </View>
          );
        })}
      </ScrollView>

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

// --- STYLES FOR ADD-ON COMPONENT ---
const styles = StyleSheet.create({
  addOnsContainer: {
    flex: 1,
    width: "100%",
    paddingBottom: 80, // Space for the absolute footer button inside the sheet
  },
  daySelectorScroll: {
    maxHeight: 50,
    marginBottom: 10,
    width: "100%", // Ensure it takes full width
  },
  daySelectorContainer: {
    paddingVertical: 5,
    // Add horizontal padding here so the scroll starts and ends with some space
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
  addOnsScrollArea: {
    flex: 1,
  },
  addOnsScrollContent: {
    paddingHorizontal: 15, // Apply padding to the content of this scroll view
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
