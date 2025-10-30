import { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomPressable from "../components/UI/CustomPressable";
import { bundleData } from "../services/data";

export default function DayMenuList() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { bundleId, day: dayName } = params;

  // Find the selected day's data from the main data source
  const dayData = useMemo(() => {
    const bundle = bundleData.bundles.find((b) => b.id === bundleId);
    if (!bundle) return null;
    return bundle.days.find((d) => d.day === dayName);
  }, [bundleId, dayName]);

  if (!dayData) {
    return (
      <View style={styles.container}>
        <Text>Menu not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{dayData.day}'s Menu</Text>
      </View>

      <ScrollView style={styles.scrollArea}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuHeaderText}>{dayData.menuName}</Text>
        </View>

        {/* Menu Items List */}
        {dayData.items.map((menuItem, itemIndex) => (
          <CustomPressable key={itemIndex} style={styles.menuItemCard}>
            <View>
              <Text style={styles.mealText}>{menuItem.itemName}</Text>
              <View style={styles.nutritionRow}>
                <View
                  style={
                    menuItem.category === "veg"
                      ? styles.vegSquare
                      : styles.nonVegSquare
                  }
                />
                <Text style={styles.nutritionText}>
                  {menuItem.nutrition.calories} Cal
                </Text>
              </View>
            </View>
            <View style={styles.rightContent}>
              <Text style={styles.quantityText}>
                {menuItem.quantity} {menuItem.uom}
              </Text>
              <CustomPressable style={styles.addButton}>
                <Text style={styles.addButtonText}>Add on</Text>
              </CustomPressable>
            </View>
          </CustomPressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
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
  menuItemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8F8FF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  mealText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  nutritionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  nutritionText: {
    marginLeft: 8,
    color: "#4B5563",
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
    paddingVertical: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#fff",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
