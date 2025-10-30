import { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import CustomPressable from "../components/UI/CustomPressable";
import { bundleData } from "../services/data";

export default function ItemDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { bundleId } = params;

  // Find the selected bundle from the main data source
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

  return (
    <View style={styles.container}>
      <View style={styles.headerImageContainer}>
        <Image
          source={
            item.bundleImage ? { uri: item.bundleImage } : placeholderImage
          }
          style={styles.mainImage}
          contentFit="cover"
        />

        <View style={styles.overlay}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <View style={styles.titleContent}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemSubtitle}>{item.description}</Text>

            <Text style={styles.tagTextSmall}>{item.category}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollArea}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuHeaderText}>Daily Menu</Text>
        </View>

        {item.days.map((day, index) => (
          <CustomPressable
            key={index}
            style={styles.dayCard}
            onPress={() =>
              router.push({
                pathname: "/dayMenuList",
                params: { bundleId: item.id, day: day.day },
              })
            }
          >
            <View style={styles.dayCardLeft}>
              <View>
                <Text style={styles.dayCardDayText}>{day.day}</Text>
                <Text style={styles.dayCardMenuName}>{day.menuName}</Text>
              </View>
            </View>
            <View style={styles.dayCardRight}>
              <View style={styles.dayCardChevron}>
                <Text style={styles.dayCardNutrition}>
                  {day.totalNutrition.calories} Cal
                </Text>
                <CustomPressable
                  style={styles.addButton}
                  onPress={() => console.log("Add on for", day.day)}
                >
                  <Text style={styles.addButtonText}>Add on</Text>
                </CustomPressable>
              </View>
            </View>
          </CustomPressable>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <CustomPressable
          onPress={() => router.push("/myCart")}
          style={styles.addToCardBtn}
        >
          <Text style={styles.subscribeText}>Add to Cart - ₹{item.price}</Text>
        </CustomPressable>
      </View>

      <Stack.Screen options={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },

  // --- 1. Header/Image/Overlay Styles ---
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
    top: 30, // Pushed down from the absolute top
    right: 20, // Pushed left from the absolute right
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
  tagToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  tagTextSmall: {
    fontSize: 14,
    fontWeight: "500",
    color: "#E5E5E5",
  },

  // --- 2. Scrollable Content Styles ---
  scrollArea: {
    flex: 1, // Keep this!
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
    textTransform:"capitalize",
  },
  dayCardMenuName: {
    fontSize: 16,
    color: "#004346",
    textTransform:"capitalize",
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

  // --- Old Styles for reference in dayMenuList.jsx ---
  dayContainer: {
    marginBottom: 20,
  },
  menuItemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8F8FF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004D40",
    marginBottom: 5,
  },
  mealText: {
    fontSize: 16,
    marginBottom: 8,
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryTime: {
    // This style is no longer used with the new data structure
  },
  nutritionText: {
    marginLeft: 8,
  },
  vegSquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#00A86B",
    backgroundColor: "#00A86B",
  },
  nonVegSquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#FF4500",
    backgroundColor: "#FF4500",
  },
  rightContent: {
    alignItems: "flex-end",
  },
  quantityText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start", // To make button only as wide as its content
    // borderWidth: 1,
    // borderColor: "#fff",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  // --- 3. Fixed Footer Button Styles ---
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff", // Ensure footer has a background
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
  addToCardBtn: {
    backgroundColor: "#1E1E1E", // Dark button color
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
  },
  subscribeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
