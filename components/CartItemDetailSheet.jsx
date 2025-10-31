/* --- Create this file, e.g., components/CartItemDetailSheet.js --- */
import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

const CartItemDetailSheet = ({ item }) => {
  if (!item) {
    return (
      <View style={styles.container}>
        <Text>No item selected.</Text>
      </View>
    );
  }

  // Check if it's a bundle with specific days
  const isDayBundle = item.days && item.days.length > 0;
  // Check if it's an add-on bundle
  const isAddOnBundle =
    item.isAddOnBundle && item.products && item.products.length > 0;

  return (
    <ScrollView style={styles.container}>
      {isDayBundle && (
        <>
          <Text style={styles.sectionTitle}>Your Bundle's Menu:</Text>
          {item.days.map((dayItem, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.dayText}>{dayItem.day}</Text>
              <Text style={styles.menuText}>{dayItem.menuName}</Text>
            </View>
          ))}
        </>
      )}

      {isAddOnBundle && (
        <>
          <Text style={styles.sectionTitle}>Add-on Products:</Text>
          {item.products.map((product, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.menuText}>{product.name}</Text>
            </View>
          ))}
        </>
      )}

      {!isDayBundle && !isAddOnBundle && (
        <Text style={styles.menuText}>This item has no additional details.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004346",
    marginBottom: 10,
  },
  itemRow: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  menuText: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
});

export default CartItemDetailSheet;