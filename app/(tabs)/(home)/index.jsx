import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons"; // Ensure expo-icons is installed
import SubscriptionCard from "../../../components/SubscriptionCard";
import { RefreshControl } from "react-native-gesture-handler";
import { useBundleData } from "../../../context/BundleContext";
import { SafeAreaView } from "react-native-safe-area-context";
import AdBanner from "../../../components/AdBanner";
import CustomPressable from "../../../components/UI/CustomPressable";
import { router } from "expo-router";

export default function Home() {
  const { data: bundleData, isLoading, refetch } = useBundleData();
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState("ALL");

  const tabs = ["ALL", "Veg", "Non Veg"];
  const name = "Lunchbox Legends";
  const location = "Chennai, Tamil Nadu, India";

  useEffect(() => {
    if (bundleData) {
      setData(bundleData);
    }
  }, [bundleData]);
  console.log("data",data);
  
  const filteredBundles = data.filter((bundle) => {
    if (active === "ALL") return true;
    if (active === "Veg") return bundle.category === "veg";
    if (active === "Non Veg")
      return bundle.category === "non-veg" || bundle.category === "mix";
    return false;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
          />
        }
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, styles.textWhite]}>{name}</Text>
          <Text style={styles.headerLocation}>📍 {location}</Text>
          <AdBanner />
        </View>

        {/* Main Content Area */}
        <View style={styles.filterSection}>
          {/* Filter Tabs */}
          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {tabs.map((tab) => {
                const isActive = active === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActive(tab)}
                    style={[
                      styles.tabButton,
                      isActive
                        ? styles.activeTabButton
                        : styles.inactiveTabButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        isActive ? styles.textWhite : styles.inactiveText,
                      ]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Quality Banner - As per image_6684ca.png */}
          <View style={styles.qualityBanner}>
            <View style={styles.shieldIconContainer}>
              <Ionicons name="shield-checkmark" size={30} color="#059669" />
            </View>
            <CustomPressable
              onPress={() => router.push("(profile)/profileDetails")}
            >
              <Text style={styles.qualityText}>
                100% safe and best quality meals
              </Text>
            </CustomPressable>
          </View>

          {/* Item Cards */}
          <View style={styles.itemCardsContainer}>
            {isLoading && (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="#004346" />
              </View>
            )}

            {filteredBundles.length > 0
              ? filteredBundles.map((item) => (
                  <SubscriptionCard key={item.id} item={item} />
                ))
              : !isLoading && (
                  <Text style={styles.emptyText}>
                    No bundles available in this category.
                  </Text>
                )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: "#004346", // Dark teal theme
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  textWhite: {
    color: "#fff",
  },
  headerLocation: {
    color: "#99f6e4",
    fontSize: 14,
    marginTop: 4,
  },
  filterSection: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#F9FAFB", // Light grey background for cards
    paddingTop: 24,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  tabButton: {
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 22,
    paddingVertical: 8,
  },
  activeTabButton: {
    borderColor: "#004346",
    backgroundColor: "#004346",
  },
  inactiveTabButton: {
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
  },
  tabText: {
    fontWeight: "700",
    fontSize: 14,
  },
  inactiveText: {
    color: "#4B5563",
  },

  // Quality Banner Styling from image_6684ca.png
  qualityBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5", // Light green bg
    marginHorizontal: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  shieldIconContainer: {
    marginRight: 10,
  },
  qualityText: {
    fontSize: 14,
    color: "#064E3B", // Dark green text
    fontWeight: "600",
  },

  itemCardsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  loader: {
    marginTop: 40,
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#6B7280",
    fontSize: 14,
  },
});
