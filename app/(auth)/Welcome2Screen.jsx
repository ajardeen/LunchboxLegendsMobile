import  { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../theme/colors";
import { useAuthRegister, useAuthLogin } from "../../hooks/Auth/useAuth";
import { useAuth } from "../../context/AuthContext";

const Welcome2Screen = () => {
  const { login } = useAuth();
  const [mode, setMode] = useState(null); // null | "login" | "signup"
  const yOffset = useRef(new Animated.Value(0)).current;

  // form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const animateUp = () => {
    Animated.timing(yOffset, {
      toValue: -20,
      duration: 450,
      useNativeDriver: true,
    }).start();
  };

  const animateDown = () => {
    Animated.timing(yOffset, {
      toValue: 0,
      duration: 450,
      useNativeDriver: true,
    }).start();
  };

  const registerMutation = useAuthRegister({
    onSuccess: () => {
      Alert.alert("Success", "Account created! Check email for OTP and login.");
      setMode("login");
    },
    onError: (err) => {
      Alert.alert("Error", err?.response?.data?.message || "Signup failed");
    },
  });

  const loginMutation = useAuthLogin({
    onSuccess: (res) => {
      const token = res?.token;
      const customer = res?.customer;

      if (!token) return Alert.alert("Error", "Login failed");

      login(token, customer);
    },
    onError: (err) => {
      Alert.alert("Error", err?.response?.data?.message || "Login failed");
    },
  });

  const handleSubmit = () => {
    if (mode === "signup") {
      if (!fullName || !phone || !email || !password) {
        Alert.alert("Validation", "All fields are required.");
        return;
      }
      registerMutation.mutate({
        fullName,
        phone,
        email,
        password,
        role: "customer",
      });
    } else {
      if (!email || !password) {
        Alert.alert("Validation", "Email and password required.");
        return;
      }
      loginMutation.mutate({ email, password, role: "customer" });
    }
  };

  const renderForm = () => (
    <Animated.View
      style={[styles.formContainer, { transform: [{ translateY: yOffset }] }]}
    >
      {mode === "signup" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            onFocus={animateUp}
            onBlur={animateDown}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            onFocus={animateUp}
            onBlur={animateDown}
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        onFocus={animateUp}
        onBlur={animateDown}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onFocus={animateUp}
        onBlur={animateDown}
      />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleSubmit}
        disabled={registerMutation.isPending || loginMutation.isPending}
      >
        {registerMutation.isPending || loginMutation.isPending ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.submitText}>
            {mode === "login" ? "Log in" : "Sign up"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setMode(mode === "login" ? "signup" : "login")}
      >
        <Text style={styles.linkText}>
          {mode === "login"
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.black]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.centerContent}>
          <Text style={styles.title}>Lunchbox Legends</Text>
          <Text style={styles.subtitle}>Home food isn’t far anymore</Text>
        </View>

        {mode ? (
          renderForm()
        ) : (
          <View style={styles.bottomButtons}>
            <TouchableOpacity
              style={styles.darkBtn}
              onPress={() => setMode("signup")}
            >
              <Text style={styles.darkBtnText}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.whiteBtn}
              onPress={() => setMode("login")}
            >
              <Text style={styles.whiteBtnText}>Log in</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: COLORS.white, fontSize: 30, fontWeight: "700" },
  subtitle: { color: COLORS.white, fontSize: 16, marginTop: 6 },
  bottomButtons: { paddingHorizontal: 25, paddingBottom: 60, gap: 14 },
  darkBtn: {
    backgroundColor: COLORS.black,
    padding: 16,
    borderRadius: 30,
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
  formContainer: { paddingHorizontal: 25, paddingBottom: 50, gap: 10 },
  input: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 6,
  },
  submitBtn: {
    backgroundColor: COLORS.black,
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
    borderColor: "#fff",
    borderWidth: 0.6,
  },
  submitText: { color: COLORS.white, textAlign: "center", fontSize: 18 },
  linkText: {
    color: COLORS.white,
    textAlign: "center",
    marginTop: 14,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default Welcome2Screen;
