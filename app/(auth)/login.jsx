import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS } from "../../theme/colors";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log("LOGIN:", { email, password, role: "customer" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    padding: 15,
    marginBottom: 14,
  },
  btn: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  btnText: { color: COLORS.white, textAlign: "center", fontSize: 18 },
});

export default LoginScreen;
