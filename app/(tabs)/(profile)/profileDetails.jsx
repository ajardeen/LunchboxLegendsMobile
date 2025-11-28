import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCustomer } from "../../../context/CustomerContext";

// Reusable Component for simple fields
const ProfileField = ({ label, value }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

// Address Component
const DeliveryAddress = ({ address, router }) => (
  <View style={styles.fieldContainer}>
    <Text style={[styles.label, { marginBottom: 10 }]}>Delivery Address</Text>

    {address ? (
      <View style={styles.addressDisplayBox}>
        <View style={styles.addressInfo}>
          <Text style={styles.addressLabel}>{address.label || "Address"}</Text>
          <Text style={styles.addressText}>{address.address}</Text>
        </View>
        <TouchableOpacity
          style={styles.addAddressButton}
          onPress={() => router.navigate("addressScreen")}
        >
          <MaterialIcons name="edit" size={20} color="#004346" />
          <Text style={styles.addAddressText}>Manage</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity
        style={styles.noAddressBox}
        onPress={() => router.navigate("addressScreen")}
      >
        <MaterialIcons name="add-location-alt" size={20} color="#004346" />
        <Text style={styles.addAddressText}>Add Delivery Address</Text>
      </TouchableOpacity>
    )}
  </View>
);

const ProfileDetails = () => {
  const router = useRouter();
  const { customer, loading } = useCustomer();

  if (loading) return null;
  if (!customer) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <ProfileField label="Full Name" value={customer.fullName} />
        <ProfileField label="Email" value={customer.email} />
        <ProfileField label="Phone Number" value={customer.phone} />
        <DeliveryAddress
          router={router}
          address={customer.deliveryAddress?.[0]}
        />
      </View>
    </ScrollView>
  );
};

export default ProfileDetails;

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  profileCard: {
    backgroundColor: "#F9FAFB", // Muted background
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: "#004346", // Theme color
    fontWeight: "600",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  addressDisplayBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  addAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  addAddressText: {
    color: "#004346", // Theme color
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
});
