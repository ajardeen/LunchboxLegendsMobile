import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import { useState } from "react";
import AdBanner from "../../components/AdBanner"; // Assuming this path is correct
import SubscriptionCard from "../../components/SubscriptionCard";

export default function Home() {
  const [active, setActive] = useState("ALL");
  const tabs = ["ALL", "Breakfast", "Lunch"];
  const name = "Kai Suvai";
  const location = "Tecci Park";

  // Note: Using a single placeholder image for all cards since the original code did.
  const items = [
    {
      id: 1,
      title: "5 Days Pack",
      subtitle: "We know your taste",
      image:
        "https://res.cloudinary.com/dgfaeq5fm/image/upload/v1761586513/image_2_ig8u2s.png",
      tag: "Pure Veg",
      tagColor: "#00A86B",
    },
    {
      id: 2,
      title: "Monthly Pack",
      subtitle: "We know your taste",
      image:
        "https://res.cloudinary.com/dgfaeq5fm/image/upload/v1761586514/image_1_wrzkxz.png",
      tag: "Non Veg",
      tagColor: "#FF4500",
    },
    {
      id: 3,
      title: "Snacks",
      subtitle: "We know your taste",
      image:
        "https://res.cloudinary.com/dgfaeq5fm/image/upload/v1761586514/image_3_x7f31c.png",
      tag: "Pure Veg",
      tagColor: "#00A86B",
    },
    {
      id: 4,
      title: "Snacks",
      subtitle: "We know your taste",
      image:
        "https://res.cloudinary.com/dgfaeq5fm/image/upload/v1761586514/image_3_x7f31c.png",
      tag: "Pure Veg",
      tagColor: "#00A86B",
    },
  ];

  // Animated values for card scaling
  // We'll create a ref to store Animated.Value for each item dynamically
  const animatedValues = items.reduce((acc, item) => {
    acc[item.id] = new Animated.Value(1);
    return acc;
  }, {});

  const handlePressIn = (itemId) => {
    Animated.spring(animatedValues[itemId], {
      toValue: 0.95, // Scale down to 95%
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (itemId) => {
    Animated.spring(animatedValues[itemId], {
      toValue: 1, // Scale back to original
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScrollView style={styles.scrollView}>
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
          {items.map((item) => (
            <SubscriptionCard
              key={item.id}
              item={item}
              handlePressIn={handlePressIn}
              handlePressOut={handlePressOut}
              animatedValue={animatedValues[item.id]}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
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
    color: "#D1D5DB", // gray-300
  },
  filterSection: {
    marginTop: 16,
    borderTopLeftRadius: 24, // rounded-t-3xl
    borderTopRightRadius: 24, // rounded-t-3xl
    backgroundColor: "#fff",
    paddingBottom: 12,
    paddingTop: 20,
  },
  tabsScrollView: {
    paddingHorizontal: 16,
    paddingLeft: 24,
  },
  tabButton: {
    marginRight: 12,
    borderRadius: 9999, // rounded-full
    borderWidth: 1, // border
    paddingHorizontal: 20, // px-5
    paddingVertical: 8, // py-2
  },
  activeTabButton: {
    borderColor: "#004D40",
    backgroundColor: "#004D40",
  },
  inactiveTabButton: {
    borderColor: "#D1D5DB", // border-gray-300
  },
  tabText: {
    fontWeight: "500", // font-medium
  },
  inactiveText: {
    color: "#374151", // text-gray-700
  },
  itemCardsContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
