import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

// --- Placeholder Data ---
const userData = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+91 98765 43210",
  addresses: [
    {
      id: 1,
      label: "Home",
      address: "H-504, Gaur City 1, Noida, UP - 201009",
    },
    {
      id: 2,
      label: "Office",
      address: "Tower B, Sector 62, Noida, UP - 201301",
    },
    {
      id: 3,
      label: "Other",
      address: "Flat 302, Green Park Apartments, Delhi - 110016",
    },
  ],
};

// --- Reusable Component for simple fields (Name, Email, Phone) ---
const ProfileField = ({ label, value }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

// --- Radio Button Component ---
const RadioButton = ({ selected, onPress, label, address }) => (
  <Pressable
    style={styles.radioContainer}
    onPress={onPress}
    android_ripple={{ color: "#e0e0e0" }}
  >
    <View style={styles.radioCircle}>
      {selected && <View style={styles.radioSelected} />}
    </View>
    <View style={styles.addressInfo}>
      <Text style={styles.addressLabel}>{label}</Text>
      <Text style={styles.addressText}>{address}</Text>
    </View>
  </Pressable>
);

// --- Component for Address Selection ---
const AddressSelector = ({ addresses, selectedId, onSelect, router }) => (
  <View style={styles.fieldContainer}>
    <Text style={[styles.label, { marginBottom: 10 }]}>Delivery Address</Text>
    {addresses.map((addr) => (
      <RadioButton
        key={addr.id}
        selected={selectedId === addr.id}
        onPress={() => onSelect(addr.id)}
        label={addr.label}
        address={addr.address}
      />
    ))}
    <Pressable style={styles.addAddressButton}>
      <MaterialIcons name="add-circle-outline" size={20} color="#007AFF" />
      <TouchableOpacity onPress={() => router.navigate("addressScreen")}>
        <Text style={styles.addAddressText}>Add New Address</Text>
      </TouchableOpacity>
    </Pressable>
  </View>
);

// --- Main Profile Component ---
const ProfileDetails = () => {
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState(1);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      {/* Basic Details */}
      <ProfileField label="Full Name" value={userData.name} />
      <ProfileField label="Email" value={userData.email} />
      <ProfileField label="Phone Number" value={userData.phone} />

      <View style={styles.separator} />

      {/* Address Selection with Radio Buttons */}
      <AddressSelector
        addresses={userData.addresses}
        selectedId={selectedAddressId}
        onSelect={setSelectedAddressId}
        router={router}
      />

      <View style={styles.separator} />
    </ScrollView>
  );
};

export default ProfileDetails;

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  fieldContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 18,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
  },
  separator: {
    height: 15,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  radioCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  radioSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  addAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  addAddressText: {
    color: "#007AFF",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
});
