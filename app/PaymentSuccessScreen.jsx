import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  Pressable,
} from "react-native";
import CustomPressable from "../components/UI/CustomPressable";
import { useRouter } from "expo-router";

const PaymentSuccessScreen = ({ navigation }) => {
  const router = useRouter();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.check}>✓</Text>
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
          onPress={() => router.navigate("/home")}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </CustomPressable>
      </Animated.View>
    </View>
  );
};

export default PaymentSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#2ecc71",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2ecc71",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  check: {
    color: "#fff",
    fontSize: 60,
    fontWeight: "700",
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
    backgroundColor: "#2ecc71",
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
