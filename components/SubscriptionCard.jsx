import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SubscriptionCard({
  item,
  handlePressIn,
  handlePressOut,
  animatedValue,
}) {
  return (
    <Link
      href={{
        pathname: "/itemDetail",
        params: {
          title: item.title,
          imageUri: item.image,
          price: item.price,
          tag: item.tag,
          tagColor: item.tagColor,
        },
      }}
      asChild
    >
      <Pressable
        onPressIn={() => handlePressIn(item.id)}
        onPressOut={() => handlePressOut(item.id)}
      >
        <Animated.View
          style={[styles.card, { transform: [{ scale: animatedValue }] }]}
        >
          {/* Top Image */}
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            contentFit="cover"
            transition={500}
          />

          {/* Bottom Content Layer */}
          <View style={styles.bottomContent}>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>{item.title}</Text>
              <View style={styles.tagWrapper}>
                <View
                  style={[styles.tagDot, { backgroundColor: item.tagColor }]}
                />
                <Text style={[styles.tagText, { color: item.tagColor }]}>
                  {item.tag}
                </Text>
              </View>
            </View>


            <View style={styles.priceRow}>
            
            <Text style={styles.subtitleText} numberOfLines={2}>
              {item.subtitle}
            </Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color={item.tagColor} />
                <Text style={styles.ratingText}>4.5</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Link>
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
    height: 122,
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
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  tagWrapper: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  subtitleText: {
    marginTop: 4,
    color: "#4B5563",
    fontSize: 13,
  },
  priceRow: {
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
