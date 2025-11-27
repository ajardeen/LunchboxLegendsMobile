import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { router } from "expo-router";

const Welcome2Screen = () => {
  return (
    <ImageBackground
      style={styles.container}
      // source={require("../assets/bg1.png")} // Optional if you have bg image
    >
      <Text style={styles.title}>Kai Suvai</Text>
      <Text style={styles.subtitle}>Home food isn’t far anymore</Text>

      <View style={styles.btnWrap}>
        <TouchableOpacity
          style={styles.darkBtn}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.darkBtnText}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.whiteBtn}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.whiteBtnText}>Log in</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: "700",
    fontFamily: "serif",
    marginBottom: 8,
  },
  subtitle: { color: COLORS.white, fontSize: 15 },
  btnWrap: { position: "absolute", bottom: 70, width: "85%" },
  darkBtn: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 30,
    marginBottom: 15,
    alignItems: "center",
  },
  darkBtnText: { color: COLORS.white, fontSize: 18 },
  whiteBtn: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  whiteBtnText: { color: COLORS.black, fontSize: 18 },
});

export default Welcome2Screen;
