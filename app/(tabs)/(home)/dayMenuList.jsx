import { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import CategoryIcon from "../../../components/CategoryIcon";
import { useBundleData } from "../../../context/BundleContext";

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DayMenuList() {
  const { getBundleById } = useBundleData();
  const params = useLocalSearchParams();
  const { bundleId, dayIndex } = params;

  const bundle = getBundleById(bundleId);
  const dayData = useMemo(() => {
    if (!bundle || !bundle.days) return null;
    return bundle.days.find((d) => d.dayIndex === parseInt(dayIndex));
  }, [bundle, dayIndex]);

  if (!dayData) {
    return (
      <View style={styles.centerContainer}>
        <Text>Menu not found!</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        headerTitle: `${dayNames[dayData.dayIndex]} Menu`,
        headerShadowVisible: false 
      }} />
      
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* Day & Menu Title */}
        <View style={styles.headerSection}>
          <Text style={styles.dayText}>{dayNames[dayData.dayIndex]}</Text>
          <Text style={styles.menuNameText}>{dayData.menuName}</Text>
        </View>

        {/* Nutrition Summary Card - New Informative Section */}
        <View style={styles.nutritionCard}>
          <Text style={styles.cardTitle}>Total Nutrition</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dayData.totalNutrition.calories}</Text>
              <Text style={styles.statLabel}>kcal</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dayData.totalNutrition.protein}g</Text>
              <Text style={styles.statLabel}>Protein</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dayData.totalNutrition.carbs}g</Text>
              <Text style={styles.statLabel}>Carbs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dayData.totalNutrition.fat}g</Text>
              <Text style={styles.statLabel}>Fats</Text>
            </View>
          </View>
        </View>

        {/* List Header */}
        <View style={styles.listHeaderContainer}>
          <Text style={styles.listHeaderText}>Meal Composition</Text>
          <Text style={styles.itemCountText}>{dayData.items.length} Items</Text>
        </View>

        {/* Menu Items */}
        {dayData.items.map((menuItem, i) => (
          <View key={i} style={styles.menuItemRow}>
            <View style={styles.itemLeft}>
              <View style={styles.titleRow}>
                <CategoryIcon type={menuItem.category} size={14} />
                <Text style={styles.mealText}>{menuItem.itemName}</Text>
              </View>
              <Text style={styles.descriptionText} numberOfLines={1}>
                {menuItem.description || "Freshly prepared daily meal"}
              </Text>
              <View style={styles.itemNutritionTag}>
                <MaterialCommunityIcons name="fire" size={12} color="#6B7280" />
                <Text style={styles.nutritionText}>{menuItem.nutrition.calories} kcal</Text>
              </View>
            </View>

            <View style={styles.itemRight}>
              <View style={styles.quantityBadge}>
                <Text style={styles.quantityText}>× {menuItem.quantity}</Text>
              </View>
            </View>
          </View>
        ))}
        
        {/* Quality Note */}
        <View style={styles.footerNote}>
          <Ionicons name="checkmark-circle" size={16} color="#059669" />
          <Text style={styles.footerNoteText}>Standard portions optimized for health</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", // Light grey to match active orders theme
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerSection: {
    marginTop: 20,
    marginBottom: 15,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#004346",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  menuNameText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#888a8eff",
    marginTop: 4,
  },
  // Nutrition Card
  nutritionCard: {
    backgroundColor: "#004346",
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: {
    color: "#fafafaff",
    fontSize: 15,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    color: "#D1D5DB",
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  // List Section
  listHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  listHeaderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  itemCountText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },
  menuItemRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  itemLeft: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  mealText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  descriptionText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  itemNutritionTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  nutritionText: {
    marginLeft: 4,
    color: "#4B5563",
    fontSize: 11,
    fontWeight: "600",
  },
  itemRight: {
    marginLeft: 10,
  },
  quantityBadge: {
    backgroundColor: "#E0F2F1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  quantityText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#004346",
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 40,
    gap: 6,
  },
  footerNoteText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  }
});