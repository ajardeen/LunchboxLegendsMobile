import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import {
  useAuthRegister,
  useAuthLogin,
  useAuthVerifyOtp,
  useAuthResendOtp,
} from "../../hooks/Auth/useAuth";

import { COLORS } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";

const Welcome2Screen = () => {
  const { login: contextLogin } = useAuth();

  const [mode, setMode] = useState(null);

  // form
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // otp
  const [otp, setOtp] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);

  // temp auth data
  const [tempUserData, setTempUserData] = useState(null);

  /**
   * Register
   */
  const { mutate: register, isPending: isRegistering } =
    useAuthRegister({
      onSuccess: (data) => {
        setTempUserData({
          email,
          userId: data?.userId,
        });

        setIsOtpStep(true);

        Alert.alert(
          "OTP Sent",
          "Verification code sent to your email"
        );
      },

      onError: (err) => {
        Alert.alert(
          "Registration Error",
          err?.response?.data?.message ||
            "Something went wrong"
        );
      },
    });

  /**
   * Login
   */
  const { mutate: loginAttempt, isPending: isLoggingIn } =
    useAuthLogin({
      onSuccess: (data) => {
        setTempUserData({
          email,
          userId: data?.userId,
        });

        setIsOtpStep(true);

        Alert.alert(
          "OTP Sent",
          "Login verification code sent to your email"
        );
      },

      onError: (err) => {
        Alert.alert(
          "Login Error",
          err?.response?.data?.message ||
            "Invalid credentials"
        );
      },
    });

  /**
   * Verify OTP
   */
  const { mutate: verifyOtp, isPending: isVerifyingOtp } =
    useAuthVerifyOtp({
      onSuccess: async (res) => {
        await contextLogin(
          res?.token,
          res?.customer
        );

        Alert.alert(
          "Success",
          "Authenticated successfully"
        );
      },

      onError: (err) => {
        Alert.alert(
          "OTP Error",
          err?.response?.data?.message ||
            "Invalid OTP"
        );
      },
    });

  /**
   * Resend OTP
   */
  const { mutate: resendOtp, isPending: isResendingOtp } =
    useAuthResendOtp({
      onSuccess: () => {
        Alert.alert(
          "OTP Sent",
          "New OTP sent to your email"
        );
      },

      onError: (err) => {
        Alert.alert(
          "Error",
          err?.response?.data?.message ||
            "Failed to resend OTP"
        );
      },
    });

  /**
   * Initial Submit
   */
  const handleInitialSubmit = () => {
    if (mode === "signup") {
      if (
        !fullName ||
        !phone ||
        !email ||
        !password
      ) {
        return Alert.alert(
          "Error",
          "All fields are required"
        );
      }

      register({
        fullName,
        phone,
        email,
        password,
      });
    } else {
      if (!email || !password) {
        return Alert.alert(
          "Error",
          "Email and password are required"
        );
      }

      loginAttempt({
        email,
        password,
      });
    }
  };

  /**
   * Verify OTP
   */
  const handleVerifyOTP = () => {
    if (!otp || otp.length < 5) {
      return Alert.alert(
        "Error",
        "Enter valid OTP"
      );
    }

    verifyOtp({
      email: tempUserData?.email,
      otp,
    });
  };

  /**
   * Resend OTP
   */
  const handleResendOtp = () => {
    resendOtp({
      email: tempUserData?.email,
    });
  };

  /**
   * OTP Form
   */
  const renderOTPForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.otpTitle}>
        Verify OTP
      </Text>

      <Text style={styles.otpSubtitle}>
        Enter OTP sent to {tempUserData?.email}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor="#888"
        keyboardType="number-pad"
        maxLength={5}
        value={otp}
        onChangeText={setOtp}
        autoFocus
      />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleVerifyOTP}
        disabled={isVerifyingOtp}
      >
        {isVerifyingOtp ? (
          <ActivityIndicator
            color={COLORS.white}
          />
        ) : (
          <Text style={styles.submitText}>
            Verify & Login
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleResendOtp}
        disabled={isResendingOtp}
      >
        <Text style={styles.linkText}>
          {isResendingOtp
            ? "Sending..."
            : "Resend OTP"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setIsOtpStep(false)}
      >
        <Text style={styles.linkText}>
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Main Form
   */
  const renderMainForm = () => (
    <View style={styles.formContainer}>
      {mode === "signup" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#888"
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleInitialSubmit}
        disabled={
          isRegistering || isLoggingIn
        }
      >
        {isRegistering ||
        isLoggingIn ? (
          <ActivityIndicator
            color={COLORS.white}
          />
        ) : (
          <Text style={styles.submitText}>
            {mode === "login"
              ? "Get Login OTP"
              : "Register"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          setMode(
            mode === "login"
              ? "signup"
              : "login"
          )
        }
      >
        <Text style={styles.linkText}>
          {mode === "login"
            ? "Need an account? Sign up"
            : "Already have an account? Log in"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={[
        COLORS.primary,
        COLORS.black,
      ]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.centerContent}>
            <Text style={styles.title}>
              Lunchbox Legends
            </Text>

            <Text style={styles.subtitle}>
              Home food isn’t far anymore
            </Text>
          </View>

          {isOtpStep ? (
            renderOTPForm()
          ) : mode ? (
            renderMainForm()
          ) : (
            <View style={styles.bottomButtons}>
              <TouchableOpacity
                style={styles.darkBtn}
                onPress={() =>
                  setMode("signup")
                }
              >
                <Text style={styles.darkBtnText}>
                  Sign up
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.whiteBtn}
                onPress={() =>
                  setMode("login")
                }
              >
                <Text style={styles.whiteBtnText}>
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },

  title: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "700",
  },

  subtitle: {
    color: COLORS.white,
    fontSize: 16,
    marginTop: 6,
  },

  bottomButtons: {
    paddingHorizontal: 25,
    paddingBottom: 60,
    gap: 14,
  },

  darkBtn: {
    backgroundColor: COLORS.black,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  darkBtnText: {
    color: COLORS.white,
    fontSize: 18,
  },

  whiteBtn: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  whiteBtnText: {
    color: COLORS.black,
    fontSize: 18,
  },

  formContainer: {
    paddingHorizontal: 25,
    paddingBottom: 50,
    gap: 10,
  },

  otpTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },

  otpSubtitle: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 10,
  },

  input: {
    backgroundColor:
      "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#000",
  },

  submitBtn: {
    backgroundColor: COLORS.black,
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
    borderColor: "#fff",
    borderWidth: 0.6,
  },

  submitText: {
    color: COLORS.white,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },

  linkText: {
    color: COLORS.white,
    textAlign: "center",
    marginTop: 14,
    textDecorationLine: "underline",
  },
});

export default Welcome2Screen;