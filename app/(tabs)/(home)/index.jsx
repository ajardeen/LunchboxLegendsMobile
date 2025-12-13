import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import AdBanner from "../../../components/AdBanner";
import SubscriptionCard from "../../../components/SubscriptionCard";
import { RefreshControl } from "react-native-gesture-handler";
import { useBundleData } from "../../../context/BundleContext";

export default function Home() {
  const { data: bundleData, isLoading, refetch } = useBundleData();

  const [data, setData] = useState([]);
  useEffect(() => {
    if (bundleData) {
      setData(bundleData);
    }
    console.log("bundleData", bundleData);

    
  }, [bundleData]);

  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState("ALL");
  const tabs = ["ALL", "Veg", "Non Veg"];
  const name = "Lunchbox Legends";
  const location = "Tecci Park";

  const filteredBundles = data.filter((bundle) => {
    if (active === "ALL") return true;
    if (active === "Veg") return bundle.category === "veg";
    if (active === "Non Veg")
      return bundle.category === "non-veg" || bundle.category === "mix";
    return false;
  });
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch(); // ← get fresh API data
    setRefreshing(false);
  };
  return (
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
        <Text style={styles.headerLocation}>📍{location}</Text>
      </View>

      {/* Ad Banner */}
      <AdBanner />

      {/* Filter Tabs */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScrollView}
        >
          
          {tabs.map((tab) => {
            const isActive = active === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActive(tab)}
                style={[
                  styles.tabButton,
                  isActive ? styles.activeTabButton : styles.inactiveTabButton,
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

        {/* Item Cards */}
        <View style={styles.itemCardsContainer}>
          {isLoading && (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          )}
          {filteredBundles.map((item) => (
            <SubscriptionCard key={item.id} item={item} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: "#004346",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  textWhite: {
    color: "#fff",
  },
  headerLocation: {
    color: "#D1D5DB",
  },
  filterSection: {
    flex: 1,
    marginTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#fff",
    paddingBottom: 12,
    paddingTop: 20,
    minHeight: "100%", // 👈 ensures full height when content is short
  },
  tabsScrollView: {
    paddingHorizontal: 16,
    paddingLeft: 24,
    maxHeight: 40,
  },
  tabButton: {
    marginRight: 12,
    borderRadius: 9999,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  activeTabButton: {
    borderColor: "#004D40",
    backgroundColor: "#004D40",
  },
  inactiveTabButton: {
    borderColor: "#D1D5DB",
  },
  tabText: {
    fontWeight: "500",
  },
  inactiveText: {
    color: "#374151",
  },
  itemCardsContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
