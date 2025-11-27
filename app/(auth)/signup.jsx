import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS } from "../../theme/colors";

const SignupScreen = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log("SIGNUP:", {
      fullName,
      phone,
      email,
      password,
      role: "customer",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
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
        onChangeText={setPassword}
        secureTextEntry
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

export default SignupScreen;
