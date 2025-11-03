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

// --- Component to Display Selected Address ---
const DeliveryAddress = ({ address, router }) => (
  <View style={styles.fieldContainer}>
    <Text style={[styles.label, { marginBottom: 10 }]}>Delivery Address</Text>
    <View style={styles.addressDisplayBox}>
      <View style={styles.addressInfo}>
        <Text style={styles.addressLabel}>{address.label}</Text>
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
  </View>
);

// --- Main Profile Component ---
const ProfileDetails = () => {
  const router = useRouter();
  // This would typically come from a global state or be fetched.
  const [selectedAddressId, setSelectedAddressId] = useState(1);

  // Find the selected address object to display
  const selectedAddress = userData.addresses.find(
    (a) => a.id === selectedAddressId
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        {/* Basic Details */}
        <ProfileField label="Full Name" value={userData.name} />
        <ProfileField label="Email" value={userData.email} />
        <ProfileField label="Phone Number" value={userData.phone} />

        {/* Display Selected Address */}
        <DeliveryAddress address={selectedAddress} router={router} />
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
