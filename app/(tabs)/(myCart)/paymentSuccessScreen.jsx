import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { Image } from "expo-image";
import CustomPressable from "../../../components/UI/CustomPressable";
import { useRouter } from "expo-router";

const paymentSuccessScreen = ({ navigation }) => {
  const router = useRouter();

  const gifFadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate GIF to fade in after 0.5s
    Animated.timing(gifFadeAnim, {
      toValue: 1,
      scale: 2,
      duration: 300, // A quick fade for the GIF
      delay: 500, // User request: appear after .5 sec
      useNativeDriver: true,
    }).start();

    // Animate the text and button to fade in after the GIF appears
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 800, // Start after the GIF animation begins (500ms + 300ms)
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: gifFadeAnim }}>
        <Image
          source={require("../../../assets/payment_success.gif")}
          style={styles.gif}
        />
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim, marginTop: 20 }}>
        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.message}>
          Your payment has been processed successfully.
        </Text>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <CustomPressable
          style={styles.button}
          onPress={() => router.navigate("(tabs)/(home)")}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </CustomPressable>
      </Animated.View>
    </View>
  );
};

export default paymentSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  gif: {
    width: 180,
    height: 180,
    marginBottom: 0, // Add some space below the GIF
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
  },
  message: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#004346",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 50,
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
