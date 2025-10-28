import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";

// Get screen width for the W-[80vw] approximation
const { width } = Dimensions.get("window");
// Calculate 80% of screen width for banner card width
const CARD_WIDTH = width * 0.8;

export default function AdBanner() {
  const banners = [
    {
      id: 1,
      title: "#3DaysTrial",
      subtitle: "We know your taste",
      image:
        "https://res.cloudinary.com/dgfaeq5fm/image/upload/v1761586513/image_2_ig8u2s.png", // replace with your actual image
    },
    {
      id: 2,
      title: "5 Days Pack",
      subtitle: "Fresh, healthy, and on time!",
      image:
        "https://res.cloudinary.com/dgfaeq5fm/image/upload/v1761586513/image_2_ig8u2s.png",
    },
    {
      id: 3,
      title: "Monthly Pack",
      subtitle: "Perfect for working pros",
      image:
        "https://res.cloudinary.com/dgfaeq5fm/image/upload/v1761586513/image_2_ig8u2s.png",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        decelerationRate="fast"
        snapToAlignment="center"
        style={styles.scrollView}
      >
        {banners.map((item) => (
          <ImageBackground
            key={item.id}
            source={{ uri: item.image }}
            style={styles.bannerCard}
            imageStyle={styles.backgroundImage}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Try Now</Text>
            </TouchableOpacity>
          </ImageBackground>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%", // w-full
    marginTop: 16, // mt-4
  },
  scrollView: {
    paddingHorizontal: 26, // px-4
  },
  bannerCard: {
    width: CARD_WIDTH, // w-[80vw]
    marginRight: 16, // mr-4
    borderRadius: 24, // rounded-3xl
    padding: 16, // p-4
    justifyContent: "center", // Align content to the bottom
    height: 140, // h-48
  },
  title: {
    color: "#fff", // text-white
    fontSize: 20, // text-xl
    marginBottom: 4, // mb-1
  },
  subtitle: {
    color: "#E5E7EB", // text-gray-200
    marginBottom: 12, // mb-3
  },
  button: {
    backgroundColor: "#fff", // bg-white
    paddingHorizontal: 16, // px-4
    paddingVertical: 8, // py-2
    borderRadius: 9999, // rounded-full
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#084C3C", // text-[#084C3C]
    fontWeight: "600", // font-semibold
  },
  backgroundImage: {
    borderRadius: 24, // rounded-3xl
    opacity: 0.8, // Add a slight overlay for text readability
  },
});
