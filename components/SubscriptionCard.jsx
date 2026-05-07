import React from "react";
import { Text, StyleSheet, Platform } from "react-native";
import { Image } from "expo-image";
import { View } from "react-native";
import CategoryIcon from "../components/CategoryIcon";
import { useRouter } from "expo-router";
import CustomPressable from "./UI/CustomPressable";

export default function SubscriptionCard({ item }) {
  // console.log("item",item);
  
  const router = useRouter();
  const placeholderImage = require("../assets/lblplaceholder.jpg");

  // Determine tag color based on category
  const getTagColor = (category) => {
    if (category === "veg") return "#00A86B"; // Green for Veg
    if (category === "non-veg") return "#FF4500"; // Red for Non-Veg
    if (category === "mix") return "#FF8C00"; // Orange for Mix
    return "#4B5563"; // Default gray
  };

  const tagColor = getTagColor(item.category);

  const goToDetail = () => {
    router.push({
      pathname: "/itemDetail",
      params: {
        bundleId: item.id,
      },
    });
  };

  return (
    <CustomPressable onPress={goToDetail}>
      <View style={styles.card}>
        <Image
          source={
            item.imgUrl ? { uri: item.imgUrl } : placeholderImage
          }
          style={styles.cardImage}
          contentFit="cover"
          transition={300}
        />

        <View style={styles.bottomContent}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>{item.name}</Text>
            <View style={styles.tagWrapper}>
              <View style={styles.tagIconWrapper}>
                <CategoryIcon type={item.category} />
              </View>
              <Text
                style={[
                  styles.tagText,
                  { color: tagColor, textTransform: "capitalize" },
                ]}
              >
                {item.category}
              </Text>
            </View>
          </View>

          <View style={styles.subtitleRow}>
            <Text style={styles.subtitleText} numberOfLines={2}>
              {/* {item.description} */}
            </Text>
            {/* <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color={item.tagColor} />
              <Text style={styles.ratingText}>4.5</Text>
            </View> */}
          </View>
        </View>
      </View>
    </CustomPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    ...Platform.select({
      android: {
        elevation: 5,
      },
    }),
  },
  cardImage: {
    height: 110,
    width: "100%",
  },
  bottomContent: {
    backgroundColor: "#fff",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  tagWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagIconWrapper: {
    padding: 2,
    boxShadowColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tagDot: {
    marginRight: 4,
    height: 8,
    width: 8,
    borderRadius: 9999,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  subtitleText: {
    marginTop: 1,
    color: "#4B5563",
    fontSize: 13,
  },
  subtitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "500",
    color: "#111827",
  },
});
