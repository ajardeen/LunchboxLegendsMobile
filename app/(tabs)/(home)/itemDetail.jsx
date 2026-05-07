import { useState, useMemo, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import CustomPressable from "../../../components/UI/CustomPressable";
import CategoryIcon from "../../../components/CategoryIcon";
import { useCart } from "../../../context/CartContext";
import CustomBottomSheet from "../../../components/UI/CustomBottomSheet";
import { useBundleData } from "../../../context/BundleContext";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const getAddOnItemId = (bundleId, dayName) => `addon_bundle_${bundleId}_${dayName}`;

export default function ItemDetail() {
  const { getBundleById } = useBundleData();
  const bottomSheetRef = useRef(null);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [bottomSheetTitle, setBottomSheetTitle] = useState("Add-on Products");
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { bundleId } = params;
  const { addToCart, cartItems } = useCart();

  const item = getBundleById(bundleId);

  if (!item) {
    return (
      <View style={styles.centerContainer}>
        <Text>Item not found!</Text>
      </View>
    );
  }

  const placeholderImage = require("../../../assets/lblplaceholder.jpg");
  const itemInCart = cartItems.find((cartItem) => cartItem.id === item.id);

  // --- Conditional Footer Button Component ---
  const FooterButton = () => {
    const button = itemInCart ? (
      <CustomPressable
        onPress={() => router.push("(tabs)/(myCart)")}
        style={[styles.actionButton, styles.viewInCartBtn]}
      >
        <Text style={[styles.subscribeText, styles.viewInCartText]}>VIEW IN CART</Text>
      </CustomPressable>
    ) : (
      <CustomPressable
        onPress={() =>
          router.push({
            pathname: "/createSubscription",
            params: { bundleId: item.id },
          })
        }
        style={[styles.actionButton, isAdding && styles.addToCardBtnDisabled]}
        disabled={isAdding}
      >
        {isAdding ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.subscribeText}>Subscribe Now • ₹{item.price}</Text>
        )}
      </CustomPressable>
    );

    return (
      <View style={styles.footerButtonWrapper}>
        <View style={{ flex: 1 }}>{button}</View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex:1}}>

    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Image Section */}
      <View style={styles.headerImageContainer}>
        <Image
          source={item.imgUrl ? { uri: item.imgUrl } : placeholderImage}
          style={styles.mainImage}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.overlay}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.badgeRow}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{item.bundleMealType}</Text>
              </View>
              <CategoryIcon type={"veg"} size={14} />
            </View>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemSubtitle}>{item.description}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* Bundle Insight Stats */}
        <View style={styles.insightContainer}>
          <View style={styles.insightBox}>
            <MaterialCommunityIcons name="calendar-check" size={20} color="#004346" />
            <Text style={styles.insightValue}>{item.totalMealsCount}</Text>
            <Text style={styles.insightLabel}>Days</Text>
          </View>
          <View style={styles.insightDivider} />
          <View style={styles.insightBox}>
            <MaterialCommunityIcons name="currency-inr" size={20} color="#004346" />
            <Text style={styles.insightValue}>{Math.round(item.price / item.totalMealsCount)}</Text>
            <Text style={styles.insightLabel}>Per Meal</Text>
          </View>
          <View style={styles.insightDivider} />
          <View style={styles.insightBox}>
            <MaterialCommunityIcons name="fire" size={20} color="#004346" />
            <Text style={styles.insightValue}>Avg. 450</Text>
            <Text style={styles.insightLabel}>kcal/day</Text>
          </View>
        </View>

        <View style={styles.menuHeader}>
          <Text style={styles.menuHeaderText}>Daily Menu Schedule</Text>
          <Text style={styles.menuSubHeaderText}>Tap on a day to view meal details</Text>
        </View>

        {item.days.map((dayObj,idx) => {
          const addOnId = getAddOnItemId(item.id, dayObj.day);
          const appliedAddOnBundle = cartItems.find((cartItem) => cartItem.id === addOnId);
          const totalAddOnItems = appliedAddOnBundle?.products?.length || 0;

          return (
            <CustomPressable
              key={idx}
              style={styles.dayCard}
              onPress={() =>
                router.push({
                  pathname: "/dayMenuList",
                  params: { bundleId: item.id, dayIndex: dayObj.dayIndex },
                })
              }
            >
              <View style={styles.dayCardLeft}>
                <Text style={styles.dayCardDayText}>{dayNames[dayObj.dayIndex]}</Text>
                <Text style={styles.dayCardMenuName} numberOfLines={1}>
                  {dayObj.menuName}
                </Text>
                {totalAddOnItems > 0 && (
                  <View style={styles.addonTag}>
                    <Text style={styles.addonTagText}>+{totalAddOnItems} Add-ons</Text>
                  </View>
                )}
              </View>

              <View style={styles.dayCardRight}>
                <View style={styles.nutritionBadge}>
                  <Text style={styles.dayCardNutrition}>
                    {dayObj.totalNutrition.calories} Cal
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </View>
            </CustomPressable>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={styles.footer}>
        <FooterButton />
      </View>

      <CustomBottomSheet
        ref={bottomSheetRef}
        title={bottomSheetTitle}
        snapPoints={["35%", "60%"]}
        initialIndex={-1}
      >
        {/* AddOnSelector component code remains commented as per your request */}
      </CustomBottomSheet>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImageContainer: {
    height: 220,
    width: "100%",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11, 9, 9, 0.35)",
    padding: 20,
    justifyContent: "space-between",
  },
  backButton: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContent: {
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  typeBadge: {
    backgroundColor: "#004346",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  itemTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  itemSubtitle: {
    fontSize: 15,
    color: "#E5E7EB",
    marginTop: 4,
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  insightContainer: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 15,
    marginTop: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  insightBox: {
    flex: 1,
    alignItems: "center",
  },
  insightValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
  },
  insightLabel: {
    fontSize: 11,
    color: "#6B7280",
    textTransform: "uppercase",
  },
  insightDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#E5E7EB",
  },
  menuHeader: {
    marginBottom: 15,
  },
  menuHeaderText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  menuSubHeaderText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  dayCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayCardLeft: {
    flex: 1,
  },
  dayCardDayText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#004346",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dayCardMenuName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginTop: 2,
  },
  dayCardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  nutritionBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dayCardNutrition: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B5563",
  },
  addonTag: {
    marginTop: 6,
    backgroundColor: "#E0F2F1",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  addonTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#004346",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
  },
  actionButton: {
    backgroundColor: "#111827",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  subscribeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  viewInCartBtn: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#111827",
  },
  viewInCartText: {
    color: "#111827",
  },
});