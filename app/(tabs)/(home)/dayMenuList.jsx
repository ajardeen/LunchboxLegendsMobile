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
import { bundleData } from "../../../services/data";
import CategoryIcon from "../../../components/CategoryIcon";
import { useBundles } from "../../../hooks/Home/useBundles";
import { useBundleData } from "../../../context/BundleContext";

export default function DayMenuList() {
  const { getDayMenu } = useBundleData();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { bundleId, day: dayName } = params;

  const dayData = getDayMenu(bundleId, dayName);

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

      {/* Header */}
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
        <Text style={styles.menuHeaderText}>{dayData.menuName}</Text>

        {/* Menu List */}
        {dayData.items.map((menuItem, i) => (
          <View key={i} style={styles.menuItemRow}>
            <View style={styles.itemLeft}>
              <Text style={styles.mealText}>{menuItem.itemName}</Text>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionText}>
                  {menuItem.nutrition.calories} Cal
                </Text>
              </View>
            </View>

            <View style={styles.itemRight}>
              <Text style={styles.quantityText}>x{menuItem.quantity}</Text>
              {/* <Text style={styles.quantityText}>{menuItem.uom}</Text> */}

              <CategoryIcon type={menuItem.category} size={14} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
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
  },
  menuHeaderText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#004346",
    marginVertical: 15,
  },
  menuItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  itemLeft: {
    flex: 1,
  },
  mealText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#111827",
  },
  nutritionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  nutritionText: {
    marginLeft: 8,
    color: "#6B7280",
    fontSize: 13,
  },

  itemRight: {
    alignItems: "flex-end",
    flexDirection: "column",
    gap: 3,
  },
  quantityText: {
    fontSize: 14,
    color: "#6B7280",
  },
});
