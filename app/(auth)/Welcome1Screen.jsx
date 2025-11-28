import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";

const Welcome1Screen = () => {
  const { loading } = useAuth();
  return (
    <ImageBackground
      style={styles.container}
      // source={require("../assets/food.png")} // Replace with your image
    >
      <View style={styles.textWrap}>
        <Text style={styles.heading}>Welcome to</Text>
        <Text style={styles.brand}>Kai Suvai</Text>
        <Text style={styles.caption}>
          The real taste of home, now at your office desk!
        </Text>
      </View>

      <TouchableOpacity
        style={styles.nextBtn}
        onPress={() => router.push("/Welcome2Screen")}
      >
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: COLORS.primary,
  },
  textWrap: { padding: 24 },
  heading: {
    color: COLORS.white,
    fontSize: 40,
    fontWeight: "700",
    fontFamily: "serif",
  },
  brand: {
    color: COLORS.white,
    fontSize: 38,
    marginTop: -10,
    fontFamily: "serif",
  },
  caption: { color: COLORS.white, fontSize: 16, marginTop: 10 },
  nextBtn: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.white,
    paddingBottom: 0,
    borderRadius: 50,
    margin: 24,
    width: 85,
    justifyContent: "center",
    alignItems: "center",
     height:50
  },
  arrow: { fontSize: 38, color: COLORS.black },
});

export default Welcome1Screen;
